'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Brain } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'

const stats = [
  { icon: Brain, label: 'Conversations processed', value: '5M+', color: 'text-neon-blue' },
  { icon: Shield, label: 'Data shared with third-parties', value: '0', color: 'text-green-400' },
  { icon: Lock, label: 'Encrypted locally', value: '100%', color: 'text-neon-purple' },
]

export default function AboutTech() {
  return (
    <div className="py-20 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            How Aara Works
          </h2>
          <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            <p>
              <strong className="text-white">Hybrid AI Architecture</strong> — GPT + Local Models + Privacy-first Design.
            </p>
            <p>
              We use secure local data storage for your thoughts. Your emotions stay yours.
            </p>
          </div>
        </motion.div>

        {/* Right Side - Network Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center h-[300px]"
        >
          <svg className="w-full h-full" viewBox="0 0 300 300">
            {/* Animated connected dots */}
            {[
              { x: 150, y: 50 },
              { x: 100, y: 120 },
              { x: 200, y: 120 },
              { x: 80, y: 200 },
              { x: 150, y: 250 },
              { x: 220, y: 200 },
            ].map((point, index) => (
              <motion.circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="8"
                fill="url(#gradient)"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            ))}
            {/* Connections */}
            <motion.line
              x1="150"
              y1="50"
              x2="100"
              y2="120"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            <motion.line
              x1="150"
              y1="50"
              x2="200"
              y2="120"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
            />
            <motion.line
              x1="100"
              y1="120"
              x2="80"
              y2="200"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.7 }}
            />
            <motion.line
              x1="200"
              y1="120"
              x2="220"
              y2="200"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
            />
            <motion.line
              x1="80"
              y1="200"
              x2="150"
              y2="250"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.9 }}
            />
            <motion.line
              x1="220"
              y1="200"
              x2="150"
              y2="250"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1 }}
            />
            {/* SVG Gradients */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00AEEF" />
                <stop offset="100%" stopColor="#7A5FFF" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00AEEF" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7A5FFF" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <GlassCard className="p-6 text-center">
                <Icon className={`w-10 h-10 mx-auto mb-4 ${stat.color}`} />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}


