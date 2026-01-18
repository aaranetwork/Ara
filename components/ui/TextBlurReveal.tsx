'use client'

import { motion } from 'framer-motion'

interface TextBlurRevealProps {
    text: string
    className?: string
    delay?: number
}

export function TextBlurReveal({ text, className = "", delay = 0 }: TextBlurRevealProps) {
    const words = text.split(" ")

    const container = {
        hidden: { opacity: 0 },
        visible: (i: number = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: delay * 0.1 }
        })
    }

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        },
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100
            }
        }
    }

    return (
        <motion.h1
            className={`flex flex-wrap justify-center gap-[0.25em] ${className}`}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {words.map((word, index) => (
                <motion.span key={index} variants={child} className="inline-block relative">
                    {word}
                </motion.span>
            ))}
        </motion.h1>
    )
}
