'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface ScrollProgressProps {
  className?: string
}

export default function ScrollProgress({ className = '' }: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      if (typeof window === 'undefined') return
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0
      setScrollProgress(Math.min(progress, 100))
    }

    // Initial calculation
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) {
    return (
      <div className={`fixed top-0 left-0 right-0 h-1 bg-dark-bg/50 z-50 ${className}`}>
        <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-lg" style={{ width: 0 }} />
      </div>
    )
  }

  return (
    <div className={`fixed top-0 left-0 right-0 h-1 bg-dark-bg/50 z-50 ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-lg"
        style={{ width: `${scrollProgress}%` }}
        initial={false}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1, ease: 'linear' }}
      />
    </div>
  )
}

