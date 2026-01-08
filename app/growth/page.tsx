'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp, Award, Target, MapPin, Calendar, ArrowRight,
    Star, Zap, Heart, ChevronLeft, BookOpen, Loader2,
    Plus, Trash2, X, Sparkles, CheckCircle2, Flag
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import Navbar from '@/components/layout/Navbar'
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
                <Loader2 className="animate-spin text-white/20" size={32} />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
            <Navbar />

            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Mobile Header - Fixed at Top (Chat Style) */}
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
                    <Image
                        alt="AARA"
                        width={20}
                        height={20}
                        className="rounded-lg border border-white/10"
                        src="/aara-logo.png"
                    />
                    <span className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase">growth</span>
                </Link>

                <div className="w-11" /> {/* Spacer to balance layout */}
            </div>

            <main className="relative z-10 max-w-2xl mx-auto px-6 pb-32 pt-24 md:pt-32">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                        Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{firstName}</span>
                    </h1>
                    <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
                        &quot;The only way to make sense out of change is to plunge into it, move with it, and join the dance.&quot;
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {[
                        { label: 'Check-ins', value: stats.totalCheckins, icon: Calendar, color: 'text-blue-400' },
                        { label: 'Streak', value: `${stats.currentStreak} Days`, icon: Zap, color: 'text-yellow-400' },
                        { label: 'Avg Mood', value: stats.moodAverage, icon: Heart, color: 'text-pink-400' },
                        { label: 'Goals', value: goals.length, icon: Target, color: 'text-green-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="p-5 rounded-2xl bg-[#0e0e12] border border-white/5 flex flex-col items-center justify-center text-center group hover:bg-white/5 transition-all"
                        >
                            <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${stat.color.replace('text-', 'text-opacity-80 ')}`}>
                                <stat.icon size={20} className={stat.color} />
                            </div>
                            <span className="text-2xl font-black text-white">{stat.value}</span>
                            <span className="text-[10px] uppercase tracking-widest text-gray-500">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Goals Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Goals</h3>
                        <button
                            onClick={() => setShowGoalModal(true)}
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 text-white transition-colors"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    <div className="space-y-2">
                        {goals.length === 0 ? (
                            <div className="p-8 rounded-2xl bg-[#0e0e12] border border-white/5 border-dashed flex flex-col items-center text-center">
                                <Sparkles size={24} className="text-gray-600 mb-2" />
                                <p className="text-sm text-gray-500">No active goals yet.</p>
                                <button onClick={() => setShowGoalModal(true)} className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300">Set one now</button>
                            </div>
                        ) : (
                            goals.map((goal) => (
                                <div key={goal.id} className="flex items-center justify-between p-4 bg-[#0e0e12] border border-white/5 rounded-2xl group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border-2 border-indigo-500/30 group-hover:border-indigo-500 transition-colors flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <span className="text-sm font-medium text-white/90">{goal.text}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteGoal(goal.id)}
                                        className="p-2 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Milestones Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-1 rounded-3xl bg-gradient-to-b from-white/5 to-transparent"
                >
                    <div className="bg-[#0e0e12] rounded-[22px] p-6 border border-white/5">
                        <div className="flex items-center gap-2 mb-6">
                            <Award size={18} className="text-yellow-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Milestones</h3>
                        </div>

                        <div className="space-y-6 relative pl-2">
                            {/* Vertical Line */}
                            <div className="absolute left-[15px] top-6 bottom-6 w-0.5 bg-white/5" />

                            {milestones.map((item, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    <div className={`
                                        w-7 h-7 rounded-full flex items-center justify-center shrink-0 relative z-10 border-4 border-[#0e0e12]
                                        ${item.type === 'milestone' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'bg-white/10 text-gray-400'}
                                    `}>
                                        {item.type === 'milestone' ? <Star size={12} fill="currentColor" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-0.5">{item.date}</span>
                                        <h4 className={`text-sm font-bold ${item.type === 'milestone' ? 'text-white' : 'text-gray-300'}`}>{item.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

            </main>

            {/* Add Goal Modal */}
            <Modal isOpen={showGoalModal} onClose={() => setShowGoalModal(false)} title="Set New Goal">
                <div className="space-y-4">
                    <input
                        autoFocus
                        value={newGoalText}
                        onChange={(e) => setNewGoalText(e.target.value)}
                        placeholder="What do you want to achieve?"
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                    />
                    <div className="flex flex-wrap gap-2">
                        {["Meditate 10m", "Drink Water", "Read", "Sleep 8h"].map(s => (
                            <button key={s} onClick={() => setNewGoalText(s)} className="px-3 py-1.5 bg-white/5 rounded-lg text-xs font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                {s}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleAddGoal}
                        disabled={!newGoalText.trim() || isSubmittingGoal}
                        className="w-full py-3 bg-indigo-500 rounded-xl text-sm font-bold text-white hover:bg-indigo-600 transition-colors disabled:opacity-50"
                    >
                        {isSubmittingGoal ? 'Adding...' : 'Add Goal'}
                    </button>
                </div>
            </Modal>
        </div>
    )
}
