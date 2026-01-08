'use client'

import { motion } from 'framer-motion'
import { policy } from '@/lib/privacy/policy'

export default function VersionBadge() {
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <motion.div 
      className="flex items-center gap-3 flex-wrap"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.span 
        className="px-3 py-1.5 rounded-lg backdrop-blur-lg bg-white/5 border border-white/10 text-sm text-gray-300"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {policy.version}
      </motion.span>
      <span className="text-sm text-gray-400">
        Last updated: {formatDate(policy.lastUpdated)}
      </span>
    </motion.div>
  )
}

