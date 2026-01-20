'use client'

import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Loader2, X, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getJournalEntries } from '@/app/actions/journal'
import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

interface CalendarViewProps {
    onBack: () => void
}

export default function CalendarView({ onBack }: CalendarViewProps) {
    const { user } = useAuth()
    const [entries, setEntries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean, entryId: string | null }>({ isOpen: false, entryId: null })

    useEffect(() => {
        const loadEntries = async () => {
            if (!user) return
            try {
                const token = await user.getIdToken()
                const res = await getJournalEntries(token)
                if (res.data) {
                    setEntries(res.data)
                }
            } catch (e) {
                console.error('Failed to load journal entries', e)
            } finally {
                setLoading(false)
            }
        }
        loadEntries()
    }, [user])

    const handleDelete = async (entryId: string, e?: React.MouseEvent) => {
        e?.stopPropagation()
        setDeleteConfirm({ isOpen: true, entryId })
    }

    const confirmDelete = async () => {
        const entryId = deleteConfirm.entryId
        if (!entryId) return

        try {
            if (!user || !db) return
            await deleteDoc(doc(db, 'users', user.uid, 'journal', entryId))

            // Optimistic update
            setEntries(prev => prev.filter(entry => entry.id !== entryId))
            if (selectedEntry?.id === entryId) {
                setSelectedEntry(null)
            }
            setDeleteConfirm({ isOpen: false, entryId: null })
        } catch (error) {
            console.error('Error deleting entry:', error)
            alert('Failed to delete entry')
        }
    }

    // Group by month
    const grouped = useMemo(() => {
        const groups = entries.reduce((acc: any, entry) => {
            const date = new Date(entry.createdAt || entry.updatedAt || Date.now())
            const month = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

            if (!acc[month]) acc[month] = []
            acc[month].push({ ...entry, dateObj: date })
            return acc
        }, {})

        // Sort entries within months
        Object.keys(groups).forEach(month => {
            groups[month].sort((a: any, b: any) => b.dateObj.getTime() - a.dateObj.getTime())
        })

        return groups
    }, [entries])

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-white/20" />
            </div>
        )
    }

    const deleteModal = typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
            {deleteConfirm.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setDeleteConfirm({ isOpen: false, entryId: null })}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-sm bg-[#1A1A1A] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden z-10"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                <Trash2 size={24} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-serif font-bold text-white">Delete Entry?</h3>
                                <p className="text-sm text-gray-400">
                                    Are you sure you want to delete this journal entry? This action cannot be undone.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 w-full pt-2">
                                <button
                                    onClick={() => setDeleteConfirm({ isOpen: false, entryId: null })}
                                    className="flex-1 py-3 px-4 rounded-xl bg-white/5 text-white/80 hover:bg-white/10 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-sm font-bold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    )

    // Entry Detail View
    if (selectedEntry) {
        const entryDate = new Date(selectedEntry.createdAt || selectedEntry.updatedAt || Date.now())
        return (
            <>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8 pb-32 relative"
                >
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedEntry(null)}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">
                                {entryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                            {selectedEntry.category && selectedEntry.category !== 'general' && (
                                <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">{selectedEntry.category}</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => handleDelete(selectedEntry.id)}
                        className="absolute top-0 right-0 p-3 rounded-full hover:bg-red-500/10 hover:text-red-500 text-white/20 transition-colors"
                        title="Delete Entry"
                    >
                        <Trash2 size={20} />
                    </button>

                    <div className="space-y-6">
                        {selectedEntry.title && (
                            <h1 className="text-2xl md:text-3xl font-serif text-white/90">{selectedEntry.title}</h1>
                        )}
                        <p className="text-lg md:text-xl leading-relaxed text-white/70 whitespace-pre-wrap">
                            {selectedEntry.content}
                        </p>
                    </div>
                </motion.div>
                {deleteModal}
            </>
        )
    }

    return (
        <div className="space-y-12 pb-32">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft size={18} />
                </button>
                <h2 className="text-xl font-serif text-white/90">Journal History</h2>
            </div>

            {entries.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p>No entries yet.</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {Object.entries(grouped).map(([month, monthEntries]: any) => (
                        <div key={month} className="space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-2">{month}</h3>
                            <div className="space-y-2">
                                {monthEntries.map((entry: any) => (
                                    <motion.button
                                        key={entry.id}
                                        onClick={() => setSelectedEntry(entry)}
                                        className="w-full flex items-center gap-6 p-4 hover:bg-white/[0.03] rounded-2xl transition-all text-left group"
                                    >
                                        <div className="shrink-0 w-12 text-center">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-600 font-bold">
                                                {entry.dateObj.getDate()}
                                            </p>
                                            <p className="text-lg font-serif text-white/40 group-hover:text-white transition-colors">
                                                {entry.dateObj.toLocaleDateString('en-US', { month: 'short' })}
                                            </p>
                                        </div>
                                        <div className="flex-1 space-y-1 border-l border-white/5 pl-6">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-sm font-bold text-white/90 tracking-wide uppercase">
                                                    {entry.title || (entry.isOneLine ? 'One Line' : 'Untitled')}
                                                    {entry.category && entry.category !== 'general' && (
                                                        <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-normal">{entry.category.toLowerCase()}</span>
                                                    )}
                                                </h4>
                                                <div
                                                    role="button"
                                                    onClick={(e) => handleDelete(entry.id, e)}
                                                    className="p-2 -mr-2 rounded-full hover:bg-red-500/10 hover:text-red-400 text-white/10 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600 line-clamp-1 group-hover:text-gray-400 transition-colors pr-8">
                                                {entry.content}
                                            </p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteModal}
        </div>
    )
}

