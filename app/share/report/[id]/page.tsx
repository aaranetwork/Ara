'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    Download,
    Eye,
    EyeOff,
    ShieldCheck,
    FileText,
    Calendar,
    Activity,
    Brain,
    Lock,
    ArrowLeft,
    CheckCircle2
} from 'lucide-react'
import Image from 'next/image'

import { db } from '@/lib/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { useParams } from 'next/navigation'

// --- Types ---
type ReportData = {
    dateRange: string
    summary: string[]
    emotionalThemes: { theme: string; observation: string }[]
    behaviors: { signal: string; status: string }[]
    strengths: string[]
    therapistMetrics: {
        engagement: string
        timeCoverage: string
        riskSignals: string
    }
    metrics: {
        avgMood: string
        totalEntries: number
        checkInRate: string
        anxietyLevel: string
    }
}

export default function SharedReportPage() {
    const params = useParams()
    const id = params?.id as string

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isPrivacyMode, setIsPrivacyMode] = useState(false)
    const [data, setData] = useState<ReportData | null>(null)

    // Fetch Shared Data
    useEffect(() => {
        async function fetchReport() {
            if (!id || !db) return

            try {
                const docRef = doc(db, 'shared_reports', id)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    // Check expiry if you implemented it
                    const reportData = docSnap.data().data as ReportData
                    setData(reportData)
                } else {
                    setError("Report not found or has expired.")
                }
            } catch (err) {
                console.error("Error fetching report:", err)
                setError("Failed to load report.")
            } finally {
                setLoading(false)
            }
        }

        fetchReport()
    }, [id])

    const handlePrint = () => window.print()

    // --- Loading State ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030305]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-t-2 border-indigo-500 animate-spin" />
                    <span className="text-white/40 text-xs font-medium uppercase tracking-widest animate-pulse">Retrieving Report...</span>
                </div>
            </div>
        )
    }

    // --- Error State ---
    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#030305] text-white">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto border border-white/10">
                        <Lock size={24} className="text-white/40" />
                    </div>
                    <h1 className="text-xl font-serif">{error || "Report Unavailable"}</h1>
                    <Link href="/" className="inline-block text-sm text-indigo-400 hover:text-indigo-300">
                        Return Home
                    </Link>
                </div>
            </div>
        )
    }

    // --- Full Report UI ---
    return (
        <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-indigo-500/30 pb-24 print:bg-white print:text-black">

            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none print:hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Navbar - Simplified for Shared View */}
            <nav className="border-b border-white/5 bg-[#030305]/80 backdrop-blur-xl fixed top-0 w-full z-50 print:hidden transition-all duration-300">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 opacity-80">
                        <Image src="/aara-logo.png" alt="AARA Prep" width={24} height={24} className="rounded-lg" />
                        <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">AARA Prep Clinical Report</span>
                    </div>

                    <Link href="https://aara.site" target="_blank" className="px-4 py-2 rounded-lg bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                        Get AARA Prep
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-32 relative z-10 space-y-12">

                {/* Header */}
                <header className="space-y-6 pb-8 border-b border-white/5 print:border-black/10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
                                <Calendar size={10} />
                                <span>{data.dateRange}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-medium text-white tracking-tight leading-tight print:text-black">
                                Clinical Analysis <br /> & Pattern Report
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-white/40 print:text-black/60">
                                <span>Source</span>
                                <span className="text-white font-medium print:text-black">AARA Prep</span>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 max-w-sm backdrop-blur-md print:hidden">
                            <div className="flex gap-3">
                                <ShieldCheck className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                                <p className="text-xs text-white/50 leading-relaxed">
                                    <strong className="text-white block mb-1">Shared Clinical View</strong>
                                    This report is a shared snapshot. Sensitive user details may be redacted based on user settings.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Metrics Grid */}
                <section>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricTile label="Avg Mood" value={data.metrics.avgMood} icon={Activity} color="indigo" />
                        <MetricTile label="Total Entries" value={data.metrics.totalEntries.toString()} icon={FileText} color="blue" />
                        <MetricTile label="Active Days" value={data.metrics.checkInRate.replace('%', '/30')} icon={CheckCircle2} color="emerald" />
                        <MetricTile label="Est. Anxiety" value={data.metrics.anxietyLevel} icon={Brain} color="rose" />
                    </div>
                </section>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Col - Summary */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Executive Summary */}
                        <section>
                            <SectionHeader icon={FileText} title="Executive Summary" />
                            <div className="bg-[#0e0e12]/50 border border-white/5 rounded-[24px] p-8 space-y-5 print:bg-white print:border-gray-200">
                                {data.summary.map((point, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                                        <p className="text-sm md:text-base text-white/80 leading-relaxed print:text-black">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Themes */}
                        <section className={isPrivacyMode ? "blur-sm opacity-50 transition-all" : "transition-all"}>
                            <SectionHeader icon={Brain} title="Reflected Themes" />
                            <p className="text-xs text-white/40 mb-4 -mt-4">Recurring patterns identified in journal entries.</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {data.emotionalThemes.map((theme, i) => (
                                    <div key={i} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-6 transition-colors print:border-gray-200">
                                        <h3 className="text-sm font-bold text-white mb-2 print:text-black">{theme.theme}</h3>
                                        <p className="text-xs text-white/50 leading-relaxed print:text-black/70">{theme.observation}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Col - Stats & Strengths */}
                    <div className="space-y-8">
                        <section>
                            <SectionHeader icon={Activity} title="Behavioral Signals" />
                            <div className="space-y-3">
                                {data.behaviors.map((item, i) => (
                                    <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-xl print:border-gray-200 flex flex-col gap-1">
                                        <span className="text-sm font-medium text-white print:text-black">{item.signal}</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-wider font-bold print:text-black/50">{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <SectionHeader icon={ShieldCheck} title="Strengths" />
                            <div className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 border border-white/5 rounded-2xl p-6 print:border-gray-200 print:bg-white">
                                <div className="flex flex-wrap gap-2">
                                    {data.strengths.map((str, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-indigo-300 print:text-black print:border-gray-300">
                                            {str}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Therapist Clinical View - Always Visible in Shared Report */}
                <section className="bg-[#050505] border border-white/10 rounded-[32px] overflow-hidden print:border-black">
                    <div className="p-1 items-center justify-center flex bg-white/[0.02] border-b border-white/5 h-12">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 flex items-center gap-2">
                            <Lock size={10} /> ClinicalMetrics (Private)
                        </span>
                    </div>
                    <div className="p-8 grid md:grid-cols-3 gap-8">
                        <ClinicalMetric label="Engagement Quality" value={data.therapistMetrics.engagement} />
                        <ClinicalMetric label="Time Coverage" value={data.therapistMetrics.timeCoverage} />
                        <ClinicalMetric label="Risk Signals" value={data.therapistMetrics.riskSignals} warning={data.therapistMetrics.riskSignals.includes("Elevated")} />
                    </div>
                </section>

                {/* Footer Actions */}
                <div className="pt-12 pb-20 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 print:hidden">
                    <button
                        onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                    >
                        {isPrivacyMode ? <Eye size={14} /> : <EyeOff size={14} />}
                        {isPrivacyMode ? "Show Sensitive Data" : "Hide Sensitive Data"}
                    </button>

                    <button
                        onClick={handlePrint}
                        className="flex-1 md:flex-none py-3 px-6 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                    >
                        <Download size={14} /> Download PDF
                    </button>
                </div>
            </main>
        </div>
    )
}

// --- Subcomponents ---

function SectionHeader({ icon: Icon, title }: { icon: any, title: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white/60 print:bg-gray-100 print:text-black">
                <Icon size={16} />
            </div>
            <h2 className="text-xl font-serif text-white tracking-tight print:text-black">{title}</h2>
        </div>
    )
}

function MetricTile({ label, value, icon: Icon, color }: { label: string, value: string, icon: any, color: string }) {
    const colors: Record<string, string> = {
        indigo: "text-indigo-400 bg-indigo-500/10",
        blue: "text-blue-400 bg-blue-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
        rose: "text-rose-400 bg-rose-500/10",
    }

    return (
        <div className="bg-[#0e0e12]/60 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.02] transition-colors group print:border-gray-200 print:bg-white">
            <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1 font-bold print:text-black/60">{label}</p>
            <p className="text-2xl font-serif font-medium text-white print:text-black">{value}</p>
        </div>
    )
}

function ClinicalMetric({ label, value, warning }: { label: string, value: string | undefined, warning?: boolean }) {
    return (
        <div className="space-y-2">
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 print:text-black/50">{label}</p>
            <p className={`text-lg font-medium print:text-black ${warning ? 'text-red-400' : 'text-white'}`}>{value || "-"}</p>
        </div>
    )
}
