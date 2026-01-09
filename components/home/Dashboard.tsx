'use client'

import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import {
    MessageSquare, Clock, Zap, TrendingUp, Users, Star,
    Calendar as CalendarIcon, Brain, ArrowRight, Sparkles
} from 'lucide-react'
import Navbar from '../layout/Navbar'
import dynamic from 'next/dynamic'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import FeedbackModal from '../FeedbackModal'

// Dynamic Imports for performance
const MoodFlowCard = dynamic(() => import('../MoodFlowCard').then(mod => mod.MoodFlowCard), {
    loading: () => <div className="h-48 bg-[#0e0e12] rounded-2xl animate-pulse" />,
    ssr: false
})
const MoodChart = dynamic(() => import('../MoodChart'), {
    loading: () => <div className="h-48 bg-[#0e0e12] rounded-3xl animate-pulse" />,
    ssr: false
})

// User Stat Card - Clean neutral design
function StatCard({ label, value, icon: Icon, color = 'blue' }: any) {
    const iconColors: Record<string, string> = {
        yellow: 'text-yellow-400',
        blue: 'text-blue-400',
        green: 'text-green-400',
    }

    return (
        <div className="p-5 bg-[#0e0e12] rounded-2xl flex flex-col items-center gap-4 h-full text-center sm:flex-row sm:text-left sm:gap-4 transition-all hover:bg-[#111116]">
            <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center ${iconColors[color] || iconColors.blue} shrink-0`}>
                <Icon size={22} />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-gray-400 mb-0.5 font-bold">{label}</p>
                <p className="text-xl sm:text-2xl font-bold text-white leading-none">{value}</p>
            </div>
        </div>
    )
}

// Recent Session Card
// RecentSession component removed


export default function Dashboard({ user }: { user: any }) {
    // Mock Date
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

    // Stats State
    const [stats, setStats] = useState({ entries: 0, totalMinutes: 0, clarityScore: 65 })
    const [checkInComplete, setCheckInComplete] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [showFeedback, setShowFeedback] = useState(false)
    const [moodData, setMoodData] = useState<{ labels: string[], values: number[], overallAvg: string }>({
        labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        values: [0, 0, 0, 0, 0, 0, 0],
        overallAvg: '-'
    })

    const loadStats = useCallback(async () => {
        if (!user?.uid) return

        // We can show stale data while refreshing if we want, but for initial load let's be careful
        // If stats are empty (0), assume initial load
        if (stats.entries === 0 && moodData.values[0] === 0) {
            setLoadingData(true)
        }

        // Try to load user stats from API (optional - may fail)
        try {
            const idToken = await user.getIdToken()
            const data = await apiClient.getUserStats(idToken)
            if (data) {
                setStats({
                    entries: data.entries || 0,
                    totalMinutes: data.totalMinutes,
                    clarityScore: data.clarityScore
                })
            }
        } catch (e) {
            console.error('Failed to load user stats (API may be offline)', e)
        }

        // Load mood data directly from Firestore (always runs)
        if (db) {
            try {
                const moodRef = collection(db, 'users', user.uid, 'moods')
                const q = query(moodRef, orderBy('createdAt', 'desc'))
                const snapshot = await getDocs(q)

                const moods = snapshot.docs.map(doc => ({
                    value: doc.data().value,
                    createdAt: doc.data().createdAt.toDate()
                }))


                // Calculate overall average
                const overallAvg = moods.length > 0
                    ? (moods.reduce((sum, m) => sum + m.value, 0) / moods.length).toFixed(1)
                    : '-'

                // Check if user has checked in today
                const today = new Date()
                const hasCheckedInToday = moods.some(m =>
                    m.createdAt.getDate() === today.getDate() &&
                    m.createdAt.getMonth() === today.getMonth() &&
                    m.createdAt.getFullYear() === today.getFullYear()
                )
                setCheckInComplete(hasCheckedInToday)

                // Process into daily averages for last 7 days
                const labels: string[] = []
                const values: number[] = []

                for (let i = 6; i >= 0; i--) {
                    const date = new Date()
                    date.setDate(date.getDate() - i)
                    date.setHours(0, 0, 0, 0)

                    const nextDate = new Date(date)
                    nextDate.setDate(nextDate.getDate() + 1)

                    labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2))

                    const dayMoods = moods.filter(m =>
                        m.createdAt >= date && m.createdAt < nextDate
                    )

                    if (dayMoods.length > 0) {
                        const avg = dayMoods.reduce((sum, m) => sum + m.value, 0) / dayMoods.length
                        values.push(Math.round(avg * 10) / 10)
                    } else {
                        values.push(0)
                    }
                }

                setMoodData({ labels, values, overallAvg })
            } catch (e) {
                console.error('Failed to load mood data', e)
            } finally {
                setLoadingData(false)
            }
        } else {
            setLoadingData(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    useEffect(() => {
        loadStats()
    }, [loadStats])

    return (
        <div className="min-h-screen bg-[#08080c] text-white selection:bg-blue-500/30">
            <Navbar />

            {/* Floating Top Branding & Controls */}
            <div className="fixed top-0 left-0 right-0 z-[80] p-6 flex justify-between items-center bg-[#08080c] pointer-events-none md:hidden">
                <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-[#0d0d0d] shadow-2xl">
                    <Image src="/aara-logo.png" alt="AARA" width={20} height={20} className="rounded-lg" />
                    <span className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase">AARA</span>
                </div>

                <div className="pointer-events-auto">
                    <Link href="/profile" className="w-10 h-10 rounded-full bg-[#0d0d0d] flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors shadow-2xl">
                        {user?.email?.[0].toUpperCase() || <Users size={18} className="text-white/60" />}
                    </Link>
                </div>
            </div>

            <main className="relative z-10 pt-28 pb-36 px-4 md:px-6 h-[100dvh] overflow-y-auto scrollbar-hide">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8"
                    >
                        <div>
                            <p className="text-white/30 text-[10px] font-black tracking-[0.3em] uppercase mb-1.5">{today}</p>
                            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                                {greeting}, <span className="text-white font-black">{user.displayName || user.email?.split('@')[0]}</span>
                            </h1>
                        </div>
                        <Link href="/chat">
                            <button className="group px-6 py-3 bg-white text-black rounded-xl font-bold text-[11px] tracking-widest uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center gap-2.5">
                                <MessageSquare size={16} /> <span>New Session</span>
                            </button>
                        </Link>
                    </motion.div>

                    {/* Grid Layout */}
                    <div className="grid lg:grid-cols-3 gap-3 sm:gap-6">

                        {/* Left Column (Main Stats & content) */}
                        <div className="lg:col-span-2 space-y-3 sm:space-y-6">

                            {/* Stats Grid Removed */}

                            {/* Mood Flow Card - mobile only (below stats) */}
                            {!checkInComplete && !loadingData && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                    className="lg:hidden"
                                >
                                    <MoodFlowCard onComplete={loadStats} />
                                </motion.div>
                            )}

                            {/* Mood Chart */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <MoodChart labels={moodData.labels} values={moodData.values} overallAvg={moodData.overallAvg} loading={loadingData} />
                            </motion.div>


                            {/* Actions Grid */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="grid sm:grid-cols-2 gap-4"
                            >
                                {/* Report Card */}
                                <Link href="/report/therapist" className="block group p-6 bg-[#0e0e12] hover:bg-[#111116] rounded-2xl transition-all shadow-xl active:scale-[0.98]">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-5 group-hover:bg-purple-500/20 transition-all">
                                        <TrendingUp size={20} className="group-hover:scale-110 transition-transform" />
                                    </div>
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors mb-1">Clinical Insights</h3>
                                    <p className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">View your progress</p>
                                </Link>

                                {/* Expert Network Card */}
                                <Link href="/therapists" className="block group p-6 bg-[#0e0e12] hover:bg-[#111116] rounded-2xl transition-all shadow-xl active:scale-[0.98] sm:col-span-1">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5 group-hover:bg-indigo-500/20 transition-all">
                                        <Users size={20} className="group-hover:scale-110 transition-transform" />
                                    </div>
                                    <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors mb-1">Expert Network</h3>
                                    <p className="text-lg font-bold text-white/80 group-hover:text-white transition-colors">Connect with verified help</p>
                                </Link>
                            </motion.div>

                        </div>

                        {/* Right Column (Sidebar) */}
                        <div className="space-y-6">
                            {/* Daily Insight (Redesigned) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="p-6 bg-gradient-to-br from-white/5 to-black/20 border border-white/5 rounded-2xl backdrop-blur-3xl shadow-xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                                <div className="flex items-center gap-2 mb-4 text-indigo-300/90 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    <Sparkles size={12} /> Daily Insight
                                </div>
                                <p className="text-sm md:text-base font-serif italic text-white/90 leading-relaxed relative z-10">
                                    &quot;Naming an emotion is the first step to taming it. Try to be specific today.&quot;
                                </p>
                            </motion.div>

                            {/* Feedback CTA */}
                            <motion.button
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35 }}
                                onClick={() => setShowFeedback(true)}
                                className="w-full p-4 bg-[#0e0e12] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:bg-green-500/20 transition-all">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-white">Feedback</p>
                                        <p className="text-[10px] text-gray-500">Help us improve</p>
                                    </div>
                                </div>
                                <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                            </motion.button>

                            {/* Mood Flow Card - desktop only (hidden on mobile, visible on lg+) */}
                            {!checkInComplete && !loadingData && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="hidden lg:block"
                                >
                                    <MoodFlowCard onComplete={loadStats} />
                                </motion.div>
                            )}

                            {/* Recent Session Removed */}

                            {/* Daily Tip Moved */}


                            {/* Calendar Stub */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="p-6 bg-[#0e0e12] rounded-2xl opacity-75"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-medium">Upcoming</h3>
                                    <Link href="/therapists" className="text-xs text-blue-400 hover:text-white">Book</Link>
                                </div>
                                <div className="text-center py-4 text-gray-600 text-sm">
                                    <CalendarIcon size={24} className="mx-auto mb-2 opacity-50" />
                                    No sessions scheduled
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>
            </main>

            <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
        </div>
    )
}
