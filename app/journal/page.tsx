'use client'

import { useState, useEffect, useRef } from 'react'
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

// Premium Journal Layout
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

    const mainRef = useRef<HTMLElement>(null)

    // Reset scroll on state change
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }, [state])

    // Show consistent loading screen until mounted (avoids hydration mismatch)
    if (!mounted || showSplash) {
        return (
            <div className="min-h-screen bg-[#030305] flex items-center justify-center">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
                        <Image src="/aara-logo.png" alt="AARA" width={32} height={32} className="opacity-80" />
                    </div>
                    <p className="text-white/70 font-serif text-lg tracking-wide">
                        {typedText}<span className="animate-pulse text-indigo-400">_</span>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-[100dvh] bg-[#030305] text-white selection:bg-white/10 overflow-hidden flex flex-col relative">

            {/* Ambient Background - Subtle */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[20%] w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full" />
            </div>

            {/* Fixed Floating Header */}
            <div className="fixed top-0 left-0 right-0 z-[90] px-4 py-6 pointer-events-none flex items-center justify-between w-full h-[88px]">
                {/* Back Button - Only in Writing State */}
                <div className="relative z-10">
                    {state !== 'home' ? (
                        <button
                            onClick={() => setState('home')}
                            className="pointer-events-auto flex items-center gap-2 px-4 py-2 hover:bg-white/5 rounded-xl transition-all group backdrop-blur-md bg-white/[0.03] border border-white/5"
                        >
                            <span className="text-[10px] font-bold tracking-widest text-white/50 group-hover:text-white uppercase transition-colors">Back</span>
                        </button>
                    ) : (
                        <div className="w-16" />
                    )}
                </div>

                {/* Branding Pill - Absolute Centered to prevent CLS */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                    <Link href="/" className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl hover:bg-white/5 transition-all active:scale-95 cursor-pointer shadow-2xl">
                        <Image src="/aara-logo.png" alt="" width={18} height={18} className="rounded opacity-80" />
                        <span className="text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase">JOURNAL</span>
                    </Link>
                </div>

                {/* Exit Button */}
                <div className="relative z-10">
                    <button
                        onClick={handleExit}
                        aria-label="Exit Journal"
                        className="pointer-events-auto w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-full transition-colors group"
                    >
                        <X size={18} className="text-white/50 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </div>

            {/* Spacer for fixed header */}
            <div className="h-24" />

            {/* Main Content Area */}
            <main ref={mainRef} className="flex-1 relative overflow-y-auto scrollbar-hide px-4 md:px-8 pb-32 z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={state}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl mx-auto h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Navigation */}
            {state !== 'writing' && (
                <nav className="fixed bottom-0 left-0 right-0 border-t border-white/5 bg-[#030305]/80 backdrop-blur-2xl pb-safe z-50">
                    <div className="max-w-md mx-auto flex items-center justify-evenly py-4">
                        {[
                            { id: 'categories', icon: LayoutGrid, label: 'Categories' },
                            { id: 'home', icon: Plus, label: 'New Entry' },
                            { id: 'calendar', icon: Calendar, label: 'History' }
                        ].map((item) => {
                            const Icon = item.icon
                            const isActive = state === item.id || (item.id === 'home' && state === 'home')
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setState(item.id as JournalState)}
                                    className={`flex flex-col items-center gap-1.5 group transition-all relative px-6 ${isActive ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="journal-nav"
                                            className="absolute -top-4 w-8 h-1 bg-white rounded-full blur-[2px]"
                                        />
                                    )}
                                    <div className={`p-2 rounded-2xl transition-all ${isActive ? 'bg-white/10' : ''}`}>
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
