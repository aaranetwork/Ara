'use client'

import { motion } from 'framer-motion'

export default function AboutQuote() {
  return (
    <div className="py-20 lg:py-32 relative overflow-hidden">
      {/* Animated soft wave background */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 50%, #00AEEF 0%, transparent 50%)',
          }}
          animate={{
            x: ['0%', '100%', '0%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 70% 50%, #7A5FFF 0%, transparent 50%)',
          }}
          animate={{
            x: ['100%', '0%', '100%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto text-center px-4"
      >
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-relaxed tracking-wide">
          &ldquo;Our mission is simple — to make emotional well-being accessible, intelligent, and personal.&rdquo;
        </h2>
        <p className="text-2xl text-gray-400 italic">— Team Aara</p>
      </motion.div>
    </div>
  )
}


