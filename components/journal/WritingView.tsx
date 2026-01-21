'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, ArrowLeft, Save, Heart, Sparkles, Smile, MessageSquare } from 'lucide-react'
import { db } from '@/lib/firebase/config'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'

interface WritingViewProps {
    category: string | null
    onExit: () => void
    onSaveStateChange: (hasUnsaved: boolean) => void
    initialDraft?: { title: string, content: string }
}

const CATEGORIES = [
    { id: 'therapy-prep', title: 'Therapy Prep', emoji: '🧠' },
    { id: 'daily-reflection', title: 'Daily Reflection', emoji: '✨' },
    { id: 'anxiety', title: 'Anxiety', emoji: '🌪️' },
    { id: 'relationships', title: 'Relationships', emoji: '🤝' },
    { id: 'work', title: 'Work/Career', emoji: '💼' },
    { id: 'self-discovery', title: 'Self-Discovery', emoji: '🔍' },
    { id: 'gratitude', title: 'Gratitude', emoji: '🙏' },
    { id: 'struggles', title: 'Struggles', emoji: '🌊' },
    { id: 'other', title: 'Other', emoji: '📝' }
]

const MOODS = [
    { value: 1, emoji: '😢', label: 'Very Low' },
    { value: 2, emoji: '😞', label: 'Low' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Excellent' }
]


export default function WritingView({ category: initialCategory, onExit, onSaveStateChange }: WritingViewProps) {
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'daily-reflection')
    const [selectedMood, setSelectedMood] = useState<number | null>(null)
    const [includeInReport, setIncludeInReport] = useState(false)
    const [entryId, setEntryId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
    const [writingStep, setWritingStep] = useState<'writing' | 'metadata' | 'protocol'>('writing')

    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastSavedData = useRef({ title: '', content: '', category: '', mood: null as number | null, include: false })

    const handleSave = useCallback(async () => {
        if (!user || !db || !content) return false

        try {
            const collectionRef = collection(db, 'users', user.uid, 'journal')
            const docRef = entryId ? doc(collectionRef, entryId) : doc(collectionRef)

            const data = {
                title: title || '',
                content,
                category: selectedCategory,
                mood: selectedMood,
                includeInReport,
                isOneLine: false,
                updatedAt: serverTimestamp(),
                ...(entryId ? {} : { createdAt: serverTimestamp() })
            }

            await setDoc(docRef, data, { merge: true })
            const newId = docRef.id

            setEntryId(newId)
            lastSavedData.current = { title, content, category: selectedCategory, mood: selectedMood, include: includeInReport }
            setSaveStatus('saved')
            onSaveStateChange(false)
            setTimeout(() => setSaveStatus('idle'), 2000)
            return true

        } catch (error: any) {
            console.error('Save failed:', error)
            setSaveStatus('error')
            return false
        }
    }, [user, entryId, title, content, selectedCategory, selectedMood, includeInReport, onSaveStateChange])

    // Autosave and Draft Persistence removed as per user request

    const handleComplete = async () => {
        if (!content) return
        setIsSaving(true)
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        const success = await handleSave()
        if (success) {
            // clearDraft() removed as logic was removed
            setTimeout(() => onExit(), 500)
        } else {
            setIsSaving(false)
            alert('Failed to save entry. Please try again.')
        }
    }

    const handleBackStep = () => {
        if (writingStep === 'metadata') setWritingStep('writing')
        else if (writingStep === 'protocol') setWritingStep('metadata')
        else onExit()
    }

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto pb-40 pt-24 px-4 md:px-8">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8 min-h-[40px]">
                <button
                    onClick={handleBackStep}
                    className="p-2.5 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all bg-white/[0.02] border border-white/5 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-3">
                    {/* Save status removed as per user request */}
                </div>
            </div>

            {/* Writing Steps */}
            <div className="flex-1 px-1">
                <AnimatePresence mode="wait">
                    {writingStep === 'writing' && (
                        <motion.div
                            key="writing-step"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-10"
                        >
                            <div className="space-y-6">
                                <input
                                    type="text"
                                    placeholder="Entry Title (Optional)"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-transparent text-2xl md:text-4xl font-serif text-white/70 placeholder:text-white/20 outline-none border-none p-0 tracking-tight"
                                />
                                <div className="h-px bg-white/10" />
                            </div>

                            <div className="space-y-6">
                                <textarea
                                    placeholder="Type freely here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full bg-transparent text-xl md:text-2xl leading-[1.6] text-white/70 placeholder:text-white/20 outline-none border-none p-0 min-h-[400px] md:min-h-[500px] resize-none overflow-hidden font-serif"
                                    autoFocus
                                />
                            </div>

                            <div className="pt-12">
                                <button
                                    onClick={() => setWritingStep('metadata')}
                                    disabled={!content}
                                    className={`w-full py-6 rounded-[32px] font-black text-[12px] tracking-[0.4em] uppercase flex items-center justify-center gap-3 group relative transition-all duration-300 transform-gpu backface-hidden ${content
                                        ? 'bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-95 shadow-2xl'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed border-white/5'
                                        }`}
                                >
                                    <span className="relative z-10 flex items-center gap-4">
                                        Save Entry
                                        <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {writingStep === 'metadata' && (
                        <motion.div
                            key="metadata-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            {/* Categories */}
                            <div className="space-y-6 pt-12 border-t border-white/5">
                                <h4 className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Category (optional)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-4 py-2 rounded-2xl text-[11px] font-bold tracking-widest uppercase transition-all border ${selectedCategory === cat.id
                                                ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                                                : 'bg-white/[0.02] border-white/5 text-white/40 hover:text-white/60'
                                                }`}
                                        >
                                            {cat.emoji} {cat.title}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mood */}
                            <div className="space-y-6 pt-12 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Mood (optional)</h4>
                                </div>
                                <div className="flex justify-between max-w-sm">
                                    {MOODS.map(mood => (
                                        <button
                                            key={mood.value}
                                            onClick={() => setSelectedMood(mood.value)}
                                            className={`w-14 h-14 rounded-2xl text-2xl flex items-center justify-center transition-all ${selectedMood === mood.value
                                                ? 'bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)] scale-110 border border-indigo-500/30'
                                                : 'bg-white/[0.02] border border-white/5 hover:bg-white/[0.05]'
                                                }`}
                                        >
                                            {mood.emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-12 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => setWritingStep('protocol')}
                                    className="flex-1 py-6 rounded-[32px] bg-white/5 border border-white/10 text-white backdrop-blur-xl font-black text-[12px] tracking-[0.4em] uppercase hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-95 shadow-2xl transition-all duration-300 transform-gpu backface-hidden"
                                >
                                    Continue
                                </button>
                                <button
                                    onClick={() => setWritingStep('protocol')}
                                    className="px-8 py-6 rounded-[32px] bg-transparent text-white/30 font-black text-[10px] tracking-[0.4em] uppercase hover:text-white/60 transition-all border border-transparent hover:border-white/5"
                                >
                                    Skip
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {writingStep === 'protocol' && (
                        <motion.div
                            key="protocol-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            <div className="pt-12 border-t border-white/5">
                                <button
                                    onClick={() => setIncludeInReport(!includeInReport)}
                                    className="group flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all w-full text-left"
                                >
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${includeInReport ? 'bg-indigo-500 border-indigo-500 shadow-lg' : 'border-white/10 group-hover:border-white/30'
                                        }`}>
                                        {includeInReport && <Check size={14} className="text-white" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white/80 transition-colors group-hover:text-white">Include in next therapy report</p>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Useful to share clinical insights later</p>
                                    </div>
                                    <MessageSquare size={18} className="text-white/10 group-hover:text-white/30 transition-colors" />
                                </button>
                            </div>

                            <div className="pt-12">
                                <button
                                    onClick={handleComplete}
                                    disabled={isSaving}
                                    className="w-full py-6 rounded-[32px] bg-white/5 border border-white/10 text-white backdrop-blur-xl font-black text-[12px] tracking-[0.4em] uppercase hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-95 shadow-2xl transition-all duration-300 transform-gpu backface-hidden flex items-center justify-center gap-3"
                                >
                                    {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Save this entry'}
                                    <Sparkles size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
