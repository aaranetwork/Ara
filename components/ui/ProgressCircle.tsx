'use client'

import { motion } from 'framer-motion'

interface ProgressCircleProps {
  percentage?: number
  progress?: number
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
  glow?: boolean
}

export default function ProgressCircle({ 
  percentage,
  progress,
  size = 120, 
  strokeWidth = 8,
  color = '#00AEEF',
  className = '',
  glow = false
}: ProgressCircleProps) {
  const actualPercentage = percentage !== undefined ? percentage : (progress !== undefined ? progress : 0)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (actualPercentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`${glow ? 'drop-shadow-[0_0_15px_rgba(0,174,239,0.6)]' : ''} ${className}`}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-2xl font-bold">{Math.round(actualPercentage)}%</span>
      </div>
    </div>
  )
}


