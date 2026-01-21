'use client'

import { useState } from 'react'

interface MoodSliderFixedProps {
    value: number
    onChange: (value: number) => void
}

export function MoodSliderFixed({ value, onChange }: MoodSliderFixedProps) {
    const [isDragging, setIsDragging] = useState(false)

    // Calculate position percentage (0-100%)
    // For a 1-10 range: value 1 = 0%, value 10 = 100%
    const percentage = ((value - 1) / (10 - 1)) * 100

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(Number(e.target.value))
    }

    return (
        <div className="w-full max-w-md mx-auto px-4">
            {/* Number Display */}
            <div className="flex items-center justify-center gap-3 mb-12">
                <span className="text-7xl font-serif text-white tabular-nums">
                    {value}
                </span>
                <span className="text-3xl text-white/30 font-light">/10</span>
            </div>

            {/* Slider Container */}
            <div className="relative">
                {/* Labels */}
                <div className="flex justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">
                        Heavy
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-white/40">
                        Light
                    </span>
                </div>

                {/* Slider Track and Thumb */}
                <div className="relative h-12 flex items-center">
                    {/* Track */}
                    <div className="relative w-full h-2 bg-white/5 rounded-full">
                        {/* Progress Fill */}
                        <div
                            className="absolute inset-y-0 left-0 bg-white/20 rounded-full transition-all duration-150 ease-out origin-left"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {/* Thumb */}
                    <div
                        className={`absolute w-6 h-6 bg-white rounded-full flex items-center justify-center border border-white/10 pointer-events-none transition-all duration-150 ease-out ${isDragging ? 'shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-110' : 'shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                            }`}
                        style={{
                            left: `${percentage}%`,
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                    >
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    </div>

                    {/* Input Range */}
                    <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={value}
                        onChange={handleChange}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onTouchStart={() => setIsDragging(true)}
                        onTouchEnd={() => setIsDragging(false)}
                        className="absolute w-full opacity-0 cursor-pointer"
                        style={{
                            top: '50%',
                            transform: 'translateY(-50%)',
                            height: '48px',
                            margin: 0,
                            padding: 0,
                            WebkitTapHighlightColor: 'transparent'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}
