'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle } from 'lucide-react'

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
                    setError('This share link has been revoked')
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
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        )
    }

    if (revoked || error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center px-6">
                <div className="max-w-md text-center">
                    <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
                    <h1 className="text-2xl font-serif text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <p className="text-sm text-gray-400">
                        If you believe this is an error, please contact the person who shared this report with you.
                    </p>
                </div>
            </div>
        )
    }

    if (!report) {
        return null
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-gray-50 border-b border-gray-200 py-6">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            A
                        </div>
                        <span className="font-semibold text-gray-900">AARA Prep</span>
                    </div>
                    <p className="text-sm text-gray-600">Shared Clinical Report · Read-Only</p>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Report Header */}
                <div className="mb-12">
                    <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-4 capitalize">
                        {report.type.replace('_', ' ')} Report
                    </div>
                    <h1 className="text-3xl font-serif text-gray-900 mb-4">Patient Insight Report</h1>
                    <div className="text-gray-600">
                        {formatDate(report.periodStart)} - {formatDate(report.periodEnd)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                        Generated {formatDate(report.createdAt)}
                    </div>
                </div>

                {/* Summary */}
                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-gray-900 mb-4">Summary</h2>
                    <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-700 leading-relaxed">{report.content.summary}</p>
                    </div>
                </section>

                {/* Themes */}
                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-gray-900 mb-4">Recurring Themes</h2>
                    <div className="space-y-4">
                        {report.content.themes.map((theme, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-white border border-gray-200 rounded-xl"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900">{theme.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-indigo-500 rounded-full"
                                                style={{ width: `${theme.strength * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600">{Math.round(theme.strength * 100)}%</span>
                                    </div>
                                </div>
                                <p className="text-gray-600">{theme.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Patterns */}
                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-gray-900 mb-4">Observed Patterns</h2>
                    <div className="space-y-4">
                        {report.content.patterns.map((pattern, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 bg-white border border-gray-200 rounded-xl"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium uppercase">
                                        {pattern.type}
                                    </span>
                                    <span className="text-sm text-gray-500">·</span>
                                    <span className="text-sm text-gray-600">{pattern.frequency}</span>
                                    <span className="text-sm text-gray-500">·</span>
                                    <span className="text-sm text-gray-600 capitalize">{pattern.trend}</span>
                                </div>
                                <p className="text-gray-700">{pattern.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Recommendations */}
                <section className="mb-12">
                    <h2 className="text-2xl font-serif text-gray-900 mb-4">Suggested Focus Areas</h2>
                    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <ul className="space-y-3">
                            {report.content.recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <CheckCircle size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                                    <span className="text-gray-700">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Comparison (if therapy report) */}
                {report.content.comparison && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-serif text-gray-900 mb-4">Progress Comparison</h2>
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                            <p className="text-sm text-gray-600 mb-4">Compared to previous report:</p>
                            <div className="space-y-2">
                                {report.content.comparison.changes.map((change: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-gray-700">{change.metric}</span>
                                        <span className={`text-sm font-medium ${change.direction === 'improved' ? 'text-green-600' :
                                            change.direction === 'declined' ? 'text-red-600' :
                                                'text-gray-600'
                                            }`}>
                                            {change.direction}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t border-gray-200 pt-8 mt-16">
                    <div className="text-center text-sm text-gray-500 space-y-2">
                        <p>Generated by <strong>AARA Prep</strong> · A Pre-Therapy Companion</p>
                        <p className="text-xs text-gray-400">
                            <strong>Important:</strong> This report is not medical advice, diagnosis, or treatment.
                            It is a structured summary of the patient&apos;s self-reported experiences for therapeutic use only.
                        </p>
                        <p className="text-xs text-gray-400">
                            For crisis support, please contact a crisis hotline or emergency services immediately.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    )
}
