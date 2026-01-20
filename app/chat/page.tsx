'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Trash2, RotateCcw, History, X, User, Briefcase, Heart, MessageCircle, MessageSquare, Zap, Clock, TrendingUp, Search, Plus, PenSquare, MoreHorizontal, MessageSquarePlus, Menu, Home, Users } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { FadeIn } from '@/components/MotionPrimitives'

import { getChatSessions, saveChatSession, deleteChatSession } from '@/app/actions/chat'
import { getUserProfile, saveUserProfile } from '@/app/actions/profile'
interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: string
}

interface ChatSession {
    id: string
    messages: Message[]
    updatedAt: string
    preview: string
}

interface UserProfile {
    name: string
    profession: string
    reason: string
    referral: string
    completedAt: string
}

// Storage logic replaced by Server Actions

// Onboarding Form Component
function OnboardingForm({ onComplete }: { onComplete: (profile: UserProfile) => void }) {
    const [step, setStep] = useState(0)
    const [name, setName] = useState('')
    const [profession, setProfession] = useState('')
    const [reason, setReason] = useState('')
    const [referral, setReferral] = useState('')

    const steps = [
        {
            icon: User,
            title: "What should we call you?",
            subtitle: "Your name helps AARA personalize the conversation",
            field: 'name'
        },
        {
            icon: Briefcase,
            title: "What do you do?",
            subtitle: "Understanding your work/study helps AARA relate better",
            field: 'profession'
        },
        {
            icon: Heart,
            title: "What brings you to AARA?",
            subtitle: "Share what you're looking for",
            field: 'reason'
        },
        {
            icon: MessageCircle,
            title: "How did you hear about us?",
            subtitle: "This helps us improve",
            field: 'referral'
        },
    ]

    const currentStep = steps[step]
    const Icon = currentStep.icon

    const getValue = () => {
        switch (currentStep.field) {
            case 'name': return name
            case 'profession': return profession
            case 'reason': return reason
            case 'referral': return referral
            default: return ''
        }
    }

    const setValue = (value: string) => {
        switch (currentStep.field) {
            case 'name': setName(value); break
            case 'profession': setProfession(value); break
            case 'reason': setReason(value); break
            case 'referral': setReferral(value); break
        }
    }

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1)
        } else {
            // Complete onboarding
            const profile: UserProfile = {
                name,
                profession,
                reason,
                referral,
                completedAt: new Date().toISOString()
            }
            onComplete(profile)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && getValue().trim()) {
            handleNext()
        }
    }

    const placeholders: Record<string, string> = {
        name: "Enter your name...",
        profession: "e.g., Student, Software Engineer, Teacher...",
        reason: "e.g., Stress, anxiety, just want to talk...",
        referral: "e.g., Google, friend, social media..."
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] bg-blue-900/10 blur-[120px] rounded-full" />
            </div>

            <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10 max-w-lg w-full"
            >
                {/* Progress */}
                <div className="flex gap-2 mb-8 justify-center">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 w-12 rounded-full transition-all ${i <= step ? 'bg-blue-500' : 'bg-white/10'
                                }`}
                        />
                    ))}
                </div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <Icon size={32} className="text-white" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
                    {currentStep.title}
                </h1>
                <p className="text-gray-500 text-center mb-8">
                    {currentStep.subtitle}
                </p>

                {/* Input */}
                <div className="mb-6">
                    {currentStep.field === 'reason' ? (
                        <textarea
                            value={getValue()}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder={placeholders[currentStep.field]}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none h-32"
                            autoFocus
                        />
                    ) : (
                        <input
                            type="text"
                            value={getValue()}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={placeholders[currentStep.field]}
                            className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            autoFocus
                        />
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    {step > 0 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 transition-all"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={!getValue().trim()}
                        className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] transition-all"
                    >
                        {step === steps.length - 1 ? 'Start Chatting' : 'Continue'}
                    </button>
                </div>

                {/* Skip */}
                {step < steps.length - 1 && (
                    <button
                        onClick={handleNext}
                        className="w-full mt-4 text-gray-600 text-sm hover:text-gray-400 transition"
                    >
                        Skip this question
                    </button>
                )}
            </motion.div>
        </div>
    )
}

// Premium Chat Interface
import { TextBlurReveal } from '@/components/ui/TextBlurReveal'

export default function ChatPage() {
    const { user, loading, signOut } = useAuth()
    const router = useRouter()

    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [currentChatId, setCurrentChatId] = useState<string | null>(null)
    const [showHistory, setShowHistory] = useState(false)
    const [chatHistory, setChatHistory] = useState<ChatSession[]>([])
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [showOnboarding, setShowOnboarding] = useState(false)

    // Only show splash once per session
    const [showSplash, setShowSplash] = useState(true)

    useEffect(() => {
        if (sessionStorage.getItem('chat_splash_shown')) {
            setShowSplash(false)
        }
    }, [])
    const [typedText, setTypedText] = useState('')

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const sidebarRef = useRef<HTMLDivElement>(null)

    // 🌊 Swipe Control for Sidebar
    const touchStartXRef = useRef<number | null>(null)
    const touchStartYRef = useRef<number | null>(null)

    useEffect(() => {
        const minSwipeDistance = 50
        const maxVerticalDistance = 100

        const onTouchStart = (e: TouchEvent) => {
            touchStartXRef.current = e.targetTouches[0].clientX
            touchStartYRef.current = e.targetTouches[0].clientY
        }

        const onTouchEnd = (e: TouchEvent) => {
            const startX = touchStartXRef.current
            const startY = touchStartYRef.current
            const endX = e.changedTouches[0]?.clientX
            const endY = e.changedTouches[0]?.clientY

            if (startX === null || startY === null || endX === undefined || endY === undefined) return

            const distanceX = endX - startX
            const distanceY = Math.abs(endY - startY)

            if (distanceY < maxVerticalDistance) {
                if (distanceX > minSwipeDistance && !showHistory) {
                    setShowHistory(true)
                }
                if (distanceX < -minSwipeDistance && showHistory) {
                    setShowHistory(false)
                }
            }

            touchStartXRef.current = null
            touchStartYRef.current = null
        }

        document.addEventListener('touchstart', onTouchStart, { passive: true })
        document.addEventListener('touchend', onTouchEnd)

        return () => {
            document.removeEventListener('touchstart', onTouchStart)
            document.removeEventListener('touchend', onTouchEnd)
        }
    }, [showHistory])

    // Auth Protection
    useEffect(() => {
        if (!loading && !user) {
            router.push('/auth/login')
        }
    }, [user, loading, router])

    // Splash Typewriter Effect
    const splashMessage = 'Initializing Consciousness...'
    useEffect(() => {
        if (!showSplash || loading) return
        let i = 0
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
    }, [showSplash, loading])

    // Load profile and chat history on mount
    useEffect(() => {
        const initData = async () => {
            if (!user) return

            try {
                const token = await user.getIdToken()

                const { data: profile } = await getUserProfile(token)
                if (profile) {
                    setUserProfile(profile as any)
                    setShowOnboarding(false)
                } else if (user.displayName) {
                    setUserProfile({ name: user.displayName, profession: '', reason: '', referral: '', completedAt: '' })
                    setShowOnboarding(false)
                } else {
                    setShowOnboarding(true)
                }

                const { data: sessions } = await getChatSessions(token)
                if (sessions) {
                    setChatHistory(sessions as ChatSession[])

                    if (sessions.length > 0 && !currentChatId) {
                        const latest = sessions[0]
                        setMessages(latest.messages)
                        setCurrentChatId(latest.id)
                    }
                }
            } catch (e) {
                console.error('Error loading data', e)
            }
        }
        initData()
    }, [user, currentChatId])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isLoading])

    // Focus input on load
    useEffect(() => {
        if (!showOnboarding) {
            inputRef.current?.focus()
        }
    }, [showOnboarding])

    // Save messages to Server
    useEffect(() => {
        const sync = async () => {
            if (!user || messages.length === 0) return

            const chatId = currentChatId || `chat_${crypto.randomUUID()}`

            if (!currentChatId) {
                setCurrentChatId(chatId)
            }

            const session: ChatSession = {
                id: chatId,
                messages,
                updatedAt: new Date().toISOString(),
                preview: messages[0]?.content || 'New chat'
            }

            setChatHistory(prev => {
                const idx = prev.findIndex(s => s.id === chatId)
                if (idx >= 0) {
                    const newArr = [...prev]
                    newArr[idx] = session
                    return newArr
                } else {
                    return [session, ...prev].slice(0, 20)
                }
            })

            try {
                const token = await user.getIdToken()
                await saveChatSession(token, session)
            } catch (e) {
                console.error('Final sync failed', e)
            }
        }

        const timer = setTimeout(sync, 1000)
        return () => clearTimeout(timer)
    }, [messages, user, currentChatId])

    const handleOnboardingComplete = async (profile: UserProfile) => {
        if (!user) return
        try {
            const token = await user.getIdToken()
            await saveUserProfile(token, profile)
            setUserProfile(profile)
            setShowOnboarding(false)
        } catch (e) {
            console.error('Error saving profile', e)
        }
    }

    const handleSend = async () => {
        if (!input.trim() || !user || isLoading) return

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, userMessage])
        const messageToSend = input
        setInput('')
        setIsLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 1500))

            const assistantMessage: Message = {
                role: 'assistant',
                content: "AARA is processing your thought pattern. \n\nWe are currently in beta. This response is a placeholder for the actual AI model integration.",
                timestamp: new Date().toISOString(),
            }

            setMessages((prev) => [...prev, assistantMessage])

        } catch (error: any) {
            console.error('Chat error:', error)
        } finally {
            setIsLoading(false)
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }

    const handleNewSession = () => {
        setMessages([])
        setSessionId(null)
        setCurrentChatId(null)
        setShowHistory(false)
    }

    const loadSession = (session: ChatSession) => {
        setMessages(session.messages)
        setCurrentChatId(session.id)
        setSessionId(session.id)
        setShowHistory(false)
    }

    const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!user) return

        const newHistory = chatHistory.filter(s => s.id !== sessionId)
        setChatHistory(newHistory)

        if (currentChatId === sessionId) {
            setMessages([])
            setCurrentChatId(null)
        }

        try {
            const token = await user.getIdToken()
            await deleteChatSession(token, sessionId)
        } catch (e) {
            console.error('Error deleting session', e)
        }
    }

    if (loading || !user) return <div className="min-h-screen bg-[#030305]" />

    if (showSplash) {
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

    if (showOnboarding) {
        return <OnboardingForm onComplete={handleOnboardingComplete} />
    }

    return (
        <div className="h-[100dvh] flex flex-col relative overflow-hidden">

            {/* Ambient Background - Reduced for mobile */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[20%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-indigo-500/5 blur-[60px] md:blur-[120px] rounded-full" />
                <div className="absolute bottom-[-20%] right-[20%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-purple-500/5 blur-[60px] md:blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-[90] p-6 pointer-events-none flex items-center justify-between">
                <button
                    onClick={() => setShowHistory(true)}
                    aria-label="Open Chat History"
                    className="pointer-events-auto p-3 rounded-xl bg-white/[0.03] backdrop-blur-md md:backdrop-blur-xl border border-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-all active:scale-95 group will-change-transform"
                >
                    <Menu size={20} className="group-hover:scale-110 transition-transform" />
                </button>

                <Link href="/" className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md md:backdrop-blur-xl hover:bg-white/5 transition-all active:scale-95 cursor-pointer">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-white/60 uppercase">AARA / CHAT</span>
                </Link>

                <Link
                    href="/"
                    aria-label="Exit Chat"
                    className="pointer-events-auto flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-full transition-colors group"
                >
                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02] text-white/40 group-hover:text-white group-hover:border-white/20 transition-all">
                        <X size={14} />
                    </div>
                </Link>
            </div>

            {/* History Sidebar - Premium Glass */}
            <div
                onClick={() => setShowHistory(false)}
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] transition-opacity duration-300 ${showHistory ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            <div
                className={`fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-black/40 backdrop-blur-lg md:backdrop-blur-2xl border-r border-white/5 z-[160] flex flex-col shadow-2xl transition-transform duration-300 ease-[0.16,1,0.3,1] ${showHistory ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="p-6 flex items-center justify-between border-b border-white/5">
                    <span className="text-xs font-bold tracking-widest text-white/40 uppercase">Sessions</span>
                    <button onClick={() => setShowHistory(false)} className="text-white/40 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="p-4">
                    <button
                        onClick={handleNewSession}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all text-sm font-medium text-white/90 group"
                    >
                        <Plus size={16} className="text-indigo-400" />
                        <span>New Conversation</span>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
                    {chatHistory.map((session) => (
                        <div
                            key={session.id}
                            onClick={() => loadSession(session)}
                            className={`group flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${currentChatId === session.id
                                ? 'bg-white/[0.06] text-white'
                                : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03]'
                                }`}
                        >
                            <span className="text-sm truncate max-w-[180px]">{session.preview}</span>
                            <button
                                onClick={(e) => deleteSession(session.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-all"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <main className={`relative z-10 flex-1 flex flex-col overflow-hidden`}>
                <div className="flex-1 overflow-y-auto px-4 pt-24 pb-4 scroll-smooth scrollbar-hide">
                    <div className="max-w-2xl mx-auto space-y-8">

                        {messages.length === 0 && (
                            <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                                <TextBlurReveal
                                    text={userProfile?.name ? `Hello, ${userProfile.name.split(' ')[0]}.` : 'I am listening.'}
                                    className="text-3xl md:text-5xl font-serif text-white/90 mb-6"
                                />
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1, duration: 1 }}
                                    className="text-white/60 text-sm max-w-sm leading-relaxed"
                                >
                                    I am an AI designed to help you process emotions through reflection. I will listen, ask clarifying questions, and help you find your own answers. I am not a therapist, but I am here to hold space for you.
                                </motion.p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] md:max-w-[75%] px-6 py-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm ${msg.role === 'user'
                                        ? 'bg-[#1a1a1e] text-white/90 rounded-br-none border border-white/10'
                                        : 'bg-white/[0.03] text-white/80 rounded-bl-none border border-white/5'
                                        }`}
                                >
                                    {msg.content.split('\n').map((line, j) => (
                                        <p key={j} className={j > 0 ? 'mt-4' : ''}>{line}</p>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5 rounded-bl-none flex gap-1.5 items-center">
                                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 md:pb-8">
                    {/* Soft Prompts */}
                    {messages.length === 0 && (
                        <div className="max-w-2xl mx-auto flex flex-wrap gap-2 mb-4 justify-center">
                            {["I'm feeling overwhelmed", "I had a weird dream", "Just want to vent", "Help me prepare for therapy"].map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => setInput(prompt)}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-xs text-white/60 hover:text-white transition-all"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />

                        <div className="relative flex items-center bg-white/[0.03] backdrop-blur-md md:backdrop-blur-xl border border-white/10 rounded-[2rem] pl-6 pr-2 py-2 focus-within:border-white/20 focus-within:bg-white/[0.05] transition-all duration-300">
                            <input
                                ref={inputRef}
                                className="flex-1 bg-transparent border-none outline-none text-white placeholder-white/20 text-[15px] py-2"
                                placeholder="Type your thoughts..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                            >
                                <Send size={18} className={input.trim() ? "text-indigo-400" : ""} />
                            </button>
                        </div>

                        <div className="text-center mt-3">
                            <p className="text-[10px] text-zinc-500 font-medium tracking-widest uppercase">AI-Driven Confidential Processing</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
