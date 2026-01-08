import { Metadata } from 'next'
import { policy } from '@/lib/privacy/policy'

export const metadata: Metadata = {
  title: 'Aara Privacy Policy — Your data, your control',
  description: 'Aara is built privacy-first. Learn how we protect your data and your choices.',
  openGraph: {
    title: 'Aara Privacy Policy — Your data, your control',
    description: 'Aara is built privacy-first. Learn how we protect your data and your choices.',
    type: 'website',
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


