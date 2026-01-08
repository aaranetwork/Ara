'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Loader2, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { getJournalEntries } from '@/app/actions/journal'

interface CalendarViewProps {
    onBack: () => void
}

export default function CalendarView({ onBack }: CalendarViewProps) {
    const { user } = useAuth()
    const [entries, setEntries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedEntry, setSelectedEntry] = useState<any | null>(null)

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

    // Group by month
    const grouped = entries.reduce((acc: any, entry) => {
        const date = new Date(entry.createdAt || entry.updatedAt || Date.now())
        const month = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

        if (!acc[month]) acc[month] = []
        acc[month].push({ ...entry, dateObj: date })
        return acc
    }, {})

    // Sort entries within months
    Object.keys(grouped).forEach(month => {
        grouped[month].sort((a: any, b: any) => b.dateObj.getTime() - a.dateObj.getTime())
    })

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-white/20" />
            </div>
        )
    }

    // Entry Detail View
    if (selectedEntry) {
        const entryDate = new Date(selectedEntry.createdAt || selectedEntry.updatedAt || Date.now())
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pb-32"
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

                <div className="space-y-6">
                    {selectedEntry.title && (
                        <h1 className="text-2xl md:text-3xl font-serif text-white/90">{selectedEntry.title}</h1>
                    )}
                    <p className="text-lg md:text-xl leading-relaxed text-white/70 whitespace-pre-wrap">
                        {selectedEntry.content}
                    </p>
                </div>
            </motion.div>
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
                                        whileHover={{ x: 4 }}
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
                                            <h4 className="text-sm font-bold text-white/90 tracking-wide uppercase">
                                                {entry.title || (entry.isOneLine ? 'One Line' : 'Untitled')}
                                                {entry.category && entry.category !== 'general' && (
                                                    <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-normal">{entry.category.toLowerCase()}</span>
                                                )}
                                            </h4>
                                            <p className="text-xs text-gray-600 line-clamp-1 group-hover:text-gray-400 transition-colors">
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
        </div>
    )
}

