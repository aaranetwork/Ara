'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp, query, orderBy, getDocs } from 'firebase/firestore'

// Ultra-fast mood slider - GPU accelerated for 60fps
function FastMoodSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    return (
        <div className="w-full max-w-md mx-auto px-4">
            {/* Number Display */}
            <div className="flex items-center justify-center gap-3 mb-12">
                <span className="text-7xl font-serif text-white tabular-nums">{value}</span>
                <span className="text-3xl text-white/30 font-light">/10</span>
            </div>

            {/* Slider Container */}
            <div className="relative">
                {/* Labels */}
                <div className="flex justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">Heavy</span>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">Light</span>
                </div>

                {/* Track Container */}
                <div className="relative h-12 flex items-center">
                    {/* Track */}
                    <div className="relative w-full h-2 bg-white/5 rounded-full">
                        {/* Fill - GPU accelerated with scaleX */}
                        <div
                            className="absolute left-0 top-0 h-full bg-white/20 rounded-full pointer-events-none will-change-transform origin-left"
                            style={{ transform: `scaleX(${((value - 1) / 9)})` }}
                        />
                    </div>

                    {/* Thumb */}
                    <div
                        className="absolute w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center border border-white/10 pointer-events-none will-change-transform"
                        style={{
                            left: '-12px',
                            top: '50%',
                            transform: `translate(${((value - 1) * 100 / 9)}%, -50%)`
                        }}
                    >
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    </div>

                    {/* Invisible Input Overlay */}
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 p-0"
                        style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'none' }}
                    />
                </div>
            </div>
        </div>
    )
}

// Simplified emotion picker
function FastEmotionPicker({ selected, onSelect }: { selected: string; onSelect: (e: string) => void }) {
    const emotions = ['Calm', 'Anxious', 'Tired', 'Hopeful', 'Stressed', 'Grateful', 'Overwhelmed', 'Content']

    return (
        <div className="w-full max-w-lg mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif text-center text-white/90 mb-12">
                One word that describes your feeling:
            </h2>

            <div className="flex flex-wrap justify-center gap-3">
                {emotions.map((emotion) => (
                    <button
                        key={emotion}
                        onClick={() => onSelect(emotion)}
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-150 ${selected === emotion
                            ? 'bg-indigo-500 text-white scale-105'
                            : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                            }`}
                    >
                        {emotion}
                    </button>
                ))}
            </div>
        </div>
    )
}

// Simplified context selector
function FastContextSelector({ selected, onToggle }: { selected: string[]; onToggle: (f: string) => void }) {
    const factors = ['Work stress', 'Sleep issues', 'Relationship tension', 'Financial worry', 'Health concerns', 'Nothing specific']

    return (
        <div className="w-full max-w-lg mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif text-center text-white/90 mb-4">
                What&apos;s influencing that?
            </h2>
            <p className="text-sm text-white/40 text-center mb-8">(Optional - select all that apply)</p>

            <div className="space-y-2">
                {factors.map((factor) => {
                    const isSelected = selected.includes(factor)
                    return (
                        <button
                            key={factor}
                            onClick={() => onToggle(factor)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 ${isSelected
                                ? 'bg-indigo-500/20 border border-indigo-500/50'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-white/30'
                                }`}>
                                {isSelected && (
                                    <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                )}
                            </div>
                            <span className="text-sm text-white/80">{factor}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default function CheckInPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const [step, setStep] = useState(1)
    const [moodValue, setMoodValue] = useState(5)
    const [emotion, setEmotion] = useState('')
    const [context, setContext] = useState<string[]>([])
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!authLoading && !user) router.push('/auth/login')
    }, [user, authLoading, router])

    const handleContextToggle = (factor: string) => {
        setContext(prev =>
            prev.includes(factor)
                ? prev.filter(f => f !== factor)
                : prev.length < 3 ? [...prev, factor] : prev
        )
    }

    const handleSave = async () => {
        if (!user || !db || saving) return
        setSaving(true)

        try {
            await addDoc(collection(db, 'users', user.uid, 'moods'), {
                moodValue,
                emotionWord: emotion,
                contextFactors: context,
                value: moodValue,
                average: moodValue,
                createdAt: Timestamp.now()
            })

            // Show brief confirmation then redirect
            setTimeout(() => router.push('/'), 1500)
        } catch (error) {
            console.error('Save error:', error)
            alert('Failed to save. Please try again.')
            setSaving(false)
        }
    }

    if (authLoading || !user) {
        return <div className="min-h-screen bg-[#030305]" />
    }

    return (
        <div className="min-h-screen bg-[#030305] text-white relative overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <nav className="flex items-center justify-between px-6 py-6">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
                    >
                        <ChevronLeft size={20} className="text-white/60" />
                    </button>

                    <div className="flex gap-1.5">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1 rounded-full transition-all duration-300 ${s === step ? 'w-8 bg-white' : s < step ? 'w-2 bg-white/40' : 'w-1.5 bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>

                    <div className="w-10" />
                </nav>

                {/* Main Content */}
                <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-6">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full"
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                                        <span className="text-xl">🌸</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Check-In</span>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-serif text-white/90 mb-16">
                                        How are you feeling today?
                                    </h1>
                                </div>
                                <FastMoodSlider value={moodValue} onChange={setMoodValue} />
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full"
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                                        <span className="text-xl">🌸</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Reflection</span>
                                    </div>
                                </div>
                                <FastEmotionPicker selected={emotion} onSelect={setEmotion} />
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full"
                            >
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                                        <span className="text-xl">🌸</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">Context</span>
                                    </div>
                                </div>
                                <FastContextSelector selected={context} onToggle={handleContextToggle} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer CTA */}
                <div className="fixed bottom-8 left-0 right-0 flex justify-center px-6">
                    <button
                        onClick={() => {
                            if (step === 1 && moodValue) setStep(2)
                            else if (step === 2 && emotion) setStep(3)
                            else if (step === 3) handleSave()
                        }}
                        disabled={
                            (step === 1 && !moodValue) ||
                            (step === 2 && !emotion) ||
                            saving
                        }
                        className="px-10 py-4 bg-white text-black rounded-full font-medium text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3"
                    >
                        {saving ? 'Saving...' : step === 3 ? 'Complete' : 'Continue'}
                        {!saving && <ArrowRight size={16} />}
                    </button>

                    {step === 3 && !saving && (
                        <button
                            onClick={handleSave}
                            className="absolute left-6 px-6 py-4 text-white/50 hover:text-white/80 transition-colors text-sm"
                        >
                            Skip →
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
