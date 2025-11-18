# 🐕 ワンちゃんカフェマップ

犬と一緒に行けるカフェ・レストランを地図から直感的に探せるサービスです。

## 📖 概要

「ワンちゃんカフェマップ」は、愛犬と一緒に楽しめるカフェやレストランを簡単に見つけられるWebアプリケーションです。サウナイキタイのようなユーザー参加型のプラットフォームで、全国の犬連れOKの飲食店情報を共有できます。

## ✨ 主な機能

- 🗺️ **地図表示**: OpenStreetMapを使用した店舗の地図表示
- 📍 **店舗登録**: ユーザー自身が犬連れOKの店舗を登録可能
- ⭐ **レビュー機能**: 実際に訪問した店舗にレビューと評価を投稿
- 💖 **行きたいリスト**: 気になる店舗を保存して後で確認
- 🔗 **シェア機能**: TwitterやLINEで店舗情報を友達にシェア
- 🔐 **認証システム**: NextAuth.jsによるシンプルなログイン機能

## 🛠️ 技術スタック

- **フロントエンド**
  - Next.js 14 (App Router)
  - TypeScript (完全な型安全性)
  - Tailwind CSS
  - React Leaflet (地図表示)

- **バックエンド**
  - Next.js API Routes
  - Prisma (ORM)
  - PostgreSQL (本番環境)
  - Zod (バリデーション)

- **認証**
  - NextAuth.js

- **品質・モニタリング**
  - 構造化ログシステム
  - パフォーマンスモニタリング
  - エラーバウンダリ
  - 環境変数バリデーション

- **インフラ (AWS)**
  - ECS Fargate (コンテナ実行環境)
  - RDS PostgreSQL (データベース)
  - ALB (ロードバランサー)
  - ECR (コンテナレジストリ)
  - Secrets Manager (機密情報管理)
  - VPC, CloudWatch, etc.

- **IaC**
  - Terraform (インフラ管理)

## 🎨 品質最適化

本プロジェクトは3回の自己レビューを経て、以下の最適化を実施しています：

### レビュー第1回: 基本的な問題の修正
- ✅ TypeScript型安全性の強化（全ての`any`型を除去）
- ✅ 包括的な型定義の作成（types/cafe.ts）
- ✅ 環境変数のバリデーション（lib/env.ts）
- ✅ エラーハンドリングの改善
- ✅ トースト通知システムの実装

### レビュー第2回: 中級的な改善
- ✅ ローディングスケルトンコンポーネントの実装
- ✅ UX向上（適切なローディング状態とエラー表示）
- ✅ Next.js Linkコンポーネントへの移行
- ✅ APIクライアントの型安全性向上

### レビュー第3回: 高度な最適化
- ✅ パフォーマンス最適化（React.memo、useMemo）
- ✅ アクセシビリティ向上（ARIA labels、キーボードナビゲーション）
- ✅ SEO最適化（OG画像、robots.txt、sitemap、manifest）
- ✅ 構造化ログシステム（lib/logger.ts）
- ✅ パフォーマンスモニタリング（lib/performance.ts）
- ✅ エラーバウンダリの実装
- ✅ セマンティックHTML、スクリーンリーダー対応

## 🚀 セットアップ

### 必要要件

- Node.js 18.x 以上
- npm または yarn

### インストール

1. リポジトリをクローン

```bash
git clone https://github.com/tatsuhitofuruta/dog-cafe-map.git
cd dog-cafe-map
```

2. 依存パッケージをインストール

```bash
npm install
```

3. 環境変数を設定

`.env.example`をコピーして`.env`ファイルを作成し、必要な値を設定します。

```bash
cp .env.example .env
```

4. データベースのセットアップ

```bash
# Prismaエンジンの問題がある場合は、以下の環境変数を設定
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Prismaクライアントを生成してデータベースを作成
npx prisma generate
npx prisma db push
```

5. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開いてアプリケーションにアクセスできます。

## 📁 プロジェクト構造

```
dog-cafe-map/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # NextAuth API
│   │   ├── cafes/         # 店舗CRUD API
│   │   ├── my/            # ユーザー関連API
│   │   └── health/        # ヘルスチェック
│   ├── auth/              # 認証ページ
│   ├── cafes/             # 店舗関連ページ
│   ├── my/                # マイページ
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # トップページ
├── components/            # 再利用可能なコンポーネント
│   ├── Header.tsx
│   ├── Map.tsx
│   ├── Providers.tsx
│   └── ShareButtons.tsx
├── lib/                   # ユーティリティ関数
│   ├── api.ts            # APIクライアント
│   └── prisma.ts         # Prismaクライアント
├── prisma/               # Prismaスキーマ
│   └── schema.prisma
├── terraform/            # インフラ定義
│   ├── modules/          # Terraformモジュール
│   │   ├── vpc/
│   │   ├── ecs/
│   │   ├── rds/
│   │   ├── alb/
│   │   └── ecr/
│   └── environments/     # 環境別設定
│       ├── dev/
│       └── prod/
├── scripts/              # デプロイスクリプト
├── public/               # 静的ファイル
├── types/                # TypeScript型定義
├── Dockerfile            # 本番環境用
├── DEPLOYMENT.md         # デプロイガイド
└── README.md
```

## 🗄️ データベーススキーマ

主要なモデル：

- **User**: ユーザー情報
- **Cafe**: カフェ/店舗情報
- **Review**: レビュー
- **WantToGo**: 行きたいリスト
- **Image**: 店舗画像

詳細は `prisma/schema.prisma` を参照してください。

## ☁️ AWSへのデプロイ

本番環境へのデプロイ方法は [DEPLOYMENT.md](./DEPLOYMENT.md) を参照してください。

### クイックスタート

```bash
# Terraformでインフラをプロビジョニング
cd terraform
terraform init -backend-config="environments/dev/backend.conf"
terraform apply -var-file="environments/dev/terraform.tfvars"

# Dockerイメージをビルド・デプロイ
./scripts/deploy.sh dev
```

### アーキテクチャ

- **ECS Fargate**: サーバーレスコンテナ実行環境
- **RDS PostgreSQL**: マネージドデータベース
- **ALB**: HTTPSロードバランサー
- **VPC**: 2つのAZにまたがるプライベート・パブリックサブネット構成
- **Secrets Manager**: 機密情報の安全な管理

詳細なインフラ構成は `terraform/` ディレクトリを参照してください。

## 🎯 今後の開発予定

### フロントエンド
- [ ] 画像アップロード機能 (S3統合)
- [ ] 検索・フィルター機能（エリア、犬のサイズ、評価など）
- [ ] 地図のクラスタリング表示
- [ ] PWA対応
- [ ] ダークモード

### バックエンド
- [ ] Google Maps APIの統合（より正確なGeocoding）
- [ ] OAuth認証（Google、Twitter、LINE）
- [ ] 店舗の自動登録機能（外部API連携）
- [ ] 全文検索（ElasticsearchまたはAlgolia）
- [ ] 画像のリサイズ・最適化（Lambda + S3）

### インフラ
- [ ] CI/CD パイプライン (GitHub Actions)
- [ ] CloudFront CDN統合
- [ ] オートスケーリング設定
- [ ] マルチリージョン対応
- [ ] バックアップとディザスタリカバリー

### その他
- [ ] 管理者機能（不適切なコンテンツの管理）
- [ ] 通知機能（新しいレビュー、行きたいリストの更新）
- [ ] ソーシャル機能（フォロー、いいね）
- [ ] モバイルアプリ（React Native）

## 📝 ライセンス

MIT License

## 👥 コントリビューション

プルリクエストや機能提案を歓迎します！

## 📞 お問い合わせ

質問や提案がある場合は、GitHubのIssueを作成してください。

---

Made with ❤️ for dog lovers
