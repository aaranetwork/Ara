'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Brain, Shield, FileText, Sparkles, Activity, BookOpen, X, LayoutTemplate } from 'lucide-react'
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

    if (user || !isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e12] border-t border-white/10 pb-8 pt-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors"
                aria-label="Close"
            >
                <X size={16} />
            </button>
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-white text-lg font-serif font-medium mb-1">
                            Begin your journey
                        </h2>
                        <p className="text-white/40 text-sm hidden md:block">
                            Track moods, reflect, and grow with AI-powered insights.
                        </p>
                    </div>

                    <div className="w-full md:w-auto min-w-[200px]">
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="w-full py-3 px-6 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-all shadow-lg shadow-white/5 text-xs uppercase tracking-wider"
                        >
                            Log In / Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LandingPage() {
    const router = useRouter()
    const { user } = useAuth()

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-center p-6 relative overflow-hidden pb-40">
            {/* Nav (Absolute) */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3 opacity-80">
                        <Image src="/aara-logo.png" alt="AARA" width={32} height={32} className="rounded-lg shadow-2xl" />
                        <span className="font-serif text-lg tracking-tight">AARA</span>
                    </div>
                    {!user && (
                        <Link href="/auth/login" className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest backdrop-blur-md">
                            Sign In
                        </Link>
                    )}
                </div>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-2xl mx-auto text-center relative z-10 flex flex-col h-full justify-center pt-20"
            >
                <div className="mb-8 inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mx-auto text-[10px] font-bold uppercase tracking-widest">
                    <Sparkles size={12} />
                    <span>Consciousness Processor v2.0</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-medium mb-8 font-serif leading-[1.1] tracking-tight">
                    Clarity for your <br />
                    <span className="text-white/40">inner world.</span>
                </h1>

                <p className="text-lg md:text-xl text-white/50 mb-16 leading-relaxed max-w-xl mx-auto">
                    An intelligent companion that helps you process emotions, identify patterns,
                    and translate your thoughts into actionable insights.
                </p>

                {/* Infinite Marquee */}
                <div className="w-full relative overflow-hidden mb-16 mask-gradient-x">
                    <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#030305] to-transparent" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#030305] to-transparent" />

                    <motion.div
                        className="flex gap-4 w-max"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            ease: "linear",
                            duration: 30
                        }}
                        style={{ willChange: 'transform' }}
                    >
                        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                            <div
                                key={i}
                                className="w-[200px] p-6 rounded-[20px] bg-white/[0.02] border border-white/5 backdrop-blur-sm flex flex-col items-center text-center gap-4 hover:bg-white/[0.04] transition-colors group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:scale-110 transition-all">
                                    <item.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-serif text-white/90 mb-1">{item.title}</h3>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider">{item.desc}</p>
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
                            router.push('/onboarding')
                        } else {
                            router.push('/onboarding') // Direct new users to onboarding first
                        }
                    }}
                    className="w-full md:w-auto mx-auto px-10 py-5 bg-white text-black rounded-2xl font-bold text-sm tracking-widest uppercase shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)] hover:bg-gray-100 transition-all flex items-center justify-center gap-3"
                >
                    Start Analysis <ArrowRight size={16} />
                </motion.button>

                <p className="mt-8 text-[10px] text-white/30 uppercase tracking-widest font-medium">
                    Trusted by 10,000+ Minds
                </p>
            </motion.div>

            <AuthBanner />

            {/* Background Elements managed by global layout, but adding local flair */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] opacity-50" />
            </div>
        </div>
    )
}
