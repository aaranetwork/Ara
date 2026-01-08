'use client'

import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// Dynamically import heavy components
const Dashboard = dynamic(() => import('./Dashboard'), {
    loading: () => <LoadingScreen />
})
const LandingPage = dynamic(() => import('./LandingPage'), {
    loading: () => <LoadingScreen />
})

// Shared Loading Screen
function LoadingScreen() {
    return (
        <div className="min-h-screen bg-[#08080c] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Image src="/aara-logo.png" alt="AARA" width={48} height={48} className="rounded-xl animate-pulse" />
                <div className="w-8 h-1 bg-blue-500/30 rounded-full animate-pulse" />
            </div>
        </div>
    )
}

export default function HomeWrapper() {
    const { user, loading } = useAuth()

    if (loading) {
        return <LoadingScreen />
    }

    if (user) {
        return <Dashboard user={user} />
    }

    return <LandingPage />
}
