'use client'

import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"

interface MoodSliderProps {
    value: number
    onChange: (value: number) => void
    prompt: string
}

export function MoodSlider({ value, onChange, prompt }: MoodSliderProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mb-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-sm">
                    <span className="text-2xl">🌸</span>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Daily Check-In</span>
                </div>
            </motion.div>

            {/* Question */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-4xl font-serif text-center font-medium leading-tight text-white/90 mb-16 px-4"
            >
                {prompt}
            </motion.h1>

            {/* Slider */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                {/* Number display */}
                <div className="flex items-center justify-center gap-4">
                    <span className="text-6xl md:text-7xl font-serif text-white/90 tabular-nums">
                        {value}
                    </span>
                    <span className="text-2xl text-white/30 font-light">/10</span>
                </div>

                {/* Slider container */}
                <div className="relative mt-8 group h-14 md:h-12 flex items-center justify-center px-4">
                    {/* Left label */}
                    <div className="absolute left-4 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/30 transition-colors group-hover:text-white/50 pointer-events-none z-10">
                        Heavy
                    </div>

                    {/* Right label */}
                    <div className="absolute right-4 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/30 transition-colors group-hover:text-white/50 pointer-events-none z-10">
                        Light
                    </div>

                    {/* Slider */}
                    <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[value]}
                        onValueChange={(values) => onChange(values[0])}
                        className={cn("w-full mx-16")}
                    />
                </div>
            </motion.div>
        </div>
    )
}
