'use client'

import { memo } from 'react'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  animation?: 'pulse' | 'none'
}

function SkeletonComponent({
  className = '',
  width = '100%',
  height = '1rem',
  rounded = 'md',
  animation = 'pulse'
}: SkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  const animationClass = animation === 'pulse' ? 'animate-pulse' : ''

  return (
    <div
      className={`bg-white/5 ${roundedClasses[rounded]} ${animationClass} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
      aria-label="Loading..."
      role="status"
    />
  )
}

// Memoized for performance
export const Skeleton = memo(SkeletonComponent)

// Pre-built skeleton patterns
export const SkeletonCard = memo(function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-4 rounded-2xl bg-white/[0.02] border border-white/5 ${className}`}>
      <Skeleton height={120} rounded="xl" className="mb-4" />
      <Skeleton height={20} width="70%" className="mb-2" />
      <Skeleton height={16} width="50%" />
    </div>
  )
})

export const SkeletonList = memo(function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton rounded="full" width={40} height={40} />
          <div className="flex-1">
            <Skeleton height={16} width="60%" className="mb-2" />
            <Skeleton height={12} width="40%" />
          </div>
        </div>
      ))}
    </div>
  )
})

export default Skeleton
