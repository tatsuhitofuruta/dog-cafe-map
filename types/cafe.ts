export interface Cafe {
  id: string
  name: string
  description?: string | null
  address: string
  latitude: number
  longitude: number
  phone?: string | null
  website?: string | null
  openingHours?: string | null
  dogRules?: string | null
  facilities?: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
}

export interface CafeWithDetails extends Cafe {
  reviews: Review[]
  images: Image[]
  _count?: {
    wantToGo: number
    reviews: number
  }
  averageRating?: number
}

export interface Review {
  id: string
  rating: number
  comment?: string | null
  createdAt: Date
  updatedAt: Date
  cafeId: string
  userId: string
  user: {
    name?: string | null
    image?: string | null
  }
}

export interface Image {
  id: string
  url: string
  cafeId: string
  createdAt: Date
}

export interface WantToGo {
  id: string
  createdAt: Date
  cafeId: string
  userId: string
}
