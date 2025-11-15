const API_BASE = process.env.NEXT_PUBLIC_API_URL

export async function apiCall(
  endpoint: string,
  options: RequestInit & { token?: string } = {}
) {
  const { token, ...requestInit } = options
  
  const headers = new Headers(requestInit.headers || {})
  headers.set('Content-Type', 'application/json')
  
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null)
  
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...requestInit,
      headers,
    })

    if (!response.ok) {
      try {
        const error = await response.json()
        throw new Error(error.message || `API Error: ${response.statusText}`)
      } catch (e: any) {
        throw new Error(e.message || `API Error: ${response.statusText}`)
      }
    }

    return await response.json()
  } catch (error: any) {
    const errorMessage = error?.message || 'API call failed'
    throw new Error(errorMessage)
  }
}
