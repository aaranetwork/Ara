'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
            className="mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-gray-500">Last updated: December 2024</p>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-invert prose-gray max-w-none"
          >
            <div className="space-y-10 text-gray-400">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Your Privacy Matters</h2>
                <p className="leading-relaxed">
                  At AARA, we understand that mental health information is deeply personal.
                  We are committed to protecting your privacy and ensuring that your data remains secure and confidential.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Data We Collect</h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Account information (email, name)</li>
                  <li>Conversation history with AARA</li>
                  <li>Journal entries</li>
                  <li>Generated reports</li>
                  <li>Usage data for improving the service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">How We Protect Your Data</h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>End-to-end encryption for all conversations</li>
                  <li>Secure cloud storage with industry-standard protocols</li>
                  <li>No selling or sharing of data with third parties</li>
                  <li>Regular security audits</li>
                  <li>You can delete your data at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Data Sharing</h2>
                <p className="leading-relaxed">
                  We do not share your personal data with anyone. The only exception is when you
                  explicitly choose to share your AARA report with a therapist. You have full
                  control over what you share and with whom.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Your Rights</h2>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Access your data at any time</li>
                  <li>Request deletion of your account and all data</li>
                  <li>Export your data</li>
                  <li>Opt out of non-essential communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
                <p className="leading-relaxed">
                  If you have any questions about our privacy practices, please contact us at{' '}
                  <a href="mailto:privacy@aara.app" className="text-blue-400 hover:underline">privacy@aara.app</a>
                </p>
              </section>
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
