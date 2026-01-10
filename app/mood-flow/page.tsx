'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Activity, ChevronLeft, TrendingUp, Sparkles, Lock, Clock, Calendar, Zap, Brain, Heart, Battery, Leaf, Users } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
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
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
            <Navbar />

            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-[90] p-6 pointer-events-none flex items-center justify-between bg-gradient-to-b from-[#050505] to-transparent">
                <button
                    onClick={() => router.back()}
                    className="pointer-events-auto p-3 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all active:scale-95 shadow-2xl group"
                >
                    <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
                </button>

                <Link
                    href="/"
                    className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/5 transition-all active:scale-95 cursor-pointer"
                >
                    <Image src="/aara-logo.png" alt="AARA" width={20} height={20} className="rounded-lg border border-white/10" />
                    <span className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase">mood</span>
                </Link>

                <div className="w-11" />
            </div>

            <main className="relative z-10 max-w-2xl mx-auto px-6 pb-32 pt-24 md:pt-32">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-4">
                        <Activity size={12} className="text-indigo-400" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Flow Analysis</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">Rhythm</span>
                    </h1>
                    <p className="text-sm text-gray-400">Understanding your emotional patterns over time.</p>
                </motion.div>

                {/* Score Big Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative overflow-hidden rounded-[32px] p-1 bg-gradient-to-b from-white/10 to-transparent mb-8"
                >
                    <div className="bg-[#0e0e12] rounded-[28px] p-8 border border-white/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                            <div className="text-center md:text-left">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Average Score</span>
                                <div className="flex items-baseline justify-center md:justify-start gap-1">
                                    <span className="text-6xl font-black text-white">{overallAvg}</span>
                                    <span className="text-xl font-bold text-gray-600">/10</span>
                                </div>
                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wide">
                                    <TrendingUp size={12} />
                                    <span>{moods.length} Check-ins total</span>
                                </div>
                            </div>

                            {/* Detailed Stats Grid inside Card */}
                            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                                {Object.entries(SIGNAL_CONFIG).slice(0, 4).map(([id, config]) => {
                                    const avg = getSignalAverage(id)
                                    return (
                                        <div key={id} className="bg-white/5 rounded-xl p-3 flex flex-col items-center justify-center min-w-[80px]">
                                            <config.icon size={16} className={`${config.color} mb-1.5`} />
                                            <span className="text-lg font-bold text-white leading-none mb-0.5">{avg || '-'}</span>
                                            <span className="text-[9px] text-gray-500 uppercase tracking-wider">{config.label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Weekly Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Calendar size={14} className="text-gray-500" />
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Last 7 Days</h3>
                    </div>
                    <div className="p-6 bg-[#0e0e12] border border-white/5 rounded-3xl h-48 flex items-end justify-between gap-2 relative">
                        {/* Subtle horizontal lines */}
                        <div className="absolute inset-0 flex flex-col justify-between py-6 px-6 pointer-events-none opacity-20">
                            <div className="w-full h-px bg-white/10" />
                            <div className="w-full h-px bg-white/10" />
                            <div className="w-full h-px bg-white/10" />
                        </div>

                        {chartData.values.map((value, i) => {
                            const height = value > 0 ? Math.max(value * 8, 4) : 2 // Adjusted height scale
                            return (
                                <div key={i} className="h-full flex flex-col justify-end items-center gap-2 flex-1 group z-10">
                                    <div className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0">
                                        {value > 0 ? value : ''}
                                    </div>
                                    <div
                                        className={`w-full max-w-[24px] rounded-full transition-all duration-500 ${value > 0 ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:bg-indigo-400' : 'bg-white/5'}`}
                                        style={{ height: `${height}%` }}
                                    />
                                    <span className="text-[9px] font-bold text-gray-600 uppercase group-hover:text-gray-400 transition-colors">
                                        {chartData.labels[i]}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* Recent History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="flex items-center gap-2 mb-4 px-1">
                        <Clock size={14} className="text-gray-500" />
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Logs</h3>
                    </div>

                    <div className="space-y-3">
                        {dataLoading ? (
                            <div className="py-12 flex justify-center"><Activity className="animate-spin text-white/20" /></div>
                        ) : moods.length === 0 ? (
                            <div className="py-16 text-center border border-white/5 border-dashed rounded-3xl">
                                <Sparkles size={24} className="mx-auto mb-3 text-gray-600" />
                                <p className="text-sm text-gray-500 font-medium">No mood data recorded yet.</p>
                            </div>
                        ) : (
                            moods.map((mood, idx) => (
                                <div key={mood.id} className="p-4 bg-[#0e0e12] border border-white/5 rounded-2xl flex items-center justify-between group hover:bg-white/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${mood.average >= 7 ? 'bg-green-500/10 text-green-400' :
                                            mood.average >= 4 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                                            }`}>
                                            {mood.average.toFixed(1)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white mb-0.5">
                                                {mood.createdAt.toLocaleDateString('en-US', { weekday: 'long' })}
                                            </p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                                                {mood.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {mood.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mini Pillars Display */}
                                    <div className="hidden md:flex gap-1">
                                        {Object.entries(mood.signals || {}).slice(0, 3).map(([k, v]) => (
                                            <div key={k} className="w-1 h-6 bg-white/10 rounded-full overflow-hidden">
                                                <div className="w-full bg-white/40" style={{ height: `${(v as number) * 10}%`, marginTop: `${100 - ((v as number) * 10)}%` }} />
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
