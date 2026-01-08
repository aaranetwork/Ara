'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Shield, FileText, Sparkles, Activity, BookOpen, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

const MARQUEE_ITEMS = [
    { icon: Brain, title: 'AI Analysis', desc: 'Emotional pattern recognition' },
    { icon: Shield, title: 'Private Space', desc: 'Encrypted and confidential' },
    { icon: FileText, title: 'Clinical Reports', desc: 'Exportable professional insights' },
    { icon: Activity, title: 'Mood Tracking', desc: 'Visualize your emotional journey' },
    { icon: BookOpen, title: 'Journaling', desc: 'Reflect on your daily thoughts' },
    { icon: Sparkles, title: 'Growth Tools', desc: 'Build mental resilience' },
]

const AuthBanner = () => {
    const [isVisible, setIsVisible] = React.useState(true)
    const { user } = useAuth()
    const router = useRouter()

    // Don't show if user is logged in or banner is dismissed
    if (user || !isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-t border-white/10 pb-6 pt-6 animate-fade-in-up">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                aria-label="Close"
            >
                <X size={18} />
            </button>
            <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-white text-xl md:text-2xl font-bold mb-1">
                            Start your <span className="text-indigo-400">mental wellness journey</span>
                        </h2>
                        <p className="text-gray-400 text-sm md:text-base hidden md:block">
                            Discover emotional patterns, track moods, and generate clinical reports.
                        </p>
                    </div>

                    <div className="w-full md:w-auto min-w-[200px]">
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="w-full py-3 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-500/20 text-sm md:text-base whitespace-nowrap"
                        >
                            Login / Signup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function WelcomePage() {
    const router = useRouter()
    const { user } = useAuth()

    return (
        <div className="min-h-[100dvh] bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden pb-40">

            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-xl mx-auto text-center relative z-10 flex flex-col h-full justify-center"
            >
                {/* Logo */}
                <div className="mb-8 md:mb-10 flex justify-center">
                    <Image src="/aara-logo.png" alt="AARA" width={64} height={64} className="rounded-xl shadow-lg" />
                </div>

                <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 font-serif leading-tight px-2">
                    Welcome to <span className="text-indigo-400">Aara</span>
                </h1>

                <p className="text-base md:text-lg text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto px-2">
                    AARA is an intelligent companion that helps you process emotions, identify patterns, and generate reports for your therapist.
                </p>

                {/* Infinite Marquee */}
                <div className="w-full relative overflow-hidden mb-12 mask-gradient-x">
                    {/* Gradient Masks for Fade Effeect */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-[#050505] to-transparent" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-[#050505] to-transparent" />

                    <motion.div
                        className="flex gap-4 w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 20
                        }}
                    >
                        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                            <div
                                key={i}
                                className="w-[180px] p-5 rounded-2xl bg-[#0e0e12] border border-white/10 backdrop-blur-md flex flex-col items-center text-center gap-3 shadow-xl"
                            >
                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white mb-1">{item.title}</h3>
                                    <p className="text-[10px] text-gray-500 leading-tight">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        if (user) {
                            router.push('/')
                        } else {
                            router.push('/auth/login')
                        }
                    }}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm tracking-wide uppercase shadow-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
                >
                    Continue <ArrowRight size={18} />
                </motion.button>

                <p className="mt-6 text-[10px] md:text-xs text-gray-600">
                    Your safe space awaits.
                </p>
            </motion.div>

            <AuthBanner />
        </div>
    )
}
