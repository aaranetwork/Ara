'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase/config'
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs, writeBatch } from 'firebase/firestore'

/**
 * Global provider to handle:
 * 1. Daily Usage Tracking (Active Days)
 * 2. Data Cleanup for Trial Users
 */
export function FeatureAccessProvider({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    useEffect(() => {
        if (loading || !user || !db) return

        const checkUsage = async () => {
            try {
                const userRef = doc(db!, 'users', user.uid)
                const userSnap = await getDoc(userRef)

                const now = new Date()
                const today = now.toISOString().split('T')[0] // YYYY-MM-DD

                let isPaid = false

                if (!userSnap.exists()) {
                    // Do NOT auto-create user here anymore. 
                    // User creation happens at /plans when they start trial.
                    // This prevents "active_days" from incrementing before they even see the app.
                    return
                } else {
                    const data = userSnap.data()
                    const onboarded = data.onboarding_completed === true

                    if (!onboarded) return // Don't track usage for non-onboarded users

                    isPaid = data.is_paid || false
                    const lastActive = data.last_active_date

                    // If new day, increment usage
                    if (lastActive !== today) {
                        await updateDoc(userRef, {
                            last_active_date: today,
                            active_days_count: increment(1)
                        })
                    }
                }

                // DATA CLEANUP (Trial Users Only)
                // Delete moods/journals older than 3 days
                if (!isPaid) {
                    const threeDaysAgo = new Date()
                    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

                    // Cleanup Moods
                    const moodsRef = collection(db!, 'users', user.uid, 'moods')
                    const oldMoodsQuery = query(moodsRef, where('createdAt', '<', threeDaysAgo))
                    const oldMoods = await getDocs(oldMoodsQuery)

                    if (!oldMoods.empty) {
                        const batch = writeBatch(db!)
                        oldMoods.forEach((doc) => batch.delete(doc.ref))
                        await batch.commit()
                        console.log(`[Cleanup] Deleted ${oldMoods.size} old moods`)
                    }

                    // Cleanup Journals
                    const journalRef = collection(db!, 'users', user.uid, 'journal')
                    const oldJournalsQuery = query(journalRef, where('createdAt', '<', threeDaysAgo))
                    const oldJournals = await getDocs(oldJournalsQuery)

                    if (!oldJournals.empty) {
                        const batch = writeBatch(db!)
                        oldJournals.forEach((doc) => batch.delete(doc.ref))
                        await batch.commit()
                        console.log(`[Cleanup] Deleted ${oldJournals.size} old journals`)
                    }
                }

            } catch (error) {
                console.error('[FeatureAccess] Error tracking usage:', error)
            }
        }

        checkUsage()
    }, [user, loading])

    // ONBOARDING & TRIAL CHECK
    const [isExpired, setIsExpired] = useState(false)
    const [needsOnboarding, setNeedsOnboarding] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (loading || !user || !db) return

        const checkStatus = async () => {
            const userRef = doc(db!, 'users', user.uid)
            const userSnap = await getDoc(userRef)

            if (userSnap.exists()) {
                const data = userSnap.data()
                const isPaid = data.is_paid || false
                const activeDays = data.active_days_count || 1
                const onboarded = data.onboarding_completed === true // Strict check

                // 1. Check Onboarding (New Users)
                if (!onboarded && !isPaid) {
                    setNeedsOnboarding(true)
                    return
                }

                // 2. Check Trial Expiration (Existing Users)
                if (!isPaid && activeDays > 3) {
                    setIsExpired(true)
                }
            } else {
                // No doc = New User = Needs Onboarding
                setNeedsOnboarding(true)
            }
        }
        checkStatus()
    }, [user, loading, pathname])

    useEffect(() => {
        if (needsOnboarding) {
            const allowed = ['/welcome', '/profile', '/sign-in']
            if (!allowed.some(path => pathname?.startsWith(path))) {
                router.replace('/welcome')
            }
        }
    }, [needsOnboarding, pathname, router])

    const isRestricted = (needsOnboarding && !['/welcome', '/profile'].some(p => pathname?.startsWith(p)))

    if (isRestricted) {
        return null // Hide protected content
    }

    return <>{children}</>
}
