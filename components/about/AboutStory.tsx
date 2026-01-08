'use client'

import { motion } from 'framer-motion'

export default function AboutStory() {
  return (
    <div id="story" className="py-20 lg:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Because everyone deserves to feel heard.
          </h2>
          <div className="space-y-4 text-lg text-gray-300 leading-relaxed">
            <p>
              In a world that moves too fast, mental health often gets left behind.
            </p>
            <p>
              Aara was created to bring accessible emotional support to everyone — combining psychology, AI, and empathy.
            </p>
            <p>
              Whether you&apos;re journaling your thoughts, playing focus games, or talking to Aara, you&apos;re healing — one mindful step at a time.
            </p>
          </div>
        </motion.div>

        {/* Right Side - 3D Floating Orb */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center h-[400px] lg:h-[500px]"
        >
          <motion.div
            className="absolute w-full max-w-md aspect-square"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-neon-purple via-neon-blue to-neon-purple opacity-30 blur-3xl" />
            
            {/* Center orb */}
            <div className="relative w-full h-full">
              <div className="absolute inset-[10%] rounded-full bg-gradient-to-br from-neon-blue via-neon-purple to-neon-blue" />
              <div className="absolute inset-[20%] rounded-full bg-gradient-to-br from-neon-purple/50 via-transparent to-neon-blue/50 backdrop-blur-md" />
              <div className="absolute inset-[35%] rounded-full bg-white/20 backdrop-blur-lg" />
              
              {/* Inner core pulse */}
              <motion.div
                className="absolute inset-[42%] rounded-full bg-white/30 backdrop-blur-md"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}


