'use client'

import { useMemo } from 'react'
import { Clock } from 'lucide-react'
import { policy } from '@/lib/privacy/policy'

export default function ReadingTime() {
  const readingTime = useMemo(() => {
    // Average reading speed: 200-250 words per minute, use 225
    const wordsPerMinute = 225
    
    const totalWords = policy.sections.reduce((count, section) => {
      const bodyWords = section.body.split(/\s+/).length
      const pointsWords = section.points?.reduce((pCount, point) => 
        pCount + point.split(/\s+/).length, 0) || 0
      return count + bodyWords + pointsWords
    }, 0)
    
    const minutes = Math.ceil(totalWords / wordsPerMinute)
    return minutes
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm text-gray-400">
      <Clock className="w-4 h-4" aria-hidden="true" />
      <span>{readingTime} min read</span>
    </div>
  )
}


