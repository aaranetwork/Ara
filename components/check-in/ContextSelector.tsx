'use client'

import { motion } from 'framer-motion'

interface ContextSelectorProps {
    contextOptions: string[]
    selectedFactors: string[]
    onToggle: (factor: string) => void
    onSkip: () => void
}

export function ContextSelector({ contextOptions, selectedFactors, onToggle, onSkip }: ContextSelectorProps) {
    return (
        <div className="w-full max-w-lg mx-auto">
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                    <span className="text-2xl">🌸</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Context</span>
                </div>
            </motion.div>

            {/* Question */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-3xl font-serif text-center font-medium leading-tight text-white/90 mb-4 px-4"
            >
                What&apos;s influencing that?
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-white/40 text-center mb-12"
            >
                (Select all that apply)
            </motion.p>

            {/* Checkboxes */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 mb-8 px-4"
            >
                {contextOptions.map((option, index) => {
                    const isSelected = selectedFactors.includes(option)
                    return (
                        <motion.button
                            key={option}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.05 }}
                            onClick={() => onToggle(option)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 ${isSelected
                                ? 'bg-indigo-500/10 border-2 border-indigo-500/50'
                                : 'bg-white/[0.02] border-2 border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                                }`}
                        >
                            {/* Custom Checkbox */}
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${isSelected
                                ? 'bg-indigo-500 border-indigo-500'
                                : 'border-white/30'
                                }`}>
                                {isSelected && (
                                    <svg className="w-3 h-3 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M5 13l4 4L19 7"></path>
                                    </svg>
                                )}
                            </div>

                            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/70'
                                }`}>
                                {option}
                            </span>
                        </motion.button>
                    )
                })}
            </motion.div>

            {/* Skip hint */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-xs text-white/30 text-center mb-6"
            >
                This step is optional — feel free to skip
            </motion.p>

            {/* Skip button */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex justify-center px-4"
            >
                <button
                    onClick={onSkip}
                    className="text-sm text-white/40 hover:text-white/70 transition-colors px-6 py-2"
                >
                    Skip this step →
                </button>
            </motion.div>
        </div>
    )
}
