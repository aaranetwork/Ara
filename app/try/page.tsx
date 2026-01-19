'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, Leaf, Heart, ChevronRight, Send } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { TextBlurReveal } from '@/components/ui/TextBlurReveal'
import { PremiumSlider } from '@/components/check-in/PremiumSlider'

// Reusing gradients from check-in for consistency
const GRADIENTS: Record<string, string> = {
    rose: 'from-rose-500/10 via-rose-500/5 to-transparent',
    violet: 'from-violet-500/10 via-violet-500/5 to-transparent',
    emerald: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
}

type Stage = 'mood' | 'reflect' | 'insight'

export default function TryPage() {
    const router = useRouter()
    const [stage, setStage] = useState<Stage>('mood')
    const [mood, setMood] = useState(5)
    const [reflection, setReflection] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Focus textarea on mount of stage
    useEffect(() => {
        if (stage === 'reflect') {
            setTimeout(() => textareaRef.current?.focus(), 500)
        }
    }, [stage])

    const handleMoodNext = () => {
        setStage('reflect')
    }

    const handleReflectNext = async () => {
        if (!reflection.trim()) return
        setIsAnalyzing(true)
        // Simulate deep AI thinking
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsAnalyzing(false)
        setStage('insight')

        if (typeof window !== 'undefined') {
            sessionStorage.setItem('guest_mood', mood.toString())
            sessionStorage.setItem('guest_reflection', reflection)
        }
    }

    const handleSaveProgress = () => {
        router.push('/auth/signup?mode=save')
    }

    // Determine current gradient theme
    const currentTheme = stage === 'mood' ? 'rose' : stage === 'reflect' ? 'violet' : 'emerald'

    return (
        <div className="min-h-screen bg-[#030305] text-[#F3F4F6] font-sans flex flex-col items-center justify-center relative overflow-hidden selection:bg-white/20 select-none">

            {/* Dynamic Ambient Background - Matching /check-in */}
            <motion.div
                key={currentTheme}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className={`absolute inset-0 bg-gradient-radial ${GRADIENTS[currentTheme]} opacity-60 pointer-events-none`}
            />

            {/* Grain Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay"></div>

            {/* Subtle Top Nav */}
            <nav className="absolute top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center opacity-0 animate-fade-in safe-area-top" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                <Link href="/" className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                    <Image src="/aara-logo.png" alt="AARA" width={24} height={24} className="rounded-md" />
                </Link>
                <Link href="/auth/login" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">
                    Sign In
                </Link>
            </nav>

            {/* Main Stage */}
            <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center justify-center min-h-[70vh]">
                <AnimatePresence mode="wait">

                    {/* STAGE 1: MOOD - Using PremiumSlider */}
                    {stage === 'mood' && (
                        <motion.div
                            key="mood"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full flex flex-col items-center"
                        >
                            {/* Step Identifier */}
                            <div className="flex justify-center mb-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center gap-2"
                                >
                                    <Heart size={12} className="text-white/70" />
                                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">First Check-in</span>
                                </motion.div>
                            </div>

                            {/* Question */}
                            <div className="mb-20 px-2">
                                <TextBlurReveal
                                    text="How heavy is your mental load right now?"
                                    className="text-3xl md:text-5xl font-serif text-center font-light leading-[1.2] text-white/90"
                                    delay={0.2}
                                />
                            </div>

                            {/* Premium Slider */}
                            <div className="mb-16 w-full">
                                <PremiumSlider
                                    value={mood}
                                    setValue={setMood}
                                    minLabel="Heavy"
                                    maxLabel="Light"
                                />
                            </div>

                            {/* Continue Button */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex justify-center"
                            >
                                <button
                                    onClick={handleMoodNext}
                                    className="group relative px-10 py-5 bg-[#F3F4F6] text-black rounded-full font-medium text-sm tracking-widest uppercase hover:px-12 transition-all duration-300 flex items-center gap-3 overflow-hidden shadow-lg shadow-white/5"
                                >
                                    <span className="relative z-10">Continue</span>
                                    <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* STAGE 2: REFLECT */}
                    {stage === 'reflect' && !isAnalyzing && (
                        <motion.div
                            key="reflect"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: -10 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full flex flex-col items-center"
                        >
                            {/* Step Identifier */}
                            <div className="flex justify-center mb-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md flex items-center gap-2"
                                >
                                    <Leaf size={12} className="text-white/70" />
                                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">Reflection</span>
                                </motion.div>
                            </div>

                            <div className="mb-12 px-2">
                                <TextBlurReveal
                                    text="What brought you here today?"
                                    className="text-3xl md:text-5xl font-serif text-center font-light leading-[1.2] text-white/90"
                                    delay={0.2}
                                />
                            </div>

                            {/* Input Container */}
                            <div className="w-full max-w-lg mx-auto mb-10">
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition duration-1000"></div>
                                    <div className="relative bg-white/[0.02] rounded-[2rem] border border-white/10 group-focus-within:border-white/20 transition-all p-2">
                                        <textarea
                                            ref={textareaRef}
                                            value={reflection}
                                            onChange={(e) => setReflection(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleReflectNext();
                                                }
                                            }}
                                            placeholder="I'm here because..."
                                            className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/20 p-6 min-h-[140px] resize-none text-lg leading-relaxed selection:bg-white/20"
                                        />
                                        <div className="flex justify-between items-center px-6 pb-4">
                                            <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">Encrypted</span>
                                            <button
                                                onClick={handleReflectNext}
                                                disabled={!reflection.trim()}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${reflection.trim()
                                                    ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110'
                                                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Send size={16} className={reflection.trim() ? 'ml-0.5' : ''} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* LOADING STATE */}
                    {isAnalyzing && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center"
                        >
                            <div className="relative w-32 h-32 mb-8">
                                <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full animate-pulse" />
                                <div className="absolute inset-0 border border-white/10 rounded-full animate-ping duration-[3s]" />
                                <div className="absolute inset-12 bg-white/80 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.5)] animate-pulse" />
                            </div>
                            <span className="text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">Analyzing Pattern...</span>
                        </motion.div>
                    )}

                    {/* STAGE 3: INSIGHT */}
                    {stage === 'insight' && (
                        <motion.div
                            key="insight"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            className="w-full max-w-lg"
                        >
                            <div className="bg-[#0e0e12]/80 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden text-center">
                                {/* Ambient Glow */}
                                <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none" />

                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <Leaf size={20} className="text-white/80" />
                                </div>

                                <h3 className="text-2xl font-serif text-white/90 mb-6 leading-relaxed">
                                    &quot;Acknowledging that you feel <span className="text-white border-b border-white/20 pb-0.5">{mood}/10</span> is a powerful start.&quot;
                                </h3>

                                <p className="text-sm text-white/50 leading-relaxed mb-10 max-w-sm mx-auto">
                                    You&apos;ve taken the first step to clarify your thoughts. Create your private space to continue this reflection.
                                </p>

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={handleSaveProgress}
                                        className="w-full py-5 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
                                    >
                                        Save & Continue <ChevronRight size={14} />
                                    </button>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="text-[10px] text-white/20 hover:text-white/50 transition-colors py-2 uppercase tracking-widest font-bold"
                                    >
                                        Exit without saving
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    )
}
