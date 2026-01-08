'use client'

import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  glow = false,
  ...props 
}, ref) => {
  const baseStyles = 'rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden'
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }
  
  const variants = {
    primary: `bg-gradient-button text-white hover:opacity-90 focus:ring-neon-blue/50 transition-opacity`,
    secondary: 'backdrop-blur-lg bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-white/30 focus:ring-neon-blue/50',
    outline: 'bg-transparent text-white border-2 border-neon-blue hover:bg-neon-blue/10 hover:border-neon-blue/60 focus:ring-neon-blue/50',
  }
  
  return (
    <motion.button
      ref={ref}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${glow ? 'glow shadow-glow-button' : ''} ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...(props as any)}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
})

Button.displayName = 'Button'

export default Button
