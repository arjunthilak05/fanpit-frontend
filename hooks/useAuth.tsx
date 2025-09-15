"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import apiClient from '@/lib/api/client'

export interface User {
  id: string
  email: string
  name: string
  role: 'consumer' | 'brand_owner' | 'staff'
  avatar?: string
  phone?: string
  isEmailVerified?: boolean
  isActive?: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null
  login: (email: string, password: string, role?: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, newPassword: string) => Promise<void>
  clearError: () => void
}

interface RegisterData {
  name: string
  email: string
  password: string
  role: 'consumer' | 'brand_owner' | 'staff'
  phone?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)
  const router = useRouter()

  const isAuthenticated = !!user

  const clearError = () => setError(null)

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      checkAuthStatus()
    }
  }, [isHydrated])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setIsLoading(false)
        return
      }

      const userData = await apiClient.get('/auth/me')
      setUser(userData.data || userData)
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string, role?: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { user, accessToken, refreshToken } = await apiClient.post('/auth/login', { email, password, role })

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      setUser(user)

      // Redirect based on role
      switch (user.role) {
        case 'consumer':
          router.push('/dashboard/consumer')
          break
        case 'brand_owner':
          router.push('/dashboard/brand-owner')
          break
        case 'staff':
          router.push('/dashboard/staff')
          break
        default:
          router.push('/')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      setError(null)

      const { user, accessToken, refreshToken } = await apiClient.post('/auth/register', userData)

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      setUser(user)

      // Don't redirect immediately, let the form handle the flow
      // router.push('/dashboard/consumer')
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      router.push('/')
    }
  }

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token')
      }

      const { accessToken } = await apiClient.post('/auth/refresh', { refreshToken })
      localStorage.setItem('accessToken', accessToken)
    } catch (error) {
      console.error('Token refresh error:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
      throw error
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await apiClient.put('/users/me', data)
      setUser(updatedUser.data || updatedUser)
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      return await apiClient.post('/auth/forgot-password', { email })
    } catch (error) {
      console.error('Forgot password error:', error)
      throw error
    }
  }

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      return await apiClient.post('/auth/reset-password', { token, newPassword })
    } catch (error) {
      console.error('Password reset error:', error)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    isLoading: isLoading || !isHydrated,
    isAuthenticated,
    error,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    forgotPassword,
    resetPassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Protected Route Component
export function ProtectedRoute({
  children,
  allowedRoles
}: {
  children: ReactNode
  allowedRoles?: ('consumer' | 'brand_owner' | 'staff')[]
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
      return
    }

    if (!isLoading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard
      switch (user.role) {
        case 'consumer':
          router.push('/dashboard/consumer')
          break
        case 'brand_owner':
          router.push('/dashboard/brand-owner')
          break
        case 'staff':
          router.push('/dashboard/staff')
          break
        default:
          router.push('/')
      }
    }
  }, [user, isLoading, allowedRoles, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null
  }

  return <>{children}</>
}