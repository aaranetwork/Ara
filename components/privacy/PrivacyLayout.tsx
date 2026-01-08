'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import PrivacyTOC from './PrivacyTOC'
import PrivacySearch from './PrivacySearch'
import PrivacySection from './PrivacySection'
import VersionBadge from './VersionBadge'
import ActionBar from './ActionBar'
import ScrollProgress from './ScrollProgress'
import ReadingTime from './ReadingTime'
import { policy } from '@/lib/privacy/policy'
import type { PolicySection } from '@/lib/privacy/policy'

export default function PrivacyLayout() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  // Keyboard shortcuts
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if ((e.target as HTMLElement)?.tagName === 'INPUT' || (e.target as HTMLElement)?.tagName === 'TEXTAREA') {
        return
      }
      
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector<HTMLInputElement>('input[aria-label="Search privacy policy"]')
        searchInput?.focus()
      }
      
      // Escape to clear search
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [searchQuery])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
    
    // Auto-expand sections that match search
    if (query.trim()) {
      const matchingSections = policy.sections.filter(s =>
        s.title.toLowerCase().includes(query.toLowerCase()) ||
        s.body.toLowerCase().includes(query.toLowerCase()) ||
        s.points?.some(p => p.toLowerCase().includes(query.toLowerCase()))
      )
      setExpandedSections(new Set(matchingSections.map(s => s.id)))
    }
  }, [])

  const handleSectionClick = useCallback((sectionId: string) => {
    setActiveSectionId(sectionId)
  }, [])

  const handleSectionExpand = useCallback((sectionId: string) => {
    setExpandedSections(prev => new Set([...prev, sectionId]))
  }, [])

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return policy.sections
    
    const queryLower = searchQuery.toLowerCase()
    return policy.sections.filter(section =>
      section.title.toLowerCase().includes(queryLower) ||
      section.body.toLowerCase().includes(queryLower) ||
      section.points?.some(p => p.toLowerCase().includes(queryLower))
    )
  }, [searchQuery])

  return (
    <div className="w-full relative">
      <ScrollProgress className="no-print" />
      
      {/* Hero Section */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex-1">
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold text-white mb-3 bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Privacy & Data Protection
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300/90 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your emotions. Your data. Your control.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ReadingTime />
            </motion.div>
          </div>
          <motion.div 
            className="flex items-center gap-4 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <VersionBadge />
          </motion.div>
        </div>
        
        <div className="no-print">
          <ActionBar />
        </div>
      </motion.div>

      {/* Search */}
      <div className="no-print">
        <PrivacySearch 
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
        />
      </div>

      {/* Desktop: 2-column layout, Mobile: Stack */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Table of Contents */}
        <div className="lg:w-80 flex-shrink-0 no-print">
          <PrivacyTOC
            sections={policy.sections}
            activeSectionId={activeSectionId}
            onSectionClick={handleSectionClick}
            searchQuery={searchQuery}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl">
          {filteredSections.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400 text-lg mb-2">No sections found matching your search.</p>
              <p className="text-gray-500 text-sm">Try different keywords or clear your search.</p>
            </motion.div>
          ) : (
            <div>
              {filteredSections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <PrivacySection
                    section={section}
                    searchQuery={searchQuery}
                    defaultExpanded={expandedSections.has(section.id)}
                    onExpand={() => handleSectionExpand(section.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

