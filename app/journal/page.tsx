'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import JournalHome from '@/components/journal/JournalHome'
import WritingView from '@/components/journal/WritingView'
import CalendarView from '@/components/journal/CalendarView'
import OneLineJournal from '@/components/journal/OneLineJournal'
import JournalHistory from '@/components/journal/JournalHistory'
import JournalInsights from '@/components/journal/JournalInsights'
import JournalEntryView from '@/components/journal/JournalEntryView'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Home, Calendar, History, BarChart2, Plus, X, ChevronLeft, BookOpen, PenLine } from 'lucide-react'
import Link from 'next/link'

type JournalState = 'home' | 'writing' | 'calendar' | 'one-line' | 'history' | 'insights' | 'entry-view'

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

export default function JournalPage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [state, setState] = useState<JournalState>('home')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId)
        setState('writing')
    }

    const handleExitWriting = useCallback(() => {
        if (hasUnsavedChanges) {
            if (confirm('You have unsaved changes. Are you sure you want to exit?')) {
                setState('home')
                setHasUnsavedChanges(false)
            }
        } else {
            setState('home')
        }
    }, [hasUnsavedChanges])

    const renderContent = () => {
        switch (state) {
            case 'home':
                return (
                    <JournalHome
                        onBegin={() => {
                            setSelectedCategory('daily-reflection')
                            setState('writing')
                        }}
                        onOneLine={() => setState('one-line')}
                        onViewHistory={() => setState('history')}
                        onViewInsights={() => setState('insights')}
                        onViewEntry={(entry) => {
                            setSelectedEntry(entry)
                            setState('entry-view')
                        }}
                    />
                )
            case 'writing':
                return (
                    <WritingView
                        category={selectedCategory}
                        onExit={handleExitWriting}
                        onSaveStateChange={setHasUnsavedChanges}
                    />
                )
            case 'calendar':
                return <CalendarView onBack={() => setState('home')} />
            case 'one-line':
                return <OneLineJournal onExit={() => setState('home')} />
            case 'history':
                return (
                    <JournalHistory
                        onBack={() => setState('home')}
                        onViewEntry={(entry) => {
                            setSelectedEntry(entry)
                            setState('entry-view')
                        }}
                    />
                )
            case 'insights':
                return <JournalInsights onBack={() => setState('home')} />
            case 'entry-view':
                return selectedEntry ? (
                    <JournalEntryView
                        entry={selectedEntry}
                        onBack={() => setState('history')}
                        onEdit={(entry) => {
                            setSelectedCategory(entry.category || null)
                            setState('writing')
                        }}
                        onDelete={() => setState('history')}
                    />
                ) : null
            default:
                return null
        }
    }

    if (authLoading) return null

    return (
        <main className="min-h-screen bg-[#030305] text-white">
            {/* Custom Fixed Header */}
            <div className="fixed top-0 left-0 right-0 z-[90] px-4 py-6 pointer-events-none flex items-center justify-between w-full h-[88px]">
                <div className="relative z-10">
                    {state === 'home' && (
                        <button
                            onClick={() => setState('insights')}
                            className="pointer-events-auto p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/10 transition-all text-white/60 hover:text-white"
                        >
                            <BarChart2 size={20} />
                        </button>
                    )}
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                    {state === 'home' ? (
                        <Link
                            href="/"
                            className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all active:scale-95 cursor-pointer shadow-2xl"
                        >
                            <img
                                alt="Aara Logo"
                                width="18"
                                height="18"
                                src="/aara-logo.png"
                                className="rounded opacity-80"
                            />
                            <span className="text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase">JOURNAL</span>
                        </Link>
                    ) : (
                        <button
                            onClick={() => setState('home')}
                            className="pointer-events-auto w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all active:scale-95 cursor-pointer shadow-2xl group"
                        >
                            {state === 'calendar' && <Calendar size={18} className="text-white/40 group-hover:text-white transition-colors" />}
                            {state === 'history' && <History size={18} className="text-white/40 group-hover:text-white transition-colors" />}
                            {state === 'insights' && <BarChart2 size={18} className="text-white/40 group-hover:text-white transition-colors" />}
                            {state === 'writing' && <BookOpen size={18} className="text-white/40 group-hover:text-white transition-colors" />}
                            {state === 'one-line' && <PenLine size={18} className="text-white/40 group-hover:text-white transition-colors" />}
                            {state === 'entry-view' && <BookOpen size={18} className="text-white/40 group-hover:text-white transition-colors" />}
                        </button>
                    )}
                </div>
                <div className="relative z-10">
                    <button
                        onClick={() => router.push('/')}
                        aria-label="Exit Journal"
                        className="pointer-events-auto w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <X size={18} className="text-white/50 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={state}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Premium Bottom Navigation */}
            {state === 'home' || state === 'history' || state === 'insights' || state === 'calendar' ? (
                <div className="fixed bottom-8 left-0 right-0 px-6 z-50">
                    <div className="max-w-md mx-auto">
                        <nav className="bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-[32px] p-2 flex items-center justify-between shadow-2xl">
                            <button
                                onClick={() => setState('home')}
                                className={`flex-1 py-3 flex flex-col items-center gap-1 rounded-2xl transition-all ${state === 'home' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                <Home size={18} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
                            </button>

                            <button
                                onClick={() => setState('calendar')}
                                className={`flex-1 py-3 flex flex-col items-center gap-1 rounded-2xl transition-all ${state === 'calendar' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                <Calendar size={18} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Calendar</span>
                            </button>

                            {/* Floating Action-like Center Button */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('daily-reflection')
                                    setState('writing')
                                }}
                                className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all mx-2"
                            >
                                <Plus size={24} />
                            </button>

                            <button
                                onClick={() => setState('history')}
                                className={`flex-1 py-3 flex flex-col items-center gap-1 rounded-2xl transition-all ${state === 'history' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                <History size={18} />
                                <span className="text-[9px] font-black uppercase tracking-widest">History</span>
                            </button>

                            <button
                                onClick={() => setState('insights')}
                                className={`flex-1 py-3 flex flex-col items-center gap-1 rounded-2xl transition-all ${state === 'insights' ? 'bg-white/10 text-white shadow-xl' : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                <BarChart2 size={18} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Insights</span>
                            </button>
                        </nav>
                    </div>
                </div>
            ) : null}
        </main>
    )
}