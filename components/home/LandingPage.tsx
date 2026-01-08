'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, useInView, useSpring, useMotionValue } from 'framer-motion'
import { useRef, useEffect } from 'react'
import {
    BookOpen, ArrowRight,
    FileText, Brain, CheckCircle, Users, Star,
    Calendar as CalendarIcon
} from 'lucide-react'

// Animated Waveform - Simple and clean
function AnimatedWaveform() {
    const heights = [
        4, 6, 8, 10, 12, 15, 18, 21, 24, 27, 30, 32, 34, 35, 36, 36, 35, 34, 32, 30, 27, 24, 21, 18, 15, 12, 10, 8, 6, 4
    ]

    return (
        <div className="flex items-center justify-center gap-[3px] h-14">
            {heights.map((h, i) => {
                const center = heights.length / 2
                const distanceFromCenter = Math.abs(i - center) / center
                const opacity = 0.9 - distanceFromCenter * 0.4

                return (
                    <motion.div
                        key={i}
                        className="w-[3px] rounded-full bg-blue-500/50"
                        style={{ opacity }}
                        initial={{ height: h, backgroundColor: 'rgb(59, 130, 246)' }}
                        animate={{
                            height: [h, h * 1.5, h * 0.8, h],
                            backgroundColor: ['rgb(59, 130, 246)', 'rgb(147, 197, 253)', 'rgb(59, 130, 246)']
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            delay: i * 0.08,
                            ease: 'easeInOut'
                        }}
                    />
                )
            })}
        </div>
    )
}

// Scroll reveal component
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: '-20px' })
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98], delay }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

// Animated Counter
function AnimatedCounter({ value, duration = 2, decimals = 0, suffix = '', prefix = '' }: { value: number, duration?: number, decimals?: number, suffix?: string, prefix?: string }) {
    const ref = useRef<HTMLSpanElement>(null)
    const motionValue = useMotionValue(0)
    const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 })
    const isInView = useInView(ref, { once: true, margin: '-20px' })

    useEffect(() => {
        if (isInView) {
            motionValue.set(value)
        }
    }, [motionValue, isInView, value])

    useEffect(() => {
        return springValue.on('change', (latest) => {
            if (ref.current) {
                ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`
            }
        })
    }, [springValue, decimals, suffix, prefix])

    return <span ref={ref}>{prefix}0{suffix}</span>
}

export default function LandingPage() {
    const heroRef = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
    const heroY = useTransform(scrollYProgress, [0, 0.4], [0, 80])

    // Smoother easing
    const easeInOutCubic = [0.65, 0, 0.35, 1]

    return (
        <main className="bg-[#08080c] text-white antialiased selection:bg-blue-500/30">
            <motion.nav
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="fixed top-0 w-full z-50 p-6 flex justify-center pointer-events-none"
            >
                <div className="flex-1 max-w-7xl flex justify-between items-center bg-[#0d0d0d] border border-white/10 rounded-[2rem] px-8 py-4 shadow-2xl pointer-events-auto">
                    <Link href="/" className="flex items-center gap-3">
                        <Image src="/aara-logo.png" alt="AARA" width={32} height={32} className="rounded-lg border border-white/10" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/80 uppercase">AARA</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-12">
                        <a href="#features" className="text-[10px] font-black tracking-widest text-white/30 hover:text-white uppercase transition-all">Features</a>
                        <a href="#how-it-works" className="text-[10px] font-black tracking-widest text-white/30 hover:text-white uppercase transition-all">Method</a>
                        <a href="#testimonials" className="text-[10px] font-black tracking-widest text-white/30 hover:text-white uppercase transition-all">Reviews</a>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/auth/login" className="text-[10px] font-black tracking-widest text-white/30 hover:text-white uppercase transition-all hidden sm:block">Sign In</Link>
                        <Link href="/auth/signup">
                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="bg-white text-black px-6 py-2.5 rounded-xl text-[11px] font-black tracking-widest uppercase hover:bg-gray-100 transition-all shadow-xl shadow-white/5">
                                Start Free
                            </motion.button>
                        </Link>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <motion.section ref={heroRef} style={{ opacity: heroOpacity, y: heroY }}
                className="min-h-screen flex flex-col items-center justify-center px-4 pt-8 relative overflow-hidden"
            >
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: easeInOutCubic, delay: 0.1 }} className="mb-10">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-[10px] tracking-[0.3em] font-black text-blue-400/60 uppercase backdrop-blur-3xl">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute h-full w-full rounded-full bg-blue-400 opacity-20"></span>
                            <span className="relative rounded-full h-2 w-2 bg-blue-400/50"></span>
                        </span>
                        System Active
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: easeInOutCubic, delay: 0.2 }} className="text-center max-w-5xl mx-auto z-10 px-4">
                    <h1 className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-[-0.04em] leading-[0.85] text-white/10 uppercase">
                        Mental Health
                    </h1>
                    <h2 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[1] mt-4 text-white">
                        Signal Processor
                    </h2>
                </motion.div>

                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: easeInOutCubic, delay: 0.4 }}
                    className="text-white/30 text-center mt-12 max-w-xl leading-relaxed text-base sm:text-lg z-10 font-medium px-4">
                    Structure your thoughts before therapy. <br className="hidden sm:block" />
                    Understand your inner world with high-fidelity AI clarity.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: easeInOutCubic, delay: 0.5 }} className="mt-16 z-10 text-center">
                    <Link href="/auth/signup">
                        <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 60px -10px rgba(59,130,246,0.3)' }} whileTap={{ scale: 0.98 }}
                            className="px-12 py-5 bg-white text-black hover:bg-gray-100 rounded-2xl font-black text-[13px] tracking-[0.2em] uppercase transition-all shadow-2xl active:scale-95">
                            Start 3-Day Trial
                        </motion.button>
                    </Link>
                    <p className="text-center text-[9px] text-white/10 mt-6 uppercase tracking-[0.4em] font-black">Private & Encrypted</p>
                </motion.div>

                <div className="absolute inset-0 -z-10 pointer-events-none bg-[#050505]" />
            </motion.section>



            {/* Feature Highlight: Report Generation */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <Reveal>
                            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white">
                                Turn chaotic thoughts into <span className="text-blue-400">structured insights</span>
                            </h2>
                            <p className="text-lg text-gray-400 leading-relaxed mb-8">
                                AARA listens to your stream of consciousness and organizes it into coherent themes.
                                It&apos;s not just a journal; it&apos;s a pre-processor for your mind.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    'Identify recurring emotional patterns',
                                    'Prepare summaries for your therapist',
                                    'Track mood progression over time',
                                    'Private, encrypted, and secure'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300">
                                        <CheckCircle size={18} className="text-blue-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </Reveal>

                        <Reveal delay={0.2} className="relative">
                            <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
                            <div className="relative bg-[#0e0e12] border border-white/10 rounded-2xl p-8 shadow-2xl">
                                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <Brain size={20} className="text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">ANALYSIS COMPLETE</p>
                                        <p className="font-medium text-white">Session Summary</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs text-blue-400 mb-1 uppercase tracking-wider">Theme 1: Anxiety</p>
                                        <p className="text-sm text-gray-300">Recurs when discussing future career prospects. Linked to perfectionism.</p>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-xs text-purple-400 mb-1 uppercase tracking-wider">Theme 2: Family Dynamics</p>
                                        <p className="text-sm text-gray-300">Feeling of responsibility for parents&apos; well-being causing stress.</p>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                            <div className="h-full w-3/4 bg-blue-500 rounded-full" />
                                        </div>
                                        <div className="h-2 w-1/4 bg-gray-800 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* New: Find a Therapist Section */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <Reveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium uppercase tracking-widest mb-6">
                            <Users size={12} /> Partner Network
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Connect with Professionals</h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                            Ready to take the next step? Find verified therapists who are experienced in working with AARA reports to fast-track your progress.
                        </p>

                        <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                            {[
                                { name: 'Dr. Sarah M.', role: 'Psychologist', rating: '4.9', img: 'S' },
                                { name: 'Dr. David K.', role: 'Trauma Specialist', rating: '5.0', img: 'D' },
                                { name: 'Dr. Priya S.', role: 'Family Therapist', rating: '4.8', img: 'P' },
                            ].map((t, i) => (
                                <div key={i} className="bg-[#0e0e12] p-5 rounded-2xl flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-xl text-gray-400 border border-white/10">
                                        {t.img}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">{t.name}</p>
                                        <p className="text-xs text-gray-500">{t.role}</p>
                                    </div>
                                    <div className="ml-auto flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                        <Star size={10} fill="currentColor" /> {t.rating}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/therapists">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 rounded-full text-white font-medium transition-colors flex items-center gap-2 mx-auto"
                            >
                                Browse Therapist Directory <ArrowRight size={18} />
                            </motion.button>
                        </Link>
                    </Reveal>
                </div>
            </section>

            {/* Use Cases */}
            <section id="use-cases" className="py-28 px-6">
                <div className="max-w-5xl mx-auto">
                    <Reveal className="text-center mb-16">
                        <p className="text-purple-400 text-sm font-semibold uppercase tracking-widest mb-4">Use Cases</p>
                        <h3 className="text-3xl md:text-4xl font-bold font-serif">How people use AARA</h3>
                    </Reveal>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: FileText,
                                color: 'blue',
                                title: 'Pre-Therapy',
                                desc: 'Organize scattered thoughts into clear patterns before your session.'
                            },
                            {
                                icon: BookOpen,
                                color: 'indigo',
                                title: 'Private Journal',
                                desc: 'Track moods and identify triggers in a secure, encrypted space.'
                            },
                            {
                                icon: Brain,
                                color: 'purple',
                                title: 'Self-Clarify',
                                desc: 'Process complex emotions anytime you feel overwhelmed.'
                            }
                        ].map((item, i) => (
                            <Reveal key={i} delay={i * 0.1}>
                                <div className={`h-full p-8 rounded-2xl border border-white/10 bg-gradient-to-b from-${item.color}-900/10 to-transparent hover:border-${item.color}-500/30 transition-colors group`}>
                                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <item.icon className={`text-${item.color}-400`} size={24} />
                                    </div>
                                    <h4 className="text-xl font-semibold mb-3">{item.title}</h4>
                                    <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>

                <div className="mt-20 p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-white/5">

                        <div className="flex-1 px-4 text-center">
                            <h3 className="text-4xl font-serif text-white mb-1">
                                <AnimatedCounter value={50} suffix="+" />
                            </h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">Therapists</p>
                        </div>

                        <div className="flex-1 px-4 text-center pt-8 md:pt-0">
                            <h3 className="text-4xl font-serif text-white mb-1">
                                <AnimatedCounter value={10} suffix="k+" />
                            </h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">Sessions</p>
                        </div>

                        <div className="flex-1 px-4 text-center pt-8 md:pt-0">
                            <h3 className="text-4xl font-serif text-white mb-1">
                                <AnimatedCounter value={4.9} decimals={1} />
                            </h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">User Rating</p>
                        </div>

                        <div className="flex-1 px-4 text-center pt-8 md:pt-0">
                            <div className="inline-flex items-center gap-2 mb-1 justify-center">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute h-full w-full rounded-full bg-green-500 opacity-75"></span>
                                    <span className="relative rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <div className="text-xl font-medium text-white flex items-center gap-1">
                                    <AnimatedCounter value={24} suffix="/7" />
                                </div>
                            </div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">Availability</p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-28 px-6 border-t border-white/5">
                <Reveal className="max-w-2xl mx-auto text-center">
                    <h3 className="text-4xl md:text-5xl font-serif font-medium mb-6">Begin your clarity</h3>
                    <p className="text-gray-500 mb-10 text-lg">Start a private session when you are ready. No pressure.</p>
                    <Link href="/auth/signup">
                        <motion.button whileHover={{ scale: 1.03, boxShadow: '0 0 50px -5px rgba(59,130,246,0.4)' }} whileTap={{ scale: 0.98 }}
                            className="px-10 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-semibold text-lg transition-all shadow-[0_0_25px_-5px_rgba(255,255,255,0.3)]">
                            Start 3-Day Free Trial
                        </motion.button>
                    </Link>
                </Reveal>
            </section>



            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 bg-[#050508]">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                        <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-xl tracking-wide">AARA</span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                            <Link href="/about" className="hover:text-white transition-colors">About</Link>
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
                            <Link href="/therapists" className="text-blue-400 hover:text-blue-300 transition-colors">Find Therapist</Link>
                            <Link href="/auth/therapist-login" className="hover:text-white transition-colors">Therapist Login</Link>
                        </div>
                    </div>
                    <div className="text-center text-xs text-gray-700">
                        <p>2025 AARA Intelligence. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </main >
    )
}
