"use client"

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { cafeApi } from '@/lib/api'

// Leafletはクライアントサイドのみで動作するため、dynamic importを使用
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">地図を読み込み中...</p>
    </div>
  ),
})

export default function Home() {
  const [cafes, setCafes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setLoading(true)
        const data = await cafeApi.getAll()
        setCafes(data)
      } catch (err) {
        console.error('Failed to fetch cafes:', err)
        setError('店舗情報の取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchCafes()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            再読み込み
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            犬と一緒に行けるカフェを探そう
          </h1>
          <p className="text-gray-600">
            全国の犬連れOKのカフェ・レストランをマップから検索
          </p>
        </div>

        {cafes.length > 0 ? (
          <>
            <div className="mb-8">
              <Map cafes={cafes} center={[35.6595, 139.7004]} zoom={13} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cafes.map((cafe) => (
                <div
                  key={cafe.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {cafe.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{cafe.address}</p>
                  {cafe.description && (
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                      {cafe.description}
                    </p>
                  )}
                  {cafe.averageRating > 0 && (
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400 text-sm">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(cafe.averageRating) ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {cafe.averageRating.toFixed(1)} ({cafe.reviewCount}件)
                      </span>
                    </div>
                  )}
                  <a
                    href={`/cafes/${cafe.id}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    詳細を見る →
                  </a>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">まだ店舗が登録されていません</p>
            <a
              href="/cafes/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              最初の店舗を登録する
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
