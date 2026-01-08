'use client'

import { useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import { onAuthChange, getCurrentUser, logout } from '@/lib/firebase/auth'
import { auth } from '@/lib/firebase/config'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    if (!auth) {
      if (isMounted) {
        setUser(null)
        setLoading(false)
      }
      return
    }

    if (typeof window !== 'undefined') {
      const currentUser = getCurrentUser()
      if (currentUser && isMounted) {
        setUser(currentUser)
        setLoading(false)
      }
    }

    const unsubscribe = onAuthChange((user) => {
      if (isMounted) {
        setUser(user)
        setLoading(false)
      }
    })

    const timeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false)
      }
    }, 1000)

    return () => {
      isMounted = false
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  return { user, loading, signOut: logout }
}


