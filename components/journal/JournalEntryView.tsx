'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Trash2, Edit3, Calendar, Clock, MessageSquare, Check, X, ShieldCheck } from 'lucide-react'
import { deleteJournalEntry } from '@/app/actions/journal'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

interface JournalEntry {
    id: string
    title?: string
    content: string
    category?: string
    isOneLine: boolean
    createdAt: any
    mood?: number
    includeInReport?: boolean
}

interface JournalEntryViewProps {
    entry: JournalEntry
    onBack: () => void
    onEdit: (entry: JournalEntry) => void
    onDelete: (id: string) => void
}

const MOODS = [
    { value: 1, emoji: '😢', label: 'Very Low' },
    { value: 2, emoji: '😞', label: 'Low' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Excellent' }
]

export default function JournalEntryView({ entry, onBack, onEdit, onDelete }: JournalEntryViewProps) {
    const { user } = useAuth()
    const [isDeleting, setIsDeleting] = useState(false)

    const date = entry.createdAt?.toDate ? entry.createdAt.toDate() : new Date()
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const formattedTime = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    const mood = entry.mood ? MOODS.find(m => m.value === entry.mood) : null

    const handleConfirmDelete = async () => {
        if (!user) return
        setIsDeleting(true)
        const token = await user.getIdToken()
        const result = await deleteJournalEntry(token, entry.id)
        if (result.success) {
            onDelete(entry.id)
            onBack()
        } else {
            setIsDeleting(false)
            alert('Error deleting entry: ' + result.error)
        }
    }

    return (
        <div className="flex flex-col min-h-full max-w-4xl mx-auto pb-40 px-4 md:px-8 pt-24">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="p-2.5 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all bg-white/[0.02] border border-white/5 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onEdit(entry)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest"
                    >
                        <Edit3 size={14} /> Edit
                    </button>
                    <button
                        onClick={() => setIsDeleting(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="space-y-8">
                {/* Header Information */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-[0.2em] ${entry.isOneLine ? 'bg-indigo-500/10 text-indigo-300/80 border border-indigo-500/20' : 'bg-white/5 text-white/30 border border-white/5'
                            }`}>
                            {entry.isOneLine ? '✏️ One Line' : '📖 Full Entry'}
                        </span>
                        <div className="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={10} className="opacity-40" /> {formattedDate}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock size={10} className="opacity-40" /> {formattedTime}
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-serif text-white/70 leading-tight">
                        {entry.title || (entry.isOneLine ? 'Quick Reflection' : formattedDate)}
                    </h1>

                    {(entry.category || mood) && (
                        <div className="flex flex-wrap gap-2">
                            {entry.category && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/5">
                                    <span className="text-[10px] opacity-40">🏷️</span>
                                    <span className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">{entry.category.replace('-', ' ')}</span>
                                </div>
                            )}
                            {mood && (
                                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/[0.02] border border-white/5">
                                    <span className="text-sm leading-none">{mood.emoji}</span>
                                    <span className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">{mood.label}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="h-px bg-white/5" />

                {/* Body Text */}
                <article className="max-w-none pt-4">
                    <div className="text-white/80 text-lg md:text-xl leading-[1.8] whitespace-pre-wrap font-serif selection:bg-indigo-500/20 antialiased tracking-wide">
                        {entry.content}
                    </div>
                </article>

                {/* Protocol Info */}
                {entry.includeInReport && (
                    <div className="pt-8">
                        <div className="flex items-center gap-4 p-6 rounded-3xl bg-green-500/[0.03] border border-green-500/10">
                            <div className="w-10 h-10 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400/80">
                                <Check size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white/80">Clinical Integration</p>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Included in therapy report protocol</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Footer */}
                <div className="pt-20 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 text-[9px] font-black tracking-[0.2em] text-white/20 uppercase">
                        <ShieldCheck size={12} /> Secure, Private & Encrypted
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-sm bg-[#0A0A0C] border border-white/10 rounded-[32px] p-8 space-y-8 shadow-2xl"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center text-red-400 mx-auto">
                                <Trash2 size={32} />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-serif text-white/90">Delete Entry?</h3>
                                <p className="text-sm text-white/40 leading-relaxed">This action cannot be undone. This memory will be permanently removed.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setIsDeleting(false)}
                                    className="py-4 rounded-2xl bg-white/5 text-white/60 font-black text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="py-4 rounded-2xl bg-red-500/20 text-red-400 font-black text-[10px] tracking-widest uppercase hover:bg-red-500/30 transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
