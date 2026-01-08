'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { onAuthChange, getCurrentUser, logout } from '@/lib/firebase/auth'

interface AuthContextType {
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signOut: async () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        // 1. Fast path: Check current user immediately (avoid flicker if already initialized)
        const currentUser = getCurrentUser()
        if (currentUser) {
            setUser(currentUser)
            setLoading(false)
        }

        // 2. Subscribe to changes
        const unsubscribe = onAuthChange((user) => {
            if (isMounted) {
                setUser(user)
                setLoading(false)
            }
        })

        return () => {
            isMounted = false
            unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, signOut: logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext)
