'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Lenis from 'lenis'
import { useAuth } from '@/hooks/useAuth'
import AaraSignature from '@/components/ui/AaraSignature'
// Lucide imports removed

// ================= PREMIUM SCROLL ANIMATIONS =================

const springConfig = { stiffness: 100, damping: 30, mass: 1 }
const smoothSpring = { stiffness: 50, damping: 20, mass: 0.5 }

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const stagger = {
    visible: { transition: { staggerChildren: 0.12 } }
}

// Parallax Section Component - creates depth effect on scroll
const ParallaxSection = ({
    children,
    speed = 0.5,
    className = ''
}: {
    children: React.ReactNode
    speed?: number
    className?: string
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    })
    const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
    const smoothY = useSpring(y, smoothSpring)

    return (
        <motion.div ref={ref} style={{ y: smoothY }} className={className}>
            {children}
        </motion.div>
    )
}

// Progressive Scroll Reveal with scale
const ScrollReveal = ({
    children,
    delay = 0,
    className = '',
    scale = true
}: {
    children: React.ReactNode
    delay?: number
    className?: string
    scale?: boolean
}) => {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: '-80px' })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30, scale: scale ? 0.97 : 1 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: scale ? 0.97 : 1 }}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
                scale: { duration: 1 }
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Simple reveal for backward compatibility
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
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={className}
    >
        {children}
    </motion.div>
)

// ================= MAIN COMPONENT =================

export default function LandingPage() {
    const { user } = useAuth()
    const heroRef = useRef<HTMLElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const [compassTab, setCompassTab] = useState<'loop' | 'path'>('loop')

    // Smooth scroll (Lenis)
    // Smooth scroll (Lenis) - Optimized configuration
    useEffect(() => {
        // Only enable Lenis on non-touch devices for native feel on mobile
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
        if (isTouch) return

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        })
        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
        return () => lenis.destroy()
    }, [])

    // Hero parallax
    const { scrollYProgress: heroProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start']
    })
    const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0.4])
    const heroScale = useTransform(heroProgress, [0, 0.8], [1, 0.98])
    const heroY = useTransform(heroProgress, [0, 1], [0, 50])
    const smoothHeroOpacity = useSpring(heroOpacity, springConfig)
    const smoothHeroScale = useSpring(heroScale, springConfig)
    const smoothHeroY = useSpring(heroY, smoothSpring)

    // Global scroll for background effects
    const { scrollYProgress } = useScroll()
    const bgY1 = useTransform(scrollYProgress, [0, 1], [0, -200])
    const bgY2 = useTransform(scrollYProgress, [0, 1], [0, -100])
    const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 0.7, 0.5, 0.3])
    const smoothBgY1 = useSpring(bgY1, smoothSpring)
    const smoothBgY2 = useSpring(bgY2, smoothSpring)

    return (
        <div
            ref={containerRef}
            className="min-h-screen text-white bg-[#000000] antialiased overscroll-y-none touch-pan-y selection:bg-indigo-500/30 selection:text-white"
            style={{ scrollBehavior: 'smooth' }}
        >

            {/* Scroll-Reactive Gradient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Main gradient - moves slower */}
                <motion.div
                    style={{ y: smoothBgY1, opacity: bgOpacity }}
                    className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[140%] h-[100vh] bg-[radial-gradient(ellipse_50%_80%_at_50%_-20%,rgba(120,119,198,0.15),transparent)] will-change-transform"
                />
                {/* Secondary orb - moves at different speed */}
                <motion.div
                    style={{ y: smoothBgY2 }}
                    className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(99,102,241,0.08),transparent_70%)] will-change-transform"
                />
                {/* Third orb */}
                <motion.div
                    style={{ y: smoothBgY1 }}
                    className="absolute top-[50%] right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(139,92,246,0.06),transparent_70%)] will-change-transform"
                />
                {/* Bottom fade */}
                <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-black to-transparent" />
            </div>

            {/* Nav */}
            <motion.nav
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 lg:px-12 py-4 lg:py-5"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image src="/aara-logo.png" alt="AARA" width={36} height={36} className="rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" priority sizes="36px" />
                        <span className="font-medium text-[17px] tracking-tight text-white/80 group-hover:text-white transition-colors">AARA</span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link href="#features" className="text-[13px] text-white/40 hover:text-white transition-colors hidden md:block">Features</Link>
                        <Link href="#how-it-works" className="text-[13px] text-white/40 hover:text-white transition-colors hidden md:block">How it works</Link>
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
            </motion.nav>

            {/* ================= HERO ================= */}
            <motion.section
                ref={heroRef}
                style={{ opacity: smoothHeroOpacity, scale: smoothHeroScale, y: smoothHeroY }}
                className="relative z-10 min-h-screen flex items-center px-6 lg:px-12 pt-24"
            >
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-32 items-center">

                        {/* Left: Copy */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={stagger}
                            className="text-left"
                        >
                            <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8">
                                <AaraSignature variant="origin" className="text-indigo-400 w-[13px] h-[13px]" />
                                <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40">aara Pre-Therapy Companion</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, filter: 'blur(12px)', y: 24 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
                                className="text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[1.05] tracking-[-0.03em] mb-8"
                            >
                                Clarity before<br />
                                <span className="text-white/30">the session.</span>
                            </motion.h1>

                            <motion.p
                                variants={fadeUp}
                                className="text-[19px] text-white/40 max-w-[480px] leading-relaxed font-light mb-12"
                            >
                                AARA helps you organize your thoughts before therapy — so your therapist
                                understands you faster, and your sessions go deeper.
                            </motion.p>

                            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-start will-change-transform">
                                <Link
                                    href="/try"
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full text-[16px] font-medium transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
                                >
                                    Prepare for your session
                                    <AaraSignature variant="arrow" className="group-hover:translate-x-0.5 transition-transform w-[18px] h-[18px]" />
                                </Link>
                                <Link
                                    href="#how-it-works"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[15px] text-white/50 hover:text-white hover:bg-white/[0.04] transition-all"
                                >
                                    See how it works
                                </Link>
                            </motion.div>
                        </motion.div>




                        {/* Mobile Hero Visual: Subtle Aurora Glow */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none lg:hidden mix-blend-screen"
                        />

                        {/* Right: System Flow Visual */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="relative hidden lg:block"
                        >
                            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
                                {/* Connection Line with Ethereal Glow */}
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
                                    {/* Base faint line */}
                                    <path
                                        d="M 50 60 C 150 60, 320 80, 350 140 C 370 200, 150 300, 110 350"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.03)"
                                        strokeWidth="1"
                                        mask="url(#card-mask)"
                                    />
                                    {/* Moving light beat */}
                                    <motion.path
                                        d="M 50 60 C 150 60, 320 80, 350 140 C 370 200, 150 300, 110 350"
                                        fill="none"
                                        stroke="url(#gradient-line)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 0.3, opacity: 1, pathOffset: [0, 1] }}
                                        transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
                                        mask="url(#card-mask)"
                                    />
                                </svg>

                                {/* 1. Capture (Top Left) */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    style={{ y: useTransform(heroProgress, [0, 1], [0, -30]) }}
                                    className="absolute top-[5%] left-[0%] w-[210px] p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-[0_0_30px_-10px_rgba(99,102,241,0.2)] z-10"
                                >
                                    <div className="flex items-center gap-2.5 mb-2.5">
                                        <div className="w-7 h-7 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/10 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
                                            <AaraSignature variant="message" className="text-indigo-300 w-[13px] h-[13px]" />
                                        </div>
                                        <span className="text-[10px] font-medium text-indigo-200/50 uppercase tracking-widest">Capture</span>
                                    </div>
                                    <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.02]">
                                        <p className="text-[13px] text-white/60 italic font-light leading-snug">"Anxious about the review..."</p>
                                    </div>
                                </motion.div>

                                {/* 2. Understand (Right Middle) */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.2 }}
                                    style={{ y: useTransform(heroProgress, [0, 1], [0, -50]) }}
                                    className="absolute top-[32%] right-[0%] w-[230px] p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)] z-20"
                                >
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
                                                <p className="text-[13px] text-white/80 font-medium leading-snug">
                                                    Performance anxiety leading to avoidance.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 3. Prepare (Bottom Left) */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 1.6 }}
                                    style={{ y: useTransform(heroProgress, [0, 1], [0, -70]) }}
                                    className="absolute bottom-[5%] left-[10%] w-[240px] p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] shadow-[0_0_30px_-10px_rgba(16,185,129,0.2)] z-30"
                                >
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
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                        </div>
                                        <span className="text-[11px] font-medium text-emerald-200/80">Ready for session</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    style={{ opacity: useTransform(heroProgress, [0, 0.2], [1, 0]) }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 group"
                    onClick={() => {
                        const featuresSection = document.getElementById('features');
                        featuresSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <motion.svg
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white/20 group-hover:text-white/40 transition-colors"
                    >
                        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                </motion.div>
            </motion.section>

            {/* ================= FEATURES ================= */}
            <section id="features" className="relative z-10 min-h-screen flex items-center px-4 md:px-6 lg:px-12 py-16 lg:py-24 content-auto">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
                        {/* Header Area */}
                        <div className="text-center lg:text-left">
                            <Reveal>
                                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8">
                                    <AaraSignature variant="system" className="text-indigo-400 w-[13px] h-[13px]" />
                                    <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40">The System</span>
                                </div>
                                <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.03em] mb-6">
                                    A simple system for<br />
                                    <span className="text-white/30">pre-therapy clarity.</span>
                                </h2>
                                <p className="text-[17px] text-white/40 max-w-[420px] mx-auto lg:mx-0 leading-relaxed font-light mb-10">
                                    Each step builds on the last. Each insight compounds.
                                </p>
                            </Reveal>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { num: '01', label: 'CAPTURE', title: 'Capture the signal.', desc: 'Daily check-ins track emotional fluctuations. 30 seconds is all it takes.', accent: 'indigo' },
                                { num: '02', label: 'CONTEXT', title: 'Add Meaning', desc: 'Journal the why behind the what. One line or a full entry — your choice.', accent: 'purple' },
                                { num: '03', label: 'PROCESS', title: 'Reflect with Guidance', desc: 'Talk through emotions with a structured AI companion designed for reflection, not advice.', accent: 'blue' },
                                { num: '04', label: 'INSIGHT', title: 'See What Matters', desc: 'AARA surfaces patterns, themes, and shifts that are easy to miss day-to-day.', accent: 'cyan' },
                                { num: '05', label: 'SHARE', title: 'Bring Clarity to Sessions', desc: 'Generate clear, clinical-style summaries your therapist can review before you speak.', accent: 'emerald' },
                                { num: '06', label: 'PROGRESS', title: 'Track Growth Over Time', desc: 'See progress across sessions — milestones, streaks, and long-term change.', accent: 'amber' },
                            ].map((feature, i) => (
                                <ScrollReveal key={i} delay={i * 0.05}>
                                    <div className={`group relative p-6 rounded-3xl border transition-all duration-500 h-full ${i === 0 ? 'bg-white/[0.06] border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : 'bg-gradient-to-b from-white/[0.04] to-white/[0.01] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1]'}`}>
                                        <div className={`absolute inset-0 bg-gradient-to-br from-${feature.accent}-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`} />
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[11px] font-medium text-white/30 tracking-widest">{feature.num}</span>
                                                <span className="text-[9px] font-medium text-white/20 tracking-[0.2em] uppercase">{feature.label}</span>
                                            </div>
                                            {i === 0 && <span className="text-[9px] uppercase tracking-widest text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">Start Here</span>}
                                        </div>
                                        <h3 className="text-[17px] font-medium text-white/90 mb-2 relative z-10">{feature.title}</h3>
                                        <p className="text-[14px] text-white/40 leading-relaxed font-light relative z-10">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= HOW IT WORKS ================= */}
            <section id="how-it-works" className="relative z-10 min-h-screen flex items-center px-4 md:px-6 lg:px-12 py-16 lg:py-24 border-t border-white/[0.04] content-auto">
                <div className="max-w-7xl mx-auto w-full">
                    <Reveal className="text-center mb-20 lg:mb-32">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8">
                            <AaraSignature variant="process" className="text-indigo-400 w-[13px] h-[13px]" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40">The Process</span>
                        </div>
                        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.03em] mb-6">
                            How AARA Works
                        </h2>
                        <p className="text-[17px] text-white/40 max-w-[420px] mx-auto leading-relaxed font-light">
                            Four simple steps to transform your therapy experience.
                        </p>
                    </Reveal>


                    <div className="relative pl-8 md:pl-0 border-l border-white/[0.08] md:border-none ml-4 md:ml-0 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 space-y-12 md:space-y-0">
                        {[
                            { num: '01', title: 'Check In', variant: 'checkin', desc: 'Track your emotional baseline in seconds. No complex forms, just pure signal.' },
                            { num: '02', title: 'Reflect', variant: 'reflect', desc: 'Add context to understand the why behind your mood. One line or a full entry.' },
                            { num: '03', title: 'Insights', variant: 'insights', desc: 'AARA spots patterns and themes you might miss, connecting the dots over time.' },
                            { num: '04', title: 'Share', variant: 'outcomes', desc: 'Generate clear, clinical summaries to send to your therapist before sessions.' },
                        ].map((step, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <div className="group relative h-auto min-h-[180px] md:h-[420px] p-6 md:p-8 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06] hover:bg-white/[0.04] active:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-700 flex flex-col justify-between overflow-hidden transform-gpu backface-hidden active:scale-[0.99] md:active:scale-[0.98]">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                    {/* Mobile Timeline Dot */}
                                    <div className="absolute -left-[45px] top-8 w-3 h-3 rounded-full bg-indigo-500 border-[3px] border-black md:hidden shadow-[0_0_10px_rgba(99,102,241,0.5)] z-20" />

                                    {/* Top: Icon & Number */}
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover:bg-white/[0.1] transition-colors duration-500">
                                            {/* @ts-ignore */}
                                            <AaraSignature variant={step.variant as any} className="text-white/40 group-hover:text-white transition-colors duration-500 w-[24px] h-[24px]" />
                                        </div>
                                        <span className="text-[12px] font-medium tracking-widest text-white/20 group-hover:text-white/40 transition-colors duration-500">
                                            STEP {step.num}
                                        </span>
                                    </div>

                                    {/* Bottom: Content */}
                                    <div className="relative z-10 transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500 mt-8 md:mt-0">
                                        <h3 className="text-[22px] md:text-[26px] font-medium text-white mb-4 leading-tight group-hover:text-indigo-200 transition-colors duration-500">
                                            {step.title}
                                        </h3>
                                        <p className="text-[15px] text-white/60 md:text-white/50 font-light leading-relaxed md:opacity-60 md:group-hover:opacity-100 transition-opacity duration-500">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= QUOTE ================= */}
            <section className="relative z-10 min-h-screen flex items-center justify-center px-6 lg:px-12 py-48 lg:py-80">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[400px] bg-indigo-500/[0.03] rounded-full blur-[100px]" />
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="relative max-w-5xl mx-auto text-center"
                >
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-12">
                        <AaraSignature variant="truth" className="text-indigo-400 w-[13px] h-[13px]" />
                        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40">The Truth</span>
                    </div>
                    <h2 className="text-[clamp(2.5rem,5.5vw,5rem)] font-medium leading-[1.2] tracking-[-0.03em]">
                        &quot;Most therapy sessions fail<br />
                        not due to lack of care,<br />
                        <span className="text-white/20">but due to lack of clarity.&quot;</span>
                    </h2>
                </motion.div>
            </section>

            {/* ================= COMPARISON ================= */}
            <section className="relative z-10 min-h-screen flex items-center px-4 md:px-6 lg:px-12 py-16 lg:py-24 border-t border-white/[0.04] content-auto">
                <div className="max-w-7xl mx-auto w-full">
                    <Reveal className="text-center mb-20 lg:mb-32">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8">
                            <AaraSignature variant="breakthrough" className="text-indigo-400 w-[13px] h-[13px]" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40">The Breakthrough</span>
                        </div>
                        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.03em] mb-6">
                            Stop looping.<br />
                            <span className="text-white/30">Start moving.</span>
                        </h2>
                        <p className="text-[17px] text-white/40 max-w-[460px] mx-auto leading-relaxed font-light">
                            Traditional therapy often feels like circling the problem. AARA helps you find the exit.
                        </p>
                    </Reveal>



                    {/* Mobile Tabs: Glass Glider */}
                    <div className="flex lg:hidden justify-center mb-10">
                        <div
                            className="relative flex items-center p-1 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300"
                            style={{
                                background: 'rgba(255, 255, 255, 0.06)',
                                boxShadow: 'inset 1px 1px 4px rgba(255, 255, 255, 0.2), inset -1px -1px 6px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.15)'
                            }}
                        >
                            {/* Glider */}
                            <div
                                className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-xl z-0 transition-all duration-500 cubic-[0.37,1.95,0.66,0.56]"
                                style={{
                                    left: compassTab === 'loop' ? '4px' : 'calc(50% + 0px)', // adjusted for padding
                                    transform: compassTab === 'loop' ? 'translateX(0%)' : 'translateX(0%)', // handled by left
                                    background: compassTab === 'loop'
                                        ? 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))'
                                        : 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(168,85,247,0.5))',
                                    boxShadow: compassTab === 'loop'
                                        ? '0 0 10px rgba(255,255,255,0.05) inset'
                                        : '0 0 20px rgba(99,102,241,0.4), 0 0 10px rgba(255,255,255,0.2) inset'
                                }}
                            />

                            <button
                                onClick={() => setCompassTab('loop')}
                                className="relative z-10 flex-1 px-8 py-3 text-[14px] font-semibold tracking-wide transition-colors duration-300 min-w-[120px]"
                                style={{ color: compassTab === 'loop' ? '#fff' : 'rgba(255,255,255,0.4)' }}
                            >
                                The Loop
                            </button>
                            <button
                                onClick={() => setCompassTab('path')}
                                className="relative z-10 flex-1 px-8 py-3 text-[14px] font-semibold tracking-wide transition-colors duration-300 min-w-[120px]"
                                style={{ color: compassTab === 'path' ? '#fff' : 'rgba(255,255,255,0.4)' }}
                            >
                                The Path
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative">
                        {/* LEFT: The Loop */}
                        <Reveal className={`${compassTab === 'loop' ? 'block' : 'hidden'} lg:block h-full`}>
                            <div className="relative p-10 md:p-12 lg:p-16 rounded-[32px] md:rounded-[40px] bg-white/[0.01] border border-white/[0.04] h-full flex flex-col items-center text-center group overflow-hidden transition-all duration-500 hover:bg-white/[0.02] active:scale-[0.99] md:active:scale-[0.98]">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03),transparent_70%)] opacity-50"></div>
                                <div className="relative z-10 mb-10">
                                    <div className="w-24 h-24 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05] group-hover:scale-110 transition-transform duration-700">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/20 group-hover:-rotate-180 transition-transform duration-[2s] ease-in-out w-[36px] h-[36px]">
                                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            <path d="M3 21v-5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-[28px] font-medium text-white/40 mb-6">The Loop</h3>
                                <p className="text-[17px] text-white/30 font-light leading-relaxed max-w-sm mx-auto">Repeating the same stories week after week. Trying to remember how you felt, but getting stuck in the noise.</p>
                            </div>
                        </Reveal>

                        {/* RIGHT: The Path */}
                        <Reveal delay={0.15} className={`${compassTab === 'path' ? 'block' : 'hidden'} lg:block h-full`}>
                            <div className="relative p-10 md:p-12 lg:p-16 rounded-[32px] md:rounded-[40px] bg-white/[0.02] backdrop-blur-xl border border-white/[0.1] h-full flex flex-col items-center text-center group overflow-hidden shadow-[0_0_80px_-20px_rgba(99,102,241,0.2)] transform-gpu backface-hidden active:scale-[0.99] md:active:scale-[0.98]">
                                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent opacity-60"></div>
                                <div className="relative z-10 mb-10">
                                    <div className="w-24 h-24 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.3)] group-hover:scale-110 transition-transform duration-500">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-300 w-[36px] h-[36px]">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"></circle>
                                            <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-[28px] font-medium text-white mb-6">The Path</h3>
                                <p className="text-[17px] text-white/80 font-normal leading-relaxed max-w-sm mx-auto">AARA joins the dots between your feelings. You walk into therapy knowing the destination.</p>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* ================= WHO IS IT FOR ================= */}
            <section className="relative z-10 min-h-screen flex items-center px-4 md:px-6 lg:px-12 py-16 lg:py-24 content-auto">
                <div className="max-w-7xl mx-auto w-full">
                    <Reveal className="text-center mb-20 lg:mb-32">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] mb-8">
                            <AaraSignature variant="community" className="text-indigo-400 w-[13px] h-[13px]" />
                            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40">For You</span>
                        </div>
                        <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[1.08] tracking-[-0.03em]">
                            Who is AARA for?
                        </h2>
                    </Reveal>
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            { title: 'Already in therapy', desc: 'Tired of spending half the session catching up. You want to go deeper, faster.' },
                            { title: 'Struggling to explain', desc: 'Never sought help because you don\'t know where to start. AARA is a safe place to begin.' },
                            { title: 'Preparing for first therapy', desc: 'Considering therapy but scared of being unprepared. AARA helps you organize first.' }
                        ].map((p, i) => (
                            <ScrollReveal key={i} delay={i * 0.08}>
                                <div className="group relative p-10 lg:p-14 rounded-3xl bg-white/[0.02] backdrop-blur-md border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 h-full flex flex-col justify-center min-h-[300px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                                    <h3 className="text-[20px] font-medium mb-4 text-white/90 relative z-10">{p.title}</h3>
                                    <p className="text-[17px] text-white/50 leading-relaxed font-light relative z-10 group-hover:text-white/70 transition-colors">{p.desc}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= TRUST & CTA ================= */}
            <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 md:px-6 lg:px-12 py-16 lg:py-24 border-t border-white/[0.04] content-auto">
                <div className="max-w-4xl mx-auto text-center">


                    <Reveal>
                        <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.08] tracking-[-0.03em] mb-12">
                            Ready to feel understood<br />
                            <span className="text-white/30">in your next session?</span>
                        </h2>
                        <Link
                            href="/try"
                            className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full text-[16px] font-medium transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02]"
                        >
                            Prepare for your session
                            <AaraSignature variant="arrow" className="group-hover:translate-x-0.5 transition-transform w-[18px] h-[18px]" />
                        </Link>

                        <div className="mt-24 pt-12 border-t border-white/[0.04]">
                            <div className="flex flex-wrap justify-center gap-12 md:gap-20 mb-12 opacity-100 transform-none">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/35 w-[18px] h-[18px]">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5"></path>
                                            <circle cx="12" cy="16" r="1.5" fill="currentColor"></circle>
                                        </svg>
                                    </div>
                                    <span className="text-[15px] text-white/50 font-medium">End-to-end encrypted</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/35 w-[18px] h-[18px]">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"></path>
                                            <path d="M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                        </svg>
                                    </div>
                                    <span className="text-[15px] text-white/50 font-medium">HIPAA compliant</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/35 w-[18px] h-[18px]">
                                            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V10h-2V5.73A2 2 0 0 1 12 2z" fill="currentColor"></path>
                                            <path d="M6 10a2 2 0 0 1 1.73-1H16.27A2 2 0 0 1 18 10v0c0 .74-.4 1.39-1 1.73v9.54c.6.34 1 .99 1 1.73v0a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v0c0-.74.4-1.39 1-1.73V11.73A2 2 0 0 1 6 10z" stroke="currentColor" strokeWidth="1.5"></path>
                                            <circle cx="12" cy="15" r="2" stroke="currentColor" strokeWidth="1.5"></circle>
                                        </svg>
                                    </div>
                                    <span className="text-[15px] text-white/50 font-medium">Ethical AI</span>
                                </div>
                            </div>
                            <p className="text-white/20 text-[13px] mb-4">
                                © 2026 AARA Wellness • <Link className="hover:text-white/40 transition-colors" href="/privacy">Privacy</Link> • <Link className="hover:text-white/40 transition-colors" href="/terms">Terms</Link>
                            </p>
                            <p className="text-[12px] text-white/15 max-w-md mx-auto leading-relaxed">AARA is a pre-therapy companion. Not a replacement for therapy, diagnosis, or emergency services.</p>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    )
}
