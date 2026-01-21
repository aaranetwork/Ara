'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { db } from '@/lib/firebase/config'
import { collection, query, getDocs } from 'firebase/firestore'

interface CalendarViewProps {
    onBack: () => void
}

export default function CalendarView({ onBack }: CalendarViewProps) {
    const { user } = useAuth()
    const [entries, setEntries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState(new Date())

    useEffect(() => {
        const loadEntries = async () => {
            if (!user || !db) return
            try {
                const q = query(collection(db, 'users', user.uid, 'journal'))
                const snapshot = await getDocs(q)
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().createdAt?.toDate() || new Date()
                }))
                setEntries(data)
            } catch (e) {
                console.error('Failed to load entries:', e)
            } finally {
                setLoading(false)
            }
        }
        loadEntries()
    }, [user])

    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()

        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        const days = []
        // Padding for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push({ day: null, fullDate: null })
        }

        // Actual days
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i)
            const dayEntries = entries.filter(e =>
                e.date.getDate() === i &&
                e.date.getMonth() === month &&
                e.date.getFullYear() === year
            )
            days.push({
                day: i,
                fullDate: date,
                entries: dayEntries,
                hasEntry: dayEntries.length > 0
            })
        }

        return days
    }, [currentDate, entries])

    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center space-y-4">
                <Loader2 className="animate-spin text-white/20 w-8 h-8" />
                <p className="text-xs text-white/20 uppercase tracking-widest font-black">Aligning your timeline...</p>
            </div>
        )
    }

    return (
        <div className="space-y-10 pb-40 max-w-4xl mx-auto pt-24 px-4 md:px-8">
            {/* Header */}
            <header className="flex items-center justify-between pb-4">
                <button
                    onClick={onBack}
                    className="p-2.5 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all bg-white/[0.02] border border-white/5 flex items-center gap-2 group"
                >
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="text-center">
                    <p className="text-xl font-serif text-white/90">
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/5 text-white/40"><ChevronLeft size={18} /></button>
                    <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/5 text-white/40"><ChevronRight size={18} /></button>
                </div>
            </header>

            {/* Calendar Grid */}
            <section className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-10 relative overflow-hidden">
                <div className="grid grid-cols-7 gap-y-8 gap-x-2 relative z-10">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <div key={d} className="text-center text-[10px] font-black tracking-widest text-white/20 uppercase pb-4 underline decoration-white/5 underline-offset-8">
                            {d}
                        </div>
                    ))}

                    {calendarData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center justify-center h-12 relative group">
                            {d.day && (
                                <>
                                    <span className={`text-sm font-serif ${d.hasEntry ? 'text-white/90' : 'text-white/10'}`}>
                                        {d.day}
                                    </span>
                                    {d.hasEntry && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-1"
                                        >
                                            <Sparkles size={8} className="text-indigo-400 group-hover:rotate-12 transition-transform shadow-[0_0_10px_rgba(129,140,248,0.4)]" />
                                        </motion.div>
                                    )}
                                    {d.hasEntry && (
                                        <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Aesthetic Gradient */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.03] blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/[0.03] blur-[80px] rounded-full -ml-24 -mb-24" />
            </section>

            {/* Stats Footer */}
            <section className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-2">
                    <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">Days Logged</p>
                    <p className="text-2xl font-serif text-white/80">
                        {entries.filter(e => e.date.getMonth() === currentDate.getMonth() && e.date.getFullYear() === currentDate.getFullYear()).length}
                    </p>
                </div>
                <div className="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-2">
                    <p className="text-[10px] font-black tracking-widest text-white/20 uppercase">Total Reflections</p>
                    <p className="text-2xl font-serif text-white/80">{entries.length}</p>
                </div>
            </section>

            {/* Security Note */}
            <div className="pt-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 text-[9px] font-black tracking-[0.2em] text-white/20 uppercase">
                    <ShieldCheck size={12} /> Timeline is Private & Secure
                </div>
            </div>
        </div>
    )
}
