import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Poppins, Inter } from 'next/font/google'
import './globals.css'
import { FeatureAccessProvider } from '@/components/providers/FeatureAccessProvider'
import { AuthProvider } from '@/context/AuthContext'
import RoutePrefetcher from '@/components/RoutePrefetcher'
import NextTopLoader from 'nextjs-toploader'
import { SpeedInsights } from "@vercel/speed-insights/next"

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'AARA — Your Pre-Therapy Insight',
    template: '%s | AARA',
  },
  description: 'Talk, play, and grow your mind with Aara. Your AI Therapist — calm, caring, always here.',
  keywords: ['AI therapy', 'mental health', 'therapy', 'wellness', 'mental wellbeing', 'anxiety', 'stress', 'depression'],
  authors: [{ name: 'AARA' }],
  creator: 'AARA',
  publisher: 'AARA',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://aara.site'),
  openGraph: {
    title: 'AARA — Your Pre-Therapy Insight',
    description: 'AARA helps you understand your emotions before therapy. Track moods, journal your thoughts, and get AI-powered mental health insights.',
    type: 'website',
    locale: 'en_US',
    siteName: 'AARA',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AARA - AI Therapist Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AARA - Your AI Therapist',
    description: 'Talk, play, and grow your mind with Aara.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/aara-logo.png',
    apple: '/icon-192.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B0C10',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Google tag (GA4) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-[#0B0C10] to-[#1C1E24] min-h-screen text-white">
        <NextTopLoader
          color="#00AEEF"
          initialPosition={0.3}
          crawlSpeed={100}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={100}
          shadow="0 0 10px #00AEEF,0 0 5px #00AEEF"
        />
        <FeatureAccessProvider>
          <AuthProvider>
            <RoutePrefetcher />
            {children}
            <SpeedInsights />
          </AuthProvider>
        </FeatureAccessProvider>
      </body>
    </html>
  )
}
