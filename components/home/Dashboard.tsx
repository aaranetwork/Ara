'use client'

import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api-client'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback, useEffect } from 'react'
import {
    MessageSquare, TrendingUp, Users, ArrowRight, Sparkles, Compass,
    Plus, ChevronRight, Play, Heart, Brain, Zap, BookOpen, CheckCircle, FileText
} from 'lucide-react'
import Navbar from '../layout/Navbar'
import dynamic from 'next/dynamic'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import FeedbackModal from '../FeedbackModal'
import { toast } from 'sonner'



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
    const firstName = user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'there'

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



    const [stats, setStats] = useState({
        streak: 0,
        totalJournals: 0,
        activeGoals: 0
    })

    const loadStats = useCallback(async () => {
        if (!user?.uid || !db) return
        setLoadingData(true)

        try {
            // 1. Load Moods
            let moods: any[] = []
            try {
                const moodRef = collection(db, 'users', user.uid, 'moods')
                const snapshot = await getDocs(moodRef)

                moods = snapshot.docs.map(doc => {
                    const data = doc.data()
                    let createdAt: Date
                    if (data.createdAt?.toDate) createdAt = data.createdAt.toDate()
                    else if (data.createdAt instanceof Date) createdAt = data.createdAt
                    else if (typeof data.createdAt === 'string' || typeof data.createdAt === 'number') createdAt = new Date(data.createdAt)
                    else createdAt = new Date()

                    return { value: data.average || data.value || 0, createdAt }
                }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            } catch (e) {
                console.error('Failed to load moods', e)
            }

            // 2. Load Journals
            let journals: any[] = []
            try {
                const journalRef = collection(db, 'users', user.uid, 'journal')
                const journalSnapshot = await getDocs(journalRef)
                journals = journalSnapshot.docs.map(doc => {
                    const data = doc.data()
                    let createdAt: Date
                    if (data.createdAt?.toDate) createdAt = data.createdAt.toDate()
                    else if (data.createdAt instanceof Date) createdAt = data.createdAt
                    else createdAt = new Date()
                    return { id: doc.id, createdAt }
                })
            } catch (e) {
                console.error('Failed to load journals', e)
            }

            // 3. Load Goals
            let activeGoalsCount = 0
            try {
                const goalsRef = collection(db, 'users', user.uid, 'goals')
                const goalsSnapshot = await getDocs(goalsRef)
                activeGoalsCount = goalsSnapshot.size
            } catch (e) {
                console.error('Failed to load goals', e)
            }

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

            // Calculate Streak (combined Mood & Journal)
            const uniqueDates = new Set([
                ...moods.map(m => m.createdAt.toDateString()),
                ...journals.map(j => j.createdAt.toDateString())
            ])
            const sortedDates = Array.from(uniqueDates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

            let streak = 0
            if (sortedDates.length > 0) {
                const todayStr = new Date().toDateString()
                const yesterdayStr = new Date(Date.now() - 86400000).toDateString()

                if (sortedDates.includes(todayStr) || sortedDates.includes(yesterdayStr)) {
                    streak = 1
                    let currentD = new Date(sortedDates[0])
                    for (let i = 1; i < sortedDates.length; i++) {
                        const prevD = new Date(sortedDates[i])
                        const diff = Math.abs(currentD.getTime() - prevD.getTime())
                        if (Math.ceil(diff / (1000 * 60 * 60 * 24)) === 1) {
                            streak++
                            currentD = prevD
                        } else break
                    }
                }
            }

            // Process last 7 days chart
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
            setStats({
                streak,
                totalJournals: journals.length,
                activeGoals: activeGoalsCount
            })
        } catch (e) {
            console.error('Failed to load mood data', e)
        } finally {
            setLoadingData(false)
        }
    }, [user?.uid])

    // Check for guest data from /try flow
    useEffect(() => {
        const syncGuestData = async () => {
            if (!user?.uid) return

            // Check session storage
            const guestMood = sessionStorage.getItem('guest_mood')
            const guestReflection = sessionStorage.getItem('guest_reflection')

            if (guestMood && guestReflection && db) {
                try {
                    // Save to Firestore
                    await addDoc(collection(db, 'users', user.uid, 'moods'), {
                        value: parseInt(guestMood),
                        reflection: guestReflection,
                        createdAt: serverTimestamp(),
                        source: 'onboarding'
                    })

                    // Clear storage
                    sessionStorage.removeItem('guest_mood')
                    sessionStorage.removeItem('guest_reflection')

                    // Notify user
                    toast.success('Your initial check-in has been saved')

                    // Refresh data
                    loadStats()
                } catch (error) {
                    console.error('Failed to sync guest data:', error)
                }
            }
        }

        syncGuestData()
    }, [user, loadStats])

    useEffect(() => {
        loadStats()
    }, [loadStats])

    return (
        <div className="min-h-screen bg-[#030305] text-[#F3F4F6] font-sans selection:bg-white/20">
            <Navbar />

            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-[80] px-6 py-4 flex justify-between items-center md:hidden bg-[#030305] border-b border-white/5 shadow-lg">
                <div className="flex items-center gap-3">
                    <Image src="/aara-logo.png" alt="" width={24} height={24} className="rounded-lg opacity-80" priority sizes="24px" />
                    <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">AARA</span>
                </div>
                <Link href="/profile" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-xs font-medium text-white/70 overflow-hidden relative">
                    {user?.photoURL ? (
                        <Image src={user.photoURL} alt="Profile" fill className="object-cover" priority sizes="32px" />
                    ) : (
                        user?.email?.[0].toUpperCase()
                    )}
                </Link>
            </div>

            <main className="relative z-10 pt-28 md:pt-12 pb-32 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">

                    {/* Hero Section */}
                    <div className="mb-8 md:mb-16">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="relative">
                                {/* Ambient Glow - Smaller and less blur on mobile */}
                                <div className="absolute -left-20 -top-20 w-48 h-48 md:w-64 md:h-64 bg-indigo-500/10 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative flex items-center gap-3 mb-4"
                                >
                                    <div className="h-px w-8 bg-white/20" />
                                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40">{today}</span>
                                </motion.div>

                                <div className="relative">
                                    <h1 className="text-4xl md:text-6xl font-serif text-white/90 leading-tight">
                                        {greeting}, <br />
                                        <span className="text-white/50 italic">{firstName}</span>
                                    </h1>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Link href="/chat">
                                    <button className="group relative px-8 py-4 bg-[#F3F4F6] text-black rounded-full font-medium text-xs tracking-widest uppercase hover:px-10 transition-all duration-500 flex items-center gap-3 overflow-hidden shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]">
                                        <span className="relative z-10">Start Session</span>
                                        <div className="relative z-10 w-6 h-6 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                                            <MessageSquare size={12} />
                                        </div>
                                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
                                    </button>
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-12 gap-6 md:gap-8">

                        {/* Left Column - Main Content (8 cols) */}
                        <div className="lg:col-span-8 flex flex-col gap-6">

                            {/* Daily Check-in CTA */}
                            {loadingData ? (
                                <div className="w-full h-40 rounded-[2.2rem] bg-white/[0.02] border border-white/5 animate-pulse" />
                            ) : !checkInComplete && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    <Link href="/check-in" className="group relative block w-full">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/20 via-amber-500/20 to-indigo-500/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />
                                        <div className="relative p-5 md:p-8 rounded-[2.2rem] bg-[#0A0A0C] border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 overflow-hidden group-hover:border-white/10 transition-colors duration-500 min-h-[160px]">
                                            {/* Reflection */}
                                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30" />

                                            <div className="flex items-center gap-4 md:gap-6 z-10">
                                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center justify-center backdrop-blur-md group-hover:scale-105 transition-transform duration-500 shadow-xl">
                                                    <Sparkles size={24} className="text-white/70" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/40">Daily Ritual</span>
                                                    </div>
                                                    <h2 className="text-xl md:text-2xl font-serif text-white/90 group-hover:text-white transition-colors">How are you feeling?</h2>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 pl-5 pr-2 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm group-hover:bg-white/[0.05] transition-all w-full md:w-auto justify-between md:justify-start">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 group-hover:text-white/90 transition-colors">Begin</span>
                                                <div className="w-8 h-8 rounded-full bg-[#151518] flex items-center justify-center text-white border border-white/5 group-hover:bg-white group-hover:text-black transition-all shadow-lg">
                                                    <ArrowRight size={14} />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            )}

                            {/* Mood Trends Card - Reduced blur on mobile */}
                            <div className="p-8 rounded-[2.2rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm md:backdrop-blur-md relative overflow-hidden">
                                <Link href="/mood-flow" className="flex items-center justify-between mb-8 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10">
                                            <Brain size={20} className="text-indigo-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-serif text-white/90">Mental Flow</h2>
                                            <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Last 7 Days</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5">
                                        <span className="text-xl font-serif text-white">{moodData.overallAvg}</span>
                                        {moodData.trend === 'up' && <TrendingUp size={14} className="text-emerald-400" />}
                                        {moodData.trend === 'down' && <TrendingUp size={14} className="text-rose-400 rotate-180" />}
                                    </div>
                                </Link>

                                <div className="h-40 flex items-end justify-between gap-2 md:gap-4 relative px-2 will-change-transform">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                                        <div className="w-full h-px border-t border-dashed border-white/20" />
                                        <div className="w-full h-px border-t border-dashed border-white/20" />
                                        <div className="w-full h-px border-t border-dashed border-white/20" />
                                        <div className="w-full h-px border-t border-dashed border-white/20" />
                                    </div>

                                    {moodData.values.map((val, i) => (
                                        <div key={i} className="h-full flex flex-col justify-end items-center gap-3 flex-1 group/bar z-10">
                                            <div
                                                className={`w-1.5 md:w-2 rounded-full transition-all duration-700 ease-out relative group-hover/bar:w-3 md:group-hover/bar:w-4 ${val > 0 ? 'bg-indigo-500/50 hover:bg-indigo-400' : 'bg-white/5'}`}
                                                style={{ height: val > 0 ? `${(val / 10) * 100}%` : '4px' }}
                                            >
                                                {val > 0 && (
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#1A1A20] rounded-lg border border-white/10 text-[9px] font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                                                        {val} / 10
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider group-hover/bar:text-white/70 transition-colors">
                                                {moodData.labels[i]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Growth Highlights Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}
                                className="p-8 rounded-[2.2rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm md:backdrop-blur-md relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[60px] -mr-10 -mt-10 group-hover:bg-rose-500/10 transition-colors duration-700" />

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-[1.2rem] bg-rose-500/10 flex items-center justify-center border border-rose-500/10">
                                            <TrendingUp size={24} className="text-rose-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-serif text-white/90">Growth Journey</h2>
                                            <p className="text-[11px] font-medium text-white/40 uppercase tracking-[0.2em] mt-1">Consistency & Goals</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6 md:gap-8 flex-1 md:flex-none">
                                        <div className="text-center md:text-left">
                                            <span className="text-2xl font-serif text-white block mb-0.5">{stats.streak}</span>
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Streak</span>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <span className="text-2xl font-serif text-white block mb-0.5">{stats.totalJournals}</span>
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Reflections</span>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <span className="text-2xl font-serif text-white block mb-0.5">{stats.activeGoals}</span>
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Goals</span>
                                        </div>
                                    </div>

                                    <Link href="/growth">
                                        <button className="h-12 px-6 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/70 hover:text-white">
                                            <span>Continue</span>
                                            <ArrowRight size={14} />
                                        </button>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Column - Sidebar (4 cols) */}
                        <div className="lg:col-span-4 flex flex-col gap-6">

                            {/* Insight Card - Dark Glass (Desktop only) */}
                            <div className="hidden lg:block p-8 rounded-[2.2rem] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 backdrop-blur-md relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] -mr-10 -mt-10" />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-6 h-6 rounded-full border border-indigo-500/20 flex items-center justify-center">
                                            <Sparkles size={10} className="text-indigo-400" />
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300/50">insight</span>
                                    </div>
                                    <p className="text-lg font-serif italic text-white/80 leading-relaxed mb-6">
                                        &quot;You don&apos;t have to control your thoughts. You just have to stop letting them control you.&quot;
                                    </p>
                                    <div className="h-0.5 w-8 bg-indigo-500/20" />
                                </div>
                            </div>

                            {/* Quick Links Group */}
                            {/* Quick Links Group - Grid */}
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <Link href="/journal" className="group flex flex-col justify-between p-4 md:p-6 rounded-[1.8rem] md:rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all min-h-[120px] md:min-h-[140px] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-[40px] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg mb-3 md:mb-4">
                                        <BookOpen size={18} className="text-white/70" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm md:text-base font-serif font-medium text-white/90">Journal</h3>
                                        <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 md:mt-1">Reflect Daily</p>
                                    </div>
                                </Link>

                                <Link href="/therapists" className="group flex flex-col justify-between p-4 md:p-6 rounded-[1.8rem] md:rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all min-h-[120px] md:min-h-[140px] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-[40px] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg mb-3 md:mb-4">
                                        <Users size={18} className="text-white/70" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm md:text-base font-serif font-medium text-white/90">Therapists</h3>
                                        <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 md:mt-1">Get Support</p>
                                    </div>
                                </Link>

                                <Link href="/report/therapist" className="group flex flex-col justify-between p-4 md:p-6 rounded-[1.8rem] md:rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm md:backdrop-blur-md hover:bg-white/[0.04] transition-all min-h-[120px] md:min-h-[140px] relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[40px] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg mb-3 md:mb-4">
                                        <FileText size={18} className="text-white/70" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm md:text-base font-serif font-medium text-white/90">Expert Report</h3>
                                        <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 md:mt-1">Deep Analysis</p>
                                    </div>
                                </Link>

                                <button
                                    onClick={() => setShowFeedback(true)}
                                    className="group flex flex-col justify-between p-4 md:p-6 rounded-[1.8rem] md:rounded-[2rem] bg-white/[0.02] border border-white/5 backdrop-blur-sm md:backdrop-blur-md hover:bg-white/[0.04] transition-all min-h-[120px] md:min-h-[140px] relative overflow-hidden text-left"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-[40px] -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg mb-3 md:mb-4">
                                        <MessageSquare size={18} className="text-white/70" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm md:text-base font-serif font-medium text-white/90">Feedback</h3>
                                        <p className="text-[9px] md:text-[10px] text-zinc-500 uppercase tracking-wider mt-0.5 md:mt-1">Improve AARA</p>
                                    </div>
                                </button>
                            </div>

                            {/* Insight Card (Mobile Priority - After Links) */}
                            <div className="lg:hidden p-8 rounded-[2.2rem] bg-gradient-to-b from-white/[0.04] to-transparent border border-white/5 backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[60px] -mr-10 -mt-10" />
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="w-6 h-6 rounded-full border border-indigo-500/20 flex items-center justify-center">
                                            <Sparkles size={10} className="text-indigo-400" />
                                        </div>
                                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-indigo-300/50">insight</span>
                                    </div>
                                    <p className="text-lg font-serif italic text-white/80 leading-relaxed mb-6">
                                        &quot;You don&apos;t have to control your thoughts. You just have to stop letting them control you.&quot;
                                    </p>
                                    <div className="h-0.5 w-8 bg-indigo-500/20" />
                                </div>
                            </div>
                        </div>

                    </div>



                </div>
            </main>

            <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
        </div>
    )
}
