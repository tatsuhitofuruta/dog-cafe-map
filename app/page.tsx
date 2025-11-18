"use client"

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { cafeApi, ApiError } from '@/lib/api'
import { CafeWithStats } from '@/types/cafe'
import { CafeCardSkeleton, MapSkeleton } from '@/components/Skeleton'
import Link from 'next/link'

// Leafletはクライアントサイドのみで動作するため、dynamic importを使用
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

export default function Home() {
  const [cafes, setCafes] = useState<CafeWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await cafeApi.getAll()
        setCafes(data)
      } catch (err) {
        console.error('Failed to fetch cafes:', err)
        const errorMessage = err instanceof ApiError
          ? err.message
          : '店舗情報の取得に失敗しました'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchCafes()
  }, [])

  if (loading) {
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
          <MapSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[...Array(6)].map((_, i) => (
              <CafeCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
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
                  <Link
                    href={`/cafes/${cafe.id}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    詳細を見る →
                  </Link>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏪</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              まだ店舗が登録されていません
            </h2>
            <p className="text-gray-600 mb-6">
              あなたが最初の店舗を登録してみませんか？
            </p>
            <Link
              href="/cafes/new"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              最初の店舗を登録する
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
