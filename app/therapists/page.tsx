'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import { ArrowRight, ArrowLeft, Heart, Users, Calendar, DollarSign, CheckCircle, Loader, Lock } from 'lucide-react'
import { useFeatureGate } from '@/hooks/useFeatureGate'

type Step = 'welcome' | 'concern' | 'format' | 'schedule' | 'budget' | 'processing'

const concerns = [
    { id: 'anxiety', label: 'Anxiety', icon: '😰' },
    { id: 'depression', label: 'Depression', icon: '😔' },
    { id: 'relationships', label: 'Relationships', icon: '💑' },
    { id: 'stress', label: 'Stress & Burnout', icon: '😓' },
    { id: 'trauma', label: 'Trauma', icon: '🌧️' },
    { id: 'other', label: 'Something Else', icon: '💭' },
]

const formats = [
    { id: 'online', label: 'Online Sessions', description: 'Video calls from anywhere' },
    { id: 'in-person', label: 'In-Person', description: 'Face-to-face meetings' },
    { id: 'both', label: 'Either Works', description: 'Flexible with both options' },
]

const schedules = [
    { id: 'weekday', label: 'Weekday Mornings', icon: '🌅' },
    { id: 'weekday-evening', label: 'Weekday Evenings', icon: '🌆' },
    { id: 'weekend', label: 'Weekends', icon: '🌴' },
    { id: 'flexible', label: 'Flexible', icon: '⏰' },
]

const budgets = [
    { id: 'budget-1', label: '$50 - $100 per session' },
    { id: 'budget-2', label: '$100 - $150 per session' },
    { id: 'budget-3', label: '$150 - $200 per session' },
    { id: 'budget-4', label: 'Insurance Covered' },
]

export default function TherapistMatchingPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [step, setStep] = useState<Step>('welcome')
    const [answers, setAnswers] = useState({
        concern: '',
        format: '',
        schedule: '',
        budget: '',
    })

    const updateAnswer = (field: keyof typeof answers, value: string) => {
        setAnswers(prev => ({ ...prev, [field]: value }))
    }

    const handleNext = (nextStep: Step) => {
        setStep(nextStep)
    }

    const handleSubmit = () => {
        setStep('processing')
        // Simulate processing
        setTimeout(() => {
            router.push('/therapists/results')
        }, 2000)
    }

    const progress = {
        welcome: 0,
        concern: 25,
        format: 50,
        schedule: 75,
        budget: 100,
        processing: 100,
    }

    if (loading) return null

    return (
        <div className="min-h-screen bg-[#08080c] text-white selection:bg-blue-500/30">
            <Navbar />

            {/* Progress Bar */}
            {step !== 'welcome' && step !== 'processing' && (
                <div className="fixed top-0 left-0 right-0 z-40 bg-[#08080c] border-b border-white/5">
                    <div className="max-w-2xl mx-auto px-6 py-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Finding Your Match</span>
                            <span className="text-xs text-gray-500 font-bold">{progress[step]}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress[step]}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <main className="pt-32 pb-40 px-6">
                <div className="max-w-xl mx-auto">
                    <AnimatePresence mode="wait">

                        {/* Welcome Screen */}
                        {step === 'welcome' && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center py-12"
                            >
                                <motion.div
                                    className="w-32 h-32 mx-auto mb-8 relative"
                                    initial={{ scale: 0.8, opacity: 0, y: -20 }}
                                    animate={{
                                        scale: 1,
                                        opacity: 1,
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        scale: { duration: 0.5, type: "spring", bounce: 0.4 },
                                        opacity: { duration: 0.5 },
                                        y: {
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }
                                    }}
                                >
                                    <Image
                                        src="/images/therapist-character.png"
                                        alt="Therapist Character"
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-contain"
                                    />
                                </motion.div>
                                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">Find Your Therapist</h1>
                                <p className="text-gray-400 text-base mb-12 max-w-md mx-auto leading-relaxed">
                                    Answer a few quick questions to get matched with licensed professionals who understand your needs.
                                </p>
                                <button
                                    onClick={() => handleNext('concern')}
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-xl font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                                >
                                    Get Started <ArrowRight size={18} />
                                </button>
                                <p className="text-[10px] text-gray-600 mt-8 font-black uppercase tracking-widest">Takes about 2 minutes</p>
                            </motion.div>
                        )}

                        {/* Question 1: Primary Concern */}
                        {step === 'concern' && (
                            <motion.div
                                key="concern"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="py-4"
                            >
                                <h2 className="text-2xl font-bold mb-3 text-center text-white">What brings you here today?</h2>
                                <p className="text-gray-500 text-center mb-10 text-sm">Select what resonates most with you</p>

                                <div className="grid grid-cols-2 gap-3 mb-10">
                                    {concerns.map(concern => (
                                        <button
                                            key={concern.id}
                                            onClick={() => updateAnswer('concern', concern.id)}
                                            className={`p-6 rounded-2xl transition-all text-center ${answers.concern === concern.id
                                                ? 'bg-white text-black shadow-xl ring-2 ring-white'
                                                : 'bg-[#0e0e12] hover:bg-[#111116] text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <div className="text-3xl mb-3">{concern.icon}</div>
                                            <div className="text-xs font-bold uppercase tracking-wider">{concern.label}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleNext('format')}
                                        disabled={!answers.concern}
                                        className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        Next <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Question 2: Format */}
                        {step === 'format' && (
                            <motion.div
                                key="format"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="py-4"
                            >
                                <h2 className="text-2xl font-bold mb-3 text-center text-white">How would you like to meet?</h2>
                                <p className="text-gray-500 text-center mb-10 text-sm">Choose your preferred therapy format</p>

                                <div className="space-y-3 mb-10">
                                    {formats.map(format => (
                                        <button
                                            key={format.id}
                                            onClick={() => updateAnswer('format', format.id)}
                                            className={`w-full p-6 rounded-2xl transition-all text-left ${answers.format === format.id
                                                ? 'bg-white text-black shadow-xl'
                                                : 'bg-[#0e0e12] hover:bg-[#111116]'
                                                }`}
                                        >
                                            <div className={`text-sm font-bold mb-1 ${answers.format === format.id ? 'text-black' : 'text-white'}`}>{format.label}</div>
                                            <div className={`text-xs ${answers.format === format.id ? 'text-gray-600' : 'text-gray-500'}`}>{format.description}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => handleNext('concern')}
                                        className="px-4 py-2 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                                    >
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                    <button
                                        onClick={() => handleNext('schedule')}
                                        disabled={!answers.format}
                                        className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        Next <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Question 3: Schedule */}
                        {step === 'schedule' && (
                            <motion.div
                                key="schedule"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="py-4"
                            >
                                <h2 className="text-2xl font-bold mb-3 text-center text-white">When works best for you?</h2>
                                <p className="text-gray-500 text-center mb-10 text-sm">Select your preferred time</p>

                                <div className="grid grid-cols-2 gap-3 mb-10">
                                    {schedules.map(schedule => (
                                        <button
                                            key={schedule.id}
                                            onClick={() => updateAnswer('schedule', schedule.id)}
                                            className={`p-6 rounded-2xl transition-all text-center ${answers.schedule === schedule.id
                                                ? 'bg-white text-black shadow-xl ring-2 ring-white'
                                                : 'bg-[#0e0e12] hover:bg-[#111116] text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <div className="text-3xl mb-3">{schedule.icon}</div>
                                            <div className="text-xs font-bold uppercase tracking-wider">{schedule.label}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => handleNext('format')}
                                        className="px-4 py-2 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                                    >
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                    <button
                                        onClick={() => handleNext('budget')}
                                        disabled={!answers.schedule}
                                        className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        Next <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Question 4: Budget */}
                        {step === 'budget' && (
                            <motion.div
                                key="budget"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="py-4"
                            >
                                <h2 className="text-2xl font-bold mb-3 text-center text-white">What&apos;s your budget?</h2>
                                <p className="text-gray-500 text-center mb-10 text-sm">Choose a comfortable range</p>

                                <div className="space-y-3 mb-10">
                                    {budgets.map(budget => (
                                        <button
                                            key={budget.id}
                                            onClick={() => updateAnswer('budget', budget.id)}
                                            className={`w-full p-6 rounded-2xl transition-all text-left ${answers.budget === budget.id
                                                ? 'bg-white text-black shadow-xl'
                                                : 'bg-[#0e0e12] hover:bg-[#111116]'
                                                }`}
                                        >
                                            <div className={`font-bold text-sm ${answers.budget === budget.id ? 'text-black' : 'text-gray-200'}`}>{budget.label}</div>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => handleNext('schedule')}
                                        className="px-4 py-2 text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                                    >
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!answers.budget}
                                        className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                                    >
                                        Find My Match <CheckCircle size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Processing Screen */}
                        {step === 'processing' && (
                            <motion.div
                                key="processing"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-20"
                            >
                                <Loader size={40} className="text-blue-500 mx-auto mb-6 animate-spin" />
                                <h2 className="text-2xl font-bold mb-2 text-white">Finding your best matches...</h2>
                                <p className="text-gray-500 text-sm">This will just take a moment</p>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}
