'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PremiumSliderProps {
    value: number
    setValue: (v: number) => void
    minLabel: string
    maxLabel: string
}

export function PremiumSlider({ value, setValue, minLabel, maxLabel }: PremiumSliderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const percent = (value - 1) / 9 * 100

    return (
        <div className="w-full">
            {/* Visual Scale / Ruler */}
            <div className="relative h-24 w-full flex items-end justify-center overflow-hidden mask-fade-sides select-none">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="w-full flex justify-between items-end pb-0 px-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                        const active = num === value
                        const distance = Math.abs(num - value)
                        // Calculate visuals directly based on value interaction
                        const height = active ? 32 : Math.max(8, 24 - (distance * 4))
                        const opacity = active ? 1 : Math.max(0.2, 0.6 - (distance * 0.15))

                        return (
                            <div key={num} className="flex flex-col items-center gap-4 w-8">
                                {/* Removed transition-all duration-300 to fix lag */}
                                <div
                                    className="w-px bg-white rounded-full transition-all duration-75"
                                    style={{ height: `${height}px`, opacity }}
                                />
                                <span className={`text-[10px] md:text-xs font-medium tabular-nums transition-colors duration-200 ${active ? 'text-white' : 'text-white/20'}`}>
                                    {num}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Interaction Layer */}
            <div className="relative mt-8 group h-14 md:h-12 flex items-center justify-center touch-none">
                <div className="absolute left-0 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/30 transition-colors group-hover:text-white/50">{minLabel}</div>
                <div className="absolute right-0 text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-white/30 transition-colors group-hover:text-white/50">{maxLabel}</div>

                <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={value}
                    onChange={(e) => setValue(parseInt(e.target.value))}
                    onMouseDown={() => setIsDragging(true)}
                    onMouseUp={() => setIsDragging(false)}
                    onTouchStart={() => setIsDragging(true)}
                    onTouchEnd={() => setIsDragging(false)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 touch-none active:cursor-grabbing"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                />

                {/* Track */}
                <div className="relative w-full h-1.5 md:h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute top-0 bottom-0 left-0 bg-white/20"
                        animate={{ width: `${percent}%` }}
                        // Use a very snappy spring or no duration if dragging to keep up
                        transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>

                {/* Thumb */}
                <motion.div
                    className="absolute w-6 h-6 md:w-6 md:h-6 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] pointer-events-none z-10 flex items-center justify-center border border-white/10"
                    animate={{ left: `calc(${percent}% - 12px)` }}
                    // Instant update when dragging
                    transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 28 }}
                >
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </motion.div>
            </div>
        </div>
    )
}
