# デプロイメントガイド

## 概要

ワンちゃんカフェマップをAWS上にデプロイするための完全ガイド。

## アーキテクチャ

```
Internet
    ↓
  ALB (Application Load Balancer)
    ↓
  ECS Fargate (Next.js Application)
    ↓
  RDS PostgreSQL
```

## 前提条件

- AWS CLIがインストールされ、設定されていること
- Terraformがインストールされていること (v1.0+)
- Dockerがインストールされていること
- Node.js 18+ がインストールされていること

## 初回デプロイ

### 1. Terraformステート管理の準備

```bash
# S3バケットの作成
aws s3 mb s3://dog-cafe-map-terraform-state --region ap-northeast-1

# S3バケットのバージョニング有効化
aws s3api put-bucket-versioning \
  --bucket dog-cafe-map-terraform-state \
  --versioning-configuration Status=Enabled

# DynamoDBテーブルの作成（ロック管理用）
aws dynamodb create-table \
  --table-name dog-cafe-map-terraform-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-northeast-1
```

### 2. インフラのプロビジョニング

```bash
cd terraform

# 開発環境の場合
terraform init -backend-config="environments/dev/backend.conf"

# 環境変数の設定
export TF_VAR_db_username="dbadmin"
export TF_VAR_db_password="$(openssl rand -base64 32)"
export TF_VAR_nextauth_secret="$(openssl rand -base64 32)"
export TF_VAR_nextauth_url="http://temp-url.com"  # 後でALB URLに更新

# デプロイ
terraform plan -var-file="environments/dev/terraform.tfvars"
terraform apply -var-file="environments/dev/terraform.tfvars"

# ALB URLの取得
ALB_URL=$(terraform output -raw alb_dns_name)
echo "ALB URL: http://$ALB_URL"

# NextAuth URLを更新
export TF_VAR_nextauth_url="http://$ALB_URL"
terraform apply -var-file="environments/dev/terraform.tfvars"
```

### 3. 初期コンテナイメージのプッシュ

```bash
cd ..

# ECR情報の取得
ECR_REPO=$(cd terraform && terraform output -raw ecr_repository_url)
AWS_REGION="ap-northeast-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# ECRログイン
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_REPO

# ビルドとプッシュ
docker build -t dog-cafe-map:latest .
docker tag dog-cafe-map:latest $ECR_REPO:latest
docker push $ECR_REPO:latest
```

### 4. データベースマイグレーション

```bash
# データベースURLの取得（Secrets Manager経由）
DATABASE_URL=$(aws secretsmanager get-secret-value \
  --secret-id dog-cafe-map-dev-database-url \
  --query SecretString \
  --output text \
  --region ap-northeast-1)

# マイグレーション実行
export DATABASE_URL
npx prisma migrate deploy
```

### 5. ECSサービスの起動確認

```bash
# ECS情報の取得
CLUSTER_NAME=$(cd terraform && terraform output -raw ecs_cluster_name)
SERVICE_NAME=$(cd terraform && terraform output -raw ecs_service_name)

# サービス状態確認
aws ecs describe-services \
  --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME \
  --region ap-northeast-1

# ログ確認
aws logs tail /ecs/dog-cafe-map-dev --follow --region ap-northeast-1
```

## 継続的デプロイ

### 自動デプロイスクリプトの使用

```bash
./scripts/deploy.sh dev
```

### 手動デプロイ

```bash
# 1. イメージのビルド
docker build -t dog-cafe-map:latest .

# 2. ECRにプッシュ
ECR_REPO=$(cd terraform && terraform output -raw ecr_repository_url)
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin $ECR_REPO

docker tag dog-cafe-map:latest $ECR_REPO:latest
docker tag dog-cafe-map:latest $ECR_REPO:$(git rev-parse --short HEAD)
docker push $ECR_REPO:latest
docker push $ECR_REPO:$(git rev-parse --short HEAD)

# 3. ECSサービス更新
CLUSTER_NAME=$(cd terraform && terraform output -raw ecs_cluster_name)
SERVICE_NAME=$(cd terraform && terraform output -raw ecs_service_name)

aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --force-new-deployment \
  --region ap-northeast-1
```

## ドメイン設定（オプション）

### 1. Route 53でドメイン設定

```bash
# ホストゾーンの作成（既存の場合はスキップ）
aws route53 create-hosted-zone --name example.com --caller-reference $(date +%s)

# ALBへのAレコード作成
# （マネジメントコンソールまたはCLIで設定）
```

### 2. SSL証明書の取得

```bash
# ACMで証明書をリクエスト
aws acm request-certificate \
  --domain-name dog-cafe-map.example.com \
  --validation-method DNS \
  --region ap-northeast-1

# 証明書ARNを取得
CERT_ARN=$(aws acm list-certificates \
  --query 'CertificateSummaryList[?DomainName==`dog-cafe-map.example.com`].CertificateArn' \
  --output text \
  --region ap-northeast-1)

# Terraformに証明書ARNを設定
export TF_VAR_certificate_arn=$CERT_ARN
export TF_VAR_nextauth_url="https://dog-cafe-map.example.com"

cd terraform
terraform apply -var-file="environments/prod/terraform.tfvars"
```

## モニタリング

### CloudWatchログの確認

```bash
aws logs tail /ecs/dog-cafe-map-dev --follow --region ap-northeast-1
```

### メトリクスの確認

- ECS CPU/Memory使用率
- ALBリクエスト数・レイテンシー
- RDS接続数・CPU使用率

## トラブルシューティング

### コンテナが起動しない場合

```bash
# タスク定義の確認
aws ecs describe-task-definition --task-definition dog-cafe-map-dev

# 失敗したタスクのログ確認
aws logs tail /ecs/dog-cafe-map-dev --since 1h
```

### データベース接続エラー

```bash
# セキュリティグループの確認
# RDSセキュリティグループがECSからの接続を許可しているか確認

# データベースURLの確認
aws secretsmanager get-secret-value \
  --secret-id dog-cafe-map-dev-database-url \
  --query SecretString \
  --output text
```

## スケーリング

### タスク数の変更

```bash
# Terraformで desired_count を変更
cd terraform
# terraform.tfvars で ecs_desired_count を編集
terraform apply -var-file="environments/dev/terraform.tfvars"
```

### オートスケーリングの設定（今後の拡張）

```hcl
# terraform/modules/ecs/autoscaling.tf に追加
resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = 10
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}
```

## バックアップとリストア

### RDSスナップショット

```bash
# 手動スナップショット作成
aws rds create-db-snapshot \
  --db-instance-identifier dog-cafe-map-dev \
  --db-snapshot-identifier dog-cafe-map-dev-$(date +%Y%m%d-%H%M%S)

# スナップショットからリストア
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier dog-cafe-map-dev-restored \
  --db-snapshot-identifier dog-cafe-map-dev-20240101-120000
```

## コスト最適化

- 開発環境は営業時間外に停止
- RDSインスタンスサイズの最適化
- CloudWatch Logsの保持期間調整
- 不要なNAT Gateway削減（開発環境）

## セキュリティ

- Secrets ManagerでDB認証情報を管理
- IAMロールは最小権限の原則
- VPCフローログの有効化
- GuardDutyの有効化（推奨）
- WAFの設定（本番環境推奨）
