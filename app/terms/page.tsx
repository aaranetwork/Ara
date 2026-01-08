import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import GlassCard from '@/components/ui/GlassCard'

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>

        <GlassCard className="p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Service Description</h2>
            <p className="text-white/80 leading-relaxed">
              AARA provides AI-powered therapy support and mental wellness tools. Our services include
              AI chat therapy, mental wellness games, and therapist booking.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Not Medical Advice</h2>
            <p className="text-white/80 leading-relaxed">
              AARA is not a substitute for professional medical or mental health treatment.
              If you are experiencing a mental health emergency, please contact local emergency services
              or a mental health professional immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">User Responsibilities</h2>
            <p className="text-white/80 leading-relaxed">
              Users are responsible for maintaining the confidentiality of their account.
              Users agree to use the service in a lawful manner and not to share inappropriate content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p className="text-white/80 leading-relaxed">
              AARA is provided &quot;as is&quot; without warranties. We are not liable for any
              damages arising from the use or inability to use our services.
            </p>
          </section>

          <p className="text-white/60 text-sm mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </GlassCard>
      </div>
      <Footer />
    </div>
  )
}





