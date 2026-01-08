import HomeWrapper from '@/components/home/HomeWrapper'

// Improved Server Component
// The browser receives this HTML instantly.
// The interactive HomeWrapper (logic) hydrates afterward.
export default function Page() {
  return <HomeWrapper />
}
