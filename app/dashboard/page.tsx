"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { UserRole } from '@/types/api'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth')
        return
      }

      if (user) {
        // Redirect to role-specific dashboard
        switch (user.role) {
          case UserRole.ADMIN:
            router.push('/dashboard/admin')
            break
          case UserRole.BRAND_OWNER:
            router.push('/dashboard/brand-owner')
            break
          case UserRole.STAFF:
            router.push('/dashboard/staff')
            break
          case UserRole.CONSUMER:
          default:
            router.push('/dashboard/consumer')
            break
        }
      }
    }
  }, [user, isAuthenticated, loading, router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
