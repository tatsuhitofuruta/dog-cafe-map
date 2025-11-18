"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { memo, useMemo } from 'react'
import Link from 'next/link'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface Cafe {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string
  description?: string
}

interface MapProps {
  cafes: Cafe[]
  center?: [number, number]
  zoom?: number
}

function Map({ cafes, center = [35.6812, 139.7671], zoom = 13 }: MapProps) {
  // Memoize markers to prevent unnecessary re-renders
  const markers = useMemo(() => (
    cafes.map((cafe) => (
      <Marker
        key={cafe.id}
        position={[cafe.latitude, cafe.longitude]}
        aria-label={`${cafe.name}の位置`}
      >
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-lg">{cafe.name}</h3>
            <p className="text-sm text-gray-600">{cafe.address}</p>
            {cafe.description && (
              <p className="text-sm mt-2">{cafe.description}</p>
            )}
            <Link
              href={`/cafes/${cafe.id}`}
              className="text-blue-600 hover:underline text-sm mt-2 inline-block"
              aria-label={`${cafe.name}の詳細を見る`}
            >
              詳細を見る
            </Link>
          </div>
        </Popup>
      </Marker>
    ))
  ), [cafes])

  return (
    <div
      className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg"
      role="region"
      aria-label="犬カフェの地図"
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
        aria-label="インタラクティブマップ"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers}
      </MapContainer>
    </div>
  )
}

// Memoize the entire component to prevent unnecessary re-renders
export default memo(Map)
