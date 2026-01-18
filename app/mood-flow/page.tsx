'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Activity, ChevronLeft, TrendingUp, Sparkles, Lock, Clock, Calendar, Zap, Brain, Heart, Battery, Leaf, Users } from 'lucide-react'
import BackButton from '@/components/ui/BackButton'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { motion } from 'framer-motion'

// Signal definitions matching MoodFlowCard
const SIGNAL_CONFIG = {
    emotional_state: { icon: Heart, label: 'Emotional', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    energy_level: { icon: Zap, label: 'Energy', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
    calm_level: { icon: Leaf, label: 'Calm', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    mental_clarity: { icon: Brain, label: 'Clarity', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    connection: { icon: Users, label: 'Social', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' }
}

interface MoodEntry {
    id: string
    signals: { [key: string]: number }
    average: number
    createdAt: Date
}

export default function MoodFlowPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [moods, setMoods] = useState<MoodEntry[]>([])
    const [dataLoading, setDataLoading] = useState(true)



    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login')
        }
    }, [user, loading, router])

    const loadMoods = useCallback(async () => {
        if (!user || !db) {
            setDataLoading(false)
            return
        }
        try {
            const moodRef = collection(db, 'users', user.uid, 'moods')
            const q = query(moodRef, orderBy('createdAt', 'desc'))
            const snapshot = await getDocs(q)
            const entries: MoodEntry[] = snapshot.docs.map(doc => {
                const data = doc.data()
                const signals = data.signals || {}
                // Backward compatibility: map stress_level to calm_level
                if (signals.stress_level && !signals.calm_level) {
                    signals.calm_level = signals.stress_level
                }
                return {
                    id: doc.id,
                    signals: signals,
                    average: data.average || data.value || 0,
                    createdAt: data.createdAt.toDate()
                }
            })
            setMoods(entries)
        } catch (e) {
            console.error('Failed to load moods:', e)
        } finally {
            setDataLoading(false)
        }
    }, [user])

    useEffect(() => {
        if (user) loadMoods()
    }, [user, loadMoods])

    // Calculate overall stats
    const overallAvg = moods.length > 0
        ? (moods.reduce((sum, m) => sum + m.average, 0) / moods.length).toFixed(1)
        : '0.0'

    // Calculate signal averages
    const getSignalAverage = (signalId: string) => {
        const values = moods.filter(m => m.signals && m.signals[signalId]).map(m => m.signals[signalId])
        if (values.length === 0) return null
        return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
    }

    // Get last 7 days data for chart
    const getLast7DaysData = () => {
        const labels: string[] = []
        const values: number[] = []
        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)
            const nextDate = new Date(date)
            nextDate.setDate(nextDate.getDate() + 1)

            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2))
            const dayMoods = moods.filter(m => m.createdAt >= date && m.createdAt < nextDate)

            if (dayMoods.length > 0) {
                const avg = dayMoods.reduce((sum, m) => sum + m.average, 0) / dayMoods.length
                values.push(Math.round(avg * 10) / 10)
            } else {
                values.push(0)
            }
        }
        return { labels, values }
    }

    const chartData = getLast7DaysData()

    if (loading || !user) {
        return (
            <div className="h-[100dvh] bg-[#050505] flex items-center justify-center">
                <Activity size={32} className="text-indigo-500 animate-pulse" />
            </div>
        )
    }



    return (
        <div className="min-h-screen text-white selection:bg-indigo-500/30 overflow-x-hidden">


            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Header with Back Button (Responsive) */}
            <div className="fixed top-0 left-0 right-0 z-[90] p-6 pointer-events-none flex items-center justify-between bg-gradient-to-b from-[#050505] to-transparent h-[88px]">
                <div className="pointer-events-auto relative z-10">
                    <BackButton />
                </div>

                <Link
                    href="/"
                    aria-label="Home"
                    className="pointer-events-auto md:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/5 transition-all active:scale-95 cursor-pointer absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
                >
                    <Image
                        alt=""
                        width={20}
                        height={20}
                        className="rounded-lg border border-white/10"
                        src="/aara-logo.png"
                    />
                    <span className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase">mood</span>
                </Link>

                <div className="w-11 md:hidden" /> {/* Spacer for balance on mobile */}
            </div>

            <main className="relative z-10 max-w-4xl mx-auto px-6 pb-32 pt-24 md:pt-32">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6 backdrop-blur-md">
                        <Activity size={12} className="text-indigo-300" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Flow Analysis</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4 text-white">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Rhythm</span>
                    </h1>
                    <p className="text-lg text-white/40 font-light max-w-lg mx-auto leading-relaxed">
                        Understanding your emotional patterns over time allows you to navigate life with greater clarity.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Score Big Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative overflow-hidden rounded-[32px] p-1 bg-gradient-to-br from-white/10 to-transparent"
                    >
                        <div className="h-full bg-[#030305]/80 backdrop-blur-2xl rounded-[28px] p-8 border border-white/5 relative overflow-hidden flex flex-col justify-between">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

                            <div className="relative z-10 mb-8">
                                <span className="text-xs font-bold text-white/40 uppercase tracking-widest block mb-2">Average Score</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-7xl font-serif text-white tracking-tighter">{overallAvg}</span>
                                    <span className="text-xl font-light text-white/30">/10</span>
                                </div>
                                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wide">
                                    <TrendingUp size={12} />
                                    <span>{moods.length} Check-ins total</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                {Object.entries(SIGNAL_CONFIG).slice(0, 2).map(([id, config]) => {
                                    const avg = getSignalAverage(id)
                                    return (
                                        <div key={id} className="bg-white/5 rounded-2xl p-4 flex flex-col items-start border border-white/5">
                                            <config.icon size={18} className={`${config.color} mb-2 opacity-80`} />
                                            <span className="text-2xl font-serif text-white mb-0.5">{avg || '-'}</span>
                                            <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold">{config.label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>

                    {/* Weekly Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative overflow-hidden rounded-[32px] p-1 bg-gradient-to-bl from-white/10 to-transparent"
                    >
                        <div className="h-full bg-[#030305]/80 backdrop-blur-2xl rounded-[28px] p-8 border border-white/5 relative flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-white/5 rounded-full">
                                    <Calendar size={16} className="text-white/60" />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Last 7 Days</h3>
                            </div>

                            <div className="flex-1 flex items-end justify-between gap-3 relative min-h-[160px]">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                    <div className="w-full h-px bg-white/5 border-t border-dashed border-white/10" />
                                    <div className="w-full h-px bg-white/5 border-t border-dashed border-white/10" />
                                    <div className="w-full h-px bg-white/5 border-t border-dashed border-white/10" />
                                </div>

                                {chartData.values.map((value, i) => {
                                    const height = value > 0 ? Math.max(value * 8, 4) : 2
                                    return (
                                        <div key={i} className="h-full flex flex-col justify-end items-center gap-3 flex-1 group z-10 relative">
                                            <div className="absolute -top-8 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-all bg-white/10 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10">
                                                {value > 0 ? value : ''}
                                            </div>
                                            <div
                                                className={`w-full max-w-[12px] md:max-w-[18px] rounded-full transition-all duration-700 ease-out border border-white/5 ${value > 0 ? 'bg-gradient-to-t from-indigo-600 to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:bg-indigo-400' : 'bg-white/5'}`}
                                                style={{ height: `${height}%` }}
                                            />
                                            <span className="text-[9px] font-bold text-white/50 uppercase group-hover:text-white transition-colors">
                                                {chartData.labels[i]}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Additional Stats Grid (Remaining Signals) */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                    {Object.entries(SIGNAL_CONFIG).slice(2, 5).map(([id, config], i) => {
                        const avg = getSignalAverage(id)
                        return (
                            <motion.div
                                key={id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                className="bg-white/[0.02] border border-white/5 rounded-[24px] p-5 flex flex-col items-center justify-center backdrop-blur-md group hover:bg-white/[0.04] transition-all"
                            >
                                <config.icon size={20} className={`${config.color} mb-3 opacity-70 group-hover:opacity-100 transition-opacity`} strokeWidth={1.5} />
                                <span className="text-2xl font-serif text-white mb-1">{avg || '-'}</span>
                                <span className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{config.label}</span>
                            </motion.div>
                        )
                    })}
                </div>

                {/* Recent History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center gap-3 mb-6 px-1">
                        <div className="p-2 bg-white/5 rounded-full">
                            <Clock size={14} className="text-white/60" />
                        </div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Recent Logs</h3>
                    </div>

                    <div className="space-y-3">
                        {dataLoading ? (
                            <div className="py-12 flex justify-center"><Activity className="animate-spin text-white/20" /></div>
                        ) : moods.length === 0 ? (
                            <div className="py-20 text-center border border-white/5 border-dashed rounded-[32px] bg-white/[0.01]">
                                <Sparkles size={24} className="mx-auto mb-4 text-white/40" />
                                <p className="text-sm text-white/60 font-light">No mood data recorded yet.</p>
                            </div>
                        ) : (
                            moods.map((mood, idx) => (
                                <div key={mood.id} className="p-5 bg-white/[0.02] border border-white/5 rounded-[24px] flex items-center justify-between group hover:bg-white/[0.04] transition-all backdrop-blur-sm">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif text-xl border border-white/5 shadow-inner ${mood.average >= 7 ? 'bg-emerald-500/10 text-emerald-300' :
                                            mood.average >= 4 ? 'bg-amber-500/10 text-amber-300' : 'bg-rose-500/10 text-rose-300'
                                            }`}>
                                            {mood.average.toFixed(1)}
                                        </div>
                                        <div>
                                            <p className="text-base font-medium text-white mb-1">
                                                {mood.createdAt.toLocaleDateString('en-US', { weekday: 'long' })}
                                            </p>
                                            <p className="text-[11px] text-white/60 uppercase tracking-wide font-medium flex items-center gap-2">
                                                <span>{mood.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/40" />
                                                <span>{mood.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mini Pillars Display */}
                                    <div className="hidden md:flex gap-1.5 opacity-50 group-hover:opacity-100 transition-opacity">
                                        {Object.entries(mood.signals || {}).slice(0, 5).map(([k, v]) => (
                                            <div key={k} className="w-1.5 h-8 bg-white/5 rounded-full overflow-hidden flex flex-col justify-end">
                                                <div className="w-full bg-white/60 rounded-full" style={{ height: `${(v as number) * 10}%` }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

            </main>
        </div>
    )
}
