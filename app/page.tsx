"use client"

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Leafletはクライアントサイドのみで動作するため、dynamic importを使用
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">地図を読み込み中...</p>
    </div>
  ),
})

// サンプルデータ（実際はAPIから取得）
const sampleCafes = [
  {
    id: '1',
    name: 'ドッグカフェ 渋谷',
    latitude: 35.6595,
    longitude: 139.7004,
    address: '東京都渋谷区渋谷1-1-1',
    description: '犬と一緒にくつろげるおしゃれなカフェ',
  },
  {
    id: '2',
    name: 'ワンワンカフェ 代々木公園',
    latitude: 35.6719,
    longitude: 139.6961,
    address: '東京都渋谷区代々木公園町1-1',
    description: '公園のそばにある犬連れ歓迎のカフェ',
  },
  {
    id: '3',
    name: 'パウパウカフェ 恵比寿',
    latitude: 35.6467,
    longitude: 139.7100,
    address: '東京都渋谷区恵比寿1-1-1',
    description: 'テラス席完備の犬カフェ',
  },
]

export default function Home() {
  const [cafes, setCafes] = useState(sampleCafes)

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
              <p className="text-sm text-gray-700 mb-4">{cafe.description}</p>
              <a
                href={`/cafes/${cafe.id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                詳細を見る →
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
