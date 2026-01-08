'use client'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

export default function Skeleton({ 
  className = '', 
  width = '100%', 
  height = '1rem',
  rounded = 'md'
}: SkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }

  return (
    <div
      className={`skeleton ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
      aria-label="Loading..."
      role="status"
    />
  )
}
