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

        // Execute prefetching with a slight delay to allow initial render priority
        const timer = setTimeout(() => {
            console.log('⚡ Prefetching routes...')
            routes.forEach((route) => {
                router.prefetch(route)
            })
        }, 1000) // Wait 1s after mount

        return () => clearTimeout(timer)
    }, [router])

    return null
}
