'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
    Zap,
    Lock,
    ArrowLeft,
    ChevronLeft
} from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs, Timestamp } from 'firebase/firestore'

// --- Types ---
type ReportData = {
    dateRange: string
    summary: string[]
    emotionalThemes: { theme: string; observation: string }[]
    behaviors: { signal: string; status: string }[]
    contexts: { category: string; triggers: string[] }[]
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
    const router = useRouter()
    const { user } = useAuth()
    const [loading, setLoading] = useState(true)
    const [isTherapistView, setIsTherapistView] = useState(false)
    const [isPrivacyMode, setIsPrivacyMode] = useState(false)

    // Default Empty State
    const [data, setData] = useState<ReportData>({
        dateRange: "Loading...",
        summary: [],
        emotionalThemes: [],
        behaviors: [],
        contexts: [],
        strengths: [],
        therapistMetrics: { engagement: "-", timeCoverage: "-", riskSignals: "-" },
        metrics: { avgMood: "-", totalEntries: 0, checkInRate: "-", anxietyLevel: "-" }
    })

    // State for tracking active days
    const [uniqueDaysCount, setUniqueDaysCount] = useState(0)

    // --- Data Fetching & Analysis Engine ---
    useEffect(() => {
        async function fetchAndAnalyze() {
            if (!user) return

            try {
                // 1. Fetch Moods
                const moodsRef = collection(db, 'users', user.uid, 'moods')
                const moodSnapshot = await getDocs(query(moodsRef, orderBy('createdAt', 'desc')))
                const moods = moodSnapshot.docs.map(doc => ({
                    val: doc.data().value,
                    date: doc.data().createdAt.toDate()
                }))

                // 2. Fetch Journals (assuming 'journals' collection)
                const journalsRef = collection(db, 'users', user.uid, 'journals')
                // Note: If journals don't exist yet, this will just be empty, which is fine
                let journals: any[] = []
                try {
                    const journalSnapshot = await getDocs(query(journalsRef, orderBy('createdAt', 'desc')))
                    journals = journalSnapshot.docs.map(doc => ({
                        text: doc.data().content || "",
                        tags: doc.data().tags || [],
                        date: doc.data().createdAt.toDate()
                    }))
                } catch (e) {
                    console.log("No journals found or error fetching", e)
                }

                // 3. Analysis Logic (The "Brain")
                const now = new Date()
                const oneMonthAgo = new Date()
                oneMonthAgo.setDate(now.getDate() - 30)

                // Filter last 30 days -- careful with type safety on dates if Firestore timestamps behave oddly
                const recentMoods = moods.filter(m => m.date >= oneMonthAgo)
                const recentJournals = journals.filter(j => j.date >= oneMonthAgo)

                // Calculate Active Days (Moods + Journals)
                const allDates = [
                    ...recentMoods.map(m => m.date),
                    ...recentJournals.map(j => j.date)
                ]
                const uniqueDays = new Set(allDates.map(d => d.toDateString())).size

                // A. Metrics
                const avgMoodVal = recentMoods.length > 0
                    ? (recentMoods.reduce((acc, m) => acc + m.val, 0) / recentMoods.length)
                    : 0

                const avgMood = avgMoodVal > 0 ? avgMoodVal.toFixed(1) : "-"
                const totalEntries = recentJournals.length

                // Check-in rate (approximate days active / 30)
                const checkInRate = Math.round((uniqueDays / 30) * 100) + "%"

                // Anxiety Proxy (Low mood count)
                const lowMoods = recentMoods.filter(m => m.val <= 3).length
                const anxietyLevel = lowMoods > 5 ? "Elevated" : lowMoods > 2 ? "Moderate" : "Low"

                // B. Date Range
                const dateOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
                const rangeStr = `${oneMonthAgo.toLocaleDateString('en-US', dateOptions)} – ${now.toLocaleDateString('en-US', dateOptions)}`

                // C. Themes (Keyword Spotting)
                const textBlob = recentJournals.map(j => j.text.toLowerCase()).join(" ")
                const allTags = recentJournals.flatMap(j => j.tags)

                const themes = []
                if (textBlob.includes("work") || textBlob.includes("job") || textBlob.includes("deadline")) {
                    themes.push({ theme: "Professional Focus", observation: "Unusual frequency of work-related keywords detected." })
                }
                if (textBlob.includes("sleep") || textBlob.includes("tired") || textBlob.includes("awake")) {
                    themes.push({ theme: "Rest & Recovery", observation: "Sleep patterns mentioned frequently in recent entries." })
                }
                if (textBlob.includes("family") || textBlob.includes("friend") || textBlob.includes("social")) {
                    themes.push({ theme: "Social Dynamics", observation: "Interpersonal relationships are a key focus area." })
                }
                if (themes.length === 0) {
                    themes.push({ theme: "General Reflection", observation: "Diverse topics covered without a single dominant outlier." })
                }

                // D. Behaviors (Timing)
                const behaviors = []
                const morningEntries = recentJournals.filter(j => j.date.getHours() < 12).length
                const nightEntries = recentJournals.filter(j => j.date.getHours() > 20).length

                if (nightEntries > morningEntries) behaviors.push({ signal: "Night Owl Reflection", status: "Primary activity window: 8PM - 4AM" })
                else behaviors.push({ signal: "Morning Clarity", status: "Primary activity window: 5AM - 12PM" })

                behaviors.push({ signal: "Consistency", status: `Active ${uniqueDays} out of last 30 days` })

                // E. Summary
                const summary = [
                    `User logged ${recentMoods.length} mood check-ins and ${recentJournals.length} journal entries in the last 30 days.`,
                    `Average emotional baseline is ${avgMoodVal > 5 ? "positive" : "challenging"} (${avgMood}/10).`,
                    `Most active analysis period is ${nightEntries > morningEntries ? "Late Evening" : "Morning"} .`,
                    lowMoods > 3 ? "Recurrent periods of low mood detected; refer to specific journal dates." : "Emotional stability appears high with few outlier events."
                ]

                // F. Strengths
                const strengths = []
                if (uniqueDays > 10) strengths.push("Consistent Self-Reflection")
                if (avgMoodVal > 6) strengths.push("High Emotional Baseline")
                if (recentJournals.length > 5) strengths.push("Articulate Expression")
                if (strengths.length === 0) strengths.push("Emerging Self-Awareness")


                setData({
                    dateRange: rangeStr,
                    summary,
                    emotionalThemes: themes,
                    behaviors,
                    contexts: [
                        { category: "Activity", triggers: ["Journaling", "Mood Tracking"] },
                        { category: "Temporal", triggers: [nightEntries > morningEntries ? "Nighttime" : "Morning"] }
                    ],
                    strengths,
                    therapistMetrics: {
                        engagement: uniqueDays > 15 ? "High" : uniqueDays > 5 ? "Moderate" : "Low", // logic based on unique days
                        timeCoverage: nightEntries > morningEntries ? "Evening Bias" : "Morning Bias",
                        riskSignals: lowMoods > 5 ? "Elevated Low Moods" : "None Detected"
                    },
                    metrics: {
                        avgMood,
                        totalEntries,
                        checkInRate,
                        anxietyLevel
                    }
                })

                setUniqueDaysCount(uniqueDays)
                setLoading(false)

            } catch (error) {
                console.error("Failed to generate report", error)
                setLoading(false)
            }
        }

        fetchAndAnalyze()
    }, [user])

    // --- Actions ---
    const handlePrint = () => {
        window.print()
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'AARA Reflection Report',
                    text: `My AARA Report: ${data.metrics.avgMood} Average Mood`,
                    url: window.location.href,
                })
            } catch (err) {
                console.log('Share canceled')
            }
        } else {
            alert("Sharing not supported on this browser (Try Mobile).")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10" />
                    <div className="h-4 w-32 bg-white/10 rounded" />
                </div>
            </div>
        )
    }

    // 6-Day Lock Screen
    if (uniqueDaysCount < 6) {
        return (
            <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans flex flex-col items-center justify-center p-6 text-center">
                <div className="max-w-md w-full space-y-8">

                    {/* Header with Back */}
                    <div className="absolute top-6 left-6">
                        <Link href="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
                            <ArrowLeft size={20} className="text-zinc-400" />
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/10">
                            <Activity className="text-indigo-500" size={32} />
                        </div>
                        <h1 className="text-3xl font-serif tracking-tight">Pattern Analysis in Progress</h1>
                        <p className="text-zinc-500 leading-relaxed">
                            AARA needs sufficient data to identify meaningful clinical patterns.
                        </p>
                    </div>

                    {/* Progress Visualization */}
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8">
                        <div className="flex justify-between items-end mb-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-1">Context Collected</p>
                                <p className="text-4xl font-mono font-bold text-white">
                                    {uniqueDaysCount}<span className="text-zinc-700">/6</span> <span className="text-lg text-zinc-600 font-sans font-normal">Days</span>
                                </p>
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                                <Zap size={18} className="animate-pulse" />
                            </div>
                        </div>

                        {/* Steps */}
                        <div className="relative pt-4 pb-2">
                            <div className="flex justify-between relative z-10">
                                {[0, 1, 2, 3, 4, 5, 6].map((step) => {
                                    const isCompleted = step <= uniqueDaysCount
                                    const isTarget = step === 6
                                    return (
                                        <div key={step} className="flex flex-col items-center gap-2">
                                            <div
                                                className={`w-3 h-3 rounded-full transition-all duration-500 border-2 ${isCompleted ? 'bg-indigo-500 border-indigo-500 scale-110' :
                                                        isTarget ? 'bg-zinc-800 border-zinc-700' : 'bg-transparent border-zinc-800'
                                                    }`}
                                            />
                                            {isTarget && <span className="absolute -right-2 -bottom-6 text-[10px] font-bold text-zinc-500">Report</span>}
                                        </div>
                                    )
                                })}
                            </div>
                            {/* Connecting Line */}
                            <div className="absolute top-[21px] left-0 w-full h-0.5 bg-zinc-900 -z-0">
                                <div
                                    className="h-full bg-indigo-500/50 transition-all duration-1000 ease-out"
                                    style={{ width: `${(uniqueDaysCount / 6) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-zinc-600 max-w-xs mx-auto">
                        Please continue journaling and checking in. Your full clinical report will unlock automatically on Day 6.
                    </p>

                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-700/30 pb-20 print:bg-white print:text-black">

            {/* Top Navigation Bar */}
            <nav className="border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl fixed top-0 w-full z-50 print:hidden">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                            <ArrowLeft size={18} className="text-zinc-400" />
                        </Link>
                        <div className="h-6 w-[1px] bg-white/10" />
                        <div className="flex items-center gap-3">
                            <Image src="/aara-logo.png" alt="AARA" width={24} height={24} className="rounded-md" />
                            <span className="text-sm font-medium text-zinc-400 tracking-wide uppercase">Reflection Report</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-zinc-900/50 p-1 rounded-lg border border-white/5">
                            <button
                                onClick={() => setIsTherapistView(false)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${!isTherapistView ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                User View
                            </button>
                            <button
                                onClick={() => setIsTherapistView(true)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${isTherapistView ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Therapist View
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 pt-32 space-y-12">

                {/* 1. Header Section */}
                <header className="space-y-6 pb-8 border-b border-white/5 print:border-black/10">
                    <div className="flex items-start justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase tracking-wider">
                                <Calendar size={12} />
                                <span>{data.dateRange}</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-tight print:text-black">
                                Evaluation & Pattern Summary
                            </h1>
                            <p className="text-zinc-400 print:text-black/60">
                                Generated for <span className="text-white font-semibold print:text-black">{user?.displayName || "AARA User"}</span>
                            </p>
                        </div>
                        <div className="bg-zinc-900 border border-white/5 rounded-full p-2 print:hidden">
                            <ShieldCheck className="text-zinc-600" size={20} />
                        </div>
                    </div>

                    <div className="bg-zinc-900/30 border border-white/5 rounded-lg p-4 flex gap-3 print:bg-gray-100 print:border-gray-300">
                        <Activity className="text-zinc-600 shrink-0 mt-0.5" size={16} />
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium max-w-xl print:text-black/70">
                            <strong className="text-zinc-400 print:text-black">Non-Diagnostic Disclaimer:</strong> This report relies on self-reported data ({data.metrics.totalEntries} entries detected) and linguistic pattern analysis. It is designed to assist clinical inquiry, not to provide independent medical diagnosis or treatment advice.
                        </p>
                    </div>
                </header>

                {/* 2. Executive Summary */}
                <section>
                    <SectionTitle icon={FileText} title="Executive Summary" />
                    <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-6 md:p-8 print:border-gray-300 print:bg-white">
                        <ul className="space-y-4">
                            {data.summary.map((point, i) => (
                                <li key={i} className="flex gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-2 shrink-0" />
                                    <p className="text-sm md:text-base text-zinc-300 leading-relaxed print:text-black">{point}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* 3. Emotional Themes */}
                <section className={`${isPrivacyMode ? 'blur-sm select-none' : ''} transition-all duration-500`}>
                    <SectionTitle icon={Brain} title="Emotional Themes (Detected)" />
                    <div className="grid md:grid-cols-2 gap-4">
                        {data.emotionalThemes.map((theme, i) => (
                            <div key={i} className="bg-zinc-900/20 border border-white/5 rounded-xl p-5 hover:bg-zinc-900/40 transition-colors print:border-gray-300">
                                <h3 className="text-sm font-semibold text-zinc-200 mb-2 print:text-black">{theme.theme}</h3>
                                <p className="text-xs text-zinc-500 leading-relaxed border-l-2 border-zinc-800 pl-3 print:text-black/70 print:border-gray-400">
                                    {theme.observation}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Behavioral Tendencies */}
                <section>
                    <SectionTitle icon={Activity} title="Behavioral Signals" />
                    <div className="space-y-3">
                        {data.behaviors.map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/20 border border-white/5 rounded-lg print:border-gray-300">
                                <span className="text-sm font-medium text-zinc-300 print:text-black">{item.signal}</span>
                                <span className="text-xs text-zinc-500 font-mono bg-zinc-900 px-2 py-1 rounded border border-white/5 print:bg-gray-100 print:text-black">
                                    {item.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. Metrics Grid (New) */}
                <section>
                    <SectionTitle icon={Zap} title="Quantitative Metrics" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricBox label="Avg Mood" value={data.metrics.avgMood} />
                        <MetricBox label="Entries" value={data.metrics.totalEntries.toString()} />
                        <MetricBox label="Consistency" value={data.metrics.checkInRate} />
                        <MetricBox label="Est. Anxiety" value={data.metrics.anxietyLevel} />
                    </div>
                </section>

                {/* 6. Strengths */}
                <section>
                    <SectionTitle icon={ShieldCheck} title="Strengths & Protective Factors" />
                    <div className="bg-gradient-to-br from-zinc-900/40 to-zinc-900/10 border border-white/5 rounded-xl p-6 print:border-gray-300 print:from-white print:to-white">
                        <div className="flex flex-wrap gap-3">
                            {data.strengths.map((str, i) => (
                                <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full bg-zinc-800/50 border border-white/10 text-xs text-zinc-300 font-medium print:bg-gray-200 print:text-black">
                                    {str}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. Therapist View (Toggle Content) */}
                <AnimatePresence>
                    {isTherapistView && (
                        <motion.section
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-8 pt-8 border-t border-dashed border-zinc-800 print:border-black">
                                <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-6 print:bg-white print:border-black">
                                    <div className="flex items-center gap-2 mb-6 text-indigo-400 print:text-black">
                                        <Lock size={16} />
                                        <h3 className="text-sm font-bold uppercase tracking-widest">Clinical Metadata</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div>
                                            <p className="text-[10px] uppercase text-zinc-500 font-semibold mb-1 print:text-black">Engagement</p>
                                            <p className="text-sm text-zinc-200 print:text-black">{data.therapistMetrics.engagement}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-zinc-500 font-semibold mb-1 print:text-black">Coverage</p>
                                            <p className="text-sm text-zinc-200 print:text-black">{data.therapistMetrics.timeCoverage}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase text-zinc-500 font-semibold mb-1 print:text-black">Risk Signals</p>
                                            <p className="text-sm text-zinc-200 print:text-black">{data.therapistMetrics.riskSignals}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* 8. Actions */}
                <div className="pt-8 pb-16 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-white/5 mt-12 print:hidden">
                    <button
                        onClick={() => setIsPrivacyMode(!isPrivacyMode)}
                        className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                        {isPrivacyMode ? <Eye size={14} /> : <EyeOff size={14} />}
                        {isPrivacyMode ? "Show Sensitive Data" : "Hide Sensitive Data (Presentation Mode)"}
                    </button>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleShare}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-900 border border-white/10 text-sm font-medium hover:bg-zinc-800 transition-colors"
                        >
                            <Share2 size={16} /> Share
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-100 text-black text-sm font-bold hover:bg-zinc-200 transition-colors shadow-lg"
                        >
                            <Download size={16} /> Download PDF
                        </button>
                    </div>
                </div>

            </main>
        </div>
    )
}

function SectionTitle({ icon: Icon, title }: { icon: any, title: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 print:border-gray-300 print:bg-white">
                <Icon size={16} className="print:text-black" />
            </div>
            <h2 className="text-lg font-serif text-zinc-200 tracking-tight print:text-black">{title}</h2>
        </div>
    )
}

function MetricBox({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4 text-center print:border-gray-300 print:bg-white">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 print:text-black/60">{label}</p>
            <p className="text-xl font-bold text-white print:text-black">{value}</p>
        </div>
    )
}
