'use client'

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Brain, Shield, FileText, Sparkles, Activity, BookOpen, X, Ear, Layout, PenTool, CheckCircle2, AlertCircle, MessageSquare, Lock, Search, Bell } from 'lucide-react'
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

const HOW_IT_WORKS = [
    {
        icon: Ear,
        step: '01',
        title: 'Listen',
        desc: 'Vent freely. AARA listens without judgment, picking up on the emotions and nuances you might miss.'
    },
    {
        icon: Layout,
        step: '02',
        title: 'Organize',
        desc: 'We structure your scattered thoughts into clear, coherent summaries and identify recurring patterns.'
    },
    {
        icon: PenTool,
        step: '03',
        title: 'Prepare',
        desc: 'Get a "Therapist-Ready" report to bring to your next session, so you can dive deep immediately.'
    }
]

const AuthBanner = () => {
    const [isVisible, setIsVisible] = React.useState(true)
    const { user } = useAuth()
    const router = useRouter()

    if (user || !isVisible) return null

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 2, duration: 0.8, type: 'spring' }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e12] border-t border-white/10 pb-8 pt-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        >
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
        </motion.div>
    )
}

// Reusable Scroll Reveal Component
const RevealInfo = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
        {children}
    </motion.div>
)

export default function LandingPage() {
    const router = useRouter()
    const { user } = useAuth()
    const { scrollY } = useScroll()
    const backgroundY = useTransform(scrollY, [0, 1000], [0, 300])

    return (
        <div className="min-h-screen text-white flex flex-col items-center justify-start relative overflow-x-hidden">
            {/* Nav (Absolute) */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 0.8, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex items-center gap-3"
                    >
                        <Image src="/aara-logo.png" alt="AARA" width={32} height={32} className="rounded-lg shadow-2xl" priority sizes="32px" />
                        <span className="font-serif text-lg tracking-tight">AARA</span>
                    </motion.div>
                    {!user && (
                        <div className="flex items-center gap-6">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                <Link href="#how-it-works" className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                                    How It Works
                                </Link>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <Link href="/auth/login" className="px-5 py-2.5 rounded-full bg-white text-black border border-white hover:bg-white/90 transition-colors text-xs font-bold uppercase tracking-widest">
                                    Sign In
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="w-full pt-44 pb-20 px-6 relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto min-h-[80vh] justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8 inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mx-auto text-[10px] font-bold uppercase tracking-widest"
                    >
                        <Sparkles size={12} />
                        <span>aara</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-8xl font-medium mb-8 font-serif leading-[1.05] tracking-tight">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="block"
                        >
                            Therapy sessions
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="block text-white/40"
                        >
                            are short.
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="text-lg md:text-xl text-white/50 mb-12 leading-relaxed max-w-2xl mx-auto"
                    >
                        Stop spending therapy trying to explain how you feel.
                        <br className="hidden md:block" />
                        AARA tracks your emotional landscape so you can dive deep immediately.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/try"
                            className="px-10 py-5 bg-white text-black rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_40px_-5px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_-5px_rgba(255,255,255,0.6)]"
                        >
                            Begin Your First Session
                        </Link>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="mt-10 text-[10px] text-white/30 uppercase tracking-widest font-medium"
                    >
                        Trusted by 500+ Early Adopters
                    </motion.p>
                </motion.div>
            </section>

            {/* MARQUEE SECTION */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 1.8, duration: 1 }}
                className="w-full overflow-hidden mb-32 mask-gradient-x pointer-events-none select-none"
            >
                <div className="relative w-full">
                    <div className="flex w-max animate-marquee gap-4">
                        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/5 whitespace-nowrap will-change-transform">
                                <item.icon size={16} className="text-white/50" />
                                <span className="text-sm text-white/70 font-medium">{item.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="w-full max-w-6xl mx-auto px-6 mb-32">
                <RevealInfo>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif mb-4">Your Mental Health Companion</h2>
                        <div className="w-24 h-1 bg-white/10 mx-auto rounded-full" />
                    </div>
                </RevealInfo>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {HOW_IT_WORKS.map((step, i) => (
                        <RevealInfo key={i} delay={i * 0.15}>
                            <div className="relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group hover:-translate-y-2 duration-300">
                                <div className="absolute -top-6 left-8 text-6xl font-serif text-white/5 font-bold group-hover:text-white/10 transition-colors">
                                    {step.step}
                                </div>
                                <div className="mb-6 w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                                    <step.icon size={24} />
                                </div>
                                <h3 className="text-xl font-medium mb-3">{step.title}</h3>
                                <p className="text-white/50 leading-relaxed text-sm">
                                    {step.desc}
                                </p>
                            </div>
                        </RevealInfo>
                    ))}
                </div>

                {/* PRODUCT SHOWCASE */}
                <RevealInfo delay={0.2}>
                    <div className="relative rounded-[3rem] bg-[#0e0e12] border border-white/10 overflow-hidden shadow-2xl mt-32 group">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        <div className="p-8 md:p-12 text-center relative z-10">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6"
                            >
                                <Activity size={12} className="text-indigo-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Live Preview</span>
                            </motion.div>
                            <h3 className="text-3xl md:text-4xl font-serif mb-4">See It In Action</h3>
                            <p className="text-white/40 text-sm max-w-lg mx-auto">Track moods, reflect, and prepare for therapy with AI-powered insights.</p>
                        </div>

                        <div className="relative max-w-5xl mx-auto -mb-20 px-4 md:px-0 transition-transform duration-700 group-hover:-translate-y-4">
                            <div className="relative bg-[#030305] rounded-t-[2rem] border-x border-t border-white/10 shadow-2xl overflow-hidden aspect-[16/10] md:aspect-[16/9]">
                                <div className="h-12 border-b border-white/5 flex items-center px-6 justify-between bg-[#030305]/50 backdrop-blur-md sticky top-0 z-20">
                                    <span className="text-[10px] font-bold tracking-widest text-white/40">AARA INTELLIGENCE</span>
                                    <div className="flex gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500/20" />
                                        <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
                                        <div className="w-2 h-2 rounded-full bg-green-500/20" />
                                    </div>
                                </div>

                                <div className="flex h-full">
                                    {/* Sidebar */}
                                    <div className="w-16 md:w-64 border-r border-white/5 hidden md:flex flex-col p-4 bg-[#030305]">
                                        <div className="space-y-1">
                                            {[
                                                { icon: Brain, label: 'Dashboard', active: true },
                                                { icon: BookOpen, label: 'Journal', active: false },
                                                { icon: Activity, label: 'Analytics', active: false },
                                                { icon: FileText, label: 'Reports', active: false },
                                            ].map((item, i) => (
                                                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl cursor-default ${item.active ? 'bg-white/10 text-white' : 'text-white/40'}`}>
                                                    <item.icon size={16} />
                                                    <span className="text-xs font-medium">{item.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 p-6 md:p-10 overflow-hidden relative">
                                        <div className="flex justify-between items-end mb-8">
                                            <div>
                                                <h4 className="text-2xl font-serif text-white mb-1">Good evening, User</h4>
                                                <p className="text-xs text-white/40">Hope you had a balanced day.</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                            {[
                                                { label: 'Active Days', val: '12/30', color: 'bg-emerald-500/10 text-emerald-400' },
                                                { label: 'Streak', val: '5 Days', color: 'bg-amber-500/10 text-amber-400' },
                                                { label: 'Avg Mood', val: '7.2', color: 'bg-indigo-500/10 text-indigo-400' },
                                                { label: 'Entries', val: '24', color: 'bg-rose-500/10 text-rose-400' },
                                            ].map((stat, i) => (
                                                <div key={i} className={`p-4 rounded-2xl border border-white/5 ${stat.color} bg-opacity-5`}>
                                                    <p className="text-[10px] opacity-60 uppercase tracking-wider mb-1">{stat.label}</p>
                                                    <p className="text-lg font-bold">{stat.val}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/10 to-transparent border border-white/5 mb-8 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-20 animate-pulse">
                                                <Sparkles size={40} className="text-indigo-400" />
                                            </div>
                                            <p className="text-xs font-bold text-indigo-400 mb-2 uppercase tracking-widest">Daily Wisdom</p>
                                            <p className="text-lg font-serif italic text-white/80 max-w-lg leading-relaxed">"Naming what you feel is the first step to understanding it."</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 opacity-50">
                                            <div className="h-32 rounded-2xl bg-white/5 border border-white/5" />
                                            <div className="h-32 rounded-2xl bg-white/5 border border-white/5" />
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0e0e12] to-transparent z-30 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </RevealInfo>
            </section>

            {/* DIFFERENTIATION SECTION */}
            <section className="w-full max-w-6xl mx-auto px-6 mb-32">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <RevealInfo>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif mb-8 leading-tight">
                                Why AARA is <br />
                                <span className="text-white/40">different.</span>
                            </h2>
                            <p className="text-white/50 leading-relaxed text-sm mb-8">
                                Most apps give you generic advice. AARA gives you specific, actionable insight by organizing your own thoughts back to you.
                            </p>
                        </div>
                    </RevealInfo>
                    <RevealInfo delay={0.2}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-[3rem] blur-2xl animate-pulse" />
                            <div className="relative p-1 border border-white/10 rounded-[3rem] bg-[#0e0e12]/50 backdrop-blur-xl">
                                <div className="aspect-square rounded-[2.8rem] bg-[#050505] relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)]" />
                                    <div className="text-center p-8">
                                        <h4 className="text-xl font-serif text-white/80 mb-4">"I usually spend 20 minutes just explaining what's been."</h4>
                                        <p className="text-xs text-white/30 italic mb-6">— Sarah, 29, Beta User</p>
                                        <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto mb-4" />
                                        <p className="text-sm text-indigo-400 font-bold uppercase tracking-widest">With AARA</p>
                                        <p className="text-white/40 mt-2 text-sm">"Here is exactly what I need to focus on today."</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </RevealInfo>
                </div>
            </section>

            {/* COMPARISON */}
            <section className="w-full max-w-6xl mx-auto px-6 mb-32">
                <div className="grid md:grid-cols-2 gap-8">
                    <RevealInfo>
                        <div className="p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/5 opacity-60 hover:opacity-100 transition-opacity">
                            <h3 className="text-lg font-bold text-white/50 mb-8 uppercase tracking-widest">Other Apps</h3>
                            <ul className="space-y-6">
                                {[
                                    'Generic chatbots that feel robotic',
                                    'Simple mood logging without context',
                                    'No structured output for therapy'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 opacity-50">
                                        <X size={20} className="text-red-500 shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </RevealInfo>

                    <RevealInfo delay={0.2}>
                        <div className="p-8 md:p-12 rounded-3xl bg-[#0e0e12] border border-indigo-500/20 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />
                            <h3 className="text-lg font-bold text-indigo-400 mb-8 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles size={16} /> AARA
                            </h3>
                            <ul className="space-y-6 relative z-10">
                                {[
                                    'Guided reflection to untangle your thoughts',
                                    'Therapist-ready summaries (The 1-Page Report)',
                                    'Clinical-grade privacy & encryption'
                                ].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + (i * 0.1) }}
                                        className="flex items-start gap-4"
                                    >
                                        <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                                        <span>{item}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </RevealInfo>
                </div>
            </section>

            {/* TARGET AUDIENCE */}
            <section className="w-full max-w-6xl mx-auto px-6 mb-32">
                <RevealInfo>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif mb-4">Who is AARA for?</h2>
                    </div>
                </RevealInfo>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            label: 'The Therapy Veteran',
                            desc: "You're tired of spending half the session catching your therapist up. You want to go deeper, faster."
                        },
                        {
                            label: 'The Silent Struggler',
                            desc: "You've never sought help because you don't know where to start. AARA gives you a safe, private place to begin."
                        },
                        {
                            label: 'The Newcomer',
                            desc: "You're considering therapy but are scared of showing up unprepared. AARA helps you organize your thoughts first."
                        }
                    ].map((persona, i) => (
                        <RevealInfo key={i} delay={i * 0.1}>
                            <div className="p-8 rounded-3xl bg-[#0e0e12] border border-white/10 hover:border-white/20 transition-colors h-full">
                                <h3 className="text-lg font-bold text-white mb-4">{persona.label}</h3>
                                <p className="text-white/50 leading-relaxed text-sm">
                                    {persona.desc}
                                </p>
                            </div>
                        </RevealInfo>
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="w-full px-6 mb-20 text-center">
                <RevealInfo>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                href="/try"
                                className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-full font-bold text-sm tracking-widest uppercase hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.6)] transition-all inline-block"
                            >
                                BEGIN YOUR FIRST SESSION
                            </Link>
                        </motion.div>
                        <Link
                            href="#how-it-works"
                            className="px-8 py-4 bg-transparent text-white/40 hover:text-white rounded-full font-bold text-xs tracking-widest transition-all"
                        >
                            HOW IT WORKS
                        </Link>
                    </div>
                </RevealInfo>
            </section>

            {/* DISCLAIMER / FOOTER */}
            <footer className="w-full border-t border-white/5 py-12 px-6 bg-black/20">
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
                    <p className="text-white/20 text-xs mb-8">© 2026 AARA Wellness</p>

                    <div className="max-w-xl text-center mx-auto opacity-40 hover:opacity-100 transition-opacity">
                        <details className="group">
                            <summary className="list-none cursor-pointer text-[10px] uppercase tracking-widest font-bold text-white/50 flex items-center justify-center gap-2">
                                <AlertCircle size={10} />
                                Medical Disclaimer
                                <span className="group-open:rotate-180 transition-transform duration-300">▼</span>
                            </summary>
                            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 text-left animate-fade-in">
                                <p className="text-[10px] text-white/50 leading-relaxed">
                                    AARA is an emotional tracking and self-reflection tool. It is not a replacement for professional therapy, psychological intervention, or emergency services. AARA does not provide medical diagnosis, treatment, or advice. If you are in crisis or experiencing a medical emergency, please contact your local emergency services immediately.
                                </p>
                            </div>
                        </details>
                    </div>
                </div>
            </footer>

            <AuthBanner />

            {/* Background Texture */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <motion.div
                    style={{ y: backgroundY }}
                    className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] opacity-50"
                />
                <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-[#0e0e12] to-transparent" />
            </div>
        </div>
    )
}
