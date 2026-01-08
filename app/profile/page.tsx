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
  Zap, CheckCircle2, Camera, X, Check, Save, HelpCircle, FileText, Lock
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

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut()
      router.push('/')
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
    <div className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-xl mx-auto px-6 pb-32 pt-24 md:pt-32"
      >
        {/* Profile Header */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <div className="relative inline-block mb-6 group">
            <div className="w-28 h-28 rounded-full p-[2px] bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 shadow-2xl shadow-indigo-500/20">
              <div className="w-full h-full rounded-full bg-[#050505] p-1">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt="Profile" width={112} height={112} className="rounded-full w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                    <span className="text-3xl font-black text-white/20">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowEditProfile(true)}
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg"
            >
              <Edit3 size={14} />
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">
            {user.displayName || 'Traveler'}
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
              {userPlan === 'free' ? 'Free Plan' : 'AARA Plus'}
            </span>
            <span>•</span>
            <span>Joined {formatMemberSince()}</span>
          </div>
        </motion.div>

        {/* Tab Switcher */}
        <motion.div variants={itemVariants} className="flex p-1.5 bg-[#0e0e12] border border-white/5 rounded-2xl mb-8 relative">
          {(['overview', 'settings'] as const).map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all relative z-10 ${isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {tab}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 rounded-xl border border-white/5 shadow-sm"
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
              transition={{ duration: 0.2 }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-5 rounded-2xl bg-[#0e0e12] border border-white/5 flex flex-col items-center justify-center gap-2 text-center group hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <Heart size={20} />
                  </div>
                  <span className="text-2xl font-black">{moodCount}</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">Check-ins</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#0e0e12] border border-white/5 flex flex-col items-center justify-center gap-2 text-center group hover:bg-white/5 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                    <MessageSquare size={20} />
                  </div>
                  <span className="text-2xl font-black">{chatCount}</span>
                  <span className="text-[10px] uppercase tracking-widest text-gray-500">Sessions</span>
                </div>
              </div>

              {/* Subscription Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-blue-900/10 border border-indigo-500/20 relative overflow-hidden mb-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full" />
                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {userPlan === 'free' ? 'Upgrade to Plus' : 'You are a Plus Member'}
                    </h3>
                    <p className="text-sm text-indigo-200/60 max-w-[200px] mb-6 leading-relaxed">
                      {userPlan === 'free'
                        ? 'Unlock unlimited chats, detailed reports, and therapist matching.'
                        : 'Enjoy unlimited access to all features.'}
                    </p>
                    <button
                      onClick={() => router.push('/plans')}
                      className="px-5 py-2.5 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wide hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/10"
                    >
                      {userPlan === 'free' ? 'Upgrade Now' : 'Manage Subscription'}
                    </button>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                    <Crown size={24} className="text-indigo-400" />
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <SectionHeader title="Account" />
              <SettingRow icon={User} label="Personal Information" desc="Name, Email, Photo" onClick={() => setShowEditProfile(true)} />
              <SettingRow icon={Bell} label="Notifications" desc="Preferences & Alerts" onClick={() => setShowNotifications(true)} />

              <SectionHeader title="Security" />
              <SettingRow icon={Lock} label="Privacy & Data" desc="Control your footprint" onClick={() => setShowPrivacy(true)} />

              <SectionHeader title="Support" />
              <SettingRow icon={HelpCircle} label="Help & Support" desc="FAQs and Contact" href="#" />
              <SettingRow icon={FileText} label="Terms & Policies" desc="Legal Information" href="#" />

              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="w-full py-4 text-center text-red-500 font-bold text-sm tracking-wide uppercase hover:bg-red-500/5 rounded-xl transition-colors"
                >
                  Sign Out
                </button>
              </div>

              <p className="text-center text-[10px] text-gray-600 mt-6 uppercase tracking-widest opacity-50">
                Aara App v1.0.0
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>

      {/* Edit Profile Modal (Simplified) */}
      <AnimatePresence>
        {showEditProfile && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowEditProfile(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#0e0e12] border border-white/10 p-6 rounded-3xl shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-6 text-center">Edit Profile</h3>
              <input
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-500 mb-4 focus:outline-none focus:border-indigo-500/50"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowEditProfile(false)} className="flex-1 py-3 bg-white/5 rounded-xl text-sm font-bold text-gray-400">Cancel</button>
                <button onClick={handleSaveProfile} className="flex-1 py-3 bg-indigo-500 rounded-xl text-sm font-bold text-white hover:bg-indigo-600">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
