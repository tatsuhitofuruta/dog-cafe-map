"use client"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect } from 'react'

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

export default function Map({ cafes, center = [35.6812, 139.7671], zoom = 13 }: MapProps) {
  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cafes.map((cafe) => (
          <Marker key={cafe.id} position={[cafe.latitude, cafe.longitude]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-lg">{cafe.name}</h3>
                <p className="text-sm text-gray-600">{cafe.address}</p>
                {cafe.description && (
                  <p className="text-sm mt-2">{cafe.description}</p>
                )}
                <a
                  href={`/cafes/${cafe.id}`}
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  詳細を見る
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
