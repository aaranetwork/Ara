import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Poppins } from 'next/font/google'
import './globals.css'
import { FeatureAccessProvider } from '@/components/providers/FeatureAccessProvider'
import { AuthProvider } from '@/context/AuthContext'
import RoutePrefetcher from '@/components/RoutePrefetcher'
import { ReadHistoryProvider } from '@/contexts/ReadHistoryContext'
import { SavedItemsProvider } from '@/contexts/SavedItemsContext'
import { DiscussionProvider } from '@/contexts/DiscussionContext'
import NextTopLoader from 'nextjs-toploader'
import { SpeedInsights } from "@vercel/speed-insights/next"
import ScrollToTop from '@/components/ScrollToTop'

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'AARA Prep — Pre-Therapy Companion',
    template: '%s | AARA Prep',
  },
  description: 'AARA Prep is a pre-therapy companion that turns daily experiences into clear, shareable insights — so therapists understand users faster, and users feel understood.',
  keywords: ['AI therapy', 'mental health', 'pre-therapy', 'therapy preparation', 'AARA Prep', 'emotional intelligence'],
  authors: [{ name: 'AARA One' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aara.site'),
  openGraph: {
    title: 'AARA Prep — Pre-Therapy Companion',
    description: 'AARA Prep is a pre-therapy companion that turns daily experiences into clear, shareable insights — so therapists understand users faster, and users feel understood.',
    type: 'website',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/aara-logo.png',
    shortcut: '/aara-logo.png',
    apple: '/aara-logo.png',
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#121212',
  width: 'device-width',
  initialScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AARA Prep",
  "operatingSystem": "Web",
  "applicationCategory": "HealthApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "Pre-therapy companion for structured insights.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "10000"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#030305] text-[#F3F4F6] selection:bg-white/20 font-sans overflow-x-hidden">
        {/* Global Grain Texture - Reduced opacity on mobile for performance */}
        <div className="fixed inset-0 opacity-[0.015] md:opacity-[0.03] bg-[url('/noise.svg')] pointer-events-none mix-blend-overlay z-[9999]"></div>

        <ScrollToTop />
        <NextTopLoader color="#FFFFFF" showSpinner={false} />
        <FeatureAccessProvider>
          <AuthProvider>
            <ReadHistoryProvider>
              <SavedItemsProvider>
                <DiscussionProvider>
                  <RoutePrefetcher />
                  <div className="relative min-h-screen">
                    {children}
                  </div>
                  <SpeedInsights />
                </DiscussionProvider>
              </SavedItemsProvider>
            </ReadHistoryProvider>
          </AuthProvider>
        </FeatureAccessProvider>
      </body>
    </html>
  )
}
