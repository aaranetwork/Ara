'use client'

import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

// Dynamically import heavy components
import LandingPage from './LandingPage'

// Dynamically import heavy components
const Dashboard = dynamic(() => import('./Dashboard'), {
    loading: () => <LoadingScreen />
})

// Shared Loading Screen
function LoadingScreen() {
    return (
        <div className="min-h-screen bg-aara-dark flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Image src="/aara-logo.png" alt="AARA" width={48} height={48} className="rounded-xl animate-pulse" />
                <div className="w-8 h-1 bg-aara-accent/30 rounded-full animate-pulse" />
            </div>
        </div>
    )
}

export default function HomeWrapper() {
    const { user, loading } = useAuth()

    // Force scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
    }, [])

    // Optimistic Render: Show Landing Page by default to improve LCP.
    // If user is found later, we switch to Dashboard.
    if (user) {
        return <Dashboard user={user} />
    }

    return <LandingPage />
}
