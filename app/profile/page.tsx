'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, LogOut, Settings, ChevronRight, Shield,
  BookOpen, MessageSquare, Calendar, Flame, TrendingUp,
  Sparkles, Edit3, Bell, Moon, Sun, Crown, Heart,
  Zap, CheckCircle2, Camera, X, Check, Save, HelpCircle, FileText, Lock, Send
} from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import { collection, getDocs, query, orderBy, limit, doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { updateProfile } from 'firebase/auth'

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [chatCount, setChatCount] = useState(0)
  const [moodCount, setMoodCount] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview')

  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showLanguage, setShowLanguage] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const [showFeedback, setShowFeedback] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Feedback State
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'general' | 'bug'>('general')
  const [sendingFeedback, setSendingFeedback] = useState(false)

  // Edit profile state
  const [displayName, setDisplayName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Settings
  const [notifDailyReminder, setNotifDailyReminder] = useState(true)
  const [dataCollection, setDataCollection] = useState(true)
  const [userPlan, setUserPlan] = useState<'free' | 'plus' | 'unlimited'>('free')

  useEffect(() => {
    setMounted(true)
  }, [])

  const loadUserSettings = useCallback(async () => {
    if (!user || !db) return
    try {
      const settingsRef = doc(db as any, 'users', user.uid, 'settings', 'preferences')
      const settingsSnap = await getDoc(settingsRef)
      if (settingsSnap.exists()) {
        const data = settingsSnap.data()
        // Simple mock load for brevity in this redesign
        if (data.notifications) setNotifDailyReminder(data.notifications.dailyReminder)
      }

      const subRef = doc(db as any, 'users', user.uid, 'subscription', 'current')
      const subSnap = await getDoc(subRef)
      if (subSnap.exists()) setUserPlan(subSnap.data().plan || 'free')
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }, [user])

  const loadStats = useCallback(async () => {
    if (!user || !db) return
    try {
      // Moods
      try {
        const moodsRef = collection(db as any, 'users', user.uid, 'moods')
        const moodsSnapshot = await getDocs(moodsRef)
        setMoodCount(moodsSnapshot.size)
      } catch (e) { setMoodCount(0) }

      // Chats
      try {
        const chatsRef = collection(db as any, 'users', user.uid, 'chats')
        const chatsSnapshot = await getDocs(chatsRef)
        setChatCount(chatsSnapshot.size)
      } catch (e) { setChatCount(0) }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.email?.split('@')[0] || '')
      loadUserSettings()
      loadStats()
    }
  }, [user, loadUserSettings, loadStats])

  const handleSaveProfile = async () => {
    if (!user) return
    setSaving(true)
    try {
      await updateProfile(user, { displayName })
      setSaveSuccess(true)
      setTimeout(() => {
        setSaveSuccess(false)
        setShowEditProfile(false)
      }, 1500)
    } catch (error) {
      console.error(error)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = async () => {
    await signOut()
    router.push('/')
  }

  const handleSendFeedback = async () => {
    if (!feedbackMessage.trim()) return

    setSendingFeedback(true)
    try {
      const token = await user?.getIdToken()
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: feedbackMessage,
          type: feedbackType
        })
      })

      if (!res.ok) throw new Error('Failed to send')

      // Success
      setFeedbackMessage('')
      setShowFeedback(false)
      alert('Thank you for your feedback!')
    } catch (e) {
      console.error(e)
      alert('Failed to send feedback. Please try again.')
    } finally {
      setSendingFeedback(false)
    }
  }

  const formatMemberSince = () => {
    if (!user?.metadata?.creationTime) return 'N/A'
    return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  if (!mounted || loading || !user) return null

  // --- Components ---
  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-3 mt-6 px-1">
      <div className="h-1 w-1 rounded-full bg-indigo-500" />
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</h3>
    </div>
  )

  const SettingRow = ({ icon: Icon, label, desc, onClick, href }: any) => {
    const Content = (
      <div className="w-full flex items-center justify-between p-4 bg-[#0e0e12] border border-white/5 rounded-2xl hover:bg-white/5 hover:border-white/10 transition-all group">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
            <Icon size={18} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-white group-hover:text-indigo-100 transition-colors">{label}</p>
            {desc && <p className="text-[10px] text-gray-500">{desc}</p>}
          </div>
        </div>
        <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
      </div>
    )

    if (href) return <Link href={href} className="block mb-2">{Content}</Link>
    return <button onClick={onClick} className="w-full mb-2 text-left">{Content}</button>
  }

  return (
    <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      <Navbar />

      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-xl mx-auto px-6 pb-32 pt-28 md:pt-36"
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="relative inline-block mb-6 group">
            <div className="w-32 h-32 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
              <div className="w-full h-full rounded-full bg-[#030305] p-1 relative overflow-hidden">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt="Profile" width={128} height={128} className="rounded-full w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                    <span className="text-3xl font-serif text-white/20 font-medium">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowEditProfile(true)}
              className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg border-4 border-[#030305]"
            >
              <Edit3 size={16} />
            </button>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-3 tracking-tight text-white">
            {user.displayName || 'Traveler'}
          </h1>
          <div className="flex items-center justify-center gap-3 text-xs text-white/50 font-bold uppercase tracking-widest">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">
              {userPlan === 'free' ? 'Free Plan' : 'AARA Plus'}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>Joined {formatMemberSince()}</span>
          </div>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div variants={itemVariants} className="flex p-1 bg-white/[0.03] border border-white/5 rounded-2xl mb-10 relative backdrop-blur-md">
          {(['overview', 'settings'] as const).map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all relative z-10 ${isActive ? 'text-black' : 'text-white/40 hover:text-white'}`}
              >
                <span className="relative z-10">{tab}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            )
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-6 rounded-[24px] bg-[#030305]/40 backdrop-blur-xl border border-white/5 flex flex-col items-center justify-center gap-3 text-center group hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
                    <Heart size={24} />
                  </div>
                  <span className="text-3xl font-serif font-medium text-white">{moodCount}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Check-ins</span>
                </div>
                <div className="p-6 rounded-[24px] bg-[#030305]/40 backdrop-blur-xl border border-white/5 flex flex-col items-center justify-center gap-3 text-center group hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare size={24} />
                  </div>
                  <span className="text-3xl font-serif font-medium text-white">{chatCount}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Sessions</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div>
                <SectionHeader title="Account" />
                <div className="space-y-2">
                  <SettingRow icon={User} label="Personal Information" desc="Name, Email, Photo" onClick={() => setShowEditProfile(true)} />
                  <SettingRow icon={Bell} label="Notifications" desc="Preferences & Alerts" onClick={() => setShowNotifications(true)} />
                </div>
              </div>

              <div>
                <SectionHeader title="Security" />
                <div className="space-y-2">
                  <SettingRow icon={Lock} label="Privacy & Data" desc="Control your footprint" onClick={() => setShowPrivacy(true)} />
                </div>
              </div>

              <div>
                <SectionHeader title="Support" />
                <div className="space-y-2">
                  <SettingRow icon={MessageSquare} label="Send Feedback" desc="Help us improve" onClick={() => setShowFeedback(true)} />
                  <SettingRow icon={HelpCircle} label="Help & Support" desc="FAQs and Contact" href="#" />
                  <SettingRow icon={FileText} label="Terms & Policies" desc="Legal Information" href="#" />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 text-center text-red-500 font-bold text-xs tracking-widest uppercase hover:bg-red-500/5 rounded-xl transition-colors border border-transparent hover:border-red-500/10"
                >
                  Sign Out
                </button>
              </div>

              <p className="text-center text-[10px] text-white/20 mt-8 uppercase tracking-widest">
                Aara App Alpha v0.9
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfile && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#030305]/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowEditProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#08080c] border border-white/10 p-8 rounded-[32px] shadow-2xl"
            >
              <h3 className="text-2xl font-serif font-medium mb-8 text-center text-white">Edit Profile</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 block ml-1">Display Name</label>
                  <input
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => setShowEditProfile(false)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white/60 tracking-wider uppercase transition-colors">Cancel</button>
                  <button onClick={handleSaveProfile} className="flex-1 py-4 bg-white text-black rounded-xl text-xs font-bold tracking-wider uppercase hover:bg-gray-200 transition-colors shadow-lg">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#030305]/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowFeedback(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#08080c] border border-white/10 p-8 rounded-[32px] shadow-2xl relative"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-medium text-white">Send Feedback</h3>
                  <p className="text-xs text-white/40 font-medium">Help us improve your experience</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 block ml-1">Type</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setFeedbackType('general')}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${feedbackType === 'general' ? 'bg-white text-black border-transparent' : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'}`}
                    >
                      General
                    </button>
                    <button
                      onClick={() => setFeedbackType('bug')}
                      className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${feedbackType === 'bug' ? 'bg-red-500 text-white border-transparent' : 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10'}`}
                    >
                      Bug Report
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 block ml-1">Message</label>
                  <textarea
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder={feedbackType === 'bug' ? "Describe the issue..." : "Share your thoughts..."}
                    rows={5}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] resize-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowFeedback(false)}
                    className="flex-1 py-4 bg-white/5 rounded-xl text-xs font-bold text-white/40 uppercase tracking-wider hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendFeedback}
                    disabled={sendingFeedback || !feedbackMessage.trim()}
                    className="flex-1 py-4 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    {sendingFeedback ? (
                      <>
                        <div className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#030305]/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#08080c] border border-white/10 p-8 rounded-[32px] shadow-2xl text-center"
            >
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500">
                <LogOut size={32} />
              </div>
              <h3 className="text-2xl font-serif font-medium mb-3 text-white">Sign Out?</h3>
              <p className="text-white/40 text-sm mb-8 leading-relaxed">
                You&apos;ll need to sign in again to access your journey data.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-4 bg-white/5 rounded-xl text-xs font-bold text-white/60 uppercase tracking-wider hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-4 bg-red-500 rounded-xl text-xs font-bold text-white uppercase tracking-wider hover:bg-red-600 shadow-lg shadow-red-500/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
