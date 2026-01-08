'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ContactHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleScrollDown = () => {
    if (typeof window === 'undefined') return
    const contactGrid = document.getElementById('contact-grid')
    if (contactGrid) {
      contactGrid.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center text-center overflow-hidden py-20 lg:py-32">
      {/* Animated Background Orbs */}
      {mounted && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full mix-blend-screen filter blur-3xl opacity-70"
            animate={{
              scale: [1, 1.2, 1],
              x: ['-10%', '10%', '-10%'],
              y: ['-10%', '10%', '-10%'],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-purple/20 rounded-full mix-blend-screen filter blur-3xl opacity-70"
            animate={{
              scale: [1, 1.1, 1],
              x: ['10%', '-10%', '10%'],
              y: ['10%', '-10%', '10%'],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-blue/10 rounded-full mix-blend-screen filter blur-3xl opacity-50"
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <motion.h1
          className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Let&apos;s Talk —
          <br />
          <span className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            We&apos;re Listening.
          </span>
        </motion.h1>
        <motion.p
          className="text-xl lg:text-2xl text-gray-300/90 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Whether you&apos;re a user, therapist, or partner — we&apos;re here to connect.
        </motion.p>

        {/* Scroll Down Indicator */}
        <div className="flex justify-center">
          <motion.button
            onClick={handleScrollDown}
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            aria-label="Scroll to contact options"
          >
            <span className="text-sm font-medium">Explore Options</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </section>
  )
}

