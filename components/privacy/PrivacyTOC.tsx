'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/ui/GlassCard'
import type { PolicySection } from '@/lib/privacy/policy'

interface PrivacyTOCProps {
  sections: PolicySection[]
  activeSectionId: string | null
  onSectionClick: (sectionId: string) => void
  searchQuery: string
}

export default function PrivacyTOC({ 
  sections, 
  activeSectionId, 
  onSectionClick,
  searchQuery 
}: PrivacyTOCProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    }

    const observers: IntersectionObserver[] = []

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id)
        if (!element) return

        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              onSectionClick(section.id)
            }
          })
        }, observerOptions)

        observer.observe(element)
        observers.push(observer)
      })
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      observers.forEach(obs => obs.disconnect())
    }
  }, [sections, onSectionClick])

  const filteredSections = searchQuery.trim()
    ? sections.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.points?.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : sections

  const handleClick = (sectionId: string) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    
    onSectionClick(sectionId)
    setIsMobileOpen(false)
    
    // Use setTimeout to ensure state update is processed
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        const offset = 100 // Account for sticky header
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        })
      }
    }, 0)
  }

  return (
    <>
      {/* Mobile Dropdown */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="w-full p-4 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10 text-white text-left flex items-center justify-between"
          aria-expanded={isMobileOpen}
          aria-label="Toggle table of contents"
        >
          <span>Table of Contents</span>
          {isMobileOpen ? (
            <span className="text-gray-400">−</span>
          ) : (
            <span className="text-gray-400">+</span>
          )}
        </button>
        
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10 p-4 space-y-2 max-h-96 overflow-y-auto"
          >
            {filteredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleClick(section.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSectionId === section.id
                    ? 'bg-neon-purple/20 text-white font-medium'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {section.title}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Desktop Sticky TOC */}
      <nav 
        className="hidden lg:block sticky top-4"
        aria-label="Table of contents"
      >
        <GlassCard className="p-6" hover={false}>
          <h3 className="text-lg font-semibold text-white mb-4">Contents</h3>
          <ul className="space-y-2">
            {filteredSections.map((section) => (
              <motion.li 
                key={section.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => handleClick(section.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all relative ${
                    activeSectionId === section.id
                      ? 'bg-neon-purple/20 text-white font-medium border-l-2 border-neon-purple'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  aria-current={activeSectionId === section.id ? 'page' : undefined}
                >
                  {section.title}
                  {activeSectionId === section.id && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1 bg-neon-purple rounded-r"
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </GlassCard>
      </nav>
    </>
  )
}

