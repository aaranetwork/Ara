import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Aara — Get in Touch',
  description: 'Reach the Aara AI team for support, partnerships, or media inquiries. We reply within 24 hours.',
  openGraph: {
    title: 'Contact Aara — Get in Touch',
    description: 'Reach the Aara AI team for support, partnerships, or media inquiries. We reply within 24 hours.',
    type: 'website',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}


