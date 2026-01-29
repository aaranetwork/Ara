'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Shield, Brain, FileText } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen text-white pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Nav (Absolute for this page style) */}
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

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Brain size={12} />
            <span>Identity</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-8 tracking-tight leading-tight">
            A pre-therapy companion used to <br className="hidden md:block" />
            <span className="text-white/40">organize thoughts & emotions.</span>
          </h1>
          <p className="text-lg text-white/60 max-w-3xl mx-auto leading-relaxed">
            AARA turns daily experiences into clear, shareable insights — so therapists understand users faster, and users feel understood.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Brain,
              title: 'Reflect',
              desc: 'Structure what you are feeling before a session.'
            },
            {
              icon: FileText,
              title: 'Summarize',
              desc: 'Share a clear summary with your therapist.'
            },
            {
              icon: Shield,
              title: 'Understand',
              desc: 'Reduce anxiety and feel understood faster.'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-8 bg-white/[0.02] border border-white/5 rounded-[24px] hover:bg-white/[0.04] transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 text-white/50 group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                <item.icon size={24} />
              </div>
              <h3 className="text-lg font-serif mb-2 text-white/90">{item.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* What AARA is NOT */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#0e0e12] border border-white/10 p-10 md:p-16 mb-16">
          <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8 text-center">
            <h2 className="text-3xl font-serif font-medium">What AARA is NOT</h2>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-left mx-auto max-w-lg">
              <div className="flex gap-3 text-white/60 text-sm items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 shrink-0" />
                Not a therapy replacement
              </div>
              <div className="flex gap-3 text-white/60 text-sm items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 shrink-0" />
                Not diagnosis
              </div>
              <div className="flex gap-3 text-white/60 text-sm items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 shrink-0" />
                Not a mental-health “solution” app
              </div>
              <div className="flex gap-3 text-white/60 text-sm items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 shrink-0" />
                Not motivation / quotes / meditation
              </div>
            </div>
          </div>
        </section>

        {/* Why does this exist? */}
        <section className="text-center max-w-3xl mx-auto py-12">
          <h2 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-8">Why does this exist?</h2>
          <blockquote className="text-3xl md:text-5xl font-serif leading-tight">
            &quot;Because most therapy sessions fail not due to lack of care, but due to <span className="text-indigo-400">lack of clarity</span>.&quot;
          </blockquote>
          <div className="pt-12">
            <Link href="/try" className="inline-block px-10 py-5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-xl shadow-white/5">
              Start Your Journey
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
