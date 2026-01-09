'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function FeedbackModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { user } = useAuth()
    const [message, setMessage] = useState('')
    const [type, setType] = useState<'general' | 'bug'>('general')
    const [sending, setSending] = useState(false)

    const handleSend = async () => {
        if (!message.trim()) return

        setSending(true)
        try {
            const token = await user?.getIdToken()
            // Use existing API
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message,
                    type
                })
            })

            if (!res.ok) throw new Error('Failed')

            setMessage('')
            onClose()
            alert('Thank you for your feedback!')
        } catch (e) {
            console.error(e)
            alert('Failed to send. Please try again.')
        } finally {
            setSending(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-[#0e0e12] border border-white/10 p-6 rounded-3xl shadow-2xl relative"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Send Feedback</h3>
                                <p className="text-xs text-gray-500">Help us improve AARA</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Type</label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setType('general')}
                                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${type === 'general' ? 'bg-indigo-500 text-white border-transparent' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'}`}
                                    >
                                        General
                                    </button>
                                    <button
                                        onClick={() => setType('bug')}
                                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold border ${type === 'bug' ? 'bg-red-500 text-white border-transparent' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'}`}
                                    >
                                        Bug Report
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">Message</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={type === 'bug' ? "Describe the issue..." : "Share your thoughts..."}
                                    rows={5}
                                    className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 resize-none"
                                    autoFocus
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-white/5 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={sending || !message.trim()}
                                    className="flex-1 py-3 bg-indigo-500 rounded-xl text-sm font-bold text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {sending ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            <span>Send Feedback</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
