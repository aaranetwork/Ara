'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useState, memo } from 'react'

interface PremiumSliderProps {
    value: number
    setValue: (v: number) => void
    minLabel: string
    maxLabel: string
}

// Memoized Tick component to prevent re-renders
const Tick = memo(function Tick({ num, mv, onClick }: { num: number, mv: any, onClick: () => void }) {
    // Transform distance to visual properties
    const distance = useTransform(mv, (v: number) => Math.abs(v - num))

    const height = useTransform(distance, (d) => {
        // Smooth interpolation for height
        // Active (0 distance) = 32
        // Falloff = 24 - (d * 4)
        // Min = 8
        if (d < 0.1) return 32
        return Math.max(8, 24 - (d * 4))
    })

    const opacity = useTransform(distance, (d) => {
        if (d < 0.1) return 1
        return Math.max(0.2, 0.6 - (d * 0.15))
    })

    const color = useTransform(distance, (d) => {
        return d < 0.5 ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.2)'
    })

    return (
        <div
            className="flex flex-col items-center gap-4 w-8 cursor-pointer"
            onClick={onClick}
        >
            <motion.div
                className="w-px bg-white rounded-full"
                style={{ height, opacity }}
            />
            <motion.span
                className="text-[10px] md:text-xs font-medium tabular-nums"
                style={{ color }}
            >
                {num}
            </motion.span>
        </div>
    )
})

export function PremiumSlider({ value, setValue, minLabel, maxLabel }: PremiumSliderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const mv = useMotionValue(value)

    // Sync motion value with prop value
    useEffect(() => {
        if (!isDragging) {
            mv.set(value)
        }
    }, [value, mv, isDragging])

    // Percentage for the track fill
    const percent = useTransform(mv, v => ((v - 1) / 9) * 100)
    const fillWidth = useTransform(percent, p => `${p}%`)
    const thumbLeft = useTransform(percent, p => `calc(${p}% - 12px)`)

    return (
        <div className="w-full">
            {/* Visual Scale / Ruler */}
            <div className="relative h-24 w-full flex items-end justify-center overflow-hidden mask-fade-sides select-none">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="w-full flex justify-between items-end pb-0 px-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <Tick
                            key={num}
                            num={num}
                            mv={mv}
                            onClick={() => {
                                setValue(num)
                                mv.set(num)
                            }}
                        />
                    ))}
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
                    onChange={(e) => {
                        const numericValue = parseInt(e.target.value)
                        mv.set(numericValue)
                        setValue(numericValue)
                    }}
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
                        style={{ width: fillWidth }}
                    // animate={{ width: `${percent}%` }}
                    // transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 30 }}
                    />
                </div>

                {/* Thumb */}
                <motion.div
                    className="absolute w-6 h-6 md:w-6 md:h-6 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] pointer-events-none z-10 flex items-center justify-center border border-white/10"
                    style={{ left: thumbLeft }}
                // animate={{ left: `calc(${percent}% - 12px)` }}
                // transition={isDragging ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 28 }}
                >
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </motion.div>
            </div>
        </div>
    )
}

