'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PrivacySearchProps {
  onSearchChange: (query: string) => void
  searchQuery: string
}

export default function PrivacySearch({ onSearchChange, searchQuery }: PrivacySearchProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const handleChange = useCallback((value: string) => {
    setLocalQuery(value)
    
    // Debounce search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      onSearchChange(value)
    }, 300)
  }, [onSearchChange])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleClear = useCallback(() => {
    setLocalQuery('')
    onSearchChange('')
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [onSearchChange])

  return (
    <motion.div 
      className="relative mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-neon-purple w-5 h-5 transition-colors" aria-hidden="true" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search privacy policy... (Ctrl+K or Cmd+K)"
          className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#10121A]/80 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] focus:shadow-md focus:shadow-[#00AEEF]/20 transition-all duration-200 hover:bg-[#10121A]/90"
          aria-label="Search privacy policy"
        />
        <AnimatePresence>
          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
        {localQuery && (
          <div className="absolute -bottom-6 left-0 text-xs text-gray-500 mt-1">
            {searchQuery.trim() && (
              <span>Press Esc to clear</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

