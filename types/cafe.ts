export interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
}

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
  createdAt: Date | string
  updatedAt: Date | string
  userId: string
}

export interface CafeWithStats extends Cafe {
  averageRating: number
  reviewCount: number
  wantToGoCount: number
}

export interface CafeWithDetails extends CafeWithStats {
  reviews: Review[]
  images: Image[]
  user?: User
}

export interface Review {
  id: string
  rating: number
  comment?: string | null
  createdAt: Date | string
  updatedAt: Date | string
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
  createdAt: Date | string
}

export interface WantToGo {
  id: string
  createdAt: Date | string
  cafeId: string
  userId: string
}

export interface WantToGoWithCafe extends WantToGo {
  cafe: CafeWithStats
}

export interface CreateCafeInput {
  name: string
  description?: string
  address: string
  latitude: number
  longitude: number
  phone?: string
  website?: string
  openingHours?: string
  dogRules?: string
  facilities?: string
}

export interface CreateReviewInput {
  rating: number
  comment?: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}
