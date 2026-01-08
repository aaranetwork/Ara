'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Shield, Brain, FileText, Lock } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-5 bg-[#08080c]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/aara-logo.png" alt="AARA" width={28} height={28} className="rounded-lg" />
            <span className="font-semibold">AARA</span>
          </Link>
          <div className="w-16" />
        </div>
      </nav>

      <div className="pt-12 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About AARA</h1>
            <p className="text-gray-500 text-lg">Mental Health Signal Processor</p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-12"
          >
            {/* What is AARA */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">What is AARA</h2>
              <p className="text-gray-400 leading-relaxed">
                It helps you structure your thoughts before therapy sessions
                and generate reports that can be shared with licensed professionals.
              </p>
            </section>

            {/* What AARA Does */}
            <section>
              <h2 className="text-2xl font-semibold mb-6">What AARA Does</h2>
              <div className="grid gap-4">
                {[
                  { icon: Brain, title: 'Processes Signals', desc: 'Helps you understand patterns in your thoughts and emotions' },
                  { icon: FileText, title: 'Generates Reports', desc: 'Creates structured summaries for therapy sessions' },
                  { icon: Shield, title: 'Supports Therapy', desc: 'Designed to work alongside real therapists, not replace them' },
                ].map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className="flex gap-4 p-5 bg-white/[0.02] border border-white/10 rounded-xl">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center shrink-0">
                        <Icon size={20} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">{item.title}</h3>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* What AARA is NOT */}
            <section className="p-6 border border-white/10 rounded-xl">
              <h2 className="text-xl font-semibold mb-4">Important to Understand</h2>
              <ul className="space-y-3 text-gray-400">
                <li>AARA is not a therapist</li>
                <li>AARA does not provide medical advice or diagnosis</li>
                <li>AARA does not replace professional mental health care</li>
                <li>AARA is a tool to support your mental health journey</li>
              </ul>
            </section>

            {/* Mission */}
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                We believe that understanding yourself is the first step toward better mental health.
                AARA exists to help you organize the signals in your mind, making it easier to
                communicate with therapists and gain clarity on your inner world.
              </p>
            </section>

            {/* CTA */}
            <div className="text-center pt-8">
              <Link href="/auth/signup">
                <button className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold transition-colors">
                  Start Your Journey
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-900/10 blur-[150px] rounded-full" />
      </div>
    </div>
  )
}
