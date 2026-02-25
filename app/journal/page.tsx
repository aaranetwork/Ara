'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
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
import Image from 'next/image'

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

    // Splash Animation State
    const [showSplash, setShowSplash] = useState(true)
    const [typedText, setTypedText] = useState('')
    const splashMessage = 'Opening Journal...'

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    // Handle Splash Typewriter
    useEffect(() => {
        if (!showSplash || authLoading) return

        let i = 0
        const typeInterval = setInterval(() => {
            if (i < splashMessage.length) {
                setTypedText(splashMessage.slice(0, i + 1))
                i++
            } else {
                clearInterval(typeInterval)
                setTimeout(() => {
                    setShowSplash(false)
                }, 300)
            }
        }, 50)
        return () => clearInterval(typeInterval)
    }, [showSplash, authLoading])

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

    if (showSplash) {
        return (
            <div className="min-h-screen bg-[#030305] flex items-center justify-center z-[100] relative">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                        <Image src="/aara-logo.png" alt="AARA Prep" width={32} height={32} className="opacity-80" />
                    </div>
                    <p className="text-white/70 font-serif text-lg tracking-wide">
                        {typedText}<span className="animate-pulse text-indigo-400">_</span>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-[#030305] text-white">
            {/* Ambient Background - Reduced for mobile */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-indigo-500/5 blur-[60px] md:blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[20%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-500/5 blur-[60px] md:blur-[120px] rounded-full" />
            </div>

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
                            <Image
                                alt="Aara Logo"
                                width={18}
                                height={18}
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
                        initial={{ opacity: 0, scale: 0.99, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.99, y: -10 }}
                        transition={{
                            type: "tween",
                            ease: [0.23, 1, 0.32, 1],
                            duration: 0.4
                        }}
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Premium Bottom Navigation - Ultramodern Floating Dock */}
            {state === 'home' || state === 'history' || state === 'insights' || state === 'calendar' ? (
                <div className="fixed bottom-6 md:bottom-10 left-0 right-0 px-6 z-50 pointer-events-none">
                    <div className="max-w-[320px] md:max-w-md mx-auto pointer-events-auto">
                        <nav className="relative bg-[#121216]/60 backdrop-blur-3xl border border-white/[0.08] rounded-[24px] md:rounded-[32px] p-2 flex items-center justify-between shadow-[0_20px_40px_-5px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.05]">

                            <button
                                onClick={() => setState('home')}
                                className="w-12 h-12 flex items-center justify-center rounded-xl transition-all relative group"
                            >
                                <div className={`absolute inset-0 bg-white/10 rounded-xl scale-50 opacity-0 transition-all duration-300 ${state === 'home' ? 'scale-100 opacity-100' : 'group-hover:scale-100 group-hover:opacity-50'}`} />
                                <Home size={20} className={`relative z-10 transition-colors duration-300 ${state === 'home' ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} strokeWidth={state === 'home' ? 2.5 : 2} />
                                {state === 'home' && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]" />}
                            </button>

                            <button
                                onClick={() => setState('calendar')}
                                className="w-12 h-12 flex items-center justify-center rounded-xl transition-all relative group"
                            >
                                <div className={`absolute inset-0 bg-white/10 rounded-xl scale-50 opacity-0 transition-all duration-300 ${state === 'calendar' ? 'scale-100 opacity-100' : 'group-hover:scale-100 group-hover:opacity-50'}`} />
                                <Calendar size={20} className={`relative z-10 transition-colors duration-300 ${state === 'calendar' ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} strokeWidth={state === 'calendar' ? 2.5 : 2} />
                                {state === 'calendar' && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]" />}
                            </button>

                            {/* Center Action Button - Floating Orb */}
                            <div className="mx-2 relative group md:-mt-2">
                                <button
                                    onClick={() => {
                                        setSelectedCategory('daily-reflection')
                                        setState('writing')
                                    }}
                                    className="relative w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-[#1a1a20] to-[#0d0d10] border border-white/10 rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 active:scale-95 transition-all duration-300"
                                >
                                    <Plus size={24} className="text-white relative z-10" strokeWidth={2.5} />
                                </button>
                            </div>

                            <button
                                onClick={() => setState('history')}
                                className="w-12 h-12 flex items-center justify-center rounded-xl transition-all relative group"
                            >
                                <div className={`absolute inset-0 bg-white/10 rounded-xl scale-50 opacity-0 transition-all duration-300 ${state === 'history' ? 'scale-100 opacity-100' : 'group-hover:scale-100 group-hover:opacity-50'}`} />
                                <History size={20} className={`relative z-10 transition-colors duration-300 ${state === 'history' ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} strokeWidth={state === 'history' ? 2.5 : 2} />
                                {state === 'history' && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]" />}
                            </button>

                            <button
                                onClick={() => setState('insights')}
                                className="w-12 h-12 flex items-center justify-center rounded-xl transition-all relative group"
                            >
                                <div className={`absolute inset-0 bg-white/10 rounded-xl scale-50 opacity-0 transition-all duration-300 ${state === 'insights' ? 'scale-100 opacity-100' : 'group-hover:scale-100 group-hover:opacity-50'}`} />
                                <BarChart2 size={20} className={`relative z-10 transition-colors duration-300 ${state === 'insights' ? 'text-white' : 'text-white/40 group-hover:text-white/70'}`} strokeWidth={state === 'insights' ? 2.5 : 2} />
                                {state === 'insights' && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_5px_white]" />}
                            </button>

                        </nav>
                    </div>
                </div>
            ) : null}
        </main>
    )
}