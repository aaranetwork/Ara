'use client'

import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'

export type FeatureKey = 'mood_flow' | 'reports' | 'therapist_match' | 'chat_context' | 'data_history'

interface FeatureGateState {
    isPaid: boolean
    activeDays: number
    loading: boolean
    canAccess: (feature: FeatureKey) => boolean
    getUnlockProgress: () => { current: number, required: number }
}

export function useFeatureGate(): FeatureGateState {
    const { user } = useAuth()
    const [isPaid, setIsPaid] = useState(false)
    const [activeDays, setActiveDays] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user || !db) {
            setLoading(false)
            return
        }

        const fetchGateData = async () => {
            try {
                const userRef = doc(db!, 'users', user.uid)
                const snap = await getDoc(userRef)
                if (snap.exists()) {
                    const data = snap.data()
                    setIsPaid(data.is_paid || false)
                    setActiveDays(data.active_days_count || 1)
                }
            } catch (error) {
                console.error('Error fetching feature gate data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchGateData()
    }, [user])

    const canAccess = (feature: FeatureKey): boolean => {
        if (loading) return false
        if (isPaid) return true // Paid users unlock everything immediately? 
        // Actually, spec says Reports unlock after 6 days even for paid users (paid days + trial days combined)
        // "Paid: UNLOCKS only after 6 total days of usage"

        switch (feature) {
            case 'mood_flow':
                // Trial: Limited to 3 entries/day. 
                // This check is better done at the action level (handleAddMood), not just a boolean gate.
                // But generally "access" to the page is allowed.
                return true

            case 'reports':
                // Trial: LOCKED
                // Paid: Unlock after 6 days
                return isPaid && activeDays >= 6

            case 'therapist_match':
                // Trial: LOCKED
                return isPaid

            case 'chat_context':
                // Trial: Limited (session based)
                return isPaid

            case 'data_history':
                // Trial: 3 days
                return isPaid

            default:
                return true
        }
    }

    const getUnlockProgress = () => {
        return { current: activeDays, required: 6 }
    }

    return { isPaid, activeDays, loading, canAccess, getUnlockProgress }
}
