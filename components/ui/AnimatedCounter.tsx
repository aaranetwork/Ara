'use client'

import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform, MotionValue } from 'framer-motion'

interface AnimatedCounterProps {
  value: number
  duration?: number
  decimals?: number
  suffix?: string
  className?: string
}

export default function AnimatedCounter({ 
  value, 
  duration = 1.5, 
  decimals = 0,
  suffix = '%',
  className = '' 
}: AnimatedCounterProps) {
  const spring = useSpring(0, { duration, bounce: 0 })
  const display = useTransform(spring, (current) =>
    Math.round(current * Math.pow(10, decimals)) / Math.pow(10, decimals)
  )

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  const [displayValue, setDisplayValue] = useState('0' + suffix)

  useEffect(() => {
    const unsubscribe = display.on('change', (latest: number) => {
      setDisplayValue(`${latest.toFixed(decimals)}${suffix}`)
    })
    return () => unsubscribe()
  }, [display, decimals, suffix])

  return <span className={className}>{displayValue}</span>
}

