'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
    Download,
    Share2,
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

import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

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

export default function AaraReportPage() {
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [isTherapistView, setIsTherapistView] = useState(false)
    const [isPrivacyMode, setIsPrivacyMode] = useState(false)

    // Data State
    const [data, setData] = useState<ReportData | null>(null)
    const [uniqueDaysCount, setUniqueDaysCount] = useState(7)

    // --- Data Analysis ---
    useEffect(() => {
        async function fetchAndAnalyze() {
            if (!user || !db) return

            try {
                // 1. Fetch Moods
                const moodsRef = collection(db, 'users', user.uid, 'moods')
                const moodSnapshot = await getDocs(query(moodsRef, orderBy('createdAt', 'desc')))
                const moods = moodSnapshot.docs.map(doc => ({
                    val: doc.data().value,
                    date: doc.data().createdAt.toDate()
                }))

                // 2. Fetch Journals
                const journalsRef = collection(db, 'users', user.uid, 'journals')
                let journals: any[] = []
                try {
                    const journalSnapshot = await getDocs(query(journalsRef, orderBy('createdAt', 'desc')))
                    journals = journalSnapshot.docs.map(doc => ({
                        text: doc.data().content || "",
                        tags: doc.data().tags || [],
                        date: doc.data().createdAt.toDate()
                    }))
                } catch (e) {
                    // Silent fail for empty journals
                }

                // 3. Analysis Logic
                const now = new Date()
                const oneMonthAgo = new Date()
                oneMonthAgo.setDate(now.getDate() - 30)

                const recentMoods = moods.filter(m => m.date >= oneMonthAgo)
                const recentJournals = journals.filter(j => j.date >= oneMonthAgo)

                const allDates = [
                    ...recentMoods.map(m => m.date),
                    ...recentJournals.map(j => j.date)
                ]
                const uniqueDays = new Set(allDates.map(d => d.toDateString())).size
                setUniqueDaysCount(uniqueDays)

                // Only generate report if enough days
                // Calculate metrics regardless for partial views
                const avgMoodVal = recentMoods.length > 0
                    ? (recentMoods.reduce((acc, m) => acc + m.val, 0) / recentMoods.length)
                    : 0
                const avgMood = avgMoodVal > 0 ? avgMoodVal.toFixed(1) : "-"
                const totalEntries = recentJournals.length
                const checkInRate = Math.round((uniqueDays / 30) * 100) + "%"
                const lowMoods = recentMoods.filter(m => m.val <= 3).length
                const anxietyLevel = lowMoods > 5 ? "Elevated" : lowMoods > 2 ? "Moderate" : "Typical"

                const morningEntries = recentJournals.filter(j => j.date.getHours() < 12).length
                const nightEntries = recentJournals.filter(j => j.date.getHours() > 20).length

                // Themes
                const textBlob = recentJournals.map(j => j.text.toLowerCase()).join(" ")
                const themes = []
                if (textBlob.includes("work") || textBlob.includes("job")) themes.push({ theme: "Professional Load", observation: "Frequent work-related stressors identified." })
                if (textBlob.includes("sleep") || textBlob.includes("tired")) themes.push({ theme: "Rest Patterns", observation: "Sleep quality is a recurring topic." })
                if (textBlob.includes("anxious") || textBlob.includes("worry")) themes.push({ theme: "Anxiety Triggers", observation: "Multiple mentions of forward-looking worry." })
                if (themes.length === 0) themes.push({ theme: "Broad Reflection", observation: "Diverse topics with balanced emotional variance." })

                // Strengths
                const strengths = []
                if (uniqueDays > 5) strengths.push("Consistent Awareness")
                if (avgMoodVal > 6) strengths.push("Positive Baseline")
                if (journals.length > 5) strengths.push("Expressive Depth")
                if (strengths.length === 0) strengths.push("Emerging Growth") // Fallback

                // Behaviors
                const behaviors = []
                if (nightEntries > morningEntries) behaviors.push({ signal: "Night Owl Reflection", status: "Active 8PM - 4AM" })
                else behaviors.push({ signal: "Morning Clarity", status: "Active 5AM - 12PM" })
                behaviors.push({ signal: "Consistency", status: `${uniqueDays}/30 Days Active` })


                setData({
                    dateRange: "Last 30 Days",
                    summary: [
                        `Logged ${recentMoods.length} check-ins and ${recentJournals.length} entries.`,
                        `Emotional baseline is ${avgMoodVal > 5 ? "stable" : "fluctuating"} (${avgMood}/10).`,
                        lowMoods > 3 ? "Recurrent periods of low mood detected." : "Emotional resilience appears high."
                    ],
                    emotionalThemes: themes,
                    behaviors,
                    strengths,
                    therapistMetrics: {
                        engagement: uniqueDays > 15 ? "High" : "Moderate",
                        timeCoverage: nightEntries > morningEntries ? "Evening Bias" : "Morning Bias",
                        riskSignals: lowMoods > 5 ? "Elevated Risk" : "None Detected"
                    },
                    metrics: { avgMood, totalEntries, checkInRate, anxietyLevel }
                })
                setLoading(false)

            } catch (error) {
                console.error("Failed to generate report", error)
                setLoading(false)
            }
        }

        fetchAndAnalyze()
    }, [user])

    const handlePrint = () => window.print()
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AARA Report',
                    text: `My AARA Clinical Report`,
                    url: window.location.href,
                })
            } catch (err) { console.log('Share canceled') }
        }
    }

    // --- Loading State ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-t-2 border-indigo-500 animate-spin" />
                    <span className="text-white/40 text-xs font-medium uppercase tracking-widest animate-pulse">Analyzing...</span>
                </div>
            </div>
        )
    }

    // --- Lock Screen (< 6 Days) ---
    if (uniqueDaysCount < 6) {
        return (
            <div className="min-h-screen text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Ambience */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-md w-full relative z-10">
                    <div className="absolute top-0 left-0">
                        <Link href="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center border border-white/5">
                            <ArrowLeft size={20} className="text-white/60" />
                        </Link>
                    </div>

                    <div className="text-center mb-10 mt-12">
                        <div className="w-20 h-20 mx-auto rounded-[24px] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(99,102,241,0.15)] group">
                            <Lock className="text-indigo-400 group-hover:scale-110 transition-transform duration-500" size={32} />
                        </div>
                        <h1 className="text-3xl font-serif font-medium tracking-tight mb-3">Pattern Analysis</h1>
                        <p className="text-white/40 leading-relaxed text-sm">
                            AARA needs more data points to identify clinically meaningful patterns in your emotional journey.
                        </p>
                    </div>

                    {/* Progress Card */}
                    <div className="bg-[#0e0e12]/80 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />

                        <div className="flex justify-between items-end mb-6 relative z-10">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Data Integrity</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-serif font-medium text-white">{uniqueDaysCount}<span className="text-white/20">/</span>6</span>
                                    <span className="text-sm text-white/40 font-medium">Days Collected</span>
                                </div>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                <Activity size={18} className="animate-pulse" />
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(uniqueDaysCount / 6) * 100}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className="absolute top-0 left-0 h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                            />
                        </div>
                        <div className="flex justify-between mt-3 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                            <span>Started</span>
                            <span>Target</span>
                        </div>
                    </div>

                    <p className="text-xs text-white/30 text-center mt-8 max-w-xs mx-auto leading-relaxed">
                        Your comprehensive clinical report will unlock automatically on Day 6.
                    </p>
                </div>
            </div>
        )
    }

    // --- Full Report UI ---
    return (
        <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30 pb-24 print:bg-white print:text-black">

            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none print:hidden">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Navbar */}
            <nav className="border-b border-white/5 bg-[#030305]/80 backdrop-blur-xl fixed top-0 w-full z-50 print:hidden transition-all duration-300">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="group p-2 hover:bg-white/5 rounded-full transition-colors flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                                <ArrowLeft size={16} className="text-white/60" />
                            </div>
                            <span className="text-sm font-medium text-white/40 group-hover:text-white transition-colors">Back</span>
                        </Link>
                    </div>
                    {/* Toggle */}
                    <div className="flex p-1 bg-white/[0.03] border border-white/5 rounded-xl backdrop-blur-md">
                        <button
                            onClick={() => setIsTherapistView(false)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${!isTherapistView ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
                        >
                            Personal
                        </button>
                        <button
                            onClick={() => setIsTherapistView(true)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${isTherapistView ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-white/40 hover:text-white'}`}
                        >
                            <span className={!isTherapistView ? "opacity-50" : ""}>Clinical</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 pt-32 relative z-10 space-y-12">

                {/* Header */}
                <header className="space-y-6 pb-8 border-b border-white/5 print:border-black/10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest">
                                <Calendar size={10} />
                                <span>{data?.dateRange}</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-medium text-white tracking-tight leading-tight print:text-black">
                                Clinical Analysis <br /> & Pattern Report
                            </h1>
                            <div className="flex items-center gap-2 text-sm text-white/40 print:text-black/60">
                                <span>Prepared for</span>
                                <span className="text-white font-medium print:text-black">{user?.displayName || "Traveler"}</span>
                            </div>
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 max-w-sm backdrop-blur-md print:hidden">
                            <div className="flex gap-3">
                                <ShieldCheck className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                                <p className="text-xs text-white/50 leading-relaxed">
                                    <strong className="text-white block mb-1">Confidential Report</strong>
                                    This automated analysis is intended to support, not replace, professional clinical evaluation.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Metrics Grid */}
                <section>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <MetricTile label="Avg Mood" value={data?.metrics.avgMood || "-"} icon={Activity} color="indigo" />
                        <MetricTile label="Total Entries" value={data?.metrics.totalEntries.toString() || "0"} icon={FileText} color="blue" />
                        <MetricTile label="Active Days" value={data?.metrics.checkInRate.replace('%', '/30') || "0/30"} icon={CheckCircle2} color="emerald" />
                        <MetricTile label="Est. Anxiety" value={data?.metrics.anxietyLevel || "-"} icon={Brain} color="rose" />
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
                                {data?.summary.map((point, i) => (
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
                            <p className="text-xs text-white/40 mb-4 -mt-4">Recurring patterns identified in your journal entries.</p>
                            <div className="grid md:grid-cols-2 gap-4">
                                {data?.emotionalThemes.map((theme, i) => (
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
                                {data?.behaviors.map((item, i) => (
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
                                    {data?.strengths.map((str, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-medium text-indigo-300 print:text-black print:border-gray-300">
                                            {str}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Therapist Clinical View */}
                <AnimatePresence>
                    {isTherapistView && (
                        <motion.section
                            initial={{ opacity: 0, height: 0, scale: 0.98 }}
                            animate={{ opacity: 1, height: 'auto', scale: 1 }}
                            exit={{ opacity: 0, height: 0, scale: 0.98 }}
                            className="bg-[#050505] border border-white/10 rounded-[32px] overflow-hidden print:border-black"
                        >
                            <div className="p-1 items-center justify-center flex bg-white/[0.02] border-b border-white/5 h-12">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 flex items-center gap-2">
                                    <Lock size={10} /> ClinicalMetrics (Private)
                                </span>
                            </div>
                            <div className="p-8 grid md:grid-cols-3 gap-8">
                                <ClinicalMetric label="Engagement Quality" value={data?.therapistMetrics.engagement} />
                                <ClinicalMetric label="Time Coverage" value={data?.therapistMetrics.timeCoverage} />
                                <ClinicalMetric label="Risk Signals" value={data?.therapistMetrics.riskSignals} warning={data?.therapistMetrics.riskSignals.includes("Elevated")} />
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Footer Actions */}
                <div className="pt-12 pb-20 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5 print:hidden">
                    <button
                        onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                    >
                        {isPrivacyMode ? <Eye size={14} /> : <EyeOff size={14} />}
                        {isPrivacyMode ? "Show Sensitive Data" : "Hide Sensitive Data"}
                    </button>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleShare}
                            className="flex-1 md:flex-none py-3 px-6 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold text-white uppercase tracking-wider transition-all"
                        >
                            Share
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex-1 md:flex-none py-3 px-6 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                        >
                            <Download size={14} /> Download PDF
                        </button>
                    </div>
                </div>

                <section className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-white/5 rounded-[24px] p-8 print:border-gray-200">
                    <h2 className="text-xl font-serif text-white mb-4 print:text-black">Recommended Next Steps</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 print:bg-gray-100 print:text-black">1</div>
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 print:text-black">Export for your Therapist</h3>
                                <p className="text-xs text-white/50 leading-relaxed print:text-black/70">Share this report to save time on &quot;catching up&quot; and focus on deep work.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 print:bg-gray-100 print:text-black">2</div>
                            <div>
                                <h3 className="text-sm font-bold text-white mb-1 print:text-black">Reflect on &quot;{data?.emotionalThemes[0]?.theme || 'Balance'}&quot;</h3>
                                <p className="text-xs text-white/50 leading-relaxed print:text-black/70">Use the Journal to explore this theme further while it&apos;s fresh in your mind.</p>
                            </div>
                        </div>
                    </div>
                </section>
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
