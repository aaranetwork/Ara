import HomeWrapper from '@/components/home/HomeWrapper'

export const metadata = {
  title: 'AARA - Mental Health Signal Processor',
  description: 'Structure your thoughts before therapy. Understand your inner world with high-fidelity AI clarity.',
}

// Improved Server Component
// The browser receives this HTML instantly.
// The interactive HomeWrapper (logic) hydrates afterward.
export default function Page() {
  return <HomeWrapper />
}
