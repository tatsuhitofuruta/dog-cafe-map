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
  - TypeScript
  - Tailwind CSS
  - React Leaflet (地図表示)

- **バックエンド**
  - Next.js API Routes
  - Prisma (ORM)
  - SQLite (開発環境)

- **認証**
  - NextAuth.js

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
│   └── prisma.ts
├── prisma/               # Prismaスキーマ
│   └── schema.prisma
├── public/               # 静的ファイル
├── types/                # TypeScript型定義
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

## 🎯 今後の開発予定

- [ ] 画像アップロード機能
- [ ] 検索・フィルター機能（エリア、犬のサイズなど）
- [ ] Google Maps APIの統合（Geocoding）
- [ ] OAuth認証（Google、Twitterなど）
- [ ] 店舗の自動登録機能（外部API連携）
- [ ] モバイルアプリ対応
- [ ] 管理者機能
- [ ] 通知機能

## 📝 ライセンス

MIT License

## 👥 コントリビューション

プルリクエストや機能提案を歓迎します！

## 📞 お問い合わせ

質問や提案がある場合は、GitHubのIssueを作成してください。

---

Made with ❤️ for dog lovers
