'use client'

import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import {
    MessageSquare, TrendingUp, Users, ArrowRight, Sparkles, Compass,
    Plus, ChevronRight, Play, Heart, Brain, Zap, BookOpen
} from 'lucide-react'
import Navbar from '../layout/Navbar'
import dynamic from 'next/dynamic'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import FeedbackModal from '../FeedbackModal'

// Dynamic Imports
const MoodFlowCard = dynamic(() => import('../MoodFlowCard').then(mod => mod.MoodFlowCard), {
    loading: () => <div className="h-32 bg-white/5 rounded-3xl animate-pulse" />,
    ssr: false
})

interface DiscoverItem {
    id: string
    title: string
    description?: string
    image: string
    category?: string
    color?: string
}

export default function Dashboard({ user }: { user: any }) {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    const hour = new Date().getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

    const [checkInComplete, setCheckInComplete] = useState(false)
    const [loadingData, setLoadingData] = useState(true)
    const [showFeedback, setShowFeedback] = useState(false)
    const [discoverItems, setDiscoverItems] = useState<DiscoverItem[]>([])
    const [moodData, setMoodData] = useState<{ labels: string[], values: number[], overallAvg: string, trend: string }>({
        labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
        values: [0, 0, 0, 0, 0, 0, 0],
        overallAvg: '-',
        trend: 'stable'
    })

    const loadStats = useCallback(async () => {
        if (!user?.uid) return
        setLoadingData(true)

        // Load discover items
        try {
            const res = await fetch('/api/discover')
            const data = await res.json()
            setDiscoverItems(data.slice(0, 3))
        } catch (e) {
            console.error('Failed to load discover items', e)
        }

        // Load mood data
        if (db) {
            try {
                const moodRef = collection(db, 'users', user.uid, 'moods')
                const q = query(moodRef, orderBy('createdAt', 'desc'))
                const snapshot = await getDocs(q)

                const moods = snapshot.docs.map(doc => {
                    const data = doc.data()
                    return {
                        value: data.average || data.value || 0,
                        createdAt: data.createdAt?.toDate() || new Date()
                    }
                })

                const validMoods = moods.filter(m => m.value > 0)
                const overallAvg = validMoods.length > 0
                    ? (validMoods.reduce((sum, m) => sum + m.value, 0) / validMoods.length).toFixed(1)
                    : '-'

                // Check check-in status
                const todayDate = new Date()
                const hasCheckedInToday = moods.some(m =>
                    m.createdAt.getDate() === todayDate.getDate() &&
                    m.createdAt.getMonth() === todayDate.getMonth() &&
                    m.createdAt.getFullYear() === todayDate.getFullYear()
                )
                setCheckInComplete(hasCheckedInToday)

                // Process last 7 days
                const labels: string[] = []
                const values: number[] = []
                const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

                for (let i = 6; i >= 0; i--) {
                    const d = new Date()
                    d.setDate(d.getDate() - i)
                    d.setHours(0, 0, 0, 0)
                    const nextD = new Date(d)
                    nextD.setDate(nextD.getDate() + 1)
                    labels.push(daysOfWeek[d.getDay()])
                    const dayMoods = moods.filter(m => m.createdAt >= d && m.createdAt < nextD)
                    if (dayMoods.length > 0) {
                        const avg = dayMoods.reduce((sum, m) => sum + m.value, 0) / dayMoods.length
                        values.push(Math.round(avg * 10) / 10)
                    } else {
                        values.push(0)
                    }
                }

                // Calculate trend
                const recentValues = values.slice(-3).filter(v => v > 0)
                const olderValues = values.slice(0, 3).filter(v => v > 0)
                let trend = 'stable'
                if (recentValues.length && olderValues.length) {
                    const recentAvg = recentValues.reduce((a, b) => a + b, 0) / recentValues.length
                    const olderAvg = olderValues.reduce((a, b) => a + b, 0) / olderValues.length
                    if (recentAvg > olderAvg + 0.5) trend = 'up'
                    else if (recentAvg < olderAvg - 0.5) trend = 'down'
                }

                setMoodData({ labels, values, overallAvg, trend })
            } catch (e) {
                console.error('Failed to load mood data', e)
            } finally {
                setLoadingData(false)
            }
        } else {
            setLoadingData(false)
        }
    }, [user?.uid])

    useEffect(() => {
        loadStats()
    }, [loadStats])

    const firstName = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'there'

    return (
        <div className="min-h-screen bg-[#030305] text-white selection:bg-indigo-500/30">
            <Navbar />

            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-[80] px-5 py-4 flex justify-between items-center md:hidden">
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/5">
                    <Image src="/aara-logo.png" alt="AARA" width={22} height={22} className="rounded-lg" />
                    <span className="text-[9px] font-black tracking-[0.35em] text-white/50 uppercase">AARA</span>
                </div>
                <Link href="/profile" className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 backdrop-blur-xl text-sm font-bold">
                    {user?.email?.[0].toUpperCase()}
                </Link>
            </div>

            <main className="relative z-10 pt-24 md:pt-8 pb-32 px-5 md:px-8 min-h-screen overflow-y-auto">
                <div className="max-w-6xl mx-auto">

                    {/* Hero Section */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-10"
                    >
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-white/30 text-[10px] font-bold tracking-[0.25em] uppercase mb-2"
                                >
                                    {today}
                                </motion.p>
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-3xl md:text-4xl font-medium"
                                >
                                    {greeting}, <span className="font-bold bg-gradient-to-r from-white via-indigo-200 to-white bg-clip-text text-transparent">{firstName}</span>
                                </motion.h1>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link href="/chat">
                                    <button className="group flex items-center gap-3 px-6 py-3.5 bg-white text-black rounded-2xl font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all active:scale-[0.98]">
                                        <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                            <MessageSquare size={16} />
                                        </div>
                                        Start Session
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.section>



                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-5 gap-6">

                        {/* Left Column - Main Content */}
                        <div className="lg:col-span-3 space-y-6">

                            {/* Daily Check-in CTA (Only if not checked in) */}
                            {!checkInComplete && !loadingData && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <Link href="/check-in" className="group relative overflow-hidden block">
                                        {/* Animated Border/Glow Container */}
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-[2.2rem] opacity-50 blur-sm group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative p-6 rounded-[2rem] bg-[#0c0c10] border border-white/5 flex items-center justify-between overflow-hidden group-hover:bg-[#111116] transition-colors duration-500">
                                            {/* Subtle Background Mesh */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-20 -mt-32 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -ml-16 -mb-24 pointer-events-none opacity-30 group-hover:opacity-60 transition-opacity" />

                                            <div className="relative flex items-center gap-5 z-10">
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-inner">
                                                    <Sparkles size={26} className="text-indigo-400 fill-indigo-400/20" />
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-indigo-100 transition-colors">Daily Check-in</h3>
                                                    <div className="flex items-center gap-2">
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                        </span>
                                                        <p className="text-indigo-200/60 text-xs font-medium tracking-wide">Ready for you</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="z-10 flex items-center gap-3 bg-white/[0.03] pl-5 pr-2 py-2 rounded-full border border-white/5 group-hover:border-white/10 transition-colors">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">Start</span>
                                                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:bg-indigo-400 group-hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                                                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )}

                            {/* Mood Overview Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link href="/mood-flow" className="block p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/5 backdrop-blur-sm hover:bg-white/[0.06] transition-all group">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Brain size={18} className="text-indigo-400" />
                                            </div>
                                            <div>
                                                <h2 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Mood Insights</h2>
                                                <p className="text-[11px] text-white/40">Last 7 days</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-white">{moodData.overallAvg}</span>
                                            {moodData.trend === 'up' && <TrendingUp size={16} className="text-emerald-400" />}
                                            {moodData.trend === 'down' && <TrendingUp size={16} className="text-rose-400 rotate-180" />}
                                            <ChevronRight size={16} className="text-white/20 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>

                                    {/* Mini Chart */}
                                    <div className="flex items-end gap-2 h-24">
                                        {moodData.values.map((val, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: val ? `${val * 10}%` : '8px' }}
                                                    transition={{ delay: 0.3 + i * 0.05, type: "spring", stiffness: 100 }}
                                                    className={`w-full rounded-lg ${val ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300' : 'bg-white/5'}`}
                                                    style={{ minHeight: val ? '8px' : '8px' }}
                                                />
                                                <span className="text-[9px] font-bold text-white/30">{moodData.labels[i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Link>
                            </motion.div>

                            {/* Featured Topics */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                                        <Sparkles size={14} className="text-amber-400" />
                                        For You
                                    </h2>
                                    <Link href="/discover" className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                                        See All <ArrowRight size={12} />
                                    </Link>
                                </div>

                                <div className="grid gap-3">
                                    {discoverItems.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                        >
                                            <Link href={`/discover/${item.id}`} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all">
                                                <div
                                                    className="w-16 h-16 rounded-xl bg-cover bg-center shrink-0 border border-white/10"
                                                    style={{
                                                        backgroundImage: `url(${item.image})`,
                                                        backgroundColor: item.color || '#1a1a2e'
                                                    }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 mb-1 block">
                                                        {item.category || 'Health'}
                                                    </span>
                                                    <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-indigo-200 transition-colors">
                                                        {item.title}
                                                    </h3>
                                                </div>
                                                <ChevronRight size={16} className="text-white/20 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0" />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="lg:col-span-2 space-y-5">

                            {/* Daily Insight */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="relative overflow-hidden p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/10"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles size={14} className="text-indigo-400" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-300/80">Daily Insight</span>
                                    </div>
                                    <p className="text-base font-serif italic text-white/90 leading-relaxed">
                                        "Naming an emotion is the first step to taming it. Try to be specific today."
                                    </p>
                                </div>
                            </motion.div>

                            {/* Quick Links */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.35 }}
                                className="space-y-2"
                            >
                                <Link href="/report/therapist" className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <TrendingUp size={18} className="text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-white">Clinical Insights</h3>
                                        <p className="text-[11px] text-white/40">View your progress</p>
                                    </div>
                                    <ChevronRight size={16} className="text-white/20 group-hover:text-purple-400 transition-colors" />
                                </Link>

                                <Link href="/therapists" className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                        <Users size={18} className="text-emerald-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-white">Expert Network</h3>
                                        <p className="text-[11px] text-white/40">Connect with help</p>
                                    </div>
                                    <ChevronRight size={16} className="text-white/20 group-hover:text-emerald-400 transition-colors" />
                                </Link>

                                <button
                                    onClick={() => setShowFeedback(true)}
                                    className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                                        <MessageSquare size={18} className="text-amber-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-bold text-white">Send Feedback</h3>
                                        <p className="text-[11px] text-white/40">Help us improve</p>
                                    </div>
                                    <ChevronRight size={16} className="text-white/20 group-hover:text-amber-400 transition-colors" />
                                </button>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
        </div>
    )
}
