'use client'

import { useFeatureGate } from '@/hooks/useFeatureGate'

export type PlanType = 'free' | 'plus'

export interface FeatureAccess {
    hasAccess: boolean
    requiredPlan: 'plus' | null
    label: string
}

/**
 * Legacy Adapter Hook
 * Adapts the old useFeatureAccess API to the new useFeatureGate logic.
 */
export const useFeatureAccess = () => {
    const { isPaid, canAccess: gateCheck, loading } = useFeatureGate()

    const canAccess = (feature: string): FeatureAccess => {
        // Map legacy string keys to new FeatureKey logic
        switch (feature) {
            case 'therapist_matching':
                return {
                    hasAccess: gateCheck('therapist_match'),
                    requiredPlan: 'plus',
                    label: 'Available in AARA Prep Plus'
                }

            case 'view_mood_trends_page':
                // New Rule: Page is OPEN, but entries are limited.
                // So we always return true here to unlock the page.
                return {
                    hasAccess: true,
                    requiredPlan: null,
                    label: ''
                }

            case 'reports':
                return {
                    hasAccess: gateCheck('reports'),
                    requiredPlan: 'plus',
                    label: 'Requires 6+ Days of Context'
                }

            default:
                return { hasAccess: true, requiredPlan: null, label: '' }
        }
    }

    return {
        userPlan: (isPaid ? 'plus' : 'free') as PlanType,
        canAccess,
        loading
    }
}
