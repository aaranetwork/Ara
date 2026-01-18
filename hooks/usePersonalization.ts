'use client'

import { useState, useEffect } from 'react'

interface UserBehavior {
    lastVisitedCategory?: string
    scrollDepth: number
    isDeepExplorer: boolean
}

export function usePersonalization() {
    const [behavior, setBehavior] = useState<UserBehavior>({
        scrollDepth: 0,
        isDeepExplorer: false
    })

    useEffect(() => {
        const handleScroll = () => {
            const depth = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
            setBehavior(prev => ({
                ...prev,
                scrollDepth: depth,
                isDeepExplorer: prev.isDeepExplorer || depth > 0.5
            }))
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return {
        behavior,
        personalizeText: (defaultHeader: string, alternativeHeader: string) => {
            return behavior.isDeepExplorer ? alternativeHeader : defaultHeader
        },
        personalizeCTA: (defaultCTA: string, alternativeCTA: string) => {
            return behavior.scrollDepth > 0.8 ? alternativeCTA : defaultCTA
        }
    }
}
