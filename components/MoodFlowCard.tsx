'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase/config'
import { collection, query, getDocs, orderBy } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Activity, ArrowRight } from 'lucide-react'

interface MoodFlowCardProps {
    onComplete?: () => void
}

export interface MoodEntry {
    id: string
    signals: { [key: string]: number }
    average: number
    createdAt: Date
}

export function MoodFlowCard({ onComplete }: MoodFlowCardProps) {
    const { user } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    // We can show stats here, but the check-in itself happens on the new page
    // For now, let's keep it simple as a trigger card

    useEffect(() => {
        if (!user) setLoading(false)
        else setLoading(false)
    }, [user])

    if (loading) return <div className="p-5 bg-[#0e0e12] rounded-2xl animate-pulse h-20" />

    const handleStart = () => {
        router.push('/check-in')
    }

    return (
        <div
            onClick={handleStart}
            className="group relative p-5 bg-[#0e0e12] border border-white/5 rounded-2xl cursor-pointer transition-all duration-300 hover:border-white/10 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            <div className="relative flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors border border-white/5">
                    <Activity size={24} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-white leading-tight">
                        Mood Flow
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                        5 insights • 30 seconds
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <span>Check In</span>
                    <ArrowRight size={16} />
                </div>
            </div>
        </div>
    )
}

export async function getMoodData(userId: string): Promise<MoodEntry[]> {
    if (!db) return []
    try {
        const moodRef = collection(db, 'users', userId, 'moods')
        const q = query(moodRef, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            signals: doc.data().signals || {},
            average: doc.data().average || doc.data().value || 0,
            createdAt: doc.data().createdAt.toDate()
        }))
    } catch (e) {
        console.error('Failed to get mood data:', e)
        return []
    }
}
