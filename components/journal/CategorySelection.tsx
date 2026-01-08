'use client'

import { motion } from 'framer-motion'
import {
    Plus,
    Heart,
    Sparkles,
    Zap,
    PenTool,
    MessageSquare,
    Smile,
    ArrowRight
} from 'lucide-react'

interface CategoryTheme {
    color: string
    bg: string
    border: string
    glow: string
    iconBg: string
}

export const CATEGORIES = [
    {
        id: 'general',
        title: 'General',
        desc: 'Capture whatever is on your mind',
        icon: MessageSquare,
        theme: {
            color: 'text-white', // Neutral icon
            bg: 'hover:bg-blue-500/5',
            border: 'hover:border-blue-500/20',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]',
            iconBg: 'bg-white/5' // Neutral bg
        }
    },
    {
        id: 'gratitude',
        title: 'Gratitude',
        desc: 'Acknowledge the good things',
        icon: Heart,
        theme: {
            color: 'text-white',
            bg: 'hover:bg-pink-500/5',
            border: 'hover:border-pink-500/20',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.2)]',
            iconBg: 'bg-white/5'
        }
    },
    {
        id: 'positivity',
        title: 'Positivity',
        desc: 'Focus on growth and light',
        icon: Smile,
        theme: {
            color: 'text-white',
            bg: 'hover:bg-amber-500/5',
            border: 'hover:border-amber-500/20',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]',
            iconBg: 'bg-white/5'
        }
    },
    {
        id: 'creativity',
        title: 'Creativity',
        desc: 'Ideate, dream, and play',
        icon: Sparkles,
        theme: {
            color: 'text-white',
            bg: 'hover:bg-purple-500/5',
            border: 'hover:border-purple-500/20',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.2)]',
            iconBg: 'bg-white/5'
        }
    },
    {
        id: 'kindness',
        title: 'Kindness',
        desc: 'Note acts of compassion',
        icon: Zap,
        theme: {
            color: 'text-white',
            bg: 'hover:bg-emerald-500/5',
            border: 'hover:border-emerald-500/20',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]',
            iconBg: 'bg-white/5'
        }
    },
    {
        id: 'productivity',
        title: 'Productivity',
        desc: 'Structure your day and goals',
        icon: PenTool,
        theme: {
            color: 'text-white',
            bg: 'hover:bg-cyan-500/5',
            border: 'hover:border-cyan-500/20',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.2)]',
            iconBg: 'bg-white/5'
        }
    },
    {
        id: 'free-write',
        title: 'Free Write',
        desc: 'Stream of consciousness',
        icon: Plus,
        theme: {
            color: 'text-white',
            bg: 'hover:bg-white/5',
            border: 'hover:border-white/20',
            glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]',
            iconBg: 'bg-white/5'
        }
    },
]

interface CategorySelectionProps {
    onSelect: (categoryId: string) => void
    onBack: () => void
}

export default function CategorySelection({ onSelect, onBack }: CategorySelectionProps) {
    return (
        <div className="space-y-6 md:space-y-12 pb-32">
            <div className="space-y-2 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400"
                >
                    <Sparkles size={12} className="text-white" /> New Session
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl md:text-4xl font-serif text-white leading-tight"
                >
                    Choose your focus
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs md:text-sm text-gray-500 max-w-sm mx-auto"
                >
                    Select a theme to guide your reflection today.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {CATEGORIES.map((cat, i) => {
                    const Icon = cat.icon
                    const theme = cat.theme || {
                        color: 'text-white',
                        bg: 'hover:bg-white/5',
                        border: 'hover:border-white/20',
                        glow: 'group-hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]',
                        iconBg: 'bg-white/5'
                    }

                    return (
                        <motion.button
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 + 0.3 }}
                            onClick={() => onSelect(cat.id)}
                            className={`
                                relative overflow-hidden group
                                flex items-center gap-4 p-4 md:p-6
                                bg-[#0e0e12] border border-white/5 rounded-2xl
                                text-left transition-all duration-500
                                ${theme.bg} ${theme.border} ${theme.glow}
                            `}
                        >
                            {/* Hover Gradient Overlay */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full ease-out`} style={{ transitionDuration: '1s' }} />

                            <div className={`relative w-10 h-10 md:w-12 md:h-12 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                                <Icon size={20} className={`${theme.color} transition-colors duration-300`} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-white mb-1 tracking-wider uppercase group-hover:text-white transition-colors">
                                    {cat.title}
                                </h3>
                                <p className="text-[10px] md:text-xs text-gray-600 font-medium group-hover:text-gray-400 transition-colors duration-300">
                                    {cat.desc}
                                </p>
                            </div>

                            <div className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-gray-500 hidden md:block">
                                <ArrowRight size={16} />
                            </div>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}
