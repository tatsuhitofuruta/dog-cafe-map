import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "ワンちゃんカフェマップ - 犬と一緒に行けるカフェを探そう",
    template: "%s | ワンちゃんカフェマップ",
  },
  description: "犬と一緒に行けるカフェ・レストランを地図から探せるサービス。全国の犬連れOKのお店を検索して、レビューや評価を確認できます。",
  keywords: ["犬", "カフェ", "ドッグカフェ", "ペット", "レストラン", "犬連れ", "ペット同伴", "お出かけ"],
  authors: [{ name: "ワンちゃんカフェマップ" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://dog-cafe-map.com",
    siteName: "ワンちゃんカフェマップ",
    title: "ワンちゃんカフェマップ - 犬と一緒に行けるカフェを探そう",
    description: "犬と一緒に行けるカフェ・レストランを地図から探せるサービス",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ワンちゃんカフェマップ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ワンちゃんカフェマップ - 犬と一緒に行けるカフェを探そう",
    description: "犬と一緒に行けるカフェ・レストランを地図から探せるサービス",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
