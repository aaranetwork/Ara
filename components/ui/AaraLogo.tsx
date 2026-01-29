'use client'

import Image from 'next/image'

interface AaraLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export default function AaraLogo({ className = '', size = 'md', showText = false }: AaraLogoProps) {
  const sizeClasses = {
    sm: 'w-6 md:w-8',
    md: 'w-8 md:w-10',
    lg: 'w-12 md:w-14',
  }

  const imageSizes = {
    sm: 32,
    md: 40,
    lg: 56,
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      {/* AARA Logo Image */}
      <div className={`h-auto ${sizeClasses[size]} transition-all duration-300 ease-in-out hover:scale-105`}>
        <div className="relative w-full h-full">
          <Image
            src="/aara-logo.png"
            alt="AARA Prep Logo"
            width={imageSizes[size]}
            height={imageSizes[size]}
            className="w-full h-full object-contain select-none"
            priority
            quality={100}
            unoptimized={true}
          />
        </div>
      </div>

      {/* AARA Text (optional) */}
      {showText && (
        <span className={`font-bold text-white ${textSizeClasses[size]} transition-colors duration-300`}>
          AARA
        </span>
      )}
    </div>
  )
}


