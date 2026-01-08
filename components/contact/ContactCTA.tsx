'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import GlassCard from '@/components/ui/GlassCard'

export default function ContactCTA() {
  return (
    <motion.section
      className="py-16 lg:py-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      <GlassCard className="p-8 lg:p-12 text-center relative overflow-hidden">
        {/* Animated Halo Effect */}
        <motion.div
          className="absolute inset-[-20px] rounded-full bg-gradient-to-r from-neon-blue/30 to-neon-purple/30 filter blur-2xl opacity-0"
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <div className="relative z-10">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Ready to talk with Aara?
          </motion.h2>
          <motion.p
            className="text-gray-300/80 text-lg lg:text-xl mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Try our AI Therapist today, or connect with a human therapist.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/chat">
              <Button
                variant="primary"
                className="flex items-center gap-2 text-lg px-8 py-4"
                aria-label="Open chat with Aara"
              >
                <MessageSquare className="w-5 h-5" />
                Open Chat
              </Button>
            </Link>
            <Link href="/therapists">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-lg px-8 py-4"
                aria-label="Book a therapist session"
              >
                <Users className="w-5 h-5" />
                Book Therapist
              </Button>
            </Link>
          </motion.div>
        </div>
      </GlassCard>
    </motion.section>
  )
}


