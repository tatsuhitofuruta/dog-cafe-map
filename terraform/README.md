# Terraform Infrastructure

AWS上にワンちゃんカフェマップのインフラをデプロイするためのTerraform設定。

## 構成

- **VPC**: プライベート・パブリックサブネット構成
- **ECS Fargate**: コンテナ実行環境
- **RDS PostgreSQL**: データベース
- **ALB**: アプリケーションロードバランサー
- **ECR**: Dockerイメージレジストリ
- **Secrets Manager**: 機密情報管理

## 使用方法

### 前提条件

1. AWS CLIの設定
2. Terraform 1.0以上のインストール
3. S3バケットとDynamoDBテーブルの作成（Terraformステート管理用）

```bash
# S3バケットの作成
aws s3 mb s3://dog-cafe-map-terraform-state --region ap-northeast-1

# DynamoDBテーブルの作成
aws dynamodb create-table \
  --table-name dog-cafe-map-terraform-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-northeast-1
```

### デプロイ手順

#### 開発環境

```bash
cd terraform

# 初期化
terraform init -backend-config="environments/dev/backend.conf"

# 変数の設定
export TF_VAR_db_username="dbadmin"
export TF_VAR_db_password="your-secure-password"
export TF_VAR_nextauth_url="http://your-alb-url.com"
export TF_VAR_nextauth_secret="your-nextauth-secret"

# プラン確認
terraform plan -var-file="environments/dev/terraform.tfvars"

# デプロイ
terraform apply -var-file="environments/dev/terraform.tfvars"
```

#### 本番環境

```bash
cd terraform

# 初期化
terraform init -backend-config="environments/prod/backend.conf"

# 変数の設定（機密情報は環境変数で渡す）
export TF_VAR_db_username="dbadmin"
export TF_VAR_db_password="your-secure-password"
export TF_VAR_nextauth_url="https://your-domain.com"
export TF_VAR_nextauth_secret="your-nextauth-secret"
export TF_VAR_certificate_arn="arn:aws:acm:ap-northeast-1:xxxxx:certificate/xxxxx"

# プラン確認
terraform plan -var-file="environments/prod/terraform.tfvars"

# デプロイ
terraform apply -var-file="environments/prod/terraform.tfvars"
```

### コンテナイメージのビルドとデプロイ

```bash
# ECRにログイン
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-northeast-1.amazonaws.com

# イメージのビルド
docker build -t dog-cafe-map .

# イメージのタグ付け
docker tag dog-cafe-map:latest <ecr-repository-url>:latest

# イメージのプッシュ
docker push <ecr-repository-url>:latest

# ECSサービスの更新
aws ecs update-service \
  --cluster dog-cafe-map-dev-cluster \
  --service dog-cafe-map-dev-service \
  --force-new-deployment \
  --region ap-northeast-1
```

### データベースマイグレーション

```bash
# ECSタスク内でPrismaマイグレーションを実行
# ローカルから実行する場合はRDSエンドポイントに接続
export DATABASE_URL="postgresql://username:password@rds-endpoint:5432/dogcafemap"
npx prisma migrate deploy
```

## モジュール

- **vpc**: VPCとサブネット
- **ecr**: ECRリポジトリ
- **rds**: RDS PostgreSQL
- **alb**: Application Load Balancer
- **ecs**: ECS Fargate クラスターとサービス

## セキュリティ

- データベース認証情報はSecrets Managerで管理
- RDSは暗号化有効
- ALBでHTTPS通信（証明書ARNを指定した場合）
- ECSタスクは最小権限の原則に従ったIAMロール

## コスト見積もり

開発環境（月額概算）:
- ECS Fargate (256 CPU, 512 MB, 1タスク): ~$15
- RDS t3.micro: ~$15
- ALB: ~$20
- NAT Gateway: ~$35
- その他（データ転送、CloudWatchなど）: ~$10
- **合計: 約$95/月**

本番環境は構成により変動。
