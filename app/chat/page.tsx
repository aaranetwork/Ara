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

  // 🌊 Swipe Control for Sidebar (works from anywhere on screen)
  const touchStartXRef = useRef<number | null>(null)
  const touchStartYRef = useRef<number | null>(null)

  useEffect(() => {
    const minSwipeDistance = 50
    const maxVerticalDistance = 100 // Ignore if vertical swipe

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

      // Only trigger if horizontal swipe (not vertical scroll)
      if (distanceY < maxVerticalDistance) {
        // Swipe right to open (from anywhere)
        if (distanceX > minSwipeDistance && !showHistory) {
          setShowHistory(true)
        }
        // Swipe left to close
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
  const splashMessage = 'Going to Chat...'
  useEffect(() => {
    if (!showSplash || loading) return
    let i = 0
    const typeInterval = setInterval(() => {
      if (i < splashMessage.length) {
        setTypedText(splashMessage.slice(0, i + 1))
        i++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => setShowSplash(false), 300)
      }
    }, 60)
    return () => clearInterval(typeInterval)
  }, [showSplash, loading])

  // Load profile and chat history on mount
  useEffect(() => {
    const initData = async () => {
      if (!user) return

      try {
        const token = await user.getIdToken()

        // 1. Profile: Check backend first, then fallback to Firebase User
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

        // 2. Chat Sessions
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

  // Save messages to Server (Debounced or on change)
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

      // Optimistic update of history
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

      // Sync to server
      try {
        const token = await user.getIdToken()
        await saveChatSession(token, session)
      } catch (e) {
        console.error('Final sync failed', e)
      }
    }

    // Debounce this effect slightly or just run it?
    // For now run it.
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
      if (!user) throw new Error('User not authenticated')
      const token = await user.getIdToken()

      let currentSessionId = sessionId
      if (!currentSessionId) {
        const sessionResponse = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user.uid,
            userName: userProfile?.name
          }),
        })
        const sessionData = await sessionResponse.json()
        if (sessionData.sessionId) {
          currentSessionId = sessionData.sessionId
          setSessionId(currentSessionId)
          // LINK: Set currentChatId to match backend session immediately
          setCurrentChatId(currentSessionId)
        } else {
          throw new Error(sessionData.error || 'Failed to create session')
        }
      }

      const response = await apiClient.sendMessageViaProxy(messageToSend, currentSessionId, token)

      if (response.sessionId) {
        setSessionId(response.sessionId)
      }

      if (response.error) {
        throw new Error(response.error)
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])

    } catch (error: any) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: `Connection error. Please try again.`,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleClear = () => {
    if (confirm('Clear this conversation?')) {
      setMessages([])
      setSessionId(null)
      setCurrentChatId(null)
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
    setSessionId(session.id) // Context Restored
    setShowHistory(false)
  }

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) return

    // Optimistic update
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
      // Revert? For MVP assume success or simple error log
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Image
              src="/aara-logo.png"
              alt="AARA"
              width={48}
              height={48}
              className="rounded-xl animate-pulse"
            />
          </div>
          <div className="w-8 h-1 bg-blue-500/30 rounded-full animate-pulse" />
        </div>
      </div>
    )
  }

  if (showSplash) {
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

  // Calculate stats from history
  const calculateStats = () => {
    const sessions = chatHistory
    const totalSessions = sessions.length



    // Calculate total minutes (approx 2 mins per message)
    const totalMessages = sessions.reduce((acc, s) => acc + s.messages.length, 0)
    const totalMinutes = totalMessages * 2

    // Calculate clarity score (mock logic: improves with more interaction)
    // Base 50, adds 0.5 per message, caps at 100
    const clarityScore = Math.min(98, Math.floor(50 + (totalMessages * 0.5)))

    return { totalSessions, totalMinutes, clarityScore }
  }

  const stats = calculateStats()

  // Show onboarding for new users
  if (showOnboarding) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />
  }

  return (
    <div className="h-[100dvh] bg-[#050505] text-white selection:bg-blue-500/30 overflow-hidden flex flex-col">

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[90vw] max-w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[10%] right-[10%] w-[50vw] max-w-[300px] h-[300px] bg-indigo-600/5 blur-[100px] rounded-full opacity-30" />
      </div>



      {/* Fixed Floating Header - Menu | Branding | Exit */}
      <div className="fixed top-0 left-0 right-0 z-[90] p-6 pointer-events-none flex items-center justify-between bg-gradient-to-b from-[#050505] to-transparent">
        {/* Menu Button (Mobile) */}
        <button
          onClick={() => setShowHistory(true)}
          className="pointer-events-auto p-3 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all active:scale-95 shadow-2xl group md:hidden"
        >
          <Menu size={20} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Desktop Menu Button */}
        <button
          onClick={() => setShowHistory(true)}
          className="pointer-events-auto p-3 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all active:scale-95 shadow-2xl group hidden md:block"
        >
          <Menu size={20} className="group-hover:scale-110 transition-transform" />
        </button>

        {/* Branding Pill */}
        <Link href="/" className="pointer-events-auto flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-2xl hover:bg-white/5 transition-all active:scale-95 cursor-pointer">
          <Image src="/aara-logo.png" alt="AARA" width={20} height={20} className="rounded-lg border border-white/10" />
          <span className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase">CHAT</span>
        </Link>

        {/* Exit Button */}
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-full transition-colors group"
        >
          <span className="text-[10px] font-bold tracking-widest text-gray-500 group-hover:text-white uppercase transition-colors">Exit</span>
          <X size={18} className="text-gray-500 group-hover:text-white transition-colors" />
        </Link>
      </div>


      {/* Premium History Sidebar - Pure CSS for lag-free performance */}
      {/* Backdrop */}
      <div
        onClick={() => setShowHistory(false)}
        className={`fixed inset-0 bg-black/80 z-[150] transition-opacity duration-200 ${showHistory ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        style={{ willChange: 'opacity' }}
      />

      {/* Sidebar Content */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#0d0d0d] border-r border-white/5 z-[160] flex flex-col shadow-2xl transition-transform duration-200 ease-out ${showHistory ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{
          willChange: 'transform',
          transform: showHistory ? 'translate3d(0, 0, 0)' : 'translate3d(-100%, 0, 0)'
        }}
      >
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/aara-logo.png"
              alt="AARA"
              width={32}
              height={32}
              className="rounded-lg shadow-lg border border-white/10"
            />
          </Link>
          <button
            onClick={() => setShowHistory(false)}
            className="p-2 text-gray-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Actions */}
        <div className="px-3 space-y-1">
          <button
            onClick={handleNewSession}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-medium text-gray-200 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/30">
              <PenSquare size={16} className="text-gray-400 group-hover:text-blue-400" />
            </div>
            <span>New chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 px-3 py-4 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <div className="text-center text-gray-600 py-8">
              <MessageSquare size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-xs">No conversations yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {chatHistory.map((session) => (
                <div
                  key={session.id}
                  onClick={() => loadSession(session)}
                  className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 border ${currentChatId === session.id
                    ? 'bg-blue-600/10 border-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                    : 'hover:bg-white/5 text-gray-400 hover:text-gray-200 border-transparent hover:border-white/5'
                    }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">
                      {session.preview}
                    </p>
                    <p className="text-[10px] opacity-40 mt-0.5">
                      {new Date(session.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <button
                    onClick={(e) => deleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-500 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>


      </div>

      {/* Chat Container */}
      <div
        className={`relative z-10 flex-1 flex flex-col overflow-hidden ${showHistory ? 'pointer-events-none md:pointer-events-auto' : ''
          }`}
        onClick={() => showHistory && setShowHistory(false)}
      >
        <div className="flex-1 overflow-y-auto px-4 pt-24 md:pt-20 pb-4 scroll-smooth scrollbar-hide">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <FadeIn className="h-[60vh] flex flex-col items-center justify-center text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 border border-blue-500/20 text-[10px] tracking-[0.2em] font-bold text-blue-400 uppercase mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    {userProfile?.name ? `Ready for you, ${userProfile.name}` : 'AARA is ready'}
                  </div>
                </div>
                <Sparkles size={48} className="text-gray-800 mb-4" />
                <h2 className="text-2xl font-bold text-gray-500 mb-2">
                  {userProfile?.name ? `Welcome back, ${userProfile.name}` : 'How can I help today?'}
                </h2>
                <p className="text-gray-600 text-sm max-w-md">
                  Share what&apos;s on your mind. AARA is here to listen.
                </p>
              </FadeIn>
            )}

            {messages.map((msg, i) => {
              const isLast = i === messages.length - 1
              return (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${isLast ? 'animate-fade-in-up' : ''
                    }`}
                >
                  <div
                    className={`max-w-[85%] md:max-w-[70%] px-4 py-3 rounded-[1.5rem] text-sm leading-relaxed shadow-lg ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-blue-500/10'
                      : 'bg-[#0d0d0d] border border-white/5 text-gray-200 rounded-bl-sm shadow-black/40'
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-[#0a0a0a] border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="relative z-20 px-4 pb-4 md:pb-8 pt-4 bg-gradient-to-t from-[#050505] via-[#050505]/95 to-transparent">
          <div className="max-w-3xl mx-auto relative group">
            {/* Liquid Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-[2.5rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />

            <div className="relative flex items-center bg-[#0d0d0d]/80 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] pl-6 pr-2 py-2 focus-within:border-blue-500/40 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-500 shadow-2xl">
              <input
                ref={inputRef}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm py-3"
                placeholder="Share what's on your mind..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center disabled:opacity-20 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20 group/send"
              >
                <Send size={18} className={`${input.trim() && !isLoading ? 'animate-pulse' : ''} group-hover/send:scale-110 transition-transform`} />
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="w-12 h-[1px] bg-gradient-to-r from-transparent to-white/10" />
              <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] whitespace-nowrap">
                AARA Signal Processor
              </p>
              <span className="w-12 h-[1px] bg-gradient-to-l from-transparent to-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
