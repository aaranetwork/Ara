'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, Lock, ArrowRight, Shield, Users, FileText, CheckCircle } from 'lucide-react'

export default function TherapistLoginPage() {
    const router = useRouter()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        setTimeout(() => {
            setLoading(false)
            setError('Therapist portal coming soon')
        }, 1000)
    }

    return (
        <div className="min-h-screen text-white selection:bg-purple-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />
                <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />
            </div>

            <div className="relative z-10 flex min-h-screen">

                {/* Left Panel - Benefits (Glassmorphism) */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 bg-white/[0.02] backdrop-blur-3xl border-r border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-50" />

                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-3 mb-20 group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Image src="/aara-logo.png" alt="AARA Prep" width={48} height={48} className="relative rounded-2xl shadow-xl" />
                            </div>
                            <span className="font-serif text-2xl tracking-tight text-white/90">AARA</span>
                        </Link>

                        <div className="mb-16">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full mb-8"
                            >
                                <Shield size={14} className="text-purple-300" />
                                <span className="text-purple-200 text-xs font-bold tracking-widest uppercase">For Therapists</span>
                            </motion.div>
                            <h1 className="text-5xl font-serif font-medium mb-6 leading-tight">
                                Professional<br />Dashboard
                            </h1>
                            <p className="text-white/50 text-lg max-w-md leading-relaxed font-light">
                                Access client reports, manage appointments, and streamline your practice with AI-driven insights.
                            </p>
                        </div>

                        <div className="space-y-8">
                            {[
                                { icon: FileText, title: 'Client Reports', desc: 'View structured mental health summaries from AARA' },
                                { icon: Users, title: 'Client Management', desc: 'Track client progress and session history' },
                                { icon: CheckCircle, title: 'Faster Sessions', desc: 'Understand clients better before they walk in' },
                            ].map((item, i) => {
                                const Icon = item.icon
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        className="flex gap-5 group"
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                                            <Icon size={22} className="text-purple-300/80 group-hover:text-purple-300 transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-lg text-white/90 mb-1 group-hover:text-white transition-colors">{item.title}</h3>
                                            <p className="text-white/40 text-sm font-light">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="relative z-10 w-full pt-8 border-t border-white/5">
                        <p className="text-white/30 text-xs uppercase tracking-widest font-bold">
                            Trusted by 500+ mental health professionals
                        </p>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-12">
                            <Link href="/" className="inline-block mb-8">
                                <Image src="/aara-logo.png" alt="AARA Prep" width={56} height={56} className="rounded-2xl mx-auto shadow-2xl" />
                            </Link>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4">
                                <Shield size={16} className="text-purple-300" />
                                <span className="text-purple-300 text-xs font-bold uppercase tracking-widest">Therapist Portal</span>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl font-serif text-white mb-3 text-center lg:text-left">Welcome back</h2>
                            <p className="text-white/40 mb-10 text-center lg:text-left font-light">Sign in to your therapist account</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Email</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full pl-11 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:bg-white/[0.05] transition-all"
                                            placeholder="therapist@email.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Password</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input
                                            type="password"
                                            required
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            className="w-full pl-11 pr-4 py-4 bg-white/[0.03] border border-white/5 rounded-xl text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:bg-white/[0.05] transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs">
                                    <label className="flex items-center gap-2 text-white/40 hover:text-white/60 cursor-pointer transition-colors">
                                        <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-purple-500 transition-colors" />
                                        Remember me
                                    </label>
                                    <a href="#" className="text-purple-400/80 hover:text-purple-300 transition-colors tracking-wide">Forgot password?</a>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-200 text-sm text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl text-white font-semibold transition-all shadow-[0_4px_20px_-5px_rgba(147,51,234,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(147,51,234,0.4)]"
                                >
                                    {loading ? (
                                        <span className="text-white/80">Signing in...</span>
                                    ) : (
                                        <>Sign In <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>

                            <div className="mt-10 pt-8 border-t border-white/5 space-y-4 text-center text-sm">
                                <p className="text-white/40">
                                    Want to partner with AARA?{' '}
                                    <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">Apply as therapist</a>
                                </p>
                                <p className="text-white/40">
                                    Not a therapist?{' '}
                                    <Link href="/auth/login" className="text-white/60 hover:text-white transition-colors ml-1 font-medium decoration-white/20 underline decoration-1 underline-offset-4">
                                        User login
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
