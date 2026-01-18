'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export function CompletionScreen() {
    return (
        <div className="min-h-screen bg-[#030305] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Dynamic Ambient Background */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 2 }}
                className={`absolute inset-0 bg-gradient-radial from-emerald-500/10 via-emerald-500/5 to-transparent pointer-events-none`}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center text-center max-w-md space-y-8 md:space-y-12"
            >
                {/* Minimalist Success Icon */}
                <div className="relative">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] backdrop-blur-xl shadow-2xl"
                    >
                        <Check size={32} className="text-emerald-400" strokeWidth={1.5} />
                    </motion.div>
                </div>

                <div className="space-y-3 md:space-y-4 px-4">
                    <h2 className="text-3xl md:text-4xl font-serif font-light text-white tracking-tight">Insight Captured</h2>
                    <p className="text-sm md:text-base text-white/40 leading-relaxed font-light font-sans max-w-xs mx-auto">
                        Your consciousness has been logged.<br />
                        We&apos;re analyzing the patterns now.
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
