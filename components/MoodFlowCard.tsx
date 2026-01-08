'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Activity, X, Check, ArrowRight, Sparkles, Brain, Zap, Heart } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { useFeatureGate } from '@/hooks/useFeatureGate'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// Professional therapeutic signal questions
const MOOD_SIGNALS = [
    {
        id: 'emotional_state',
        emoji: '💭',
        question: 'How is your emotional state?',
        lowLabel: 'Low',
        highLabel: 'Peak',
        color: 'from-blue-400 to-indigo-400'
    },
    {
        id: 'energy_level',
        emoji: '⚡',
        question: 'Rate your energy levels',
        lowLabel: 'Drained',
        highLabel: 'Charged',
        color: 'from-yellow-400 to-orange-400'
    },
    {
        id: 'stress_level',
        emoji: '🧘',
        question: 'Current stress level?',
        lowLabel: 'High',
        highLabel: 'Calm',
        color: 'from-red-400 to-pink-400'
    },
    {
        id: 'mental_clarity',
        emoji: '🧠',
        question: 'How clear is your mind?',
        lowLabel: 'Foggy',
        highLabel: 'Clear',
        color: 'from-emerald-400 to-teal-400'
    },
    {
        id: 'connection',
        emoji: '💝',
        question: 'Feeling connected?',
        lowLabel: 'Alone',
        highLabel: 'Unified',
        color: 'from-pink-400 to-rose-400'
    }
]

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
    const [isOpen, setIsOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<{ [key: string]: number }>({})
    const [saving, setSaving] = useState(false)
    const [todayCount, setTodayCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showComplete, setShowComplete] = useState(false)
    const { isPaid } = useFeatureGate()
    const DAILY_LIMIT = isPaid ? 999 : 3

    const signal = MOOD_SIGNALS[currentStep]
    const progress = ((currentStep + 1) / MOOD_SIGNALS.length) * 100

    useEffect(() => {
        if (user) loadTodayEntry()
    }, [user])

    const loadTodayEntry = async () => {
        if (!user || !db) {
            setLoading(false)
            return
        }
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const moodRef = collection(db, 'users', user.uid, 'moods')
            const q = query(moodRef, where('createdAt', '>=', Timestamp.fromDate(today)))
            const snapshot = await getDocs(q)
            setTodayCount(snapshot.size)
        } catch (e) {
            console.error('Failed to load mood:', e)
        } finally {
            setLoading(false)
        }
    }

    const handleAnswer = (value: number) => {
        const newAnswers = { ...answers, [signal.id]: value }
        setAnswers(newAnswers)
        if (currentStep < MOOD_SIGNALS.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 150)
        } else {
            saveMood(newAnswers)
        }
    }

    const saveMood = async (finalAnswers: { [key: string]: number }) => {
        if (!user || !db) return
        setSaving(true)
        try {
            const values = Object.values(finalAnswers)
            const average = values.reduce((a, b) => a + b, 0) / values.length
            const moodRef = collection(db, 'users', user.uid, 'moods')
            await addDoc(moodRef, {
                signals: finalAnswers,
                value: Math.round(average * 10) / 10,
                average: Math.round(average * 10) / 10,
                createdAt: Timestamp.now()
            })
            setShowComplete(true)
            setTimeout(() => {
                setIsOpen(false)
                setShowComplete(false)
                setCurrentStep(0)
                setAnswers({})
                onComplete?.()
            }, 1200)
        } catch (e) {
            console.error('Failed to save mood:', e)
        } finally {
            setSaving(false)
        }
    }

    const openModal = () => {
        setCurrentStep(0)
        setAnswers({})
        setShowComplete(false)
        setIsOpen(true)
    }

    if (todayCount >= DAILY_LIMIT) {
        return (
            <div className="p-5 bg-[#0e0e12] border border-white/10 rounded-2xl flex items-center justify-between opacity-60 hover:opacity-100 transition-opacity">
                <div>
                    <p className="text-gray-400 font-bold text-sm">Daily Limit Reached</p>
                    <p className="text-[10px] text-gray-600">Upgrade for unlimited entries</p>
                </div>
                <Link href="/plans" className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg font-bold hover:bg-indigo-500/20 transition-colors">
                    Unlock
                </Link>
            </div>
        )
    }

    if (loading) return <div className="p-5 bg-[#0e0e12] rounded-2xl animate-pulse h-20" />

    return (
        <>
            {/* Card Trigger */}
            <div
                onClick={openModal}
                className="group relative p-5 bg-[#0e0e12] border border-white/5 rounded-2xl cursor-pointer transition-all duration-300 hover:border-white/10 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors border border-white/5">
                        <Sparkles size={24} className="text-indigo-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                        {/* Title removed as per request */}
                        <p className="text-lg font-bold text-white leading-tight">
                            Mood Flow
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            5 quick signals • 30 seconds
                        </p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-bold rounded-xl hover:scale-105 transition-all shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <span>Check In</span>
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>

            {/* Premium Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#050505]/95 backdrop-blur-xl z-[200]"
                        />

                        <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="w-full max-w-sm"
                            >
                                {showComplete ? (
                                    <div className="text-center py-20">
                                        <motion.div
                                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center shadow-[0_0_50px_rgba(74,222,128,0.3)]"
                                        >
                                            <Check size={48} className="text-black" />
                                        </motion.div>
                                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Data Saved</h2>
                                        <p className="text-gray-500 font-medium">Your flow has been recorded.</p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        {/* Progress Line */}
                                        <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full bg-gradient-to-r ${signal.color}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                            />
                                        </div>

                                        {/* Close Button */}
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            className="absolute -top-12 right-0 p-2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            <X size={24} />
                                        </button>

                                        {/* Content */}
                                        <div className="pt-10">
                                            <motion.div
                                                key={currentStep}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="space-y-8"
                                            >
                                                <div className="text-center space-y-4">
                                                    <span className="text-6xl filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                                        {signal.emoji}
                                                    </span>
                                                    <h2 className="text-2xl font-bold text-white leading-tight px-4">
                                                        {signal.question}
                                                    </h2>
                                                </div>

                                                <div className="bg-[#0e0e12] border border-white/5 rounded-3xl p-1.5 grid grid-cols-5 gap-1.5 shadow-2xl">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                                                        // Split into two rows logic handled by CSS grid-cols-5
                                                        return (
                                                            <button
                                                                key={num}
                                                                onClick={() => handleAnswer(num)}
                                                                className={`
                                                                    aspect-square rounded-2xl text-lg font-bold transition-all duration-200
                                                                    bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105 active:scale-90
                                                                    ${num <= 5 ? 'opacity-70' : 'opacity-100'}
                                                                `}
                                                            >
                                                                {num}
                                                            </button>
                                                        )
                                                    })}
                                                </div>

                                                <div className="flex justify-between px-4 text-xs font-bold uppercase tracking-widest text-gray-600">
                                                    <span>{signal.lowLabel}</span>
                                                    <span>{signal.highLabel}</span>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </>
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
