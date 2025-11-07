"use client"

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

// サンプルデータ
const sampleWantToGo = [
  {
    id: '1',
    cafe: {
      id: '1',
      name: 'ドッグカフェ 渋谷',
      address: '東京都渋谷区渋谷1-1-1',
      description: '犬と一緒にくつろげるおしゃれなカフェ',
      averageRating: 4.5,
      reviewCount: 12,
    },
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    cafe: {
      id: '2',
      name: 'ワンワンカフェ 代々木公園',
      address: '東京都渋谷区代々木公園町1-1',
      description: '公園のそばにある犬連れ歓迎のカフェ',
      averageRating: 4.0,
      reviewCount: 8,
    },
    createdAt: new Date('2024-01-18'),
  },
]

export default function WantToGoPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wantToGoList, setWantToGoList] = useState(sampleWantToGo)

  // ログインしていない場合はリダイレクト
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const handleRemove = (id: string) => {
    if (confirm('行きたいリストから削除しますか?')) {
      setWantToGoList(wantToGoList.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            行きたいリスト
          </h1>
          <p className="text-gray-600">
            気になるカフェを保存して、あとで訪問できます
          </p>
        </div>

        {wantToGoList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              行きたいリストが空です
            </h2>
            <p className="text-gray-600 mb-6">
              気になるカフェを見つけたら「行きたい」ボタンで保存しましょう
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              カフェを探す
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wantToGoList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">
                      {item.cafe.name}
                    </h3>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      title="削除"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {item.cafe.address}
                  </p>

                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {item.cafe.description}
                  </p>

                  {/* 評価 */}
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(item.cafe.averageRating || 0)
                            ? '★'
                            : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      {item.cafe.averageRating?.toFixed(1)} (
                      {item.cafe.reviewCount}件)
                    </span>
                  </div>

                  {/* 追加日 */}
                  <p className="text-xs text-gray-500 mb-4">
                    追加日: {item.createdAt.toLocaleDateString('ja-JP')}
                  </p>

                  <Link
                    href={`/cafes/${item.cafe.id}`}
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    詳細を見る
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {wantToGoList.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              全 {wantToGoList.length} 件のカフェ
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
