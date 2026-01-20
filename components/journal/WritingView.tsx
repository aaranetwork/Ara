'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { CATEGORIES } from './CategorySelection'
import { db } from '@/lib/firebase/config'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/hooks/useAuth'

interface WritingViewProps {
    category: string | null
    onExit: () => void
    onSaveStateChange: (hasUnsaved: boolean) => void
}

export default function WritingView({ category, onExit, onSaveStateChange }: WritingViewProps) {
    const { user } = useAuth()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [entryId, setEntryId] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const lastSavedData = useRef({ title: '', content: '' })

    const selectedCat = CATEGORIES.find(c => c.id === category)

    const handleSave = useCallback(async () => {
        if (!user || !db) return false

        try {
            const collectionRef = collection(db, 'users', user.uid, 'journal')
            const docRef = entryId ? doc(collectionRef, entryId) : doc(collectionRef)

            const data = {
                title: title || '',
                content,
                category: category || 'general',
                isOneLine: false,
                updatedAt: serverTimestamp(),
                // Only set createdAt if creating new
                ...(entryId ? {} : { createdAt: serverTimestamp() })
            }

            await setDoc(docRef, data, { merge: true })
            const newId = docRef.id

            setEntryId(newId)
            lastSavedData.current = { title, content }
            setSaveStatus('saved')
            onSaveStateChange(false)
            localStorage.removeItem('journal_draft') // Clear draft on success
            setTimeout(() => setSaveStatus('idle'), 2000)
            return true

        } catch (error: any) {
            console.error('Autosave failed:', error)
            setSaveStatus('error')
            return false
        }
    }, [user, entryId, title, content, category, onSaveStateChange])

    // Load draft on mount
    useEffect(() => {
        const savedDraft = localStorage.getItem('journal_draft')
        if (savedDraft && !entryId) {
            try {
                const { title: savedTitle, content: savedContent, timestamp } = JSON.parse(savedDraft)
                // Only restore if less than 24 hours old
                if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
                    setTitle(savedTitle)
                    setContent(savedContent)
                }
            } catch (e) {
                console.error('Failed to parse draft', e)
            }
        }
    }, [entryId])

    // Save draft to local storage
    useEffect(() => {
        if (title || content) {
            localStorage.setItem('journal_draft', JSON.stringify({
                title,
                content,
                timestamp: Date.now()
            }))
        }
    }, [title, content])

    // Autosave trigger
    useEffect(() => {
        // Don't save if content hasn't changed from last save
        if (title === lastSavedData.current.title && content === lastSavedData.current.content) {
            return
        }

        if (title || content) {
            onSaveStateChange(true)

            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

            setSaveStatus('saving')
            saveTimeoutRef.current = setTimeout(async () => {
                await handleSave()
            }, 1500) // Debounce 1.5s
        } else {
            onSaveStateChange(false)
        }
    }, [title, content, handleSave, onSaveStateChange])



    const handleComplete = async () => {
        if (!content) return

        setIsSaving(true)
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

        const success = await handleSave()

        if (success) {
            setTimeout(() => {
                onExit()
            }, 500)
        } else {
            setIsSaving(false)
            alert('Failed to save entry. Please try again.')
        }
    }

    const today = new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    })

    return (
        <div className="flex flex-col h-full space-y-8 pb-32">
            {/* Header Info */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">{today}</p>
                    {selectedCat && (
                        <p className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-bold">{selectedCat.title}</p>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <AnimatePresence mode="wait">
                        {saveStatus === 'saving' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-gray-600"
                            >
                                <Loader2 size={12} className="animate-spin" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Saving</span>
                            </motion.div>
                        )}
                        {saveStatus === 'saved' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-green-500/80"
                            >
                                <Check size={12} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Saved</span>
                            </motion.div>
                        )}
                        {saveStatus === 'error' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 text-red-500/80"
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest">Error Saving</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Editor */}
            <div className="space-y-6">
                <input
                    type="text"
                    placeholder="Entry Title (Optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-2xl md:text-3xl font-serif text-white/90 placeholder:text-white/10 outline-none border-none p-0"
                />

                <textarea
                    placeholder="Start writing..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent text-lg md:text-xl leading-relaxed text-white/70 placeholder:text-white/5 outline-none border-none p-0 min-h-[40vh] resize-none scrollbar-hide"
                    autoFocus
                />
            </div>

            {/* Complete Button */}
            <div className="fixed bottom-12 left-0 right-0 px-6 z-50">
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={handleComplete}
                        disabled={isSaving || !content}
                        className={`w-full py-5 rounded-2xl font-bold uppercase tracking-[0.3em] text-[10px] transition-all flex items-center justify-center gap-3 ${content && !isSaving
                            ? 'bg-white text-black hover:scale-[1.02] active:scale-95'
                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : 'Complete'}
                    </button>
                </div>
            </div>
        </div>
    )
}

