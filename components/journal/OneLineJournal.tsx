'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, ArrowRight } from 'lucide-react'
import { saveJournalEntry } from '@/app/actions/journal'
import { useAuth } from '@/hooks/useAuth'

interface OneLineJournalProps {
    onExit: () => void
}

export default function OneLineJournal({ onExit }: OneLineJournalProps) {
    const { user } = useAuth()
    const [content, setContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSave = async () => {
        if (!content || !user) return
        setIsSaving(true)

        try {
            const token = await user.getIdToken()
            const result = await saveJournalEntry(token, {
                content,
                category: 'general',
                isOneLine: true,
                title: 'One Line Entry'
            })

            if (result.success) {
                setIsSaving(false)
                setIsSuccess(true)
                setTimeout(() => onExit(), 1500)
            } else {
                console.error('Failed to save:', result.error)
                setIsSaving(false)
                alert(`Failed to save entry: ${result.error}`)
            }
        } catch (error: any) {
            console.error('Error saving:', error)
            setIsSaving(false)
            alert(`Error saving entry: ${error.message || error}`)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
            <div className="text-center space-y-2">
                <h2 className="text-xl font-serif text-white/90">One-line journal</h2>
                <p className="text-sm text-gray-500">One sentence is enough.</p>
            </div>

            <div className="w-full max-w-sm relative">
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    placeholder="What's the one thing on your mind?"
                    autoFocus
                    className="w-full bg-transparent text-lg text-center font-serif text-white/90 placeholder:text-white/10 outline-none border-b border-white/10 pb-4 focus:border-white/30 transition-colors"
                />

                <AnimatePresence>
                    {content && !isSuccess && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={handleSave}
                            className="absolute -right-4 top-0 p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            {isSaving ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                        </motion.button>
                    )}

                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-x-0 -bottom-12 flex flex-col items-center gap-2 text-green-500/80"
                        >
                            <Check size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest italic">Entry Captured</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
