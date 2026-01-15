'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { ArrowRight, Check, ChevronLeft, Heart, Zap, Leaf, Brain, Users, Info } from 'lucide-react'
import Image from 'next/image'

// --- Types & Config ---
type MoodStep = {
    id: string
    title: string
    question: string
    icon: any
    lowLabel: string
    highLabel: string
    color: string
    description?: string
}

const STEPS: MoodStep[] = [
    {
        id: 'emotional_state',
        title: 'Emotional State',
        question: 'How does your heart feel right now?',
        icon: Heart,
        lowLabel: 'Distressed',
        highLabel: 'Thriving',
        color: 'from-pink-500 to-rose-500',
        description: 'Tune into your emotional baseline.'
    },
    {
        id: 'energy_level',
        title: 'Energy Level',
        question: 'How charged is your inner battery?',
        icon: Zap,
        lowLabel: 'Depleted',
        highLabel: 'charged',
        color: 'from-yellow-400 to-orange-500',
        description: 'Assess your physical and mental vitality.'
    },
    {
        id: 'calm_level',
        title: 'Calmness',
        question: 'How still are the waters of your mind?',
        icon: Leaf,
        lowLabel: 'Turbulent',
        highLabel: 'Serene',
        color: 'from-emerald-400 to-teal-500',
        description: 'Observe the noise level of your thoughts.'
    },
    {
        id: 'mental_clarity',
        title: 'Clarity',
        question: 'How sharp is your focus today?',
        icon: Brain,
        lowLabel: 'Foggy',
        highLabel: 'Lucid',
        color: 'from-violet-500 to-purple-600',
        description: 'Gauge your ability to concentrate.'
    },
    {
        id: 'connection',
        title: 'Connection',
        question: 'How connected do you feel to the world?',
        icon: Users,
        lowLabel: 'Isolated',
        highLabel: 'United',
        color: 'from-blue-400 to-indigo-500',
        description: 'Reflect on your sense of belonging.'
    }
]

export default function CheckInPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<{ [key: string]: number }>({})
    const [saving, setSaving] = useState(false)
    const [completed, setCompleted] = useState(false)

    // Ensure user is logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login')
        }
    }, [user, authLoading, router])

    const handleNext = (value: number) => {
        const stepId = STEPS[currentStep].id
        setAnswers(prev => ({ ...prev, [stepId]: value }))

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            submitCheckIn({ ...answers, [stepId]: value })
        }
    }

    const submitCheckIn = async (finalAnswers: { [key: string]: number }) => {
        if (!user || !db) return
        setSaving(true)
        try {
            const values = Object.values(finalAnswers)
            const average = values.reduce((a, b) => a + b, 0) / values.length

            await addDoc(collection(db, 'users', user.uid, 'moods'), {
                signals: finalAnswers,
                value: Math.round(average * 10) / 10,
                average: Math.round(average * 10) / 10,
                createdAt: Timestamp.now()
            })
            setCompleted(true)
            setTimeout(() => router.push('/'), 2000)
        } catch (error) {
            console.error('Error saving check-in:', error)
            setSaving(false)
        }
    }

    if (authLoading || (!user && !completed)) return <div className="min-h-screen bg-[#050505]" />

    if (completed) return <CompletionScreen />

    const step = STEPS[currentStep]

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col overflow-hidden relative selection:bg-indigo-500/30">
            {/* Background Ambience (Aara Theme) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Header */}
            <header className="relative z-20 px-6 py-6 flex items-center justify-between">
                <button
                    onClick={() => currentStep > 0 ? setCurrentStep(c => c - 1) : router.back()}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5 backdrop-blur-md"
                >
                    <ChevronLeft size={20} className="text-gray-300" />
                </button>
                <div className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Step {currentStep + 1}/{STEPS.length}</span>
                </div>
                <div className="w-11" /> {/* Spacer */}
            </header>

            {/* Main Content */}
            <main className="flex-1 relative z-10 flex flex-col max-w-lg mx-auto w-full px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                        className="flex-1 flex flex-col"
                    >
                        {/* Question Section */}
                        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8 min-h-[40vh]">

                            {/* Icon Container */}
                            <motion.div
                                className="relative"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                            >
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-tr ${step.color} blur-[40px] opacity-20`}
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                                <div className="relative w-24 h-24 rounded-[2rem] flex items-center justify-center bg-[#0e0e12] border border-white/10 shadow-2xl">
                                    <step.icon size={36} className="text-white" strokeWidth={1.5} />
                                </div>
                            </motion.div>

                            <motion.div
                                className="space-y-4 max-w-xs mx-auto"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
                                    {step.title}
                                </h2>
                                <h1 className="text-3xl md:text-4xl font-serif font-medium leading-tight text-white">
                                    {step.question}
                                </h1>
                            </motion.div>
                        </div>

                        {/* Interactive Input Section */}
                        <div className="flex-1 pb-12 flex flex-col justify-end">
                            <StepInput step={step} onNext={handleNext} />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}

function CompletionScreen() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 text-center space-y-8 p-8 max-w-md">
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-emerald-400 to-green-500 flex items-center justify-center shadow-[0_0_60px_rgba(16,185,129,0.3)]"
                >
                    <Check size={56} className="text-[#050505]" strokeWidth={3} />
                </motion.div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-serif font-medium text-white">Check-in Complete</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Your reflection has been captured safely. Taking you back to your dashboard...
                    </p>
                </div>
            </div>
        </div>
    )
}

// --- Specialized Input Components ---

function StepInput({ step, onNext }: { step: MoodStep, onNext: (val: number) => void }) {
    const [value, setValue] = useState(5)

    // Unique Visual Feedback Logic
    const renderVisualFeedback = () => {
        switch (step.id) {
            case 'emotional_state':
                return (
                    <div className="h-2 w-full bg-[#0e0e12] border border-white/10 rounded-full overflow-hidden mb-10 relative">
                        <div className="absolute inset-0 bg-white/5" />
                        <motion.div
                            className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${step.color}`}
                            initial={{ width: '50%' }}
                            animate={{ width: `${value * 10}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    </div>
                )
            case 'energy_level':
                return (
                    <div className="flex justify-center mb-10 gap-1.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: i <= value ? 1 : 0.9,
                                    opacity: i <= value ? 1 : 0.3
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                className={`w-2.5 h-12 rounded-sm ${i <= value
                                    ? 'bg-gradient-to-t from-yellow-500 to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                    : 'bg-white/5 border border-white/5'
                                    }`}
                            />
                        ))}
                    </div>
                )

            case 'calm_level':
                // Breathing circle size
                return (
                    <div className="h-32 flex items-center justify-center mb-6 relative">
                        {/* Ripples */}
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    scale: [1, 1.2 + (value * 0.05), 1],
                                    opacity: [0.1, 0, 0.1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    delay: i * 0.5,
                                    ease: "easeInOut"
                                }}
                                className={`absolute rounded-full border border-emerald-500/30`}
                                style={{ width: `${i * 60}px`, height: `${i * 60}px` }}
                            />
                        ))}

                        <motion.div
                            animate={{
                                scale: 0.8 + (value * 0.08),
                                filter: `blur(${Math.max(0, 10 - value)}px)`
                            }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className={`w-16 h-16 rounded-full bg-gradient-to-b ${step.color} shadow-[0_0_40px_rgba(16,185,129,0.3)]`}
                        />
                    </div>
                )

            case 'mental_clarity':
                return (
                    <div className="h-24 flex items-center justify-center mb-10">
                        <motion.p
                            animate={{
                                filter: `blur(${(10 - value) * 1.2}px)`,
                                opacity: 0.3 + (value / 15),
                                scale: 0.9 + (value / 50)
                            }}
                            transition={{ type: "spring", stiffness: 150, damping: 20 }}
                            className="text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight"
                        >
                            CLARITY
                        </motion.p>
                    </div>
                )

            default: // Connection & General
                return (
                    <div className="h-14 mb-10 flex items-center gap-4 px-1 rounded-2xl">
                        <div className="flex-1 h-1.5 bg-[#0e0e12] border border-white/10 rounded-full overflow-hidden flex items-center relative">
                            <motion.div
                                className={`absolute left-0 h-full bg-gradient-to-r ${step.color}`}
                                animate={{ width: `${value * 10}%` }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                            {/* Nodes along the line */}
                            <div className="absolute inset-0 flex justify-between px-0.5">
                                {[0, 2, 4, 6, 8, 10].map(n => (
                                    <div key={n} className={`w-1 h-full bg-[#050505]/50`} />
                                ))}
                            </div>
                        </div>
                    </div>
                )
        }
    }

    return (
        <div className="space-y-6">

            {/* Dynamic Visual Feedback */}
            {renderVisualFeedback()}

            {/* Premium Slider Container */}
            <div className="bg-[#0e0e12] border border-white/10 rounded-[2rem] p-8 relative hover:border-white/20 transition-colors duration-500 group">
                <div className="flex justify-between items-center mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-400 transition-colors">{step.lowLabel}</span>
                    <span className="text-4xl font-serif text-white tabular-nums">{value}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-gray-400 transition-colors">{step.highLabel}</span>
                </div>

                <div className="relative h-12 flex items-center">
                    {/* Track */}
                    <div className="absolute left-0 right-0 h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white/30"
                            animate={{ width: `${value * 10}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        />
                    </div>

                    {/* Invisible Range Input */}
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={value}
                        onChange={(e) => setValue(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />

                    {/* Custom Thumb (Visual Only, follows value) */}
                    <motion.div
                        className="absolute w-8 h-8 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] z-10 pointer-events-none flex items-center justify-center"
                        animate={{ left: `calc(${((value - 1) / 9) * 100}% - 16px)` }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <div className="w-2 h-2 rounded-full bg-black/20" />
                    </motion.div>
                </div>
            </div>

            {/* Continue Button */}
            <motion.button
                onClick={() => onNext(value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm tracking-wide uppercase transition-colors flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(99,102,241,0.3)]"
            >
                Continue <ArrowRight size={18} />
            </motion.button>
        </div>
    )
}
