'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const teamMembers = [
  {
    name: 'Umar',
    role: 'Founder & Lead',
    motto: 'AI should heal, not just answer.',
    gradient: 'from-neon-blue to-neon-purple',
  },
  {
    name: 'Aara Core Team',
    role: 'Design + ML',
    motto: 'We teach empathy to algorithms.',
    gradient: 'from-neon-purple to-pink-500',
  },
  {
    name: 'Contributors',
    role: 'Global',
    motto: 'Mental wellness is a human right.',
    gradient: 'from-cyan-500 to-neon-blue',
  },
]

export default function AboutTeam() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="py-20 lg:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl lg:text-5xl font-bold text-white text-center mb-16"
      >
        The People Behind Aara
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className="relative"
          >
            <div className="glass-card p-8 text-center h-full relative overflow-hidden">
              {/* Avatar placeholder */}
              <motion.div
                className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-3xl font-bold`}
                whileHover={{
                  scale: 1.1,
                  transition: { type: 'spring', stiffness: 300 },
                }}
              >
                {member.name[0]}
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
              <p className="text-gray-400 mb-4">{member.role}</p>

              {/* Hover reveal quote */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg text-gray-300 italic leading-relaxed"
                  >
                    &ldquo;{member.motto}&rdquo;
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}


