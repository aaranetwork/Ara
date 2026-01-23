'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs, deleteDoc, doc, where } from 'firebase/firestore'
import { Calendar, BookOpen, Loader2, Trash2, ChevronRight, Search, ArrowLeft } from 'lucide-react'
import { TextBlurReveal } from '@/components/ui/TextBlurReveal'
import Modal from '@/components/ui/Modal'

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

interface JournalHistoryProps {
    onBack: () => void
    onViewEntry: (entry: JournalEntry) => void
}

const CATEGORIES = [
    "therapy-prep", "daily-reflection", "anxiety", "relationships", "work", "self-discovery", "gratitude", "struggles", "other"
]

export default function JournalHistory({ onBack, onViewEntry }: JournalHistoryProps) {
    const { user } = useAuth()
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('all')
    const [sortBy, setSortBy] = useState<'desc' | 'asc'>('desc')
    const [entryToDelete, setEntryToDelete] = useState<string | null>(null)

    useEffect(() => {
        const loadEntries = async () => {
            if (!user || !db) {
                setLoading(false)
                return
            }

            try {
                const journalRef = collection(db, 'users', user.uid, 'journal')
                const journalQuery = query(journalRef, orderBy('createdAt', sortBy))
                const snapshot = await getDocs(journalQuery)

                const loadedEntries = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt
                })) as JournalEntry[]

                setEntries(loadedEntries)
            } catch (error) {
                console.error('Error loading journal entries:', error)
            } finally {
                setLoading(false)
            }
        }

        loadEntries()
    }, [user, sortBy])

    const handleDelete = (e: React.MouseEvent, entryId: string) => {
        e.stopPropagation()
        setEntryToDelete(entryId)
    }

    const confirmDelete = async () => {
        if (!user || !db || !entryToDelete) return

        try {
            await deleteDoc(doc(db, 'users', user.uid, 'journal', entryToDelete))
            setEntries(prev => prev.filter(entry => entry.id !== entryToDelete))
            setEntryToDelete(null)
        } catch (error) {
            console.error('Error deleting entry:', error)
        }
    }

    const filteredEntries = entries.filter(entry => {
        const matchesSearch = entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (entry.title?.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesCategory = filterCategory === 'all' || entry.category === filterCategory
        return matchesSearch && matchesCategory
    })

    // Grouping by month
    const groupedEntries: { [key: string]: JournalEntry[] } = {}
    filteredEntries.forEach(entry => {
        const date = entry.createdAt?.toDate ? entry.createdAt.toDate() : new Date()
        const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        if (!groupedEntries[monthYear]) groupedEntries[monthYear] = []
        groupedEntries[monthYear].push(entry)
    })

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="w-8 h-8 text-white/40 animate-spin" />
                <p className="text-sm text-white/40">Loading history...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-40 max-w-5xl mx-auto pt-24 px-4 md:px-8">
            {/* Header */}
            <header className="flex items-center justify-between pb-4">
                <button
                    onClick={onBack}
                    className="p-2.5 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all bg-white/[0.02] border border-white/5"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">All Entries</h1>
                <div className="w-10" />
            </header>

            {/* Controls */}
            <div className="space-y-6">
                <div className="relative group">
                    <Search size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search your journey..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/5 rounded-[24px] py-4 pl-14 pr-6 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-indigo-500/30 focus:bg-white/[0.04] transition-all"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide pb-2 px-1">
                        <button
                            onClick={() => setFilterCategory('all')}
                            className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap transition-all border ${filterCategory === 'all' ? 'bg-white text-black border-white' : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white/60'
                                }`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase whitespace-nowrap transition-all border ${filterCategory === cat ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white/60'
                                    }`}
                            >
                                {cat.replace('-', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">Sort By:</span>
                            <button
                                onClick={() => setSortBy(prev => prev === 'desc' ? 'asc' : 'desc')}
                                className="text-[10px] font-black tracking-widest text-indigo-400 uppercase hover:text-indigo-300 transition-colors"
                            >
                                {sortBy === 'desc' ? 'Newest First ▼' : 'Oldest First ▲'}
                            </button>
                        </div>
                        <span className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
                            {filteredEntries.length} {filteredEntries.length === 1 ? 'Entry' : 'Entries'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Entries List */}
            <div className="space-y-12">
                {Object.keys(groupedEntries).length > 0 ? (
                    Object.entries(groupedEntries).map(([month, monthEntries]) => (
                        <div key={month} className="space-y-6">
                            <div className="flex items-center gap-6 px-2">
                                <h3 className="text-[11px] font-black tracking-[0.4em] text-white/60 uppercase whitespace-nowrap">{month}</h3>
                                <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {monthEntries.map((entry, idx) => (
                                    <motion.button
                                        key={entry.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => onViewEntry(entry)}
                                        className="group relative p-6 bg-white/[0.015] border border-white/5 rounded-[32px] text-left hover:bg-white/[0.03] hover:border-white/10 transition-all overflow-hidden"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-white/20" />
                                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
                                                    {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                                </span>
                                            </div>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-[0.2em] ${entry.isOneLine ? 'bg-indigo-500/10 text-indigo-300' : 'bg-white/5 text-white/40'
                                                }`}>
                                                {entry.isOneLine ? 'One Line' : 'Full Entry'}
                                            </span>
                                        </div>

                                        <h4 className={`text-base font-serif font-medium mb-1 line-clamp-1 ${entry.isOneLine ? 'text-indigo-200/80' : 'text-white/80'}`}>
                                            {entry.title || (entry.isOneLine ? 'Quick Reflection' : 'Untitled Entry')}
                                        </h4>

                                        <p className="text-sm text-white/50 line-clamp-2 font-serif leading-relaxed">
                                            {entry.content}
                                        </p>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {entry.category && (
                                                    <span className="text-[9px] font-bold text-indigo-400/60 uppercase tracking-widest bg-indigo-500/5 px-2 py-0.5 rounded-lg border border-indigo-500/10">
                                                        🏷️ {entry.category.replace('-', ' ')}
                                                    </span>
                                                )}
                                                {entry.includeInReport && (
                                                    <span className="text-[9px] font-bold text-green-400/60 uppercase tracking-widest bg-green-500/5 px-2 py-0.5 rounded-lg border border-green-500/10">
                                                        ✓ In Report
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
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white/[0.01] border border-white/5 rounded-[40px] border-dashed">
                        <div className="w-16 h-16 rounded-full bg-white/[0.03] flex items-center justify-center mx-auto mb-6">
                            <BookOpen size={24} className="text-white/10" />
                        </div>
                        <h4 className="text-lg font-serif text-white/40 mb-2">No memories found</h4>
                        <p className="text-xs text-white/20 uppercase tracking-widest">Adjust your filters or start writing</p>
                        <button
                            onClick={() => { setSearchTerm(''); setFilterCategory('all'); }}
                            className="mt-8 text-[10px] font-black tracking-widest text-indigo-400 uppercase hover:text-indigo-300 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>


            <Modal
                isOpen={!!entryToDelete}
                onClose={() => setEntryToDelete(null)}
                title="Delete Entry"
            >
                <div className="space-y-6">
                    <p className="text-white/60 text-sm font-serif leading-relaxed">
                        Are you sure you want to delete this entry? This action cannot be undone and the memory will be lost forever.
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
        </div >
    )
}
