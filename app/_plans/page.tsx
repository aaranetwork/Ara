'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Shield, ArrowRight, ArrowLeft } from 'lucide-react'
import { useFeatureGate } from '@/hooks/useFeatureGate'
import { useAuth } from '@/hooks/useAuth'
import { useState, useEffect } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function PlansPage() {
    const { activeDays, isPaid } = useFeatureGate()
    const { user, loading: authLoading } = useAuth()
    const isTrialExpired = !isPaid && activeDays > 3
    const [startingTrial, setStartingTrial] = useState(false)
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleStartTrial = async () => {
        if (!user || !db) return
        setStartingTrial(true)
        try {
            const userRef = doc(db as any, 'users', user.uid)
            // Initialize User for Trial
            await setDoc(userRef, {
                onboarding_completed: true,
                trial_started_at: new Date(),
                first_seen_at: new Date(),
                last_active_date: new Date().toISOString().split('T')[0],
                active_days_count: 1,
                is_paid: false
            }, { merge: true })

            // Add Free Subscription record
            const subRef = doc(db as any, 'users', user.uid, 'subscription', 'current')
            await setDoc(subRef, {
                plan: 'free_trial',
                createdAt: new Date().toISOString()
            }, { merge: true })

            window.location.href = '/'
        } catch (error) {
            console.error('Error starting trial:', error)
            setStartingTrial(false)
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    // Helper for render logic
    const currentPlan = isPaid ? 'plus' : 'free'

    if (!mounted || authLoading) return null

    return (
        <div className="min-h-[100dvh] bg-[#050505] text-white overflow-x-hidden">

            {/* Simple Header (No Navbar) */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-center z-20">
                <Image src="/aara-logo.png" alt="AARA" width={32} height={32} className="rounded-lg opacity-80" />
            </div>

            {/* Background Ambience */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <main className="min-h-[100dvh] flex flex-col justify-center pt-20 pb-10 px-4 relative z-10">
                <div className="max-w-md mx-auto w-full">

                    {/* Header Text */}
                    <div className="text-center mb-8 md:mb-12">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-4"
                        >
                            <Star size={10} fill="currentColor" />
                            Premium Access
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-black mb-3 md:mb-4 tracking-tight"
                        >
                            Unlock Clarity
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-sm md:text-base text-gray-400 max-w-xs mx-auto leading-relaxed"
                        >
                            Unlimited AI therapy, clinical reports, and deeper self-discovery.
                        </motion.p>
                    </div>

                    {/* Expiration Notice */}
                    {isTrialExpired && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3"
                        >
                            <Shield size={16} className="text-red-400 shrink-0" />
                            <div>
                                <p className="font-bold text-red-200 text-sm">Free Trial Ended</p>
                                <p className="text-[10px] text-red-400/80">Subscribe to regain access.</p>
                            </div>
                        </motion.div>
                    )}

                    {/* Plan Card (AARA Plus) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative bg-[#0e0e12] border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl mb-6"
                    >
                        {/* Gradient Glow */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-500/20 to-transparent pointer-events-none" />

                        <div className="p-6 relative">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-white">AARA Plus</h3>
                                    <p className="text-xs text-indigo-400 font-medium">Monthly Plan</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-3xl font-black text-white">₹299</span>
                                    <p className="text-[10px] text-gray-500">/month</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                {[
                                    'Unlimited Daily Check-ins',
                                    'Clinical Therapist Reports',
                                    'Therapist Matching',
                                    'Full History Retention',
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                            <Check size={10} className="text-indigo-400" />
                                        </div>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-3.5 bg-white text-black rounded-xl font-bold text-sm tracking-wide hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2">
                                Upgrade Now <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Start Trial Option */}
                    {currentPlan === 'free' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <button
                                onClick={handleStartTrial}
                                disabled={startingTrial}
                                className="text-xs text-gray-500 hover:text-white transition-colors underline decoration-gray-700 underline-offset-4"
                            >
                                {startingTrial ? 'Activating...' : 'Start 3-Day Free Trial'}
                            </button>
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    )
}
