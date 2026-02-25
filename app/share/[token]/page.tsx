'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle2, FileText, Calendar, TrendingUp, Sparkles, Loader2, ShieldCheck, Lock } from 'lucide-react'
import Image from 'next/image'

interface ReportData {
    id: string
    type: 'pre_therapy' | 'therapy' | 'self_insight'
    createdAt: string
    periodStart: string
    periodEnd: string
    content: {
        summary: string
        themes: Array<{ name: string; strength: number; description: string }>
        patterns: Array<{ type: string; description: string; frequency: string; trend: string }>
        recommendations: string[]
        comparison?: any
    }
}

export default function TherapistViewPage({ params }: { params: { token: string } }) {
    const router = useRouter()

    const [report, setReport] = useState<ReportData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [revoked, setRevoked] = useState(false)

    useEffect(() => {
        async function fetchSharedReport() {
            try {
                const response = await fetch(`/api/share/${params.token}`)

                if (response.status === 403) {
                    setRevoked(true)
                    setError('This share link has been revoked or expired')
                } else if (response.ok) {
                    const data = await response.json()
                    setReport(data.data)
                } else {
                    const data = await response.json()
                    setError(data.error || 'Invalid or expired share link')
                }
            } catch (err) {
                console.error('Error fetching shared report:', err)
                setError('Failed to load report')
            } finally {
                setLoading(false)
            }
        }

        fetchSharedReport()
    }, [params.token])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030305] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="text-indigo-500 animate-spin" />
                    <div className="text-white/40 text-sm font-medium tracking-widest uppercase">Verifying Digital Vault...</div>
                </div>
            </div>
        )
    }

    if (revoked || error) {
        return (
            <div className="min-h-screen bg-[#030305] flex items-center justify-center px-6">
                <div className="max-w-md text-center">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
                        <Lock size={32} className="text-red-400" />
                    </div>
                    <h1 className="text-2xl font-serif text-white/90 mb-4">Access Restricted</h1>
                    <p className="text-white/40 mb-8 leading-relaxed">{error}</p>
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                        Clinical Security Protocol Active
                    </div>
                </div>
            </div>
        )
    }

    if (!report) return null

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    }

    return (
        <div className="min-h-screen bg-[#030305] text-[#F3F4F6] pb-32 selection:bg-indigo-500/30">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Public Header */}
            <header className="relative z-20 border-b border-white/5 bg-[#030305]/80 backdrop-blur-xl transition-all duration-300">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src="/logo.png" alt="AARA" width={28} height={28} className="rounded-lg brightness-110" />
                        <span className="text-[10px] font-bold tracking-[0.25em] text-white/40 uppercase">AARA Clinical Synthesis</span>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <ShieldCheck size={12} />
                        Read-Only Vault
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-4xl mx-auto px-6 pt-16">
                {/* Report Identity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 space-y-4"
                >
                    <div className="inline-block px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
                        {report.type.replace('_', ' ')} Report
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white/90 leading-tight tracking-tight">
                        Client Insight Synthesis
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-white/40 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="opacity-50" />
                            {formatDate(report.createdAt)}
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div>Analysis: {formatDate(report.periodStart)} — {formatDate(report.periodEnd)}</div>
                    </div>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-16"
                >
                    {/* Clinical Summary */}
                    <motion.section variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <FileText size={16} className="text-white/40" />
                            </div>
                            <h2 className="text-2xl font-serif text-white/90">Executive Summary</h2>
                        </div>
                        <div className="relative p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-2xl">
                            <p className="text-white/70 leading-relaxed text-lg font-light italic">
                                &quot;{report.content.summary}&quot;
                            </p>
                        </div>
                    </motion.section>

                    {/* Themes */}
                    <motion.section variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <Sparkles size={16} className="text-white/40" />
                            </div>
                            <h2 className="text-2xl font-serif text-white/90">Observed Psychological Themes</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {report.content.themes.map((theme, i) => (
                                <div
                                    key={i}
                                    className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-serif text-lg text-white/80">{theme.name}</h3>
                                        <div className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold font-mono">
                                            {Math.round(theme.strength * 100)}% Match
                                        </div>
                                    </div>
                                    <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">{theme.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Behavioral Patterns */}
                    <motion.section variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <TrendingUp size={16} className="text-white/40" />
                            </div>
                            <h2 className="text-2xl font-serif text-white/90">Behavioral Trajectories</h2>
                        </div>
                        <div className="space-y-3">
                            {report.content.patterns.map((pattern, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-[#0A0A0C]/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-bold uppercase tracking-wider text-white/40">{pattern.type}</span>
                                            <h4 className="text-white/90 font-medium">{pattern.description}</h4>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                                        <div className="text-white/20">Frequency: <span className="text-white/60">{pattern.frequency}</span></div>
                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                        <div className="text-white/20">Trend: <span className="text-indigo-400">{pattern.trend}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Recommendations */}
                    <motion.section variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                <CheckCircle2 size={16} className="text-emerald-400/60" />
                            </div>
                            <h2 className="text-2xl font-serif text-white/90">Suggested Clinical Focus</h2>
                        </div>
                        <div className="p-8 rounded-[2.5rem] bg-emerald-500/[0.02] border border-emerald-500/5 backdrop-blur-sm">
                            <ul className="grid grid-cols-1 gap-4">
                                {report.content.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-4 text-white/60">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2.5 shrink-0" />
                                        <span className="text-md leading-relaxed">{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.section>
                </motion.div>

                {/* Shared Footer Disclaimer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-24 pt-12 border-t border-white/5 text-center space-y-4"
                >
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                        Professional Disclosure & Safety Protocol
                    </div>
                    <p className="max-w-2xl mx-auto text-xs text-white/30 leading-relaxed">
                        This synthesis is generated by AARA, an AI-assisted self-reflection tool. It is intended to assist clinical assessment and is not a substitute for professional medical advice, diagnosis, or treatment.
                    </p>
                    <p className="text-[10px] text-white/10">
                        &copy; 2026 AARA. Protected by Clinical-Grade Encryption.
                    </p>
                </motion.footer>
            </main>
        </div>
    )
}

