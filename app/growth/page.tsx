'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp, Award, Target, MapPin, Calendar, ArrowRight,
    Star, Zap, Heart, ChevronLeft, BookOpen, Loader2,
    Plus, Trash2, X, Sparkles, CheckCircle2, Flag
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
            <div className="h-[100dvh] bg-[#050505] text-white flex items-center justify-center">
                <Loader2 className="animate-spin text-white/40" size={32} />
            </div>
        )
    }

    return (
        <div className="min-h-screen text-white selection:bg-indigo-500/30 overflow-x-hidden">


            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 mb-6 backdrop-blur-md">
                        <Sparkles size={12} className="text-indigo-300" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Your Journey</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight mb-4 text-white">
                        Hello, <span className="text-indigo-300">{firstName}</span>
                    </h1>
                    <p className="text-white/60 max-w-lg mx-auto leading-relaxed font-light text-lg">
                        Every step you take adds to your story. Here is your progress so far.
                    </p>
                </motion.div>

                {/* Stats Grid - Premium Glass */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Active Days', value: stats.totalCheckins, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                        { label: 'Streak', value: `${stats.currentStreak} Days`, icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                        { label: 'Avg Mood', value: stats.moodAverage, icon: Heart, color: 'text-rose-400', bg: 'bg-rose-500/10' },
                        { label: 'Goals', value: goals.length, icon: Target, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + (i * 0.1) }}
                            className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/[0.04] transition-all duration-300 hover:border-white/10 backdrop-blur-md"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={22} className={stat.color} strokeWidth={1.5} />
                            </div>
                            <span className="text-2xl md:text-3xl font-serif text-white mb-1">{stat.value}</span>
                            <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Goals Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-xl"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-serif text-white">Active Goals</h3>
                            <button
                                onClick={() => setShowGoalModal(true)}
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95 border border-white/5"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        <div className="space-y-3">
                            {goals.length === 0 ? (
                                <div className="py-12 flex flex-col items-center text-center opacity-40">
                                    <Target size={32} className="mb-3 stroke-1" />
                                    <p className="text-sm font-light">No goals set yet</p>
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
                        className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                                <Award size={16} className="text-yellow-400" />
                            </div>
                            <h3 className="text-lg font-serif text-white">Milestones</h3>
                        </div>

                        <div className="space-y-6 relative pl-3">
                            {/* Vertical Line */}
                            <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-white/10 to-transparent" />

                            {milestones.map((item, i) => (
                                <div key={i} className="flex gap-6 relative group">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10 border-4 border-[#030305] shadow-lg transition-transform duration-300 group-hover:scale-110
                                        ${item.type === 'milestone' ? 'bg-yellow-400 text-black shadow-yellow-400/20' : 'bg-white/10 text-white/40'}
                                    `}>
                                        {item.type === 'milestone' ? <Star size={12} fill="currentColor" /> : <div className="w-2 h-2 rounded-full bg-white/40" />}
                                    </div>
                                    <div className="pt-1">
                                        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest block mb-1">{item.date}</span>
                                        <h4 className={`text-base font-medium ${item.type === 'milestone' ? 'text-white' : 'text-white/70'}`}>{item.title}</h4>
                                        <p className="text-sm text-white/60 mt-1 font-light leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

            </main>

            {/* Add Goal Modal - Premium Style */}
            <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="Set New Goal">
                <div className="space-y-6 pt-2">
                    <input
                        autoFocus
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="What do you want to achieve?"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-lg text-white placeholder-white/40 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                    />
                    <div className="flex flex-wrap gap-2">
                        {["Meditate 10m", "Drink Water", "Read 10 pages", "Sleep 8h"].map(s => (
                            <button key={s} onClick={() => setNewGoalText(s)} className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-white/50 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/5 transition-all">
                                {s}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleAddGoal}
                        disabled={!newGoalText.trim() || isSubmittingGoal}
                        className="w-full py-4 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 shadow-lg"
                    >
                        {isSubmittingGoal ? 'Adding...' : 'Commit Goal'}
                    </button>
                </div>
            </Modal>
        </div>
    )
}
