'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { X, LayoutGrid, Clock, Calendar, Plus } from 'lucide-react'
import JournalHome from '@/components/journal/JournalHome'
import CategorySelection from '@/components/journal/CategorySelection'
import WritingView from '@/components/journal/WritingView'
import CalendarView from '@/components/journal/CalendarView'
import OneLineJournal from '@/components/journal/OneLineJournal'

type JournalState = 'home' | 'categories' | 'writing' | 'calendar' | 'one-line'

export default function JournalPage() {
    const router = useRouter()
    const [state, setState] = useState<JournalState>('home')
    const [previousState, setPreviousState] = useState<JournalState>('home')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    const [mounted, setMounted] = useState(false)
    const [showSplash, setShowSplash] = useState(true)
    const [typedText, setTypedText] = useState('')

    // Mark as mounted on client
    useEffect(() => {
        setMounted(true)
    }, [])

    // Splash Typewriter Effect
    useEffect(() => {
        if (!mounted) return

        const splashMessage = 'Opening Journal...'
        let i = 0

        setTypedText('')

        const typeInterval = setInterval(() => {
            if (i < splashMessage.length) {
                setTypedText(splashMessage.slice(0, i + 1))
                i++
            } else {
                clearInterval(typeInterval)
                setTimeout(() => setShowSplash(false), 500)
            }
        }, 50)
        return () => clearInterval(typeInterval)
    }, [mounted])

    const handleExit = () => {
        if (hasUnsavedChanges) {
            if (confirm('You have unsaved changes. Are you sure you want to exit?')) {
                router.push('/')
            }
        } else {
            router.push('/')
        }
    }

    const renderContent = () => {
        switch (state) {
            case 'home':
                return <JournalHome onBegin={() => setState('categories')} onOneLine={() => setState('one-line')} />
            case 'categories':
                return (
                    <CategorySelection
                        onSelect={(cat: string) => {
                            setSelectedCategory(cat)
                            setPreviousState('categories')
                            setState('writing')
                        }}
                        onBack={() => setState('home')}
                    />
                )
            case 'writing':
                return (
                    <WritingView
                        category={selectedCategory}
                        onExit={() => setState('home')}
                        onSaveStateChange={setHasUnsavedChanges}
                    />
                )
            case 'calendar':
                return <CalendarView onBack={() => setState('home')} />
            case 'one-line':
                return <OneLineJournal onExit={() => setState('home')} />
            default:
                return <JournalHome onBegin={() => setState('categories')} onOneLine={() => setState('one-line')} />
        }
    }

    // Show consistent loading screen until mounted (avoids hydration mismatch)
    if (!mounted || showSplash) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <Image src="/aara-logo.png" alt="AARA" width={64} height={64} className="rounded-2xl" />
                    <p className="text-white font-mono text-lg tracking-wide">
                        {typedText}<span className="animate-pulse">|</span>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-[100dvh] bg-[#050505] text-white selection:bg-white/10 overflow-hidden flex flex-col">
            {/* Fixed Floating Header */}
            <div className="fixed top-0 left-0 right-0 z-[90] px-4 py-5 md:p-6 pointer-events-none flex items-center justify-between">
                {/* Back Button - Only in Writing State */}
                {state === 'writing' ? (
                    <button
                        onClick={() => setState(previousState)}
                        className="pointer-events-auto flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <span className="text-[10px] font-bold tracking-widest text-gray-500 group-hover:text-white uppercase transition-colors">← Back</span>
                    </button>
                ) : (
                    <div className="w-16 md:w-20" />
                )}

                {/* Branding Pill */}
                <Link href="/" className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/5 transition-all active:scale-95 cursor-pointer">
                    <Image src="/aara-logo.png" alt="AARA" width={20} height={20} className="rounded-lg border border-white/10" />
                    <span className="text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] text-white/60 uppercase">JOURNAL</span>
                </Link>

                {/* Exit Button */}
                <button
                    onClick={handleExit}
                    className="pointer-events-auto flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-full transition-colors group"
                >
                    <span className="text-[10px] font-bold tracking-widest text-gray-500 group-hover:text-white uppercase transition-colors">Exit</span>
                    <X size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                </button>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-20" />

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-y-auto scrollbar-hide py-12 px-4 md:px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={state}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="max-w-5xl mx-auto h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Navigation */}
            {state !== 'writing' && (
                <nav className="border-t border-white/5 bg-[#050505]/80 backdrop-blur-xl pb-safe">
                    <div className="max-w-5xl mx-auto flex items-center justify-around py-4">
                        {[
                            { id: 'categories', icon: LayoutGrid, label: 'Categories' },
                            { id: 'home', icon: Plus, label: 'Today' },
                            { id: 'calendar', icon: Calendar, label: 'Calendar' }
                        ].map((item) => {
                            const Icon = item.icon
                            const isActive = state === item.id || (item.id === 'home' && state === 'categories')
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setState(item.id as JournalState)}
                                    className={`flex flex-col items-center gap-1 group transition-all ${isActive ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                                >
                                    <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-white/5' : ''}`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </nav>
            )}
        </div>
    )
}
