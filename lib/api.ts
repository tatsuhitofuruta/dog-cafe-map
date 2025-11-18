// API client utilities

export class ApiError extends Error {
  constructor(public status: number, message: string, public details?: any) {
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
  getAll: async () => {
    return fetchApi<any[]>('/api/cafes')
  },

  getById: async (id: string) => {
    return fetchApi<any>(`/api/cafes/${id}`)
  },

  create: async (data: any) => {
    return fetchApi<any>('/api/cafes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: any) => {
    return fetchApi<any>(`/api/cafes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string) => {
    return fetchApi<any>(`/api/cafes/${id}`, {
      method: 'DELETE',
    })
  },
}

// Review API
export const reviewApi = {
  getAll: async (cafeId: string) => {
    return fetchApi<any[]>(`/api/cafes/${cafeId}/reviews`)
  },

  create: async (cafeId: string, data: { rating: number; comment?: string }) => {
    return fetchApi<any>(`/api/cafes/${cafeId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

// WantToGo API
export const wantToGoApi = {
  check: async (cafeId: string) => {
    return fetchApi<{ isWantToGo: boolean }>(`/api/cafes/${cafeId}/want-to-go`)
  },

  add: async (cafeId: string) => {
    return fetchApi<any>(`/api/cafes/${cafeId}/want-to-go`, {
      method: 'POST',
    })
  },

  remove: async (cafeId: string) => {
    return fetchApi<any>(`/api/cafes/${cafeId}/want-to-go`, {
      method: 'DELETE',
    })
  },

  getMyList: async () => {
    return fetchApi<any[]>('/api/my/want-to-go')
  },
}
