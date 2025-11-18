"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { cafeApi, ApiError } from '@/lib/api'

export default function NewCafePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    website: '',
    openingHours: '',
    dogRules: '',
    facilities: '',
  })

  // ログインしていない場合はリダイレクト
  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const geocodeAddress = async (address: string): Promise<{ latitude: number; longitude: number }> => {
    // 簡易的なGeocoding（本番ではGoogle Maps APIやOpenStreetMap Nominatimを使用）
    // ここでは東京の中心座標をデフォルトとする
    try {
      // Nominatim APIを使用（無料、ただしレート制限あり）
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'DogCafeMap/1.0',
          },
        }
      )

      const data = await response.json()

      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        }
      }
    } catch (err) {
      console.error('Geocoding error:', err)
    }

    // デフォルト: 東京駅
    return { latitude: 35.6812, longitude: 139.7671 }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // 住所から緯度経度を取得
      const { latitude, longitude } = await geocodeAddress(formData.address)

      // APIに送信
      const cafe = await cafeApi.create({
        ...formData,
        latitude,
        longitude,
      })

      alert('店舗を登録しました！')
      router.push(`/cafes/${cafe.id}`)
    } catch (err) {
      console.error('登録エラー:', err)
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('登録に失敗しました。もう一度お試しください。')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* パンくずリスト */}
        <nav className="mb-6 text-sm">
          <Link href="/" className="text-blue-600 hover:underline">
            トップ
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-700">店舗を登録</span>
        </nav>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            新しい店舗を登録
          </h1>

          <p className="text-gray-600 mb-8">
            犬と一緒に行けるカフェ・レストランの情報を登録してください。
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 店舗名 */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                店舗名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：ドッグカフェ渋谷"
              />
            </div>

            {/* 住所 */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                住所 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：東京都渋谷区渋谷1-1-1"
              />
            </div>

            {/* 説明 */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                説明
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="お店の特徴や雰囲気など"
              />
            </div>

            {/* 電話番号 */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                電話番号
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：03-1234-5678"
              />
            </div>

            {/* ウェブサイト */}
            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ウェブサイト
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：https://example.com"
              />
            </div>

            {/* 営業時間 */}
            <div>
              <label
                htmlFor="openingHours"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                営業時間
              </label>
              <input
                type="text"
                id="openingHours"
                name="openingHours"
                value={formData.openingHours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：10:00-20:00"
              />
            </div>

            {/* 犬の受入条件 */}
            <div>
              <label
                htmlFor="dogRules"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                犬の受入条件
              </label>
              <input
                type="text"
                id="dogRules"
                name="dogRules"
                value={formData.dogRules}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：小型犬・中型犬OK（大型犬は要相談）"
              />
            </div>

            {/* 設備 */}
            <div>
              <label
                htmlFor="facilities"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                設備
              </label>
              <input
                type="text"
                id="facilities"
                name="facilities"
                value={formData.facilities}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例：テラス席、ドッグラン、水飲み場"
              />
            </div>

            {/* エラーメッセージ */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* 送信ボタン */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? '登録中...' : '店舗を登録'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={isSubmitting}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
