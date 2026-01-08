'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function AboutCTA() {
  return (
    <div className="py-20 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center px-4 relative"
      >
        {/* Animated halo behind buttons */}
        <motion.div
          className="absolute -inset-8 rounded-3xl bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-blue/20 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Start your journey with Aara today.
          </h2>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/chat">
              <Button variant="primary" className="text-lg px-8 py-4">
                Talk to Aara
              </Button>
            </Link>
            <Link href="/mode">
              <Button variant="outline" className="text-lg px-8 py-4">
                Explore Aara Mode
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


