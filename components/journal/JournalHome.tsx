'use client'

import { motion } from 'framer-motion'
import { PenLine, Sparkles, BookOpen, Brain, Mic, MessageSquare } from 'lucide-react'

interface JournalHomeProps {
    onBegin: () => void
    onOneLine: () => void
}

export default function JournalHome({ onBegin, onOneLine }: JournalHomeProps) {
    return (
        <div className="space-y-12 pb-32">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-3"
            >
                <h1 className="text-3xl md:text-4xl font-serif text-white/90">Today</h1>
                <p className="text-gray-500 text-sm max-w-sm mx-auto">
                    What would you like to capture?
                </p>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid gap-4"
            >
                {/* One Line Journal - Primary */}
                <button
                    onClick={onOneLine}
                    className="group relative p-6 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10 border border-white/10 rounded-2xl text-left hover:border-blue-500/30 transition-all active:scale-[0.98] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-white/5">
                            <PenLine size={22} className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">One Line Journal</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                Just one sentence. Quick, simple, powerful.
                            </p>
                        </div>
                    </div>
                </button>

                {/* Full Journal Entry */}
                <button
                    onClick={onBegin}
                    className="group relative p-6 bg-white/[0.02] border border-white/10 rounded-2xl text-left hover:border-white/20 transition-all active:scale-[0.98]"
                >
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-white/5">
                            <BookOpen size={22} className="text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white/90 mb-1 group-hover:text-white transition-colors">Full Journal Entry</h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Write freely with guided prompts and categories.
                            </p>
                        </div>
                    </div>
                </button>
            </motion.div>

            {/* AI Features - Coming Soon */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
            >
                <h2 className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase px-1">AI Features</h2>

                <div className="grid gap-3">
                    {/* AI Reflection */}
                    <div className="group relative p-5 bg-white/[0.02] border border-white/5 rounded-2xl opacity-60 cursor-not-allowed">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/10">
                                <Brain size={18} className="text-purple-400/60" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-white/60">AI Reflection</h3>
                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-gray-500 uppercase">Soon</span>
                                </div>
                                <p className="text-xs text-gray-600">Let AI help you reflect on your entries</p>
                            </div>
                        </div>
                    </div>

                    {/* Voice Journal */}
                    <div className="group relative p-5 bg-white/[0.02] border border-white/5 rounded-2xl opacity-60 cursor-not-allowed">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 border border-green-500/10">
                                <Mic size={18} className="text-green-400/60" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-white/60">Voice Journal</h3>
                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-gray-500 uppercase">Soon</span>
                                </div>
                                <p className="text-xs text-gray-600">Speak your thoughts, we&apos;ll transcribe them</p>
                            </div>
                        </div>
                    </div>

                    {/* AI Prompts */}
                    <div className="group relative p-5 bg-white/[0.02] border border-white/5 rounded-2xl opacity-60 cursor-not-allowed">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0 border border-orange-500/10">
                                <Sparkles size={18} className="text-orange-400/60" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-white/60">AI Prompts</h3>
                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-gray-500 uppercase">Soon</span>
                                </div>
                                <p className="text-xs text-gray-600">Personalized writing prompts by AI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

