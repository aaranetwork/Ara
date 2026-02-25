'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function RoutePrefetcher() {
    const router = useRouter()

    useEffect(() => {
        // List of key routes to prefetch
        const routes = [
            '/chat',
            '/journal',
            '/growth',
            '/mood-flow',
            '/profile',
            '/therapists'
        ]

        // Execute prefetching with delay to allow initial render priority
        const timer = setTimeout(() => {
            routes.forEach((route) => {
                router.prefetch(route)
            })
        }, 2000) // Wait 2s after mount for better initial load

        return () => clearTimeout(timer)
    }, [router])

    return null
}
