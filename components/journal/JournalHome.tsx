'use client'

import { motion } from 'framer-motion'
import { PenLine, BookOpen, ChevronRight, Calendar, Brain, Mic, Trash2 } from 'lucide-react'
import { TextBlurReveal } from '@/components/ui/TextBlurReveal'
import Modal from '@/components/ui/Modal'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, limit, onSnapshot, deleteDoc, doc } from 'firebase/firestore'


interface JournalEntry {
    id: string
    title?: string
    content: string
    category?: string
    isOneLine: boolean
    createdAt: any
}

interface JournalHomeProps {
    onBegin: () => void
    onOneLine: () => void
    onViewHistory: () => void
    onViewInsights: () => void
    onViewEntry: (entry: JournalEntry) => void
}

export default function JournalHome({ onBegin, onOneLine, onViewHistory, onViewInsights, onViewEntry }: JournalHomeProps) {
    const { user } = useAuth()
    const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null)

    const handleDelete = (e: React.MouseEvent, entryId: string) => {
        e.stopPropagation()
        setEntryToDelete(entryId)
    }

    const confirmDelete = async () => {
        if (!user || !db || !entryToDelete) return

        try {
            await deleteDoc(doc(db, 'users', user.uid, 'journal', entryToDelete))
            setEntryToDelete(null)
        } catch (error) {
            console.error('Error deleting entry:', error)
        }
    }

    useEffect(() => {
        if (!user || !db) return

        const q = query(
            collection(db, 'users', user.uid, 'journal'),
            orderBy('createdAt', 'desc'),
            limit(5)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const entries = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as JournalEntry[]
            setRecentEntries(entries)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "tween",
                ease: [0.23, 1, 0.32, 1],
                duration: 0.8
            }
        }
    }

    const entryVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "tween",
                ease: [0.23, 1, 0.32, 1],
                duration: 0.5
            }
        }
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12 pb-32 max-w-5xl mx-auto pt-24 px-4 md:px-8"
        >
            {/* Hero Section */}
            <motion.div variants={itemVariants} className="text-center space-y-4">
                <TextBlurReveal
                    text="Your Chronicle"
                    className="text-3xl md:text-5xl font-serif text-white/90"
                />
                <p className="text-white/60 text-sm md:text-base max-w-sm mx-auto leading-relaxed font-serif italic">
                    Capture the present moment. Reflect on your journey.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* One Line Starter */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOneLine}
                    className="group relative p-8 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-indigo-500/10 border border-white/10 rounded-3xl text-left hover:border-white/20 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xl text-indigo-300">
                            <PenLine size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-serif font-medium text-white mb-1 group-hover:text-indigo-200 transition-colors">One Line Journal</h3>
                            <p className="text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">Just one sentence. Quick, simple, powerful.</p>
                        </div>
                    </div>
                </motion.button>

                {/* Full Entry Starter */}
                <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onBegin}
                    className="group relative p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-left hover:border-white/10 transition-all"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-2xl text-white/40">
                            <BookOpen size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-serif font-medium text-white/80 mb-1 group-hover:text-white transition-colors">Full Entry</h3>
                            <p className="text-sm text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">Write freely with guided prompts and categories.</p>
                        </div>
                    </div>
                </motion.button>
            </div>

            {/* Recent Entries Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Recent Entries</h2>
                    <button
                        onClick={onViewHistory}
                        className="text-[10px] font-black tracking-[0.2em] text-indigo-400 hover:text-indigo-300 uppercase transition-colors"
                    >
                        View All →
                    </button>
                </div>

                <div className="grid gap-3 min-h-[120px]">
                    {loading ? (
                        <div className="py-8 text-center animate-pulse">
                            <p className="text-white/20 text-xs font-serif italic">Gleaning your history...</p>
                        </div>
                    ) : recentEntries.length > 0 ? (
                        recentEntries.map((entry, idx) => (
                            <motion.button
                                key={entry.id}
                                variants={entryVariants}
                                whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.02)" }}
                                whileTap={{ scale: 0.995 }}
                                onClick={() => onViewEntry(entry)}
                                className="group p-5 bg-white/[0.015] border border-white/5 rounded-3xl text-left hover:border-white/10 transition-all"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={12} className="text-white/20" />
                                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                                            {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'}
                                            , {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''}
                                        </span>
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-[0.2em] ${entry.isOneLine ? 'bg-indigo-500/10 text-indigo-300' : 'bg-white/5 text-white/40'
                                        }`}>
                                        {entry.isOneLine ? 'One Line' : 'Full Entry'}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <h4 className={`text-base font-serif font-medium mb-1 line-clamp-1 ${entry.isOneLine ? 'text-indigo-200/80' : 'text-white/80'}`}>
                                        {entry.title || (entry.isOneLine ? 'Quick Reflection' : 'Untitled Entry')}
                                    </h4>
                                    <p className="text-sm text-white/50 line-clamp-2 font-serif leading-relaxed">
                                        {entry.content}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {entry.category && (
                                            <span className="text-[9px] font-bold text-indigo-400/60 uppercase tracking-widest bg-indigo-500/5 px-2 py-0.5 rounded-lg border border-indigo-500/10">
                                                🏷️ {entry.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => handleDelete(e, entry.id)}
                                            className="hidden md:block p-2 rounded-xl bg-red-500/0 text-white/0 group-hover:bg-red-500/10 group-hover:text-red-400 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <ChevronRight size={16} className="text-white/10 group-hover:text-white/40 transition-colors" />
                                    </div>
                                </div>
                            </motion.button>
                        ))
                    ) : (
                        <div className="py-12 text-center bg-white/[0.01] border border-white/5 rounded-3xl">
                            <p className="text-white/20 text-xs font-serif italic">Your journey begins with a single word.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Pro Features Section */}
            <motion.section variants={itemVariants} className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                    <h2 className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Pro Features</h2>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="group relative p-5 bg-white/[0.015] border border-white/5 rounded-2xl grayscale hover:grayscale-0 transition-all duration-500 cursor-not-allowed overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-transparent to-purple-500/0 group-hover:from-purple-500/5 transition-all duration-700" />
                        <div className="relative flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/10">
                                <Brain size={18} className="text-purple-400/60" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-white/80">AI Reflection</h3>
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white/50 uppercase tracking-widest">Soon</span>
                                </div>
                                <p className="text-xs text-white/60 mt-0.5">Let AI help you reflect on your entries</p>
                            </div>
                        </div>
                    </div>

                    <div className="group relative p-5 bg-white/[0.015] border border-white/5 rounded-2xl grayscale hover:grayscale-0 transition-all duration-500 cursor-not-allowed overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-transparent to-emerald-500/0 group-hover:from-emerald-500/5 transition-all duration-700" />
                        <div className="relative flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/10">
                                <Mic size={18} className="text-emerald-400/60" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-white/80">Voice Journal</h3>
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-white/50 uppercase tracking-widest">Soon</span>
                                </div>
                                <p className="text-xs text-white/60 mt-0.5">Speak your thoughts, we&apos;ll transcribe them</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>


            <Modal
                isOpen={!!entryToDelete}
                onClose={() => setEntryToDelete(null)}
                title="Delete Entry"
            >
                <div className="space-y-6">
                    <p className="text-white/60 text-sm font-serif leading-relaxed">
                        Are you sure you want to delete this entry? This action cannot be undone.
                    </p>
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={() => setEntryToDelete(null)}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </motion.div >
    )
}
