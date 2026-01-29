'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import AaraSignature from '@/components/ui/AaraSignature'
import Lenis from 'lenis'

// ================= LIGHTWEIGHT ANIMATIONS =================

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
}

// Simple reveal - no heavy calculations
const Reveal = ({
    children,
    delay = 0,
    className = ''
}: {
    children: React.ReactNode
    delay?: number
    className?: string
}) => (
    <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
        className={className}
    >
        {children}
    </motion.div>
)

// ================= MAIN COMPONENT =================

export default function LandingPage() {
    const { user } = useAuth()

    // Initialize Lenis smooth scrolling
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)

        return () => {
            lenis.destroy()
        }
    }, [])

    return (
        <div data-smooth-scroll className="min-h-screen text-white bg-[#000000] antialiased selection:bg-indigo-500/30 selection:text-white">

            {/* Static Gradient Background - No scroll tracking */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[140%] h-[100vh] bg-[radial-gradient(ellipse_50%_80%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
                <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(99,102,241,0.06),transparent_70%)]" />
                <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-black to-transparent" />
            </div>

            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 lg:px-12 py-4 lg:py-5 bg-black/50 backdrop-blur-sm border-b border-white/[0.04]">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image src="/aara-logo.png" alt="AARA Prep" width={36} height={36} className="rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" priority sizes="36px" />
                        <div className="flex flex-col">
                            <span className="font-medium text-[15px] tracking-tight text-white/90 group-hover:text-white transition-colors leading-tight">AARA Prep</span>
                            <span className="text-[9px] text-white/30 tracking-wide">by AARA One</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="#how-it-works" className="text-[13px] text-white/40 hover:text-white transition-colors hidden md:block">How it works</Link>
                        <Link href="#benefits" className="text-[13px] text-white/40 hover:text-white transition-colors hidden md:block">Benefits</Link>
                        {!user ? (
                            <Link href="/auth/login" className="text-[13px] px-5 py-2.5 rounded-full text-white/60 hover:text-white hover:bg-white/[0.06] transition-all">
                                Sign In
                            </Link>
                        ) : (
                            <Link href="/" className="text-[13px] px-5 py-2.5 rounded-full bg-white text-black font-medium hover:bg-white/90 transition-colors">
                                Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* ================= HERO ================= */}
            <section className="relative z-10 min-h-screen flex items-center px-6 lg:px-12 pt-24">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                        {/* Left: Copy */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="text-left"
                        >
                            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-8">
                                <AaraSignature variant="origin" className="text-indigo-400 w-[13px] h-[13px]" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/50">Pre-Therapy Companion</span>
                            </motion.div>

                            <motion.h1
                                variants={fadeUp}
                                className="text-[clamp(2.5rem,7vw,5rem)] font-medium leading-[1.08] tracking-[-0.03em] mb-8"
                            >
                                Clarity before<br />
                                <span className="text-white/30">the session.</span>
                            </motion.h1>

                            <motion.p
                                variants={fadeUp}
                                className="text-[18px] text-white/50 max-w-[480px] leading-relaxed font-light mb-10"
                            >
                                AARA Prep helps you organize your thoughts before therapy — so your therapist
                                understands you faster, and your sessions go deeper.
                            </motion.p>

                            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/try"
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full text-[15px] font-semibold transition-all duration-300 hover:bg-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Start Preparing — Free
                                    <AaraSignature variant="arrow" className="group-hover:translate-x-0.5 transition-transform w-[16px] h-[16px]" />
                                </Link>
                                <Link
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-[14px] text-white/50 hover:text-white hover:bg-white/[0.05] transition-all"
                                >
                                    See how it works
                                </Link>
                            </motion.div>

                            {/* Quick Stats */}
                            <motion.div variants={fadeUp} className="flex gap-8 mt-12 pt-8 border-t border-white/[0.06]">
                                <div>
                                    <div className="text-2xl font-semibold text-white">30 sec</div>
                                    <div className="text-[13px] text-white/40">Daily check-in</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-semibold text-white">7 days</div>
                                    <div className="text-[13px] text-white/40">To first insight</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-semibold text-white">100%</div>
                                    <div className="text-[13px] text-white/40">Private & secure</div>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Right: Floating Cards Visual */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                                {/* Connection Line SVG */}
                                <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" viewBox="0 0 400 400">
                                    <defs>
                                        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
                                            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.5)" />
                                            <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                                        </linearGradient>
                                        <mask id="card-mask">
                                            <rect x="0" y="0" width="400" height="400" fill="white" />
                                            <rect x="-10" y="10" width="190" height="120" fill="black" rx="20" />
                                            <rect x="210" y="120" width="200" height="120" fill="black" rx="20" />
                                            <rect x="30" y="300" width="220" height="120" fill="black" rx="20" />
                                        </mask>
                                    </defs>
                                    <path
                                        d="M 50 60 C 150 60, 320 80, 350 140 C 370 200, 150 300, 110 350"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.03)"
                                        strokeWidth="1"
                                        mask="url(#card-mask)"
                                    />
                                    <motion.path
                                        d="M 50 60 C 150 60, 320 80, 350 140 C 370 200, 150 300, 110 350"
                                        fill="none"
                                        stroke="url(#gradient-line)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        mask="url(#card-mask)"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 0.3, opacity: 1, pathOffset: [0, 1] }}
                                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
                                    />
                                </svg>


                                {/* 1. Capture Card (Top Left) */}
                                <div className="absolute top-[5%] left-[0%] w-[210px] p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-[0_0_30px_-10px_rgba(99,102,241,0.2)] z-10">
                                    <div className="flex items-center gap-2.5 mb-2.5">
                                        <div className="w-7 h-7 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
                                            <AaraSignature variant="message" className="text-indigo-300 w-[13px] h-[13px]" />
                                        </div>
                                        <span className="text-[10px] font-medium text-indigo-200/50 uppercase tracking-widest">Capture</span>
                                    </div>
                                    <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.02]">
                                        <p className="text-[13px] text-white/60 italic font-light leading-snug">&quot;Anxious about the review...&quot;</p>
                                    </div>
                                </div>

                                {/* 2. Understand Card (Right Middle) */}
                                <div className="absolute top-[32%] right-[0%] w-[230px] p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)] z-20">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent rounded-2xl opacity-30" />
                                    <div className="relative">
                                        <div className="flex items-center gap-2.5 mb-2.5">
                                            <div className="w-7 h-7 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/10 shadow-[0_0_10px_rgba(168,85,247,0.15)]">
                                                <AaraSignature variant="ai" className="text-purple-300 w-[13px] h-[13px]" />
                                            </div>
                                            <span className="text-[10px] font-medium text-purple-200/50 uppercase tracking-widest">Understand</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="mt-1.5 w-1 h-1 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)] flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-purple-300/40 uppercase tracking-wide mb-0.5">Pattern Noticed</p>
                                                <p className="text-[13px] text-white/80 font-medium leading-snug">Performance anxiety leading to avoidance.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Prepare Card (Bottom Left) */}
                                <div className="absolute bottom-[5%] left-[10%] w-[240px] p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] z-30">
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <div className="w-7 h-7 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/10 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                                            <AaraSignature variant="outcomes" className="text-emerald-300 w-[13px] h-[13px]" />
                                        </div>
                                        <span className="text-[10px] font-medium text-emerald-200/50 uppercase tracking-widest">Prepare</span>
                                    </div>
                                    <div className="space-y-1.5 mb-3">
                                        <div className="h-1 w-full rounded-full bg-white/[0.06]" />
                                        <div className="h-1 w-4/5 rounded-full bg-white/[0.04]" />
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 w-fit">
                                        <div className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                                        </div>
                                        <span className="text-[11px] font-medium text-emerald-200/80">Ready for session</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section id="how-it-works" className="relative z-10 px-4 md:px-6 lg:px-12 py-24 lg:py-32">
                <div className="max-w-7xl mx-auto">
                    <Reveal className="text-center mb-16">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
                            <AaraSignature variant="process" className="text-indigo-400 w-[13px] h-[13px]" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/50">Simple Process</span>
                        </div>
                        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em] mb-4">
                            How AARA Prep Works
                        </h2>
                        <p className="text-[16px] text-white/40 max-w-[400px] mx-auto">
                            Four simple steps to transform your therapy experience.
                        </p>
                    </Reveal>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { num: '01', title: 'Check In', icon: 'checkin', desc: 'Track your emotional baseline in 30 seconds. Quick, simple, daily.' },
                            { num: '02', title: 'Reflect', icon: 'reflect', desc: 'Add context through journaling. One line or a full entry.' },
                            { num: '03', title: 'Discover', icon: 'insights', desc: 'AARA Prep spots patterns you might miss day-to-day.' },
                            { num: '04', title: 'Share', icon: 'outcomes', desc: 'Generate clinical summaries for your therapist.' },
                        ].map((step, i) => (
                            <Reveal key={i} delay={i * 0.08}>
                                <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 h-full">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-11 h-11 rounded-xl bg-white/[0.04] flex items-center justify-center border border-white/[0.06] group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                                            {/* @ts-ignore */}
                                            <AaraSignature variant={step.icon as any} className="text-white/50 group-hover:text-indigo-400 transition-colors w-5 h-5" />
                                        </div>
                                        <span className="text-[11px] font-medium tracking-widest text-white/25">{step.num}</span>
                                    </div>
                                    <h3 className="text-[18px] font-medium text-white mb-2 group-hover:text-indigo-200 transition-colors">{step.title}</h3>
                                    <p className="text-[14px] text-white/45 leading-relaxed">{step.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= BENEFITS ================= */}
            <section id="benefits" className="relative z-10 px-4 md:px-6 lg:px-12 py-24 lg:py-32 border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <Reveal>
                            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6">
                                <AaraSignature variant="breakthrough" className="text-indigo-400 w-[13px] h-[13px]" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/50">Why AARA Prep</span>
                            </div>
                            <h2 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] mb-6">
                                Stop spending half your session<br />
                                <span className="text-white/30">catching up.</span>
                            </h2>
                            <p className="text-[16px] text-white/45 leading-relaxed mb-8 max-w-lg">
                                Most people walk into therapy trying to remember what happened during the week.
                                AARA Prep captures it as it happens, so you can focus on what matters.
                            </p>
                            <Link
                                href="/try"
                                className="inline-flex items-center gap-2 text-[15px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                                Try it free
                                <AaraSignature variant="arrow" className="w-4 h-4" />
                            </Link>
                        </Reveal>

                        <div className="grid gap-4">
                            {[
                                { title: 'Better memory', desc: 'Never forget what you wanted to discuss. AARA Prep tracks it all.' },
                                { title: 'Deeper sessions', desc: 'Skip the recap and dive straight into meaningful work.' },
                                { title: 'Clear patterns', desc: 'See connections between events and emotions you missed.' },
                                { title: 'Therapist alignment', desc: 'Share summaries so they understand before you speak.' },
                            ].map((benefit, i) => (
                                <Reveal key={i} delay={i * 0.05}>
                                    <div className="flex gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] transition-colors">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-[15px] font-medium text-white mb-1">{benefit.title}</h3>
                                            <p className="text-[14px] text-white/45">{benefit.desc}</p>
                                        </div>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= WHO IS IT FOR ================= */}
            <section className="relative z-10 px-4 md:px-6 lg:px-12 py-24 lg:py-32">
                <div className="max-w-7xl mx-auto">
                    <Reveal className="text-center mb-16">
                        <h2 className="text-[clamp(2rem,5vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] mb-4">
                            Who is AARA Prep for?
                        </h2>
                    </Reveal>
                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            { title: 'In therapy now', desc: 'Make every session count. No more catching up on what happened.' },
                            { title: 'Considering therapy', desc: 'Start organizing your thoughts before your first appointment.' },
                            { title: 'Self-reflection', desc: 'Understand yourself better, even without a therapist.' },
                        ].map((p, i) => (
                            <Reveal key={i} delay={i * 0.06}>
                                <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-colors h-full">
                                    <h3 className="text-[17px] font-medium mb-3 text-white">{p.title}</h3>
                                    <p className="text-[14px] text-white/45 leading-relaxed">{p.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= FINAL CTA ================= */}
            <section className="relative z-10 px-4 md:px-6 lg:px-12 py-24 lg:py-32 border-t border-white/[0.04]">
                <div className="max-w-3xl mx-auto text-center">
                    <Reveal>
                        <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.02em] mb-8">
                            Ready to feel understood<br />
                            <span className="text-white/30">in your next session?</span>
                        </h2>
                        <Link
                            href="/try"
                            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full text-[15px] font-semibold transition-all duration-300 hover:bg-indigo-100 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Start Preparing — Free
                            <AaraSignature variant="arrow" className="group-hover:translate-x-0.5 transition-transform w-[16px] h-[16px]" />
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="relative z-10 px-4 md:px-6 lg:px-12 py-12 border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                        {/* Trust badges */}
                        <div className="flex flex-wrap justify-center gap-6">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <rect x="3" y="11" width="18" height="11" rx="2" strokeWidth="1.5" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="1.5" />
                                </svg>
                                <span className="text-[13px] text-white/40">End-to-end encrypted</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="1.5" />
                                </svg>
                                <span className="text-[13px] text-white/40">HIPAA compliant</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                                    <path d="M12 8v8M8 12h8" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span className="text-[13px] text-white/40">Ethical AI</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-white/20 text-[13px] mb-3">
                            © 2026 AARA One • <Link className="hover:text-white/40 transition-colors" href="/privacy">Privacy</Link> • <Link className="hover:text-white/40 transition-colors" href="/terms">Terms</Link>
                        </p>
                        <p className="text-[11px] text-white/15 max-w-md mx-auto">
                            AARA Prep is a pre-therapy companion. Not a replacement for therapy, diagnosis, or emergency services.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
