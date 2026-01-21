'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, ArrowLeft, Send } from 'lucide-react'
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/hooks/useAuth'

interface OneLineJournalProps {
    onExit: () => void
}

const EXAMPLES = [
    "Feeling drained but proud of how I showed up today.",
    "Anxious about tomorrow's meeting but trying to breathe.",
    "Grateful for small moments of peace today.",
    "Today was a step forward in my healing journey.",
    "I'm learning to be kinder to myself every day."
]

export default function OneLineJournal({ onExit }: OneLineJournalProps) {
    const { user } = useAuth()
    const [content, setContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [charCount, setCharCount] = useState(0)

    const MAX_CHARS = 150

    useEffect(() => {
        setCharCount(content.length)
    }, [content])

    // Persistence logic removed as per user request

    const handleSave = async () => {
        if (!content || !user || !db || isSaving) return
        setIsSaving(true)

        try {
            const docRef = doc(collection(db, 'users', user.uid, 'journal'))
            await setDoc(docRef, {
                content,
                category: 'Quick Reflection',
                isOneLine: true,
                title: 'One Line Reflection',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            })

            setIsSaving(false)
            setIsSuccess(true)
            // clearDraft() removed
            setTimeout(() => onExit(), 1500)
        } catch (error: any) {
            console.error('Error saving:', error)
            setIsSaving(false)
            alert(`Error saving entry: ${error.message || error}`)
        }
    }

    return (
        <div className="flex flex-col min-h-screen max-w-4xl mx-auto pb-40 pt-24 px-4 md:px-12 overflow-x-hidden">
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onExit}
                    className="p-2.5 rounded-2xl hover:bg-white/5 text-white/40 hover:text-white transition-all bg-white/[0.02] border border-white/5 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <div className="w-10" />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-12">
                <div className="text-center space-y-4 max-w-sm">
                    <p className="text-white/60 text-sm leading-relaxed font-serif italic">
                        Just one sentence. Quick, simple, powerful.
                    </p>
                </div>

                <div className="w-full relative group">
                    <div className="bg-white/[0.02] border border-white/10 rounded-[40px] p-8 md:p-14 focus-within:border-white/20 transition-all shadow-2xl backdrop-blur-xl relative overflow-hidden">
                        {/* Decorative Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/[0.02] via-transparent to-purple-500/[0.02]" />

                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSave()
                                }
                            }}
                            placeholder="Today, I feel..."
                            autoFocus
                            className="w-full bg-transparent text-2xl md:text-5xl text-center font-serif text-white/90 placeholder:text-white/25 outline-none resize-none min-h-[160px] md:min-h-[220px] scrollbar-hide leading-[1.2] relative z-10"
                        />

                        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                            <span className={`text-[10px] font-black tracking-[0.3em] uppercase transition-colors px-4 py-1.5 rounded-full border ${charCount >= MAX_CHARS ? 'text-red-500 border-red-500/20 bg-red-500/5' : 'text-white/20 border-white/5 bg-white/[0.02]'
                                }`}>
                                {charCount} / {MAX_CHARS}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="w-full flex justify-center pt-8">
                    <button
                        onClick={handleSave}
                        disabled={!content || isSaving || isSuccess}
                        className={`group relative px-12 py-5 rounded-[32px] font-black text-[11px] tracking-[0.4em] uppercase overflow-hidden transition-all duration-300 transform-gpu backface-hidden active:scale-95 ${content && !isSaving && !isSuccess
                            ? 'bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white/10 hover:border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] hover:scale-[1.02]'
                            : 'bg-white/5 text-white/20 cursor-not-allowed border-white/5'
                            }`}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {isSaving ? <Loader2 size={16} className="animate-spin" /> :
                                isSuccess ? <Check size={16} className="text-green-600" /> :
                                    <>SAVE & CONTINUE <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>}
                        </span>
                    </button>
                </div>
            </div>

            {/* Inspiration Footer */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mt-32 space-y-12"
            >
                <div className="flex items-center gap-6">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                    <span className="text-[10px] font-black tracking-[0.4em] text-white/30 uppercase flex items-center gap-3 whitespace-nowrap">
                        <span className="text-sm">💡</span> Daily Examples
                    </span>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                </div>

                <div className="grid gap-3 max-w-lg mx-auto pb-10">
                    {EXAMPLES.map((example, i) => (
                        <button
                            key={i}
                            onClick={() => setContent(example)}
                            className="group text-center text-[13px] md:text-[15px] text-white/40 hover:text-white/80 transition-all leading-relaxed p-5 rounded-[24px] bg-white/[0.01] border border-white/5 hover:border-white/20 hover:bg-white/[0.03] font-serif hover:scale-[1.01]"
                        >
                            {example}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
