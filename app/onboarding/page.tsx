'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, Brain, Shield, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { TextBlurReveal } from '@/components/ui/TextBlurReveal'

const SLIDES = [
    {
        id: 'analysis',
        icon: Brain,
        title: 'Deep Analysis',
        description: 'Understand the "why" behind your feelings with AI-driven emotional pattern recognition.',
        theme: 'violet'
    },
    {
        id: 'reports',
        icon: Sparkles,
        title: 'Clinical Insights',
        description: 'Generate professional summaries of your mental journey to share with your therapist.',
        theme: 'rose'
    },
    {
        id: 'privacy',
        icon: Shield,
        title: 'Private Space',
        description: 'Your thoughts are encrypted and secure. A sanctuary for your mind.',
        theme: 'emerald'
    }
]

const GRADIENTS: Record<string, string> = {
    violet: 'from-violet-500/10 via-violet-500/5 to-transparent',
    rose: 'from-rose-500/10 via-rose-500/5 to-transparent',
    emerald: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
}

export default function OnboardingPage() {
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    const { user } = useAuth()

    const handleNext = async () => {
        if (currentIndex < SLIDES.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            if (user && db) {
                try {
                    await updateDoc(doc(db, 'users', user.uid), {
                        onboarding_completed: true,
                        last_active_date: new Date().toISOString().split('T')[0]
                    })
                    router.push('/')
                } catch (error) {
                    console.error('Error saving onboarding:', error)
                    router.push('/')
                }
            } else {
                router.push('/auth/login')
            }
        }
    }

    const currentSlide = SLIDES[currentIndex]
    const Icon = currentSlide.icon

    return (
        <div className="min-h-screen bg-[#030305] text-[#F3F4F6] font-sans flex flex-col items-center justify-center relative overflow-hidden selection:bg-white/20 select-none">

            {/* Dynamic Ambient Background */}
            <motion.div
                key={currentSlide.theme}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className={`absolute inset-0 bg-gradient-radial ${GRADIENTS[currentSlide.theme]} opacity-60 pointer-events-none`}
            />

            {/* Grain Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50">
                <Image src="/aara-logo.png" alt="AARA" width={32} height={32} className="rounded-lg opacity-80" />
                <button
                    onClick={() => router.push('/auth/login')}
                    className="text-white/30 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
                >
                    Skip Intro
                </button>
            </div>

            {/* Main Center Stage */}
            <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: -10 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full flex flex-col items-center"
                    >
                        {/* Glass Card */}
                        <div className="w-full relative">

                            {/* Icon Badge */}
                            <div className="flex justify-center mb-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="w-16 h-16 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center justify-center shadow-2xl"
                                >
                                    <Icon size={24} className="text-white/80" />
                                </motion.div>
                            </div>

                            {/* Title Reveal */}
                            <div className="mb-6 h-16 flex items-center justify-center">
                                <TextBlurReveal
                                    key={currentSlide.title}
                                    text={currentSlide.title}
                                    className="text-3xl md:text-4xl font-serif text-center font-light text-white/90"
                                    delay={2}
                                />
                            </div>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-white/50 text-center leading-relaxed text-sm md:text-base max-w-sm mx-auto mb-12 font-light"
                            >
                                {currentSlide.description}
                            </motion.p>

                            {/* Progress Bars */}
                            <div className="flex justify-center gap-1.5 mb-12">
                                {SLIDES.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`h-1 rounded-full transition-all duration-700 ease-[0.22,1,0.36,1] ${idx === currentIndex ? 'w-8 bg-white' :
                                                idx < currentIndex ? 'w-2 bg-white/40' : 'w-2 bg-white/10'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Continue Button */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex justify-center"
                            >
                                <button
                                    onClick={handleNext}
                                    className="group relative px-8 py-4 bg-[#F3F4F6] text-black rounded-full font-medium text-xs tracking-widest uppercase hover:px-10 transition-all duration-500 flex items-center gap-3 overflow-hidden shadow-lg shadow-white/5"
                                >
                                    <span className="relative z-10">{currentIndex === SLIDES.length - 1 ? 'Begin Journey' : 'Continue'}</span>
                                    <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
                                </button>
                            </motion.div>

                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
