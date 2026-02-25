'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth'
import { useAuth } from '@/hooks/useAuth'
import { useEffect } from 'react'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/')
    }
  }, [user, authLoading, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmail(email, password)
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-indigo-500/30 bg-[#000000] text-white antialiased">
      {/* Static Gradient Background - Same as Landing Page */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[140%] h-[100vh] bg-[radial-gradient(ellipse_50%_80%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
        <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(99,102,241,0.06),transparent_70%)]" />
        <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(168,85,247,0.05),transparent_70%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-black to-transparent" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 max-w-md w-full"
      >
        {/* Logo & Title */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Image src="/aara-logo.png" alt="AARA Prep" width={48} height={48} className="relative rounded-2xl shadow-2xl" />
            </div>
          </Link>
          <h1 className="text-4xl font-medium text-white mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-white/40 text-sm tracking-wide">Enter your credentials to access your space</p>
        </motion.div>

        {/* Card */}
        <motion.div variants={fadeUp} className="p-8 md:p-10 bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] rounded-3xl shadow-2xl">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 focus:bg-white/[0.05] transition-all duration-300"
                placeholder="name@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/30 focus:bg-white/[0.05] transition-all duration-300"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-white text-black font-semibold rounded-full hover:bg-indigo-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 text-white/20 uppercase tracking-widest font-bold bg-[#030305]">Or</span>
            </div>
          </div>

          {/* Google Button */}
          <motion.button
            onClick={handleGoogleLogin}
            disabled={loading}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.06)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-white/[0.03] border border-white/[0.06] text-white/80 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 group"
          >
            <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="group-hover:text-white transition-colors">Continue with Google</span>
          </motion.button>
        </motion.div>

        {/* Footer Link */}
        <motion.p variants={fadeUp} className="text-center text-white/30 text-sm mt-8">
          New to AARA?{' '}
          <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors underline decoration-indigo-400/30 underline-offset-4">
            Create an account
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}
