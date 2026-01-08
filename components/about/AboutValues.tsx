'use client'

import { motion } from 'framer-motion'
import { Feather, Brain, Sparkles } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'

const values = [
  {
    icon: Feather,
    title: 'Calm by Design',
    description: 'Every pixel is made to soothe your mind.',
    gradient: 'from-blue-500/20 to-purple-500/20',
  },
  {
    icon: Brain,
    title: 'Smart Empathy',
    description: 'Aara listens without bias — learns with care.',
    gradient: 'from-purple-500/20 to-pink-500/20',
  },
  {
    icon: Sparkles,
    title: 'Growth Together',
    description: 'Therapy, games, and insights that evolve with you.',
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },
]

export default function AboutValues() {
  return (
    <div className="py-20 lg:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl lg:text-5xl font-bold text-white text-center mb-16"
      >
        Our Philosophy
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((value, index) => {
          const Icon = value.icon
          return (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard className="p-8 text-center h-full hover:border-neon-blue/40 transition-all duration-300">
                <motion.div
                  className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${value.gradient} flex items-center justify-center`}
                  whileHover={{
                    scale: 1.1,
                    transition: { type: 'spring', stiffness: 300 },
                  }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{value.description}</p>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}


