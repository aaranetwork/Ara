'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, Share2, Download, Link2, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

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
                    // Copy to clipboard
                    navigator.clipboard.writeText(data.shareUrl)
                    alert('Link copied to clipboard!')
                } else if (method === 'pdf' && data.pdfUrl) {
                    // Download PDF
                    window.open(data.pdfUrl, '_blank')
                }

                // Refresh report to show new share
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
                // Refresh report
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
                <div className="text-white/60">Loading...</div>
            </div>
        )
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-[#030305] flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-2xl font-serif text-white/60 mb-4">{error || 'Report not found'}</h1>
                    <button
                        onClick={() => router.push('/reports')}
                        className="px-6 py-3 bg-white text-black rounded-full font-medium text-sm"
                    >
                        Back to Reports
                    </button>
                </div>
            </div>
        )
    }

    const activeShares = report.shareHistory.filter(s => !s.revokedAt)
    const canShare = report.type !== 'self_insight' // Self-insight reports are user-only

    return (
        <div className="min-h-screen bg-[#030305] text-white">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[100px] rounded-full" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/reports')}
                            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors"
                        >
                            <ChevronLeft size={20} className="text-white/60" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-serif capitalize">{report.type.replace('_', ' ')} Report</h1>
                            <p className="text-sm text-white/40">Version {report.version} · {formatDate(report.createdAt)}</p>
                        </div>
                    </div>

                    {canShare && (
                        <button
                            onClick={() => setShowShareModal(true)}
                            className="px-6 py-3 bg-indigo-500 text-white rounded-full font-medium text-sm flex items-center gap-2 hover:bg-indigo-600 transition-colors"
                        >
                            <Share2 size={16} />
                            Share with Therapist
                        </button>
                    )}
                </div>

                {/* Period */}
                <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="text-sm text-white/60">
                        {formatDate(report.periodStart)} - {formatDate(report.periodEnd)}
                    </div>
                </div>

                {/* Summary */}
                <section className="mb-8">
                    <h2 className="text-xl font-serif mb-4">Summary</h2>
                    <p className="text-white/70 leading-relaxed">{report.content.summary}</p>
                </section>

                {/* Themes */}
                <section className="mb-8">
                    <h2 className="text-xl font-serif mb-4">Themes</h2>
                    <div className="space-y-3">
                        {report.content.themes.map((theme, i) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium">{theme.name}</h3>
                                    <div className="text-sm text-white/40">{Math.round(theme.strength * 100)}%</div>
                                </div>
                                <p className="text-sm text-white/60">{theme.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Patterns */}
                <section className="mb-8">
                    <h2 className="text-xl font-serif mb-4">Patterns</h2>
                    <div className="space-y-3">
                        {report.content.patterns.map((pattern, i) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-1 bg-white/10 rounded text-xs">{pattern.type}</span>
                                    <span className="text-xs text-white/40">{pattern.frequency}</span>
                                    <span className="text-xs text-white/40">· {pattern.trend}</span>
                                </div>
                                <p className="text-sm text-white/70">{pattern.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommendations */}
                <section className="mb-8">
                    <h2 className="text-xl font-serif mb-4">Recommendations</h2>
                    <ul className="space-y-2">
                        {report.content.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start gap-3 text-white/70">
                                <span className="text-indigo-400 mt-1">•</span>
                                {rec}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Share History */}
                {activeShares.length > 0 && (
                    <section>
                        <h2 className="text-xl font-serif mb-4">Shared With</h2>
                        <div className="space-y-2">
                            {activeShares.map((share) => (
                                <div key={share.id} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            {share.shareMethod === 'pdf' ? <Download size={14} /> : <Link2 size={14} />}
                                            <span className="text-sm capitalize">{share.shareMethod.replace('_', ' ')}</span>
                                        </div>
                                        <div className="text-xs text-white/40">
                                            Shared {formatDate(share.sharedAt)}
                                            {share.accessedAt && ` · Accessed ${share.accessCount} time${share.accessCount !== 1 ? 's' : ''}`}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRevokeShare(share.id)}
                                        className="px-4 py-2 bg-red-500/10 text-red-200 rounded-full text-sm hover:bg-red-500/20 transition-colors"
                                    >
                                        Revoke
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-6">
                    <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-8 max-w-md w-full">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-serif">Share Report</h2>
                            <button onClick={() => setShowShareModal(false)} className="text-white/60 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <p className="text-white/60 mb-6">Choose how to share this report with your therapist:</p>

                        <div className="space-y-3">
                            <button
                                onClick={() => handleShare('pdf')}
                                disabled={sharing}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <Download size={20} />
                                    <span className="font-medium">Download PDF</span>
                                </div>
                                <p className="text-sm text-white/60">Get a PDF file to share directly</p>
                            </button>

                            <button
                                onClick={() => handleShare('secure_link')}
                                disabled={sharing}
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors text-left disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <Link2 size={20} />
                                    <span className="font-medium">Secure Link</span>
                                </div>
                                <p className="text-sm text-white/60">Copy a private link (you can revoke later)</p>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
