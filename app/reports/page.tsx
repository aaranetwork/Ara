'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, FileText, Calendar, Share2, ExternalLink, Plus, X, Loader2, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react'
import { TextBlurReveal } from '@/components/ui/TextBlurReveal'

interface ClinicalReport {
    id: string
    generatedAt: string
    type: 'pre_therapy' | 'therapy' | 'self_insight'
    period: {
        start: string
        end: string
    }
    shares?: Array<{
        token: string
        createdAt: string
        status: 'active' | 'expired'
    }>
}

export default function ReportsPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [reports, setReports] = useState<ClinicalReport[]>([])
    const [eligibility, setEligibility] = useState<{
        canGeneratePreTherapy: boolean
        daysRemaining: number
        checkInsRemaining: number
        hasBaseline: boolean
    } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showGenerateModal, setShowGenerateModal] = useState(false)
    const [generating, setGenerating] = useState(false)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        async function fetchReports() {
            if (!user) return

            setLoading(true)
            setError(null)

            try {
                const idToken = await user.getIdToken()
                const response = await fetch('/api/reports', {
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    setReports(data.reports || [])
                    setEligibility(data.eligibility || null)
                } else {
                    const data = await response.json()
                    setError(data.error || 'Failed to load reports')
                }
            } catch (err) {
                console.error('Error fetching reports:', err)
                setError('Failed to load reports')
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [user])

    const handleGenerateReport = async () => {
        if (!user) return

        setGenerating(true)
        try {
            const idToken = await user.getIdToken()

            // Determine report type based on eligibility
            const type = eligibility?.hasBaseline ? 'therapy' : 'pre_therapy'

            const response = await fetch('/api/reports/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type }),
            })

            if (response.ok) {
                const data = await response.json()
                setReports([data.report, ...reports])
                setShowGenerateModal(false)
            } else {
                const data = await response.json()
                setError(data.error || 'Failed to generate report')
            }
        } catch (err) {
            console.error('Error generating report:', err)
            setError('Failed to generate report')
        } finally {
            setGenerating(false)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1]
            }
        }
    }

    if (authLoading) {
        return <div className="min-h-screen bg-[#030305]" />
    }

    return (
        <div className="min-h-screen bg-[#030305] text-[#F3F4F6] pb-32 selection:bg-indigo-500/30">
            {/* Immersive Background Layers */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
                >
                    <div className="space-y-4">
                        <button
                            onClick={() => router.back()}
                            className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4"
                        >
                            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            Back
                        </button>
                        <TextBlurReveal
                            text="Mental Health Portfolio"
                            className="text-4xl md:text-5xl lg:text-6xl font-serif text-white/90 leading-tight"
                        />
                        <p className="text-white/40 max-w-lg leading-relaxed">
                            A curated history of your emotional journey, trends, and clinical insights generated from your activity.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowGenerateModal(true)}
                        className="relative group px-8 py-4 bg-white text-black rounded-full overflow-hidden transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 via-white to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10 flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
                            <Sparkles size={16} />
                            Generate New Insight
                        </span>
                    </motion.button>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 w-full bg-white/5 rounded-3xl animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-200/80 text-center mb-12 backdrop-blur-xl"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Reports List */}
                {!loading && !error && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-6"
                    >
                        {reports.length > 0 ? (
                            reports.map((report) => {
                                const activeShare = report.shares?.find(s => s.status === 'active')

                                return (
                                    <motion.div
                                        key={report.id}
                                        variants={itemVariants}
                                        whileHover={{ y: -4 }}
                                        className="group relative"
                                    >
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 rounded-[2.5rem] blur transition-opacity" />

                                        <div className="relative p-8 rounded-[2.5rem] bg-[#0A0A0C]/40 backdrop-blur-2xl border border-white/5 group-hover:border-white/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-start gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-white/10 transition-colors">
                                                    <FileText size={24} className="text-white/60 group-hover:text-white transition-colors" />
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h3 className="text-xl font-serif text-white/90 group-hover:text-white transition-colors">
                                                            {report.type === 'pre_therapy' ? 'Clinical Baseline' :
                                                                report.type === 'therapy' ? 'Progress Snapshot' : 'Deep Insight'}
                                                        </h3>
                                                        {activeShare && (
                                                            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                                <span className="text-emerald-400 text-[9px] font-bold uppercase tracking-widest">Shared</span>
                                                            </div>
                                                        )}
                                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/30 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                                                            {formatDate(report.generatedAt)}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-4 text-xs text-white/30">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} className="opacity-50" />
                                                            <span>{report.period?.start ? formatDate(report.period.start) : 'N/A'} - {report.period?.end ? formatDate(report.period.end) : 'N/A'}</span>
                                                        </div>
                                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                                        <div className="flex items-center gap-2">
                                                            <TrendingUp size={14} className="opacity-50" />
                                                            <span>Insight Report</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 ml-auto md:ml-0">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => router.push(`/reports/${report.id}`)}
                                                    className="pl-6 pr-4 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white text-white hover:text-black transition-all flex items-center gap-3 text-xs font-bold uppercase tracking-widest group/btn"
                                                >
                                                    View Report
                                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/btn:bg-black/5">
                                                        <ChevronLeft size={18} className="rotate-180" />
                                                    </div>
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white/40 hover:text-white transition-all shadow-xl"
                                                >
                                                    <Share2 size={18} />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative py-20 px-8 rounded-[3rem] bg-white/[0.02] border border-dashed border-white/10 text-center"
                            >
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5">
                                    <FileText size={40} className="text-white/20" />
                                </div>
                                <h3 className="text-2xl font-serif text-white/80 mb-4">Your story is waiting to be told</h3>
                                <p className="text-white/40 max-w-sm mx-auto mb-10 leading-relaxed">
                                    Generate your first clinical report to transform your data into a clear path forward.
                                </p>
                                <button
                                    onClick={() => setShowGenerateModal(true)}
                                    className="px-10 py-4 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl"
                                >
                                    Begin Foundation Report
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Generation Modal */}
            <AnimatePresence>
                {showGenerateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#030305]/80 backdrop-blur-md"
                            onClick={() => !generating && setShowGenerateModal(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative z-10 w-full max-w-xl p-10 rounded-[2.5rem] bg-[#0A0A0C] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                        >
                            {/* Modal Background Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Sparkles size={24} className="text-indigo-400" />
                                    </div>
                                    {!generating && (
                                        <button
                                            onClick={() => setShowGenerateModal(false)}
                                            className="p-3 rounded-full hover:bg-white/5 transition-colors text-white/20 hover:text-white"
                                        >
                                            <X size={24} />
                                        </button>
                                    )}
                                </div>

                                <h3 className="text-3xl font-serif text-white/90 mb-4 leading-tight">
                                    {eligibility?.hasBaseline ? 'Synthesize Therapy Progress' : 'Establish Your Clinical Baseline'}
                                </h3>

                                <p className="text-white/50 mb-10 leading-relaxed">
                                    {eligibility?.hasBaseline
                                        ? "This advanced synthesis analyzes your last 30 days of activity to identify recurring themes, emotional shifts, and focus areas for your next therapy session."
                                        : "Your baseline report creates a comprehensive map of your psychological landscape over your first 7 days, providing your therapist with a clear foundation for care."
                                    }
                                </p>

                                {/* Checklist / Status Section */}
                                {!eligibility?.hasBaseline && !eligibility?.canGeneratePreTherapy ? (
                                    <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl mb-10 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Foundation Status</span>
                                            <span className="text-xs text-white/40 font-mono">
                                                {7 - (eligibility?.daysRemaining || 0)} / 7 Days Complete
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-white/60">Data Consistency</span>
                                                    <span className="text-white/80">{Math.round(((7 - (eligibility?.daysRemaining || 0)) / 7) * 100)}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${((7 - (eligibility?.daysRemaining || 0)) / 7) * 100}%` }}
                                                        transition={{ duration: 1, ease: 'easeOut' }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 text-white/40 text-xs">
                                                <ShieldCheck size={16} className={eligibility?.checkInsRemaining === 0 ? "text-emerald-500" : ""} />
                                                <span>Minimum of 3 check-ins required ({3 - (eligibility?.checkInsRemaining || 0)}/3)</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl mb-10 text-emerald-200/60 text-sm">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck size={20} className="text-emerald-400" />
                                        </div>
                                        <span>Your profile has sufficient emotional signal for a high-fidelity clinical synthesis.</span>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleGenerateReport}
                                        disabled={generating || (!eligibility?.hasBaseline && !eligibility?.canGeneratePreTherapy)}
                                        className="flex-1 px-8 py-5 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                    >
                                        {generating ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                <span>Synthesizing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={18} />
                                                <span>{eligibility?.hasBaseline ? 'Generate Synthesis' : 'Build Foundation'}</span>
                                            </>
                                        )}
                                    </motion.button>
                                    <button
                                        onClick={() => setShowGenerateModal(false)}
                                        disabled={generating}
                                        className="px-8 py-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <p className="text-center text-[10px] text-white/20 mt-8 uppercase tracking-[0.2em] font-bold">
                                    Encrypted & Secured by AARA Protocol
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

