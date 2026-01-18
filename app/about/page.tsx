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
              <Image src="/aara-logo.png" alt="AARA" width={24} height={24} className="rounded-md" />
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
            <span>Our Vision</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 tracking-tight">
            Mental Clarity, <br className="hidden md:block" />
            <span className="text-white/40">Elevated.</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            AARA is a signal processor for your mind. We help you structure your thoughts
            before therapy, translating raw emotions into clear, actionable insights.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: Brain,
              title: 'Signal Processing',
              desc: 'Advanced algorithms to identify patterns in your emotional data.'
            },
            {
              icon: FileText,
              title: 'Clinical Reports',
              desc: 'Turn journals into structured summaries for your therapist.'
            },
            {
              icon: Shield,
              title: 'Human Centric',
              desc: 'Designed to support professional therapy, not replace it.'
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

        {/* Mission Statement */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#0e0e12] border border-white/10 p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto space-y-8">
            <h2 className="text-3xl md:text-4xl font-serif font-medium">Important to Understand</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <div className="flex gap-3 text-white/60 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                AARA is not a therapist.
              </div>
              <div className="flex gap-3 text-white/60 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                We do not provide medical diagnosis.
              </div>
              <div className="flex gap-3 text-white/60 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                Emergency services should be contacted for crises.
              </div>
              <div className="flex gap-3 text-white/60 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20 mt-2 shrink-0" />
                We facilitate structured self-reflection.
              </div>
            </div>
            <div className="pt-4">
              <Link href="/auth/signup" className="inline-block px-8 py-4 bg-white text-black rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">
                Start Your Journey
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
