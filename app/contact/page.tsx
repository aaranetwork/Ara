'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen text-white pt-32 pb-20 px-6">
      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 bg-[#030305]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-medium">Back</span>
          </Link>
          <div className="flex items-center gap-2 opacity-50">
            <Image src="/aara-logo.png" alt="AARA Prep" width={24} height={24} className="rounded-md" />
          </div>
        </div>
      </nav>

      <div className="max-w-xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Contact Support</h1>
          <p className="text-white/60">We answer within 24 hours.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#0e0e12] border border-white/10 rounded-[24px] p-12 text-center"
            >
              <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-400">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-serif mb-2">Message Sent</h2>
              <p className="text-white/60 mb-8">Thank you for reaching out. A team member will review your request shortly.</p>
              <Link href="/" className="inline-block px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors">
                Return Home
              </Link>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                    placeholder="Jane Doe"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-black rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Sending...' : (
                  <>Send Message <Send size={16} /></>
                )}
              </button>

              <div className="pt-8 grid grid-cols-2 gap-4">
                <a href="mailto:support@aara.app" className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-colors flex flex-col items-center gap-2 text-center group">
                  <Mail className="text-white/40 group-hover:text-white transition-colors" size={20} />
                  <span className="text-xs text-white/60">support@aara.app</span>
                </a>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center gap-2 text-center">
                  <MessageSquare className="text-white/40" size={20} />
                  <span className="text-xs text-white/60">Avg. Response: 24h</span>
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
