'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ArrowRight, Leaf, Heart, ChevronRight, Send, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type Stage = 'mood' | 'reflect' | 'insight'

// Optimized GPU-accelerated slider - same as check-in page
function FastMoodSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [isActive, setIsActive] = useState(false)
    const percentage = ((value - 1) / 9) * 100

    return (
        <div className="w-full max-w-md mx-auto px-4 sm:px-6">
            {/* Number Display */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
                <span className="text-6xl sm:text-7xl md:text-8xl font-serif text-white tabular-nums">{value}</span>
                <span className="text-2xl sm:text-3xl text-white/30 font-light">/10</span>
            </div>

            {/* Slider Container */}
            <div className="relative">
                {/* Labels */}
                <div className="flex justify-between mb-3 sm:mb-4 px-1">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-white/40">Heavy</span>
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-white/40">Light</span>
                </div>

                {/* Track Container */}
                <div className="relative h-16 sm:h-12 flex items-center">
                    {/* Track */}
                    <div className="relative w-full h-2.5 sm:h-2 bg-white/5 rounded-full">
                        {/* Fill Bar - GPU accelerated */}
                        <div
                            className="absolute inset-y-0 left-0 bg-white/20 rounded-full origin-left transition-transform duration-150 ease-out"
                            style={{
                                transform: `scaleX(${percentage / 100})`,
                                willChange: 'transform'
                            }}
                        />
                    </div>

                    {/* Thumb */}
                    <div
                        className={`absolute rounded-full flex items-center justify-center border transition-all duration-150 ease-out ${isActive
                            ? 'w-8 h-8 sm:w-7 sm:h-7 shadow-[0_0_24px_rgba(255,255,255,0.5)] scale-110 border-white/20'
                            : 'w-7 h-7 sm:w-6 sm:h-6 shadow-[0_0_12px_rgba(255,255,255,0.3)] border-white/10'
                            } bg-white`}
                        style={{
                            left: `${percentage}%`,
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            willChange: 'transform'
                        }}
                    >
                        <div className={`rounded-full bg-black transition-all duration-150 ${isActive ? 'w-2 h-2' : 'w-1.5 h-1.5'}`} />
                    </div>

                    {/* Input Overlay */}
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        onMouseDown={() => setIsActive(true)}
                        onMouseUp={() => setIsActive(false)}
                        onTouchStart={() => setIsActive(true)}
                        onTouchEnd={() => setIsActive(false)}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer touch-none"
                        style={{
                            margin: 0,
                            padding: 0,
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

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

    const handleMoodNext = useCallback(() => {
        setStage('reflect')
    }, [])

    const handleReflectNext = useCallback(async () => {
        if (!reflection.trim()) return
        setIsAnalyzing(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setIsAnalyzing(false)
        setStage('insight')

        if (typeof window !== 'undefined') {
            sessionStorage.setItem('guest_mood', mood.toString())
            sessionStorage.setItem('guest_reflection', reflection)
        }
    }, [reflection, mood])

    const handleSaveProgress = useCallback(() => {
        router.push('/auth/signup?mode=save')
    }, [router])

    return (
        <div className="min-h-screen bg-[#030305] text-white relative overflow-hidden">
            {/* Background - Same as check-in */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <nav className="flex items-center justify-between px-6 py-6">
                    <button
                        onClick={() => stage === 'mood' ? router.push('/') : setStage('mood')}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
                    >
                        <ChevronLeft size={20} className="text-white/60" />
                    </button>

                    <Link href="/" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                        <Image src="/aara-logo.png" alt="AARA Prep" width={24} height={24} className="rounded-md" />
                    </Link>

                    <Link href="/auth/login" className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/40 hover:text-white transition-colors px-3 py-2">
                        Sign In
                    </Link>
                </nav>

                {/* Main Content */}
                <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-6">
                    <AnimatePresence mode="wait">

                        {/* STAGE 1: MOOD */}
                        {stage === 'mood' && (
                            <motion.div
                                key="mood"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full"
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                                        <Heart size={14} className="text-white/70" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">First Check-in</span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-serif text-white/90 mb-16">
                                        How is your mind feeling right now?
                                    </h1>
                                </div>
                                <FastMoodSlider value={mood} onChange={setMood} />
                            </motion.div>
                        )}

                        {/* STAGE 2: REFLECT */}
                        {stage === 'reflect' && !isAnalyzing && (
                            <motion.div
                                key="reflect"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-lg mx-auto"
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                                        <Leaf size={14} className="text-white/70" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Reflection</span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-serif text-white/90">
                                        What brought you here today?
                                    </h1>
                                </div>

                                {/* Simple Textarea */}
                                <div className="mt-10">
                                    <textarea
                                        ref={textareaRef}
                                        value={reflection}
                                        onChange={(e) => setReflection(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault()
                                                handleReflectNext()
                                            }
                                        }}
                                        placeholder="I'm here because..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl text-white/90 placeholder-white/30 px-5 py-4 min-h-[140px] resize-none text-lg leading-relaxed outline-none focus:border-white/20 transition-colors"
                                    />
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={handleReflectNext}
                                            disabled={!reflection.trim()}
                                            className={`px-6 py-3 rounded-full font-medium transition-all ${reflection.trim()
                                                ? 'bg-white text-black hover:scale-105'
                                                : 'bg-white/10 text-white/30 cursor-not-allowed'
                                                }`}
                                        >
                                            Continue
                                        </button>
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
                                <div className="relative w-24 h-24 mb-8">
                                    <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full animate-pulse" />
                                    <div className="absolute inset-0 border border-white/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                                    <div className="absolute inset-8 bg-white/80 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] animate-pulse" />
                                </div>
                                <span className="text-white/40 text-xs tracking-[0.2em] uppercase animate-pulse">Analyzing Pattern...</span>
                            </motion.div>
                        )}

                        {/* STAGE 3: INSIGHT */}
                        {stage === 'insight' && (
                            <motion.div
                                key="insight"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full max-w-lg"
                            >
                                <div className="bg-white/[0.02] backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden text-center">
                                    {/* Ambient Glow */}
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />

                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center mx-auto mb-8">
                                        <Leaf size={20} className="text-white/80" />
                                    </div>

                                    <div className="mb-6 relative">
                                        {mood <= 3 && (
                                            <h3 className="text-xl md:text-2xl font-serif text-white/90 leading-relaxed">
                                                &quot;It takes courage to sit with heavy feelings.&quot;
                                            </h3>
                                        )}
                                        {mood > 3 && mood <= 7 && (
                                            <h3 className="text-xl md:text-2xl font-serif text-white/90 leading-relaxed">
                                                &quot;A score of <span className="text-white border-b border-white/20 pb-0.5">{mood}/10</span> means things are in motion.&quot;
                                            </h3>
                                        )}
                                        {mood > 7 && (
                                            <h3 className="text-xl md:text-2xl font-serif text-white/90 leading-relaxed">
                                                &quot;It&apos;s great to feel this lightness.&quot;
                                            </h3>
                                        )}
                                    </div>

                                    <p className="text-sm text-white/50 leading-relaxed mb-8 max-w-sm mx-auto">
                                        You&apos;ve taken the first step to clarify your thoughts. Create your private space to continue.
                                    </p>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={handleSaveProgress}
                                            className="w-full py-4 bg-white text-black rounded-full font-semibold text-sm uppercase tracking-wider hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]"
                                        >
                                            Save & Continue <ChevronRight size={16} />
                                        </button>
                                        <button
                                            onClick={() => router.push('/')}
                                            className="text-[10px] text-white/30 hover:text-white/60 transition-colors py-3 uppercase tracking-widest font-bold"
                                        >
                                            Exit without saving
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Footer CTA - Fixed at bottom */}
                {stage === 'mood' && (
                    <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6">
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            onClick={handleMoodNext}
                            className="px-10 py-4 bg-white text-black rounded-full font-medium text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-lg flex items-center gap-3"
                        >
                            Continue
                            <ArrowRight size={16} />
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    )
}
