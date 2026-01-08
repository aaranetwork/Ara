'use client'

import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

interface MotionProps extends HTMLMotionProps<'div'> {
    children: ReactNode
    delay?: number
    duration?: number
    className?: string
}

export const FadeIn = ({ children, delay = 0, duration = 0.5, className, ...props }: MotionProps) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration, delay, ease: 'easeOut' }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
)

export const SlideUp = ({ children, delay = 0, duration = 0.5, className, ...props }: MotionProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration, delay, ease: 'easeOut' }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
)

export const ScaleIn = ({ children, delay = 0, duration = 0.5, className, ...props }: MotionProps) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration, delay, ease: 'easeOut' }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
)

export const StaggerContainer = ({ children, delay = 0, stagger = 0.1, className, ...props }: MotionProps & { stagger?: number }) => (
    <motion.div
        initial="hidden"
        animate="show"
        exit="hidden"
        variants={{
            hidden: { opacity: 0 },
            show: {
                opacity: 1,
                transition: {
                    staggerChildren: stagger,
                    delayChildren: delay,
                },
            },
        }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
)

export const StaggerItem = ({ children, delay = 0, className, ...props }: MotionProps) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0, transition: { delay } },
        }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
)
