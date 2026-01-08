'use client'

import { useFeatureAccess } from '@/hooks/useFeatureAccess'
import { Activity, Lock, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function MoodChart({ labels, values, overallAvg, loading = false }: { labels?: string[], values?: number[], overallAvg?: string, loading?: boolean }) {
    const displayLabels = (labels && labels.length > 0) ? labels : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
    const displayValues = (values && values.length > 0) ? values : [0, 0, 0, 0, 0, 0, 0]

    // Calculate average if not provided
    const displayAvg = overallAvg || (() => {
        const validValues = displayValues.filter(v => v > 0)
        return validValues.length > 0
            ? (validValues.reduce((a, b) => a + b, 0) / validValues.length).toFixed(1)
            : '-'
    })()

    // Feature Access
    const { canAccess } = useFeatureAccess()
    const trendsAccess = canAccess('mood_trends')

    return (
        <div className={`p-6 bg-[#0e0e12] border border-white/5 rounded-3xl relative ${trendsAccess.hasAccess ? '' : 'opacity-80'}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                        {trendsAccess.hasAccess ? <Activity size={18} /> : <Lock size={18} />}
                    </div>
                    <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Mood Analytics</h3>
                        <p className="text-[9px] text-gray-600 font-medium">
                            {trendsAccess.hasAccess ? 'Weekly activity overview' : trendsAccess.label}
                        </p>
                    </div>
                </div>
                {trendsAccess.hasAccess && !loading && (
                    <Link href="/mood-flow">
                        <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                            <span className="text-lg font-bold text-white">{displayAvg}<span className="text-[10px] text-gray-500 ml-1 font-normal">avg</span></span>
                            <ChevronRight size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                    </Link>
                )}
            </div>

            <div className="h-48 relative">
                {/* Background Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none opacity-20 z-0">
                    <div className="w-full h-px bg-white/10"></div>
                    <div className="w-full h-px bg-white/10"></div>
                    <div className="w-full h-px bg-white/10"></div>
                </div>

                {/* The Bars */}
                <div className={`flex items-end justify-between w-full h-full gap-2 relative z-10 ${!trendsAccess.hasAccess ? 'opacity-30 blur-[2px]' : ''}`}>
                    {displayValues.map((v, i) => {
                        const height = Math.min(Math.max(v * 10, 2), 100)
                        const isPositive = v > 0

                        return (
                            <div key={i} className="h-full flex flex-col justify-end items-center gap-2 flex-1 group z-10">
                                <div className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0 h-4">
                                    {!loading && isPositive && v}
                                </div>
                                <div
                                    className={`w-full max-w-[24px] rounded-full transition-all duration-500 ${loading ? 'bg-white/5 animate-pulse' : (isPositive ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:bg-indigo-400' : 'bg-white/5')}`}
                                    style={{ height: loading ? '30%' : `${height}%` }}
                                />
                                <span className="text-[9px] font-bold text-gray-600 uppercase group-hover:text-gray-400 transition-colors">
                                    {displayLabels[i]}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {!trendsAccess.hasAccess && (
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                        <p className="text-xs font-semibold text-gray-300 flex items-center gap-2">
                            <Lock size={12} /> {trendsAccess.label}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
