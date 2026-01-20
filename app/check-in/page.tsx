'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase/config'
import { collection, addDoc, Timestamp } from 'firebase/firestore'

import { MoodSlider } from '@/components/check-in/MoodSlider'
import { EmotionPicker } from '@/components/check-in/EmotionPicker'
import { ContextSelector } from '@/components/check-in/ContextSelector'
import { CheckInConfirmation } from '@/components/check-in/CheckInConfirmation'
import { getDailyMoodPrompt, getDailyEmotionWords, getDailyContextOptions, trackShownPrompt, trackShownEmotionWords } from '@/components/check-in/utils/rotationLogic'
import { generateInsights, Insight } from '@/components/check-in/utils/insightGenerator'

type Step = 'mood' | 'emotion' | 'context' | 'complete'

export default function CheckInPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    // Flow state
    const [currentStep, setCurrentStep] = useState<Step>('mood')
    const [startTime] = useState(Date.now())

    // Data collection
    const [moodValue, setMoodValue] = useState(5)
    const [moodPrompt, setMoodPrompt] = useState('')
    const [emotionWord, setEmotionWord] = useState('')
    const [emotionCustom, setEmotionCustom] = useState(false)
    const [emotionWordsShown, setEmotionWordsShown] = useState<string[]>([])
    const [contextFactors, setContextFactors] = useState<string[]>([])
    const [skippedContext, setSkippedContext] = useState(false)

    // UI state
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [insights, setInsights] = useState<Insight[]>([])

    // Auth protection
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login')
        }
    }, [user, authLoading, router])

    // Initialize rotation data
    useEffect(() => {
        const prompt = getDailyMoodPrompt()
        const emotions = getDailyEmotionWords()

        setMoodPrompt(prompt)
        setEmotionWordsShown(emotions)

        trackShownPrompt(prompt)
        trackShownEmotionWords(emotions)
    }, [])

    // Save to localStorage for recovery
    useEffect(() => {
        if (typeof window !== 'undefined' && currentStep !== 'complete') {
            const progress = {
                step: currentStep,
                moodValue,
                emotionWord,
                emotionCustom,
                contextFactors,
                timestamp: Date.now()
            }
            localStorage.setItem('checkInProgress', JSON.stringify(progress))
        }
    }, [currentStep, moodValue, emotionWord, emotionCustom, contextFactors])

    // Load from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('checkInProgress')
            if (saved) {
                try {
                    const progress = JSON.parse(saved)
                    // Only restore if less than 1 hour old
                    if (Date.now() - progress.timestamp < 3600000) {
                        setCurrentStep(progress.step)
                        setMoodValue(progress.moodValue)
                        setEmotionWord(progress.emotionWord)
                        setEmotionCustom(progress.emotionCustom)
                        setContextFactors(progress.contextFactors)
                    }
                } catch (e) {
                    // Ignore errors
                }
            }
        }
    }, [])

    const handleMoodContinue = () => {
        setCurrentStep('emotion')
    }

    const handleEmotionSelect = (emotion: string, isCustom: boolean) => {
        setEmotionWord(emotion)
        setEmotionCustom(isCustom)
    }

    const handleEmotionContinue = () => {
        if (!emotionWord) return
        setCurrentStep('context')
    }

    const handleContextToggle = (factor: string) => {
        setContextFactors(prev => {
            if (prev.includes(factor)) {
                return prev.filter(f => f !== factor)
            } else {
                // Max 3 selections
                if (prev.length >= 3) return prev
                return [...prev, factor]
            }
        })
    }

    const handleContextSkip = () => {
        setSkippedContext(true)
        submitCheckIn(true)
    }

    const handleContextContinue = () => {
        setSkippedContext(false)
        submitCheckIn(false)
    }

    const submitCheckIn = async (skipped: boolean) => {
        if (!user || !db || isSubmitting) return

        setIsSubmitting(true)

        try {
            const timeToComplete = Math.floor((Date.now() - startTime) / 1000) // seconds

            // Save to Firestore
            await addDoc(collection(db, 'users', user.uid, 'moods'), {
                moodValue,
                moodPrompt,
                emotionWord,
                emotionCustom,
                emotionWordsShown,
                contextFactors: skipped ? [] : contextFactors,
                skippedContext: skipped,
                timeToComplete,
                value: moodValue, // For compatibility with old system
                average: moodValue, // For compatibility with old system
                createdAt: Timestamp.now()
            })

            // Generate insights
            const userInsights = await generateInsights(user.uid)
            setInsights(userInsights)

            // Clear localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('checkInProgress')
            }

            // Move to completion
            setCurrentStep('complete')

        } catch (error) {
            console.error('Error saving check-in:', error)
            alert('Failed to save check-in. Please try again.')
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        if (currentStep === 'emotion') setCurrentStep('mood')
        else if (currentStep === 'context') setCurrentStep('emotion')
        else router.back()
    }

    const getProgressWidth = () => {
        switch (currentStep) {
            case 'mood': return '33%'
            case 'emotion': return '66%'
            case 'context': return '100%'
            default: return '0%'
        }
    }

    if (authLoading || !user) {
        return <div className="min-h-screen bg-[#030305]" />
    }

    if (currentStep === 'complete') {
        return <CheckInConfirmation moodValue={moodValue} userId={user.uid} insights={insights} />
    }

    const contextOptions = getDailyContextOptions()

    return (
        <div className="min-h-screen bg-[#030305] text-white font-sans overflow-hidden relative selection:bg-white/20">
            {/* Background gradient */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-indigo-500/5 blur-[80px] md:blur-[120px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="relative z-50 flex items-center justify-between px-6 md:px-8 py-6 md:py-8">
                <button
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all text-white/40 hover:text-white disabled:opacity-30"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Progress bar */}
                <div className="flex-1 max-w-xs mx-auto">
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-500"
                            initial={{ width: '0%' }}
                            animate={{ width: getProgressWidth() }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                <div className="w-10" /> {/* Spacer */}
            </nav>

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-6 pb-8">
                <AnimatePresence mode="wait">
                    {currentStep === 'mood' && (
                        <motion.div
                            key="mood"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <MoodSlider
                                value={moodValue}
                                onChange={setMoodValue}
                                prompt={moodPrompt}
                            />

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex justify-center mt-12"
                            >
                                <button
                                    onClick={handleMoodContinue}
                                    className="px-10 py-4 bg-white text-black rounded-full font-medium text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-lg"
                                >
                                    Continue →
                                </button>
                            </motion.div>
                        </motion.div>
                    )}

                    {currentStep === 'emotion' && (
                        <motion.div
                            key="emotion"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <EmotionPicker
                                emotionWords={emotionWordsShown}
                                selectedEmotion={emotionWord}
                                onSelect={handleEmotionSelect}
                            />

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex justify-center mt-12"
                            >
                                <button
                                    onClick={handleEmotionContinue}
                                    disabled={!emotionWord}
                                    className="px-10 py-4 bg-white text-black rounded-full font-medium text-sm uppercase tracking-wider hover:scale-105 transition-transform shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    Continue →
                                </button>
                            </motion.div>
                        </motion.div>
                    )}

                    {currentStep === 'context' && (
                        <motion.div
                            key="context"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full"
                        >
                            <ContextSelector
                                contextOptions={contextOptions}
                                selectedFactors={contextFactors}
                                onToggle={handleContextToggle}
                                onSkip={handleContextSkip}
                            />

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex justify-center mt-8"
                            >
                                <button
                                    onClick={handleContextContinue}
                                    disabled={isSubmitting}
                                    className="px-10 py-4 bg-indigo-500 text-white rounded-full font-medium text-sm uppercase tracking-wider hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save & Continue →'}
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
