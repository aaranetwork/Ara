'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ScrollText } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen text-white pt-32 pb-20 px-6">
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

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-white/5 pb-12"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 border border-indigo-500/20">
            <ScrollText size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Privacy Policy</h1>
          <p className="text-white/40 text-sm uppercase tracking-widest font-bold">Last Updated: December 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-12"
        >
          <Section title="Your Privacy Matters">
            At AARA, we understand that mental health information is deeply personal.
            We are committed to protecting your privacy and ensuring that your data remains secure and confidential.
            This policy outlines exactly how your data is handled.
          </Section>

          <Section title="Data Collection">
            <ul className="list-disc list-outside ml-4 space-y-2 marker:text-indigo-500/50">
              <li><strong className="text-white font-medium">Account Details:</strong> Basic identity info required for secure access.</li>
              <li><strong className="text-white font-medium">Journal & Chat Logs:</strong> Stored securely to provide history and analysis.</li>
              <li><strong className="text-white font-medium">Analytics:</strong> Anonymized usage patterns to improve AARA's core algorithms.</li>
            </ul>
          </Section>

          <Section title="Security Protocol">
            We employ a multi-layered security approach:
            <ul className="list-disc list-outside ml-4 space-y-2 mt-4 marker:text-indigo-500/50">
              <li>At-rest encryption for all database entries.</li>
              <li>Strict TLS/SSL transport security for all data in transit.</li>
              <li>Isolated sandbox environments for AI processing.</li>
              <li>No third-party data selling. Ever.</li>
            </ul>
          </Section>

          <Section title="User Control">
            You retain full ownership of your data. You may:
            <ul className="list-disc list-outside ml-4 space-y-2 mt-4 marker:text-indigo-500/50">
              <li>Export your complete history at any time.</li>
              <li>Request permanent deletion of your account and associated data.</li>
              <li>Opt-out of non-essential analytical tracking.</li>
            </ul>
          </Section>

          <div className="pt-8 border-t border-white/5">
            <p className="text-white/40 text-sm">
              Questions? Contact our Data Protection Officer at <a href="mailto:privacy@aara.app" className="text-indigo-400 hover:text-indigo-300 transition-colors">privacy@aara.app</a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-serif text-white/90">{title}</h2>
      <div className="text-white/60 leading-relaxed text-base">
        {children}
      </div>
    </section>
  )
}
