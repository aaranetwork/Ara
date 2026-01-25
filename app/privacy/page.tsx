import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, FileText, Database, UserCheck } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 px-6 py-6 bg-[#030305]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <span className="font-serif text-lg tracking-tight">AARA Privacy</span>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <article className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-6 text-[10px] font-bold uppercase tracking-widest">
              <Shield size={12} />
              <span>Official Policy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">
              Your Privacy is Our <br />
              <span className="text-white/40">Core Architecture.</span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed max-w-xl mx-auto">
              AARA is built on a "Privacy-First" principle. We don't just promise privacy; we engineer it into every interaction.
            </p>
          </div>

          {/* Last Updated */}
          <div className="text-center text-xs text-white/30 mb-16 uppercase tracking-widest">
            Last Updated: January 25, 2026
          </div>

          {/* Content Blocks */}
          <div className="space-y-12">

            {/* 1. Philosophy */}
            <section className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <h2 className="text-2xl font-serif mb-4 flex items-center gap-3">
                <Lock className="text-indigo-400" size={24} />
                1. Our Philosophy
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                You are not the product. Your mental health data is sacred. We believe that for therapy to work, honesty is required, and for honesty to exist, absolute privacy is non-negotiable.
              </p>
              <p className="text-white/60 leading-relaxed">
                AARA operates as a <strong>Zero-Surprise</strong> platform. No data is shared, processed, or analyzed without your explicit action or consent.
              </p>
            </section>

            {/* 2. Data Collection */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white/90">2. Data We Collect & Why</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/5">
                  <div className="flex items-center gap-3 mb-3 text-emerald-400">
                    <Database size={18} />
                    <h3 className="font-bold text-sm">Daily Check-ins</h3>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Mood scores, emotions, and context tags.
                    <br /><strong>Purpose:</strong> To track patterns over time.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[#0e0e12] border border-white/5">
                  <div className="flex items-center gap-3 mb-3 text-amber-400">
                    <FileText size={18} />
                    <h3 className="font-bold text-sm">Journal Entries</h3>
                  </div>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Free-text reflections you write.
                    <br /><strong>Purpose:</strong> Self-reflection. Only processed for insights if you toggle consent.
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Data Processing */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white/90">3. How We Process Insights</h2>
              <p className="text-white/60 leading-relaxed mb-4">
                AARA uses secure AI processing to turn raw text into clinical insights (e.g., "You tend to feel anxious on Sundays").
              </p>
              <ul className="list-disc list-inside space-y-2 text-white/60 ml-2">
                <li>Raw journals stay encrypted unless you explicitly select them for a report.</li>
                <li>We do not use your data to train public AI models.</li>
                <li>Processing happens in a secure, isolated environment.</li>
              </ul>
            </section>

            {/* 4. Sharing */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white/90">4. Sharing with Therapists</h2>
              <p className="text-white/60 leading-relaxed mb-4">
                AARA does not automatically share anything with your therapist. Sharing is a <strong>manual action</strong> you take.
              </p>
              <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex gap-4">
                <Eye className="text-indigo-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-indigo-300 text-sm mb-1">You are in control</h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    When you generate a report, you create a static "snapshot". You can share this via PDF or secure link. You can revoke secure links at any time.
                  </p>
                </div>
              </div>
            </section>

            {/* 5. Your Rights */}
            <section>
              <h2 className="text-xl font-bold mb-4 text-white/90">5. Your Rights</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <UserCheck className="text-white/40 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-white text-sm">Right to Delete</h4>
                    <p className="text-xs text-white/50">You can delete your account and all associated data permanently at any time.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Database className="text-white/40 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-white text-sm">Right to Export</h4>
                    <p className="text-xs text-white/50">You can download a copy of all your check-ins and journals.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="pt-8 border-t border-white/5 text-center">
              <p className="text-white/40 text-sm mb-2">Questions about privacy?</p>
              <a href="mailto:privacy@aara.app" className="text-white font-medium hover:underline">privacy@aara.app</a>
            </section>

          </div>
        </article>
      </main>

      <footer className="text-center py-8 border-t border-white/5 bg-[#030305]">
        <p className="text-white/20 text-xs">© 2026 AARA Wellness</p>
      </footer>
    </div>
  )
}
