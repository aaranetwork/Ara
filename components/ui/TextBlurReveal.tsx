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
            transition: { staggerChildren: 0.06, delayChildren: delay * 0.08 }
        })
    }

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                filter: { type: "tween", ease: [0.23, 1, 0.32, 1], duration: 0.6 },
                opacity: { duration: 0.4 },
                y: { type: "tween", ease: [0.23, 1, 0.32, 1], duration: 0.5 }
            }
        },
        hidden: {
            opacity: 0,
            y: 15,
            filter: "blur(8px)",
            transition: {
                filter: { duration: 0.3 },
                opacity: { duration: 0.3 },
                y: { type: "tween", ease: "easeIn", duration: 0.3 }
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
