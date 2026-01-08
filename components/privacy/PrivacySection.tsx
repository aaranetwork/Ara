'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { ChevronDown, ChevronUp, Link as LinkIcon, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import type { PolicySection } from '@/lib/privacy/policy'

interface PrivacySectionProps {
  section: PolicySection
  searchQuery: string
  defaultExpanded?: boolean
  onExpand?: () => void
}

function highlightText(text: string, query: string): string {
  if (!query.trim()) return text
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

export default function PrivacySection({ 
  section, 
  searchQuery, 
  defaultExpanded = false,
  onExpand 
}: PrivacySectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [copied, setCopied] = useState(false)

  const copySectionLink = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (typeof window === 'undefined') return
    
    const url = `${window.location.origin}${window.location.pathname}#${section.id}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }).catch(() => {
        // Fallback if clipboard API fails
        console.error('Failed to copy link')
      })
    }
  }, [section.id])

  // Auto-expand if hash matches or search query matches
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1)
      if (hash === section.id) {
        setIsExpanded(true)
        setTimeout(() => {
          document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [section.id])

  // Auto-expand if search query matches
  useEffect(() => {
    if (searchQuery.trim()) {
      const queryLower = searchQuery.toLowerCase()
      const matches = 
        section.title.toLowerCase().includes(queryLower) ||
        section.body.toLowerCase().includes(queryLower) ||
        section.points?.some(p => p.toLowerCase().includes(queryLower))
      
      if (matches) {
        setIsExpanded(true)
        onExpand?.()
      }
    }
  }, [searchQuery, section, onExpand])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (!isExpanded) {
      onExpand?.()
    }
  }

  const highlightedTitle = useMemo(() => 
    highlightText(section.title, searchQuery), 
    [section.title, searchQuery]
  )

  const highlightedBody = useMemo(() => 
    highlightText(section.body, searchQuery), 
    [section.body, searchQuery]
  )

  const highlightedPoints = useMemo(() => 
    section.points?.map(p => highlightText(p, searchQuery)),
    [section.points, searchQuery]
  )

  return (
    <GlassCard className="mb-6 group" hover={false}>
      <div className="relative">
        <button
          onClick={toggleExpanded}
          className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-neon-purple/50 focus:rounded-xl transition-all"
          aria-expanded={isExpanded}
          aria-controls={`section-${section.id}`}
        >
          <div className="flex items-center justify-between gap-4">
            <h2 
              id={section.id}
              className="text-2xl font-semibold text-white flex-1 group-hover:text-neon-blue/90 transition-colors"
              dangerouslySetInnerHTML={{ __html: highlightedTitle }}
            />
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={copySectionLink}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-lg"
                aria-label={`Copy link to ${section.title}`}
                title="Copy section link"
              >
                {copied ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <LinkIcon className="w-5 h-5 text-gray-400 hover:text-white" />
                )}
              </button>
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-gray-400 transition-transform" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-400 transition-transform" aria-hidden="true" />
              )}
            </div>
          </div>
        </button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`section-${section.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <motion.div 
              className="px-6 pb-6 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p 
                className="text-gray-300/90 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: highlightedBody }}
              />
              
              {highlightedPoints && highlightedPoints.length > 0 && (
                <ul className="space-y-2 list-disc list-inside text-gray-300/90">
                  {highlightedPoints.map((point, index) => (
                    <li 
                      key={index}
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: point }}
                    />
                  ))}
                </ul>
              )}

              {/* Special callout for Local-Only Mode */}
              {section.id === 'storage-retention' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 p-4 rounded-xl backdrop-blur-lg bg-neon-blue/10 border border-neon-blue/30"
                >
                  <p className="text-white font-medium">
                    <strong>Local-Only Mode:</strong> Local-Only Mode keeps your chats, mood logs, and voice notes on your device. Nothing is uploaded unless you enable Cloud Sync.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

