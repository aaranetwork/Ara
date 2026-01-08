import Link from 'next/link'
import AaraLogo from '@/components/ui/AaraLogo'

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
  { href: '/therapist-login', label: 'Therapist Login' },
]

export default function Footer() {
  return (
    <footer className="mt-20 py-8 border-t border-white/10" role="contentinfo">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group" aria-label="AARA Home">
            <AaraLogo size="md" showText />
          </Link>
          <nav className="flex items-center gap-6 flex-wrap justify-center" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} AARA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
