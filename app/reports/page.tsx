'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, FileText, Calendar, Share2, ExternalLink, Plus, X, Loader2 } from 'lucide-react'

interface ClinicalReport {
    id: string
    generatedAt: string
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

    if (authLoading) {
        return <div className="min-h-screen bg-[#030305]" />
    }

    return (
        <div className="min-h-screen bg-[#030305] text-[#F3F4F6] pb-32">
            {/* Subtle ambient glow */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors border border-white/5"
                        >
                            <ChevronLeft size={20} className="text-white/60" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-serif text-white/90">Clinical Reports</h1>
                            <p className="text-sm text-white/40 mt-1">Your mental health insights</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowGenerateModal(true)}
                        className="group relative px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
                    >
                        <Plus size={16} />
                        <span>Generate Report</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-3 text-white/40">
                            <Loader2 size={20} className="animate-spin" />
                            <span className="text-sm">Loading reports...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 mb-6">
                        {error}
                    </div>
                )}

                {/* Reports List  */}
                {!loading && !error && reports.length > 0 && (
                    <div className="space-y-4">
                        {reports.map((report, index) => {
                            const activeShare = report.shares?.find(s => s.status === 'active')

                            return (
                                <motion.div
                                    key={report.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all relative overflow-hidden"
                                >
                                    {/* Subtle glow on hover */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />

                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-start gap-5 flex-1">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                                <FileText size={20} className="text-white/70" />
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-serif text-white/90">
                                                        Clinical Report
                                                    </h3>
                                                    {activeShare && (
                                                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                                                            Shared
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-white/40">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={14} />
                                                        <span>{formatDate(report.period.start)} - {formatDate(report.period.end)}</span>
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                                    <span>Generated {formatDate(report.generatedAt)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => router.push(`/reports/${report.id}`)}
                                                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-sm text-white/70 hover:text-white"
                                            >
                                                <span>View</span>
                                                <ExternalLink size={14} />
                                            </button>

                                            <button
                                                onClick={() => {/* Share functionality */ }}
                                                className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/70 hover:text-white"
                                            >
                                                <Share2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && reports.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                            <FileText size={28} className="text-white/30" />
                        </div>
                        <h2 className="text-2xl font-serif text-white/70 mb-2">No reports yet</h2>
                        <p className="text-white/40 mb-8 max-w-md mx-auto">
                            Generate your first clinical report to see comprehensive insights about your mental health journey
                        </p>
                        <button
                            onClick={() => setShowGenerateModal(true)}
                            className="px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-sm font-medium text-white/80 hover:text-white inline-flex items-center gap-2"
                        >
                            <Plus size={16} />
                            <span>Generate Your First Report</span>
                        </button>
                    </motion.div>
                )}
            </div>

            {/* Generate Modal */}
            <AnimatePresence>
                {showGenerateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => !generating && setShowGenerateModal(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative z-10 w-full max-w-md p-8 rounded-[2rem] bg-[#0A0A0C] border border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-serif text-white/90">
                                    {eligibility?.hasBaseline ? 'Generate Report' : 'Pre-Therapy Insight'}
                                </h3>
                                {!generating && (
                                    <button
                                        onClick={() => setShowGenerateModal(false)}
                                        className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60 hover:text-white"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            <p className="text-white/60 mb-8 leading-relaxed">
                                {eligibility?.hasBaseline
                                    ? "This will generate a comprehensive clinical report based on your check-ins, journal entries, chat conversations, and emotional patterns from the last 30 days."
                                    : "This will generate your foundational Pre-Therapy Insight Report. It analyzes your first 7 days of activity to establish a clinical baseline."
                                }
                            </p>

                            {!eligibility?.hasBaseline && !eligibility?.canGeneratePreTherapy ? (
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-8">
                                    <div className="flex items-center gap-3 text-amber-200 mb-2">
                                        <Loader2 size={18} className="animate-spin" />
                                        <span className="font-medium">Building Baseline</span>
                                    </div>
                                    <p className="text-sm text-white/50 mb-3">
                                        We need a bit more data to make this report accurate.
                                    </p>
                                    <div className="space-y-2 text-sm">
                                        {(eligibility?.daysRemaining || 0) > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-white/40">Time remaining</span>
                                                <span className="text-white/80">{eligibility?.daysRemaining} days</span>
                                            </div>
                                        )}
                                        {(eligibility?.checkInsRemaining || 0) > 0 && (
                                            <div className="flex justify-between">
                                                <span className="text-white/40">Check-ins needed</span>
                                                <span className="text-white/80">{eligibility?.checkInsRemaining} more</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}

                            <div className="flex gap-3">
                                <button
                                    onClick={handleGenerateReport}
                                    disabled={generating || (!eligibility?.hasBaseline && !eligibility?.canGeneratePreTherapy)}
                                    className="flex-1 px-6 py-3 bg-white text-black rounded-full font-medium hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Generating...</span>
                                        </>
                                    ) : (
                                        <span>
                                            {eligibility?.hasBaseline ? 'Generate Report' : 'Generate Baseline'}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowGenerateModal(false)}
                                    disabled={generating}
                                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
