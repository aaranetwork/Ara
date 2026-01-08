'use client'

import { motion } from 'framer-motion'

import {
    Activity,
    Calendar,
    TrendingUp,
    Brain,
    Clock,
    AlertCircle,
    CheckCircle2,
    MessageSquare,
    ChevronDown,
    Download
} from 'lucide-react'
import { useState } from 'react'
import { useFeatureGate } from '@/hooks/useFeatureGate'
import { Lock } from 'lucide-react'

export default function TherapistReportPage() {
    const [timeRange, setTimeRange] = useState('7d')

    // Feature Access Check
    const { canAccess, getUnlockProgress } = useFeatureGate()
    const hasAccess = canAccess('reports')
    const { current, required } = getUnlockProgress()
    const isLocked = !hasAccess

    if (isLocked) {
        return (
            <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center">
                <div className="max-w-md space-y-6">
                    <div className="w-20 h-20 mx-auto rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center">
                        <Lock size={32} className="text-white/40" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Analyzing Your Journey</h1>
                        <p className="text-white/60 leading-relaxed">
                            Reports become available once enough context is collected.
                            We need a few more days of activity to generate meaningful clinical insights.
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-white/40">Context Collected</span>
                            <span className="font-bold">{current}/{required} Days</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-1000"
                                style={{ width: `${(current / required) * 100}%` }}
                            />
                        </div>
                    </div>

                    <p className="text-xs text-white/30">
                        This ensures your report reflects your true patterns, not just a snapshot.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-black tracking-tight"
                        >
                            Therapist Report
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/60 mt-2"
                        >
                            Summary analysis for clinical review
                        </motion.p>
                    </div>

                    <div className="flex items-center gap-3">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        >
                            <option value="7d">Last 7 Days</option>
                            <option value="14d">Last 14 Days</option>
                            <option value="30d">Last 30 Days</option>
                        </select>
                        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                            <Download size={16} />
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Average Mood', value: '7.2', trend: '+0.5', icon: Activity, color: 'text-green-400' },
                        { label: 'Journal Entries', value: '12', trend: 'High', icon: BookOpen, color: 'text-blue-400' },
                        { label: 'Check-in Rate', value: '85%', trend: 'Consistent', icon: CheckCircle2, color: 'text-purple-400' },
                        { label: 'Anxiety Level', value: 'Low', trend: '-10%', icon: Brain, color: 'text-orange-400' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl hover:bg-white/[0.05] transition-colors"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className="text-xs font-medium text-white/40 bg-white/5 px-2 py-1 rounded-full">
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                            <p className="text-sm text-white/40 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Analysis & Insights */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Weekly Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8"
                        >
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="text-blue-400" size={24} />
                                Emotional Trajectory
                            </h2>

                            {/* Placeholder for Chart */}
                            <div className="h-64 w-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-0 flex items-end justify-between px-8 pb-8 opacity-30">
                                    {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                                        <div
                                            key={i}
                                            className="w-8 bg-blue-500 rounded-t-lg transition-all duration-500 group-hover:bg-blue-400"
                                            style={{ height: `${h}%` }}
                                        />
                                    ))}
                                </div>
                                <span className="text-white/40 font-medium z-10">Detailed visualization coming soon</span>
                            </div>
                        </motion.div>

                        {/* Recent Insights */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8"
                        >
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Brain className="text-purple-400" size={24} />
                                Clinical Insights
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { title: "Improved Sleep Pattern", desc: "User reported better sleep quality correlating with evening meditation sessions.", type: "positive" },
                                    { title: "Mid-week Stress Peak", desc: "Consistently higher anxiety levels observed on Wednesdays. Worth exploring triggers.", type: "neutral" },
                                    { title: "Coping Mechanism Usage", desc: "Increased utilization of breathing exercises during high-stress moments.", type: "positive" }
                                ].map((insight, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${insight.type === 'positive' ? 'bg-green-500' : 'bg-yellow-500'
                                            }`} />
                                        <div>
                                            <h4 className="font-semibold text-white/90">{insight.title}</h4>
                                            <p className="text-sm text-white/60 mt-1 leading-relaxed">{insight.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Recent Activity */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 h-full"
                        >
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Clock className="text-orange-400" size={24} />
                                Recent Timeline
                            </h2>
                            <div className="relative pl-4 border-l border-white/10 space-y-8">
                                {[
                                    { title: "Mood Check-in", time: "2 hours ago", desc: "Feeling calm and focused", type: "mood" },
                                    { title: "Journal Entry", time: "Yesterday, 8:30 PM", desc: "Reflection on work stress", type: "journal" },
                                    { title: "Weekly Goal Met", time: "Yesterday, 2:00 PM", desc: "Completed 3 meditation sessions", type: "goal" },
                                    { title: "Therapy Notes", time: "Jan 03", desc: "Session summary added", type: "note" },
                                ].map((item, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#050505] border-2 border-white/20" />
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-white/40 font-mono tracking-wide">{item.time}</span>
                                            <h4 className="font-medium text-white/90">{item.title}</h4>
                                            <p className="text-sm text-white/50">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full mt-8 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white/60 transition-colors">
                                View Full History
                            </button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function BookOpen({ size, className }: { size?: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size || 24}
            height={size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    )
}
