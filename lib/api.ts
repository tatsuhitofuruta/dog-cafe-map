import type {
  CafeWithStats,
  CafeWithDetails,
  CreateCafeInput,
  Review,
  CreateReviewInput,
  WantToGoWithCafe
} from '@/types/cafe'

// API client utilities

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: unknown) {
    super(message)
    this.name = 'ApiError'
  }
}

async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new ApiError(
      response.status,
      error.error || 'API request failed',
      error.details
    )
  }

  return response.json()
}

// Cafe API
export const cafeApi = {
  getAll: async (): Promise<CafeWithStats[]> => {
    return fetchApi<CafeWithStats[]>('/api/cafes')
  },

  getById: async (id: string): Promise<CafeWithDetails> => {
    return fetchApi<CafeWithDetails>(`/api/cafes/${id}`)
  },

  create: async (data: CreateCafeInput): Promise<CafeWithStats> => {
    return fetchApi<CafeWithStats>('/api/cafes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: Partial<CreateCafeInput>): Promise<CafeWithStats> => {
    return fetchApi<CafeWithStats>(`/api/cafes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/api/cafes/${id}`, {
      method: 'DELETE',
    })
  },
}

// Review API
export const reviewApi = {
  getAll: async (cafeId: string): Promise<Review[]> => {
    return fetchApi<Review[]>(`/api/cafes/${cafeId}/reviews`)
  },

  create: async (cafeId: string, data: CreateReviewInput): Promise<Review> => {
    return fetchApi<Review>(`/api/cafes/${cafeId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// WantToGo API
export const wantToGoApi = {
  check: async (cafeId: string): Promise<{ isWantToGo: boolean }> => {
    return fetchApi<{ isWantToGo: boolean }>(`/api/cafes/${cafeId}/want-to-go`)
  },

  add: async (cafeId: string): Promise<{ id: string }> => {
    return fetchApi<{ id: string }>(`/api/cafes/${cafeId}/want-to-go`, {
      method: 'POST',
    })
  },

  remove: async (cafeId: string): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(`/api/cafes/${cafeId}/want-to-go`, {
      method: 'DELETE',
    })
  },

  getMyList: async (): Promise<WantToGoWithCafe[]> => {
    return fetchApi<WantToGoWithCafe[]>('/api/my/want-to-go')
  },
}
