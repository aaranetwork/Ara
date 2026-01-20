'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Insight, getPersonalizedMessage } from './utils/insightGenerator'

interface CheckInConfirmationProps {
    moodValue: number
    userId: string
    insights?: Insight[]
}

export function CheckInConfirmation({ moodValue, userId, insights = [] }: CheckInConfirmationProps) {
    const router = useRouter()
    const [displayedInsights, setDisplayedInsights] = useState<Insight[]>(insights)

    const personalizedMessage = getPersonalizedMessage(moodValue)

    return (
        <div className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-6">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full" />
            </div>

            <div className="relative z-10 w-full max-w-lg">
                {/* Checkmark animation */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="flex justify-center mb-12"
                >
                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center">
                        <motion.svg
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="w-10 h-10 text-indigo-400"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <motion.path d="M5 13l4 4L19 7" />
                        </motion.svg>
                    </div>
                </motion.div>

                {/* Personalized message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mb-8"
                >
                    <h2 className="text-2xl md:text-3xl font-serif text-white/90 mb-4 leading-relaxed">
                        "{personalizedMessage}"
                    </h2>
                    <p className="text-white/50 text-sm md:text-base">
                        You've taken the first step to clarify your thoughts.
                    </p>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"
                />

                {/* Insights */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-4 mb-10"
                >
                    {displayedInsights.map((insight, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + index * 0.1 }}
                            className="flex items-center gap-3 text-white/70"
                        >
                            <span className="text-2xl">{insight.icon}</span>
                            <span className="text-sm md:text-base">{insight.message}</span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <button
                        onClick={() => router.push('/mood-flow')}
                        className="flex-1 py-4 px-6 rounded-xl bg-white/[0.03] border border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white transition-all text-sm font-medium"
                    >
                        View Insights
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="flex-1 py-4 px-6 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all text-sm font-medium shadow-lg shadow-indigo-500/20"
                    >
                        Go to Dashboard
                    </button>
                </motion.div>
            </div>
        </div>
    )
}
