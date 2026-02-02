'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth')
      const adminEmail = localStorage.getItem('adminEmail')
      
      if (adminAuth === 'true' && adminEmail === 'cardoso9197@gmail.com') {
        setIsAuthenticated(true)
      } else {
        router.push('/admin/login')
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const logout = () => {
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminEmail')
    localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  return { isAuthenticated, isLoading, logout }
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('adminToken')
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  const adminAuth = localStorage.getItem('adminAuth')
  const adminEmail = localStorage.getItem('adminEmail')
  return adminAuth === 'true' && adminEmail === 'cardoso9197@gmail.com'
}
