'use client'

import React from 'react'

interface ModernInputProps {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    disabled?: boolean
    autoFocus?: boolean
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function ModernInput({
    value,
    onChange,
    placeholder = "Type here...",
    disabled,
    autoFocus,
    onKeyDown
}: ModernInputProps) {
    return (
        <div className="relative flex items-center justify-center w-full max-w-[500px] mx-auto group">
            <div className="relative w-full flex items-center gap-3">
                {/* Input Container - Fully Round */}
                <div className="relative flex-1 group/input">
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        disabled={disabled}
                        autoFocus={autoFocus}
                        className="relative w-full bg-[#0e0e12] border border-white/5 rounded-full px-8 py-5 text-lg text-white placeholder-white/20 focus:outline-none focus:bg-[#121216] focus:border-white/10 transition-all shadow-xl"
                        placeholder={placeholder}
                    />
                </div>
            </div>
        </div>
    )
}
