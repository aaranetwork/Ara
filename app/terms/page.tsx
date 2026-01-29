'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Gavel } from 'lucide-react'

export default function TermsPage() {
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
            <Image src="/aara-logo.png" alt="AARA Prep" width={24} height={24} className="rounded-md" />
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
            <Gavel size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Terms of Service</h1>
          <p className="text-white/40 text-sm uppercase tracking-widest font-bold">Last Updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-12"
        >
          <Section title="Service Description">
            AARA Prep describes itself as an AI-powered pre-therapy companion and therapy support tool.
            Our services provide structured self-reflection, journaling assistance, and data visualization.
          </Section>

          <Section title="Not Medical Advice">
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200/80 text-sm leading-relaxed mb-4">
              <strong>Critical Disclaimer:</strong> AARA Prep is not a substitute for professional medical or mental health treatment.
            </div>
            If you are experiencing a mental health emergency, please contact local emergency services or a mental health professional immediately.
            AARA Prep is a tool for self-help and organization, not diagnosis or treatment.
          </Section>

          <Section title="User Responsibilities">
            By using AARA Prep, you agree to:
            <ul className="list-disc list-outside ml-4 space-y-2 mt-4 marker:text-indigo-500/50">
              <li>Maintain the confidentiality of your account credentials.</li>
              <li>Provide accurate information during onboarding.</li>
              <li>Use the service lawfully and respectfully.</li>
              <li>Not attempt to reverse-engineer the AI logic or systems.</li>
            </ul>
          </Section>

          <Section title="Limitation of Liability">
            AARA Prep is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not guarantee that the service will be uninterrupted or error-free.
            To the maximum extent permitted by law, AARA Prep shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.
          </Section>

          <div className="pt-8 border-t border-white/5">
            <p className="text-white/40 text-sm">
              Acceptance of these terms is a condition of usage for AARA Prep services.
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
