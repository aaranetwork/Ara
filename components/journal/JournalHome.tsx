'use client'

// Premium Journal Home
import { motion } from 'framer-motion'
import { PenLine, Sparkles, BookOpen, Brain, Mic, MessageSquare } from 'lucide-react'
import { TextBlurReveal } from '@/components/ui/TextBlurReveal'

interface JournalHomeProps {
    onBegin: () => void
    onOneLine: () => void
}

export default function JournalHome({ onBegin, onOneLine }: JournalHomeProps) {
    return (
        <div className="space-y-12 pb-32">
            {/* Header */}
            <div className="text-center space-y-4 pt-4">
                <TextBlurReveal
                    text="Your Chronicle"
                    className="text-3xl md:text-5xl font-serif text-white/90"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed"
                >
                    Capture the present moment. Reflect on your journey.
                </motion.p>
            </div>

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
                    className="group relative p-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-indigo-500/10 border border-white/10 rounded-3xl text-left hover:border-white/20 transition-all active:scale-[0.98] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-white/5 shadow-2xl">
                            <PenLine size={24} className="text-indigo-300" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-serif font-medium text-white mb-1 group-hover:text-indigo-200 transition-colors">One Line Journal</h3>
                            <p className="text-sm text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                                Just one sentence. Quick, simple, powerful.
                            </p>
                        </div>
                    </div>
                </button>

                {/* Full Journal Entry */}
                <button
                    onClick={onBegin}
                    className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-left hover:bg-white/[0.04] hover:border-white/10 transition-all active:scale-[0.98]"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border border-white/5 shadow-2xl">
                            <BookOpen size={24} className="text-white/40 group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-serif font-medium text-white/80 mb-1 group-hover:text-white transition-colors">Full Entry</h3>
                            <p className="text-sm text-white/40 leading-relaxed">
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
                className="space-y-6"
            >
                <div className="flex items-center gap-4 px-2">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <h2 className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase">Pro Features</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                <div className="grid gap-3">
                    {/* AI Reflection */}
                    <div className="group relative p-5 bg-white/[0.015] border border-white/5 rounded-2xl opacity-60 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-500 cursor-not-allowed">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/10">
                                <Brain size={18} className="text-purple-400/60" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-white/60">AI Reflection</h3>
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white/30 uppercase tracking-widest">Soon</span>
                                </div>
                                <p className="text-xs text-white/30 mt-0.5">Let AI help you reflect on your entries</p>
                            </div>
                        </div>
                    </div>

                    {/* Voice Journal */}
                    <div className="group relative p-5 bg-white/[0.015] border border-white/5 rounded-2xl opacity-60 grayscale hover:grayscale-0 hover:opacity-80 transition-all duration-500 cursor-not-allowed">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/10">
                                <Mic size={18} className="text-emerald-400/60" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-white/60">Voice Journal</h3>
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white/30 uppercase tracking-widest">Soon</span>
                                </div>
                                <p className="text-xs text-white/30 mt-0.5">Speak your thoughts, we&apos;ll transcribe them</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

