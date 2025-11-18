"use client"

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import ShareButtons from '@/components/ShareButtons'

const Map = dynamic(() => import('@/components/Map'), { ssr: false })

// サンプルデータ
const sampleCafe = {
  id: '1',
  name: 'ドッグカフェ 渋谷',
  description: '犬と一緒にくつろげるおしゃれなカフェです。テラス席では愛犬と一緒にお食事を楽しめます。',
  address: '東京都渋谷区渋谷1-1-1',
  latitude: 35.6595,
  longitude: 139.7004,
  phone: '03-1234-5678',
  website: 'https://example.com',
  openingHours: '10:00-20:00',
  dogRules: '小型犬・中型犬OK（大型犬は要相談）',
  facilities: 'テラス席、ドッグラン、水飲み場、リード貸出',
  reviews: [
    {
      id: '1',
      rating: 5,
      comment: '愛犬と一緒にゆっくり過ごせました！スタッフの方も犬に優しくて安心です。',
      user: { name: '太郎', image: null },
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      rating: 4,
      comment: 'テラス席が広くて快適。ただし週末は混雑するので予約推奨です。',
      user: { name: '花子', image: null },
      createdAt: new Date('2024-01-10'),
    },
  ],
  images: [
    { id: '1', url: 'https://via.placeholder.com/600x400', createdAt: new Date() },
  ],
  averageRating: 4.5,
  wantToGoCount: 42,
}

export default function CafeDetailPage() {
  const params = useParams()
  const { data: session } = useSession()
  const [isWantToGo, setIsWantToGo] = useState(false)
  const cafe = sampleCafe

  const toggleWantToGo = () => {
    if (!session) {
      alert('ログインが必要です')
      return
    }
    setIsWantToGo(!isWantToGo)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <nav className="mb-4 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            トップ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700">{cafe.name}</span>
        </nav>

        {/* メイン画像 */}
        <div className="mb-6">
          <img
            src={cafe.images[0]?.url || 'https://via.placeholder.com/1200x400'}
            alt={`${cafe.name}の外観または店内の様子`}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
            loading="eager"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左側：詳細情報 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {cafe.name}
              </h1>

              {/* 評価と行きたいボタン */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center" role="group" aria-label="評価">
                  <div className="flex text-yellow-400" aria-hidden="true">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(cafe.averageRating || 0) ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {cafe.averageRating?.toFixed(1)} ({cafe.reviews.length}件)
                  </span>
                  <span className="sr-only">
                    5点満点中{cafe.averageRating?.toFixed(1)}点、{cafe.reviews.length}件のレビュー
                  </span>
                </div>

                <button
                  onClick={toggleWantToGo}
                  className={`px-6 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isWantToGo
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  aria-pressed={isWantToGo}
                  aria-label={`${cafe.name}を行きたいリストに${isWantToGo ? '追加済み' : '追加する'}`}
                >
                  {isWantToGo ? '行きたい✓' : '行きたい'}
                  <span className="ml-2 text-sm" aria-label={`${cafe.wantToGoCount}人が行きたいと登録`}>
                    ({cafe.wantToGoCount})
                  </span>
                </button>
              </div>

              <p className="text-gray-700 mb-6">{cafe.description}</p>

              {/* 基本情報 */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">基本情報</h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="font-medium text-gray-900">住所</dt>
                    <dd className="text-gray-700">{cafe.address}</dd>
                  </div>
                  {cafe.phone && (
                    <div>
                      <dt className="font-medium text-gray-900">電話番号</dt>
                      <dd className="text-gray-700">{cafe.phone}</dd>
                    </div>
                  )}
                  {cafe.website && (
                    <div>
                      <dt className="font-medium text-gray-900">ウェブサイト</dt>
                      <dd>
                        <a
                          href={cafe.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {cafe.website}
                        </a>
                      </dd>
                    </div>
                  )}
                  {cafe.openingHours && (
                    <div>
                      <dt className="font-medium text-gray-900">営業時間</dt>
                      <dd className="text-gray-700">{cafe.openingHours}</dd>
                    </div>
                  )}
                  {cafe.dogRules && (
                    <div>
                      <dt className="font-medium text-gray-900">犬の受入条件</dt>
                      <dd className="text-gray-700">{cafe.dogRules}</dd>
                    </div>
                  )}
                  {cafe.facilities && (
                    <div>
                      <dt className="font-medium text-gray-900">設備</dt>
                      <dd className="text-gray-700">{cafe.facilities}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* レビュー */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">レビュー</h2>
                {session && (
                  <Link
                    href={`/cafes/${cafe.id}/review`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    レビューを書く
                  </Link>
                )}
              </div>

              <div className="space-y-4">
                {cafe.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < review.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {review.user.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-400">
                        {review.createdAt.toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右側：地図とシェア */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">アクセス</h2>
              <div className="h-64 mb-4">
                <Map
                  cafes={[cafe]}
                  center={[cafe.latitude, cafe.longitude]}
                  zoom={15}
                />
              </div>

              {/* シェアボタン */}
              <div className="border-t pt-4">
                <ShareButtons
                  title={cafe.name}
                  text={`${cafe.name} - 犬と一緒に行けるカフェ`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
