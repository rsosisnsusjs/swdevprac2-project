'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiCall } from '@/lib/api-client'

interface User {
  _id: string
  name: string
  email: string
  tel?: string
  role: 'member' | 'admin'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; tel: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken')
        if (storedToken) {
          try {
            const data = await apiCall('/auth/me', { token: storedToken })
            setUser(data.data)
            setToken(storedToken)
          } catch (error) {
            localStorage.removeItem('authToken')
            setToken(null)
            setUser(null)
          }
        }
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    const authToken = data.token
    setToken(authToken)
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      tel: data.tel,
      role: data.role || 'member',
    })
    
    localStorage.setItem('authToken', authToken)
  }

  const register = async (data: { name: string; email: string; tel: string; password: string }) => {
    const result = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, role: 'member' }),
    })

    const authToken = result.token
    setToken(authToken)
    setUser({
      _id: result._id,
      name: result.name,
      email: result.email,
      tel: data.tel,
      role: 'member',
    })
    
    localStorage.setItem('authToken', authToken)
  }

  const logout = async () => {
    try {
      await apiCall('/auth/logout', { method: 'POST', token })
    } catch (error) {
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('authToken')
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
