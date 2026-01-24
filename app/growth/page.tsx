'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp, Award, Target, MapPin, Calendar, ArrowRight,
    Star, Zap, Heart, ChevronLeft, BookOpen, Loader2,
    Plus, Trash2, X, Sparkles, CheckCircle2, Flag, Brain, Activity
} from 'lucide-react'
import BackButton from '@/components/ui/BackButton'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import Modal from '@/components/ui/Modal'

export default function GrowthPage() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [stats, setStats] = useState({
        totalCheckins: 0,
        currentStreak: 0,
        moodAverage: 0,
        journalCount: 0
    })
    const [loading, setLoading] = useState(true)
    const [firstName, setFirstName] = useState('Traveler')
    const [milestones, setMilestones] = useState<any[]>([])
    const [goals, setGoals] = useState<any[]>([])
    const [showGoalModal, setShowGoalModal] = useState(false)
    const [newGoalText, setNewGoalText] = useState('')
    const [isSubmittingGoal, setIsSubmittingGoal] = useState(false)
    const [insights, setInsights] = useState<any>(null)
    const [insightsLoading, setInsightsLoading] = useState(false)

    useEffect(() => {
        if (authLoading) return
        if (!user) {
            router.push('/auth/login')
            return
        }
        setFirstName(user.displayName?.split(' ')[0] || 'Traveler')

        const fetchData = async () => {
            if (!db) return
            try {
                // Fetch Moods
                const moodsQuery = query(collection(db, 'users', user.uid, 'moods'), orderBy('createdAt', 'desc'))
                const moodsSnapshot = await getDocs(moodsQuery)
                const moods = moodsSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }))

                // Fetch Journals
                const journalsQuery = query(collection(db, 'users', user.uid, 'journal'), orderBy('createdAt', 'desc'))
                const journalsSnapshot = await getDocs(journalsQuery)
                const journals = journalsSnapshot.docs.map(doc => ({
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date()
                }))

                // Fetch Goals
                const goalsQuery = query(collection(db, 'users', user.uid, 'goals'), orderBy('createdAt', 'desc'))
                const goalsSnapshot = await getDocs(goalsQuery)
                const fetchedGoals = goalsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
                setGoals(fetchedGoals)

                // Calculations
                const totalCheckins = moods.length
                const journalCount = journals.length
                const avgMood = moods.length > 0
                    ? (moods.reduce((acc, curr: any) => acc + (curr.average || 0), 0) / moods.length).toFixed(1)
                    : '0.0'

                const uniqueDates = new Set([
                    ...moods.map((m: any) => m.createdAt.toDateString()),
                    ...journals.map((j: any) => j.createdAt.toDateString())
                ])
                const sortedDates = Array.from(uniqueDates).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

                let streak = 0
                const today = new Date().toDateString()
                const yesterday = new Date(Date.now() - 86400000).toDateString()

                if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
                    let currentDate = new Date(sortedDates[0])
                    const mostRecent = sortedDates[0]
                    if (mostRecent === today || mostRecent === yesterday) {
                        streak = 1
                        for (let i = 1; i < sortedDates.length; i++) {
                            const prevDate = new Date(sortedDates[i])
                            const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime())
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            if (diffDays === 1) {
                                streak++
                                currentDate = prevDate
                            } else {
                                break
                            }
                        }
                    }
                }

                setStats({
                    totalCheckins,
                    currentStreak: streak,
                    moodAverage: parseFloat(avgMood as string),
                    journalCount
                })

                // Milestones
                const newMilestones = []
                if (streak >= 7) newMilestones.push({ title: "7 Day Streak", date: "Just now", desc: "Consistency is key!", type: "milestone" })
                if (journalCount >= 1) newMilestones.push({ title: "First Reflection", date: "Journaling", desc: "Documenting your journey.", type: "start" })
                if (totalCheckins >= 1) newMilestones.push({ title: "Journey Begun", date: "First Steps", desc: "Started tracking mood.", type: "start" })
                if (newMilestones.length === 0) newMilestones.push({ title: "Ready to Start?", date: "Today", desc: "Complete a check-in to see milestones.", type: "start" })
                setMilestones(newMilestones)

                // Fetch Insights
                setInsightsLoading(true)
                try {
                    const idToken = await user.getIdToken()
                    const insightsResponse = await fetch('/api/insights/current?days=30', {
                        headers: { 'Authorization': `Bearer ${idToken}` }
                    })
                    if (insightsResponse.ok) {
                        const insightsData = await insightsResponse.json()
                        setInsights(insightsData.data)
                    }
                } catch (err) {
                    console.error('Error fetching insights:', err)
                } finally {
                    setInsightsLoading(false)
                }

            } catch (error) {
                console.error("Error fetching growth data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user, authLoading, router])

    const handleAddGoal = async () => {
        if (!newGoalText.trim() || !user || !db) return
        setIsSubmittingGoal(true)
        try {
            const docRef = await addDoc(collection(db, 'users', user.uid, 'goals'), {
                text: newGoalText,
                createdAt: Timestamp.now(),
                status: 'active'
            })
            setGoals([{ id: docRef.id, text: newGoalText, status: 'active' }, ...goals])
            setNewGoalText('')
            setShowGoalModal(false)
        } catch (error) {
            console.error("Error adding goal:", error)
        } finally {
            setIsSubmittingGoal(false)
        }
    }

    const handleDeleteGoal = async (goalId: string) => {
        if (!user || !db) return
        try {
            await deleteDoc(doc(db, 'users', user.uid, 'goals', goalId))
            setGoals(goals.filter(g => g.id !== goalId))
        } catch (error) {
            console.error("Error deleting goal:", error)
        }
    }

    if (authLoading || loading) {
        return (
            <div className="h-[100dvh] bg-[#030305] text-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Image src="/aara-logo.png" alt="AARA" width={48} height={48} className="rounded-xl animate-pulse" />
                    <div className="w-8 h-1 bg-indigo-500/30 rounded-full animate-pulse" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#030305] text-white selection:bg-indigo-500/30 overflow-x-hidden">


            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            {/* Grain Texture Overlay */}
            <div className="fixed inset-0 opacity-[0.015] bg-[url('/noise.svg')] pointer-events-none" />

            {/* Back Button */}
            <div className="fixed top-6 left-6 z-[60]">
                <BackButton />
            </div>

            <main className="relative z-10 max-w-4xl mx-auto px-6 pb-32 pt-20 md:pt-28">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 mb-8 backdrop-blur-sm">
                        <Sparkles size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Your Journey</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-light tracking-tight mb-6 text-white">
                        Hello, <span className="text-indigo-400">{firstName}</span>
                    </h1>
                    <p className="text-white/50 max-w-lg mx-auto leading-relaxed text-base md:text-lg">
                        Every step you take adds to your story. Here&apos;s your progress so far.
                    </p>
                </motion.div>

                {/* Stats Grid - Premium Glass */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Active Days', value: stats.totalCheckins, icon: Calendar, color: 'text-white/70', bg: 'bg-white/5' },
                        { label: 'Streak', value: `${stats.currentStreak}`, icon: Zap, color: 'text-yellow-400/80', bg: 'bg-yellow-500/10' },
                        { label: 'Avg Mood', value: stats.moodAverage.toFixed(1), icon: Heart, color: 'text-rose-400/80', bg: 'bg-rose-500/10' },
                        { label: 'Goals', value: goals.length, icon: Target, color: 'text-indigo-400/80', bg: 'bg-indigo-500/10' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (i * 0.1), duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="relative p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.04] transition-all duration-300 hover:border-indigo-500/30 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] backdrop-blur-sm will-change-transform"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 will-change-transform`}>
                                <stat.icon size={22} className={stat.color} strokeWidth={1.5} />
                            </div>
                            <span className="text-3xl md:text-4xl font-serif text-white mb-1.5 tabular-nums">{stat.value}</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Insights Section */}
                {insights && !insightsLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mb-12 p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                <Brain size={20} className="text-indigo-400" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-serif text-white">Emotional Insights</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Average Mood */}
                            <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-white/60 font-medium">Average Mood</span>
                                    <span className="text-2xl font-serif text-white/90">
                                        {insights.emotionalPatterns?.intensity || 0}/10
                                    </span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full transition-all"
                                        style={{ width: `${((insights.emotionalPatterns?.intensity || 0) / 10) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {/* Dominant Emotions */}
                            {insights.emotionalPatterns?.dominant?.length > 0 && (
                                <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                                    <span className="text-sm text-white/60 font-medium block mb-3">Dominant Emotions</span>
                                    <div className="flex flex-wrap gap-2">
                                        {insights.emotionalPatterns.dominant.slice(0, 3).map((emotion: string, i: number) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 rounded-full text-xs font-medium"
                                            >
                                                {emotion}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Trend */}
                            {insights.emotionalPatterns?.trend && (
                                <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5">
                                    <span className="text-sm text-white/60 font-medium block mb-3">Trend</span>
                                    <div className="flex items-center gap-2">
                                        {insights.emotionalPatterns.trend === 'improving' && <TrendingUp size={18} className="text-emerald-400" />}
                                        {insights.emotionalPatterns.trend === 'declining' && <TrendingUp size={18} className="text-rose-400 rotate-180" />}
                                        {insights.emotionalPatterns.trend === 'volatile' && <Activity size={18} className="text-amber-400" />}
                                        <span className="text-sm text-white/80 capitalize">{insights.emotionalPatterns.trend}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Themes */}
                        {insights.themes?.length > 0 && (
                            <div className="mt-6">
                                <span className="text-sm text-white/60 font-medium block mb-3">Active Themes</span>
                                <div className="flex flex-wrap gap-2">
                                    {insights.themes.slice(0, 5).map((theme: string, i: number) => (
                                        <div
                                            key={i}
                                            className="px-4 py-2 bg-white/[0.02] rounded-xl text-white/70 text-sm flex items-center gap-2 border border-white/5"
                                        >
                                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                            {theme}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Goals Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-md md:backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-serif text-white">Active Goals</h3>
                            <button
                                onClick={() => setShowGoalModal(true)}
                                className="w-10 h-10 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 flex items-center justify-center text-indigo-400 transition-all active:scale-95 border border-indigo-500/20 hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {goals.length === 0 ? (
                                <div className="py-16 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
                                        <Target size={28} className="text-indigo-400/60" strokeWidth={1.5} />
                                    </div>
                                    <p className="text-sm text-white/40">No goals set yet</p>
                                    <p className="text-xs text-white/30 mt-1">Click + to add your first goal</p>
                                </div>
                            ) : (
                                goals.map((goal) => (
                                    <div key={goal.id} className="group flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-6 h-6 rounded-full border border-indigo-500/30 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                                                <div className="w-3 h-3 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <span className="text-sm text-white/80 font-light">{goal.text}</span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteGoal(goal.id)}
                                            aria-label="Delete Goal"
                                            className="p-2 text-white/40 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>

                    {/* Milestones Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-md hover:border-white/10 transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.1)]">
                                <Award size={20} className="text-yellow-400" strokeWidth={2} />
                            </div>
                            <h3 className="text-xl font-serif text-white">Milestones</h3>
                        </div>

                        <div className="space-y-8 relative">
                            {/* Vertical Timeline */}
                            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-indigo-500/30 via-indigo-500/10 to-transparent rounded-full" />

                            {milestones.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + i * 0.1 }}
                                    className="flex gap-5 relative group"
                                >
                                    {/* Milestone Circle */}
                                    <div className={`relative flex-shrink-0 z-10 transition-all duration-300 group-hover:scale-110 ${item.type === 'milestone'
                                        ? 'w-10 h-10'
                                        : 'w-10 h-10'
                                        }`}>
                                        {item.type === 'milestone' ? (
                                            // Active Milestone
                                            <div className="relative w-full h-full">
                                                {/* Glow Effect */}
                                                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md animate-pulse" />
                                                {/* Circle */}
                                                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-400/30">
                                                    <Star size={14} fill="currentColor" className="text-black" strokeWidth={0} />
                                                </div>
                                            </div>
                                        ) : (
                                            // Inactive Milestone
                                            <div className="w-full h-full rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center group-hover:border-white/20 transition-colors">
                                                <div className="w-2 h-2 rounded-full bg-white/30" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-1.5">
                                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.15em] block mb-1.5">
                                            {item.date}
                                        </span>
                                        <h4 className={`text-base font-medium mb-1 transition-colors ${item.type === 'milestone' ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                                            }`}>
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-white/50 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </main>

            <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="Set New Goal">
                <div className="space-y-6">
                    {/* Input Field */}
                    <div className="relative">
                        <input
                            autoFocus
                            value={newGoalText}
                            onChange={(e) => setNewGoalText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && newGoalText.trim() && !isSubmittingGoal) {
                                    handleAddGoal()
                                }
                            }}
                            placeholder="What do you want to achieve?"
                            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-base text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all"
                        />
                    </div>

                    {/* Suggestion Pills */}
                    <div>
                        <p className="text-xs uppercase tracking-wider text-white/40 font-bold mb-3">Quick Suggestions</p>
                        <div className="flex flex-wrap gap-2">
                            {["Meditate 10m", "Drink 8 glasses", "Read 10 pages", "Sleep 8h", "Exercise 30m", "Journal today"].map(s => (
                                <button
                                    key={s}
                                    onClick={() => setNewGoalText(s)}
                                    className="px-4 py-2.5 bg-white/[0.03] rounded-xl text-xs font-medium text-white/60 hover:text-white hover:bg-indigo-500/10 border border-white/5 hover:border-indigo-500/30 transition-all active:scale-95"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleAddGoal}
                        disabled={!newGoalText.trim() || isSubmittingGoal}
                        className="w-full py-4 bg-white text-black rounded-2xl text-sm font-bold hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-[0.98]"
                    >
                        {isSubmittingGoal ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Adding...
                            </span>
                        ) : 'Commit Goal'}
                    </button>
                </div>
            </Modal>
        </div>
    )
}
