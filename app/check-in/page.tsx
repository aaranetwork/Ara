'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { Heart, Zap, Leaf, Brain, Users } from 'lucide-react'
import { PremiumSlider } from '@/components/check-in/PremiumSlider'
import { CompletionScreen } from '@/components/check-in/CompletionScreen'
import { TextBlurReveal } from '@/components/ui/TextBlurReveal'

// --- Premium Config ---
const STEPS = [
    {
        id: 'emotional_state',
        title: 'Emotional State',
        question: 'How does your heart feel right now?',
        icon: Heart,
        lowLabel: 'Heavy',
        highLabel: 'Light',
        theme: 'rose'
    },
    {
        id: 'energy_level',
        title: 'Vitality',
        question: 'How charged is your inner battery?',
        icon: Zap,
        lowLabel: 'Empty',
        highLabel: 'Full',
        theme: 'amber'
    },
    {
        id: 'calm_level',
        title: 'Serenity',
        question: 'How still are the waters of your mind?',
        icon: Leaf,
        lowLabel: 'Stormy',
        highLabel: 'Still',
        theme: 'emerald'
    },
    {
        id: 'mental_clarity',
        title: 'Clarity',
        question: 'How sharp is your focus today?',
        icon: Brain,
        lowLabel: 'Hazy',
        highLabel: 'Sharp',
        theme: 'violet'
    },
    {
        id: 'connection',
        title: 'Connection',
        question: 'How connected do you feel to the world?',
        icon: Users,
        lowLabel: 'Distant',
        highLabel: 'United',
        theme: 'blue'
    }
]

const GRADIENTS: Record<string, string> = {
    rose: 'from-rose-500/10 via-rose-500/5 to-transparent',
    amber: 'from-amber-500/10 via-amber-500/5 to-transparent',
    emerald: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    violet: 'from-violet-500/10 via-violet-500/5 to-transparent',
    blue: 'from-blue-500/10 via-blue-500/5 to-transparent',
}

export default function CheckInPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const [currentStep, setCurrentStep] = useState(0)
    const [answers, setAnswers] = useState<{ [key: string]: number }>({})
    const [completed, setCompleted] = useState(false)
    const [value, setValue] = useState(5)

    const step = STEPS[currentStep]

    useEffect(() => {
        if (!authLoading && !user) router.push('/auth/login')
    }, [user, authLoading, router])

    useEffect(() => {
        setValue(5)
    }, [currentStep])

    const handleNext = () => {
        const stepId = STEPS[currentStep].id
        const newAnswers = { ...answers, [stepId]: value }
        setAnswers(newAnswers)

        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        } else {
            submitCheckIn(newAnswers)
        }
    }

    const submitCheckIn = async (finalAnswers: { [key: string]: number }) => {
        if (!user || !db) return
        try {
            const values = Object.values(finalAnswers)
            const avg = values.reduce((a, b) => a + b, 0) / values.length

            await addDoc(collection(db, 'users', user.uid, 'moods'), {
                signals: finalAnswers,
                value: Math.round(avg * 10) / 10,
                average: Math.round(avg * 10) / 10,
                createdAt: Timestamp.now()
            })
            setCompleted(true)
            setTimeout(() => router.push('/'), 2500)
        } catch (e) {
            console.error(e)
        }
    }

    if (authLoading || (!user && !completed)) return <div className="min-h-screen bg-[#030305]" />
    if (completed) return <CompletionScreen />

    return (
        <div className="min-h-screen bg-[#030305] text-[#F3F4F6] font-sans overflow-hidden relative selection:bg-white/20 select-none">

            {/* Dynamic Ambient Background */}
            <motion.div
                key={step.theme}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className={`absolute inset-0 bg-gradient-radial ${GRADIENTS[step.theme]} opacity-60 pointer-events-none`}
            />
            {/* Grain Texture Overlay for 'Paper' feel */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

            {/* Navigation Bar */}
            <nav className="relative z-50 flex items-center justify-between px-6 md:px-8 py-6 md:py-8 safe-area-top">
                <button
                    onClick={() => currentStep > 0 ? setCurrentStep(c => c - 1) : router.back()}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-white/40 hover:text-white"
                >
                    <ChevronLeft size={20} />
                </button>

                <div className="flex gap-1.5">
                    {STEPS.map((s, i) => (
                        <div
                            key={s.id}
                            className={`h-1 rounded-full transition-all duration-700 ease-[0.22,1,0.36,1] ${i === currentStep ? 'w-6 md:w-8 bg-white' :
                                i < currentStep ? 'w-2 bg-white/40' : 'w-1.5 bg-white/10'
                                }`}
                        />
                    ))}
                </div>

                <div className="w-10 h-10" /> {/* Spacer */}
            </nav>

            {/* Main Center Stage */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-[70vh] px-6 pb-safe-bottom">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full max-w-lg flex flex-col items-center"
                    >
                        {/* The Card - Minimalist/Glass */}
                        <div className="relative w-full">

                            {/* Step Identifier */}
                            <div className="flex justify-center mb-6 md:mb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center gap-2"
                                >
                                    <step.icon size={12} className="text-white/70" />
                                    <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">{step.title}</span>
                                </motion.div>
                            </div>

                            {/* The Question - Responsive Typography */}
                            <div className="mb-12 md:mb-20 px-2">
                                <TextBlurReveal
                                    key={step.question} // Force re-render on step change
                                    text={step.question}
                                    className="text-3xl md:text-5xl font-serif text-center font-light leading-[1.2] text-white/90"
                                    delay={2}
                                />
                            </div>

                            {/* The Bespoke Control */}
                            <div className="mb-12 md:mb-16">
                                <PremiumSlider
                                    value={value}
                                    setValue={setValue}
                                    minLabel={step.lowLabel}
                                    maxLabel={step.highLabel}
                                />
                            </div>

                            {/* Continue Action */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex justify-center"
                            >
                                <button
                                    onClick={handleNext}
                                    className="group relative px-8 py-4 md:px-10 md:py-5 bg-[#F3F4F6] text-black rounded-full font-medium text-xs md:text-sm tracking-widest uppercase hover:px-12 transition-all duration-300 flex items-center gap-3 overflow-hidden shadow-lg shadow-white/5"
                                >
                                    <span className="relative z-10">Continue</span>
                                    <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                                </button>
                            </motion.div>

                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
