'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Heart, Users, Calendar, DollarSign, CheckCircle, Loader, Lock } from 'lucide-react'
import { useFeatureGate } from '@/hooks/useFeatureGate'
import BackButton from '@/components/ui/BackButton'

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

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [step])

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

            {/* Progress Bar - Glass Style */}
            {step !== 'welcome' && step !== 'processing' && (
                <div className="fixed top-[70px] left-0 right-0 z-40 flex justify-center pointer-events-none">
                    <div className="bg-[#030305]/80 backdrop-blur-xl border border-white/5 rounded-full px-6 py-2 flex items-center gap-4 shadow-xl pointer-events-auto">
                        <span className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Matching</span>
                        <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress[step]}%` }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            />
                        </div>
                        <span className="text-[10px] text-white/90 font-bold">{progress[step]}%</span>
                    </div>
                </div>
            )}

            <main className="relative z-10 pt-32 pb-40 px-6">
                <div className="max-w-2xl mx-auto">
                    <AnimatePresence mode="wait">

                        {/* Welcome Screen */}
                        {step === 'welcome' && (
                            <motion.div
                                key="welcome"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5 }}
                                className="text-center py-8"
                            >
                                <motion.div
                                    className="w-40 h-40 mx-auto mb-10 relative"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[40px] animate-pulse" />
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="w-full h-full relative z-10"
                                    >
                                        <Image
                                            src="/images/therapist-character.png"
                                            alt="Therapist Character"
                                            width={160}
                                            height={160}
                                            className="w-full h-full object-contain drop-shadow-2xl"
                                        />
                                    </motion.div>
                                </motion.div>
                                <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-white tracking-tight">
                                    Find Your <span className="italic text-indigo-300">Guide</span>
                                </h1>
                                <p className="text-white/40 text-lg mb-12 max-w-md mx-auto leading-relaxed font-light">
                                    Answer a few quick questions to get matched with licensed professionals who truly understand your needs.
                                </p>
                                <button
                                    onClick={() => handleNext('concern')}
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">Get Started <ArrowRight size={16} /></span>
                                </button>
                                <p className="text-[10px] text-white/40 mt-8 font-bold uppercase tracking-widest">Takes about 2 minutes</p>
                            </motion.div>
                        )}

                        {/* Question 1: Primary Concern */}
                        {step === 'concern' && (
                            <motion.div
                                key="concern"
                                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="py-4"
                            >
                                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-center text-white">What brings you here?</h2>
                                <p className="text-white/40 text-center mb-12 font-light">Select what resonates most with you right now</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                    {concerns.map((concern, i) => (
                                        <motion.button
                                            key={concern.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + (i * 0.05) }}
                                            onClick={() => updateAnswer('concern', concern.id)}
                                            className={`p-8 rounded-[24px] transition-all duration-300 text-center border relative overflow-hidden group ${answers.concern === concern.id
                                                ? 'bg-white text-black border-transparent shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                                : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10 text-white/50 hover:text-white'
                                                }`}
                                        >
                                            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{concern.icon}</div>
                                            <div className="text-xs font-bold uppercase tracking-widest">{concern.label}</div>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => handleNext('format')}
                                        disabled={!answers.concern}
                                        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full font-bold text-xs uppercase tracking-widest disabled:opacity-30 disabled:hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Question 2: Format */}
                        {step === 'format' && (
                            <motion.div
                                key="format"
                                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="py-4"
                            >
                                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-center text-white">Preferred Format</h2>
                                <p className="text-white/40 text-center mb-12 font-light">How would you like to connect with your therapist?</p>

                                <div className="space-y-4 mb-12">
                                    {formats.map((format, i) => (
                                        <motion.button
                                            key={format.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + (i * 0.05) }}
                                            onClick={() => updateAnswer('format', format.id)}
                                            className={`w-full p-6 px-8 rounded-[24px] transition-all duration-300 text-left border flex items-center justify-between group ${answers.format === format.id
                                                ? 'bg-white text-black border-transparent shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                                : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10'
                                                }`}
                                        >
                                            <div>
                                                <div className={`text-sm font-bold uppercase tracking-wide mb-1 ${answers.format === format.id ? 'text-black' : 'text-white'}`}>{format.label}</div>
                                                <div className={`text-xs font-medium ${answers.format === format.id ? 'text-black/60' : 'text-white/40'}`}>{format.description}</div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${answers.format === format.id ? 'border-black' : 'border-white/20'}`}>
                                                {answers.format === format.id && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => handleNext('concern')}
                                        className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                    <button
                                        onClick={() => handleNext('schedule')}
                                        disabled={!answers.format}
                                        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full font-bold text-xs uppercase tracking-widest disabled:opacity-30 disabled:hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Question 3: Schedule */}
                        {step === 'schedule' && (
                            <motion.div
                                key="schedule"
                                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="py-4"
                            >
                                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-center text-white">Your Availability</h2>
                                <p className="text-white/40 text-center mb-12 font-light">When is the best time for your sessions?</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                    {schedules.map((schedule, i) => (
                                        <motion.button
                                            key={schedule.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + (i * 0.05) }}
                                            onClick={() => updateAnswer('schedule', schedule.id)}
                                            className={`p-8 rounded-[24px] transition-all duration-300 text-center border relative overflow-hidden group ${answers.schedule === schedule.id
                                                ? 'bg-white text-black border-transparent shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                                : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10 text-white/50 hover:text-white'
                                                }`}
                                        >
                                            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{schedule.icon}</div>
                                            <div className="text-xs font-bold uppercase tracking-widest">{schedule.label}</div>
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => handleNext('format')}
                                        className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                    <button
                                        onClick={() => handleNext('budget')}
                                        disabled={!answers.schedule}
                                        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full font-bold text-xs uppercase tracking-widest disabled:opacity-30 disabled:hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Question 4: Budget */}
                        {step === 'budget' && (
                            <motion.div
                                key="budget"
                                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
                                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                className="py-4"
                            >
                                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4 text-center text-white">Budget Preference</h2>
                                <p className="text-white/40 text-center mb-12 font-light">Select a range that you are comfortable with</p>

                                <div className="space-y-4 mb-12">
                                    {budgets.map((budget, i) => (
                                        <motion.button
                                            key={budget.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 + (i * 0.05) }}
                                            onClick={() => updateAnswer('budget', budget.id)}
                                            className={`w-full p-6 px-8 rounded-[24px] transition-all duration-300 text-left border flex items-center justify-between group ${answers.budget === budget.id
                                                ? 'bg-white text-black border-transparent shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                                : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-white/10'
                                                }`}
                                        >
                                            <div className={`font-bold text-sm tracking-wide ${answers.budget === budget.id ? 'text-black' : 'text-white'}`}>{budget.label}</div>
                                            {answers.budget === budget.id && <CheckCircle size={20} className="text-black" />}
                                        </motion.button>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => handleNext('schedule')}
                                        className="text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                                    >
                                        <ArrowLeft size={14} /> Back
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!answers.budget}
                                        className="px-10 py-4 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2"
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
                                className="text-center py-32"
                            >
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                                    <Loader size={64} className="text-indigo-400 animate-spin relative z-10" />
                                </div>
                                <h2 className="text-3xl font-serif font-medium mb-3 text-white">Curating Your Matches</h2>
                                <p className="text-white/30 text-sm font-light uppercase tracking-widest animate-pulse">Analyzing compatibility...</p>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}
