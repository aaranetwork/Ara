'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface EmotionPickerProps {
    emotionWords: string[]
    selectedEmotion: string
    onSelect: (emotion: string, isCustom: boolean) => void
}

export function EmotionPicker({ emotionWords, selectedEmotion, onSelect }: EmotionPickerProps) {
    const [customInput, setCustomInput] = useState('')
    const [showCustomInput, setShowCustomInput] = useState(false)

    const handlePillClick = (word: string) => {
        onSelect(word, false)
        setShowCustomInput(false)
        setCustomInput('')
    }

    const handleCustomSubmit = () => {
        if (customInput.trim()) {
            onSelect(customInput.trim(), true)
        }
    }

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
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Reflection</span>
                </div>
            </motion.div>

            {/* Question */}
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-3xl font-serif text-center font-medium leading-tight text-white/90 mb-12 px-4"
            >
                Pick one word that describes<br />how you're feeling:
            </motion.h2>

            {/* Emotion Pills */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap justify-center gap-3 mb-8 px-4"
            >
                {emotionWords.map((word, index) => (
                    <motion.button
                        key={word}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        onClick={() => handlePillClick(word)}
                        className={`px-5 py-3 rounded-full font-medium text-sm transition-all duration-200 ${selectedEmotion === word && !showCustomInput
                                ? 'bg-indigo-500 text-white border-2 border-indigo-500 scale-105'
                                : 'bg-white/[0.03] text-white/80 border-2 border-white/10 hover:bg-white/[0.06] hover:border-white/20'
                            }`}
                    >
                        {word}
                    </motion.button>
                ))}
            </motion.div>

            {/* Custom Input Option */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="px-4"
            >
                {!showCustomInput ? (
                    <button
                        onClick={() => setShowCustomInput(true)}
                        className="w-full text-sm text-white/40 hover:text-white/70 transition-colors py-2"
                    >
                        Or type your own...
                    </button>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-white/50 text-center">Or type your own:</p>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customInput}
                                onChange={(e) => setCustomInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && customInput.trim()) {
                                        handleCustomSubmit()
                                    }
                                }}
                                placeholder="e.g., confused, optimistic..."
                                autoFocus
                                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:border-indigo-500/50 focus:bg-white/[0.05] outline-none transition-all"
                            />
                            <button
                                onClick={handleCustomSubmit}
                                disabled={!customInput.trim()}
                                className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium text-sm hover:bg-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                Add
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                setShowCustomInput(false)
                                setCustomInput('')
                            }}
                            className="w-full text-xs text-white/30 hover:text-white/50 transition-colors py-1"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    )
}
