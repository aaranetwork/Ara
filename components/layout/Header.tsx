'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AaraLogo from '@/components/ui/AaraLogo'

// Only show header on marketing/home page, not on authenticated pages
const showHeaderOnPaths = ['/']

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const shouldShowHeader = showHeaderOnPaths.includes(pathname)

  useEffect(() => {
    if (!shouldShowHeader) return
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [shouldShowHeader])

  if (!shouldShowHeader) return null

  return (
    <header 
      className={`sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 ${
        isScrolled 
          ? 'glass-card border-b border-white/20 shadow-glass' 
          : 'bg-dark-bg/80 border-b border-white/10'
      }`}
    >
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3"
            aria-label="AARA Home"
          >
            <AaraLogo size="md" showText />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            <Link
              href="/auth/login"
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
            >
              Login
            </Link>
            <Link href="/auth/signup" prefetch>
              <button className="px-6 py-2 rounded-lg bg-gradient-button text-white font-semibold hover:scale-105 transition-transform">
                Get Started
              </button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:border-neon-blue/50 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 space-y-2 overflow-hidden"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <Link
                href="/auth/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg bg-gradient-button text-white font-semibold text-center"
              >
                Get Started
              </Link>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
