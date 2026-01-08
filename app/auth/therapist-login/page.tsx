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
        <div className="min-h-screen bg-[#08080c] text-white">
            <div className="flex min-h-screen">

                {/* Left Panel - Benefits */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-purple-900/20 to-[#08080c] border-r border-white/5">
                    <div>
                        <Link href="/" className="flex items-center gap-3 mb-16">
                            <Image src="/aara-logo.png" alt="AARA" width={40} height={40} className="rounded-xl" />
                            <span className="font-bold text-xl">AARA</span>
                        </Link>

                        <div className="mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full mb-6">
                                <Shield size={16} className="text-purple-400" />
                                <span className="text-purple-400 text-sm font-medium">For Therapists</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-4">
                                Professional<br />Dashboard
                            </h1>
                            <p className="text-gray-500 text-lg">
                                Access client reports, manage appointments, and streamline your practice.
                            </p>
                        </div>

                        <div className="space-y-6">
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
                                        transition={{ delay: 0.2 + i * 0.1 }}
                                        className="flex gap-4"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center shrink-0">
                                            <Icon size={20} className="text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium mb-1">{item.title}</h3>
                                            <p className="text-gray-500 text-sm">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                        Trusted by 500+ mental health professionals
                    </p>
                </div>

                {/* Right Panel - Login Form */}
                <div className="flex-1 flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-10">
                            <Link href="/" className="inline-block mb-6">
                                <Image src="/aara-logo.png" alt="AARA" width={48} height={48} className="rounded-xl mx-auto" />
                            </Link>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full mb-4">
                                <Shield size={16} className="text-purple-400" />
                                <span className="text-purple-400 text-sm font-medium">Therapist Portal</span>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
                            <p className="text-gray-500 mb-8">Sign in to your therapist account</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                                            placeholder="therapist@email.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Password</label>
                                    <div className="relative">
                                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            type="password"
                                            required
                                            value={form.password}
                                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-transparent" />
                                        Remember me
                                    </label>
                                    <a href="#" className="text-purple-400 hover:underline">Forgot password?</a>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-300 text-sm text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-xl text-white font-semibold transition-colors"
                                >
                                    {loading ? (
                                        <span>Signing in...</span>
                                    ) : (
                                        <>Sign In <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-white/10 space-y-4 text-center text-sm">
                                <p className="text-gray-500">
                                    Want to partner with AARA?{' '}
                                    <a href="#" className="text-purple-400 hover:underline">Apply as therapist</a>
                                </p>
                                <p className="text-gray-600">
                                    Not a therapist?{' '}
                                    <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                                        User login →
                                    </Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Background */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-900/20 blur-[180px] rounded-full" />
            </div>
        </div>
    )
}
