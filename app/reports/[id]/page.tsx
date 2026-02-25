'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Share2, Download, Link2, X, FileText, Calendar, TrendingUp, Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { TextBlurReveal } from '@/components/ui/TextBlurReveal'

interface Report {
    id: string
    type: 'pre_therapy' | 'therapy' | 'self_insight'
    version: number
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
    shareHistory: Array<{
        id: string
        sharedAt: string
        shareMethod: 'pdf' | 'secure_link'
        revokedAt: string | null
        accessedAt: string | null
        accessCount: number
    }>
}

export default function ReportDetailPage({ params }: { params: { id: string } }) {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    const [report, setReport] = useState<Report | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showShareModal, setShowShareModal] = useState(false)
    const [sharing, setSharing] = useState(false)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login')
        }
    }, [user, authLoading, router])

    // Fetch report details
    useEffect(() => {
        async function fetchReport() {
            if (!user) return

            try {
                const idToken = await user.getIdToken()
                const response = await fetch(`/api/reports/${params.id}`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                    },
                })

                if (response.ok) {
                    const data = await response.json()
                    setReport(data.data)
                } else if (response.status === 404) {
                    setError('Report not found')
                } else {
                    setError('Failed to load report')
                }
            } catch (err) {
                console.error('Error fetching report:', err)
                setError('Failed to load report')
            } finally {
                setLoading(false)
            }
        }

        fetchReport()
    }, [user, params.id])

    const handleShare = async (method: 'pdf' | 'secure_link') => {
        if (!user || !report) return
        setSharing(true)

        try {
            const idToken = await user.getIdToken()
            const response = await fetch(`/api/reports/${report.id}/share`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shareMethod: method,
                    recipientType: 'therapist',
                }),
            })

            const data = await response.json()

            if (response.ok) {
                if (method === 'secure_link' && data.shareUrl) {
                    navigator.clipboard.writeText(data.shareUrl)
                    alert('Link copied to clipboard!')
                } else if (method === 'pdf' && data.pdfUrl) {
                    window.open(data.pdfUrl, '_blank')
                }
                window.location.reload()
            } else {
                alert(data.error || 'Failed to share report')
            }
        } catch (err) {
            console.error('Error sharing report:', err)
            alert('Failed to share report')
        } finally {
            setSharing(false)
            setShowShareModal(false)
        }
    }

    const handleRevokeShare = async (shareId: string) => {
        if (!user || !report) return
        if (!confirm('Revoke access to this share?')) return

        try {
            const idToken = await user.getIdToken()
            const response = await fetch(`/api/reports/${report.id}/share/${shareId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                },
            })

            if (response.ok) {
                window.location.reload()
            } else {
                alert('Failed to revoke share')
            }
        } catch (err) {
            console.error('Error revoking share:', err)
            alert('Failed to revoke share')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#030305] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={32} className="text-indigo-500 animate-spin" />
                    <div className="text-white/40 text-sm font-medium tracking-widest uppercase">Deciphering Report...</div>
                </div>
            </div>
        )
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-[#030305] flex items-center justify-center px-6">
                <div className="text-center max-w-sm">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                        <X size={32} className="text-red-400" />
                    </div>
                    <h1 className="text-2xl font-serif text-white/90 mb-4">{error || 'Report not found'}</h1>
                    <p className="text-white/40 mb-8 leading-relaxed">The report you are looking for might have been archived or is temporarily unavailable.</p>
                    <button
                        onClick={() => router.push('/reports')}
                        className="w-full px-8 py-4 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        Return to Portfolio
                    </button>
                </div>
            </div>
        )
    }

    const activeShares = report.shareHistory.filter(s => !s.revokedAt)
    const canShare = report.type !== 'self_insight'

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
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
                {/* Document Substrate Glow */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                {/* Header Section */}
                <motion.div variants={itemVariants} className="p-10 md:p-14 border-b border-white/5 relative">
                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                        <Sparkles size={120} />
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif text-white/90 capitalize leading-tight mb-4 pr-20">
                        {report.type.replace('_', ' ')} Report
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-white/40">
                        <span className="text-indigo-400">Version {report.version}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                        <span>{formatDate(report.createdAt)}</span>
                    </div>

                    <div className="mt-10 p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 inline-flex">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <TrendingUp size={18} className="text-indigo-400/80" />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-0.5">Analysis Window</div>
                            <div className="text-sm font-medium text-white/80">
                                {formatDate(report.periodStart)} — {formatDate(report.periodEnd)}
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="px-10 md:px-14 py-12 space-y-16">

                    {/* Summary Section */}
                    <motion.section variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <div className="w-1 h-6 bg-indigo-500 rounded-full" />
                            <h2 className="text-xl font-serif text-white/80 uppercase tracking-widest">Clinical Summary</h2>
                        </div>
                        <p className="text-white/70 leading-relaxed text-lg font-light pl-4 border-l-2 border-white/10 italic">
                            {report.content.summary}
                        </p>
                    </motion.section>

                    {/* Themes Grid */}
                    <motion.section variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <div className="w-1 h-6 bg-purple-500 rounded-full" />
                            <h2 className="text-xl font-serif text-white/80 uppercase tracking-widest">Core Psychological Themes</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
                            {report.content.themes.map((theme, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-serif text-lg text-white/90">{theme.name}</h3>
                                        <span className="text-xs font-mono text-purple-400/80">{Math.round(theme.strength * 100)}% Match</span>
                                    </div>
                                    <p className="text-sm text-white/40 leading-relaxed">{theme.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Patterns Table/List */}
                    <motion.section variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <div className="w-1 h-6 bg-blue-500 rounded-full" />
                            <h2 className="text-xl font-serif text-white/80 uppercase tracking-widest">Behavioral Patterns</h2>
                        </div>
                        <div className="space-y-4 pl-4">
                            {report.content.patterns.map((pattern, i) => (
                                <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-1 bg-white/5 rounded text-[9px] font-bold uppercase tracking-wider text-white/40">{pattern.type}</span>
                                        <h4 className="text-white/80 font-medium text-sm">{pattern.description}</h4>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest">
                                        <div className="text-white/30">Freq: <span className="text-white/60">{pattern.frequency}</span></div>
                                        <div className="w-1 h-1 rounded-full bg-white/10" />
                                        <div className="text-white/30">Trend: <span className="text-blue-400">{pattern.trend}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Recommendations Section */}
                    <motion.section variants={itemVariants} className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <div className="w-1 h-6 bg-emerald-500 rounded-full" />
                            <h2 className="text-xl font-serif text-white/80 uppercase tracking-widest">Proposed Focus Areas</h2>
                        </div>
                        <ul className="space-y-4 pl-4">
                            {report.content.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-4 text-white/70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-2.5 flex-shrink-0" />
                                    <span className="text-md leading-relaxed font-light">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.section>

                    {/* Share History embedded at bottom of document */}
                    {activeShares.length > 0 && (
                        <motion.section variants={itemVariants} className="pt-12 mt-12 border-t border-white/5">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-6 pl-4">Clinical Access History</h2>
                            <div className="space-y-2 pl-4">
                                {activeShares.map((share) => (
                                    <div key={share.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                {share.shareMethod === 'pdf' ? <Download size={14} className="text-white/40" /> : <Link2 size={14} className="text-white/40" />}
                                            </div>
                                            <div>
                                                <div className="text-xs font-medium text-white/80 capitalize">
                                                    {share.shareMethod.replace('_', ' ')} Access
                                                </div>
                                                <div className="text-[9px] text-white/40 uppercase tracking-widest">
                                                    Shared {formatDate(share.sharedAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRevokeShare(share.id)}
                                            className="px-4 py-1.5 text-red-400 text-[10px] font-bold uppercase tracking-widest hover:bg-red-500/10 rounded-md transition-colors"
                                        >
                                            Revoke
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    )}

                </div>
            </motion.div>

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#030305]/80 backdrop-blur-md"
                            onClick={() => !sharing && setShowShareModal(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative z-10 w-full max-w-md p-10 rounded-[2.5rem] bg-[#0A0A0C] border border-white/10 shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <Share2 size={24} className="text-indigo-400" />
                                </div>
                                <button onClick={() => setShowShareModal(false)} className="text-white/20 hover:text-white p-2">
                                    <X size={24} />
                                </button>
                            </div>

                            <h2 className="text-3xl font-serif text-white/90 mb-4">Clinical Bridge</h2>
                            <p className="text-white/40 mb-10 leading-relaxed text-sm">Choose how you wish to securely provide this synthesis to your practitioner.</p>

                            <div className="space-y-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleShare('pdf')}
                                    disabled={sharing}
                                    className="w-full group p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white text-white hover:text-black transition-all flex items-center justify-between disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <Download size={24} />
                                        <div>
                                            <div className="font-bold text-xs uppercase tracking-widest">Document Export (PDF)</div>
                                            <div className="text-[10px] opacity-60">High-Fidelity Clinical Layout</div>
                                        </div>
                                    </div>
                                    <ChevronLeft size={20} className="rotate-180 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleShare('secure_link')}
                                    disabled={sharing}
                                    className="w-full group p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white text-white hover:text-black transition-all flex items-center justify-between disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-4 text-left">
                                        <Link2 size={24} />
                                        <div>
                                            <div className="font-bold text-xs uppercase tracking-widest">Digital Vault (Link)</div>
                                            <div className="text-[10px] opacity-60">Temporary, Revocable URL</div>
                                        </div>
                                    </div>
                                    <ChevronLeft size={20} className="rotate-180 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

