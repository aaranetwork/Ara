'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Globe, Clock } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@aara.ai',
    href: 'mailto:contact@aara.ai',
  },
  {
    icon: MapPin,
    label: 'Headquarters',
    value: 'Delhi, India',
  },
  {
    icon: Globe,
    label: 'Website',
    value: 'aara.ai',
    href: 'https://aara.ai',
  },
  {
    icon: Clock,
    label: 'Response Time',
    value: 'We reply within 24 hours',
  },
]

export default function ContactInfoPanel() {
  return (
    <motion.section
      className="py-16 lg:py-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Reach Us Directly
          </h2>
          <p className="text-gray-300/80 text-lg mb-8">
            Prefer email? We&apos;re just a message away.
          </p>
          
          <div className="space-y-4">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              const Content = info.href ? (
                <a
                  href={info.href}
                  target={info.href.startsWith('http') ? '_blank' : undefined}
                  rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="hover:text-neon-blue transition-colors"
                >
                  {info.value}
                </a>
              ) : (
                <span>{info.value}</span>
              )

              return (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-neon-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{info.label}</p>
                    <p className="text-white font-medium">{Content}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Animated Map/Illustration */}
        <motion.div
          className="hidden lg:flex items-center justify-center h-64 lg:h-96 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <GlassCard className="w-full h-full flex items-center justify-center relative overflow-hidden">
            {/* Animated Globe/Map Visualization */}
            <svg
              className="w-full h-full"
              viewBox="0 0 200 200"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Grid Lines */}
              {[...Array(5)].map((_, i) => (
                <line
                  key={`v-${i}`}
                  x1={i * 50}
                  y1={0}
                  x2={i * 50}
                  y2={200}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                />
              ))}
              {[...Array(5)].map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1={0}
                  y1={i * 50}
                  x2={200}
                  y2={i * 50}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Animated Connection Nodes */}
              {[
                { x: 50, y: 80, delay: 0 },
                { x: 100, y: 120, delay: 0.3 },
                { x: 150, y: 80, delay: 0.6 },
              ].map((node, i) => (
                <motion.circle
                  key={`node-${i}`}
                  cx={node.x}
                  cy={node.y}
                  r="8"
                  fill="url(#gradient)"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: node.delay,
                    ease: 'easeInOut',
                  }}
                />
              ))}
              
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00AEEF" />
                  <stop offset="100%" stopColor="#7A5FFF" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400 text-sm font-medium">🌍 Global Reach</p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </motion.section>
  )
}


