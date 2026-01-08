'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Trash2, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'

export default function ActionBar() {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleScroll = () => {
      const heroHeight = 300 // Approximate hero height
      setIsVisible(window.scrollY > heroHeight)
    }

    // Initial check
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/export-data')
      const data = await response.json()
      
      if (response.status === 501) {
        alert(data.message || 'Data export is not yet implemented. Please contact privacy@aara.ai for assistance.')
      } else {
        // Future: handle actual export
        console.log(data)
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export data. Please contact privacy@aara.ai')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteData = async () => {
    if (!confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/user/delete-data')
      const data = await response.json()
      
      if (response.status === 501) {
        alert(data.message || 'Data deletion is not yet implemented. Please contact privacy@aara.ai for assistance.')
      } else {
        // Future: handle actual deletion
        console.log(data)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete data. Please contact privacy@aara.ai')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Desktop Action Buttons (inline) */}
      <div className="hidden lg:flex gap-4 mb-8 flex-wrap">
        {user && (
          <>
            <Button
              variant="outline"
              onClick={handleExportData}
              disabled={isLoading}
              className="flex items-center gap-2"
              aria-label="Export my data"
            >
              <Download className="w-4 h-4" />
              Export My Data
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteData}
              disabled={isLoading}
              className="flex items-center gap-2"
              aria-label="Delete my data"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Data
            </Button>
          </>
        )}
        <a 
          href="mailto:privacy@aara.ai" 
          aria-label="Contact privacy team"
          className="flex items-center gap-2 px-6 py-3 rounded-xl backdrop-blur-lg bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
        >
          <Mail className="w-4 h-4" />
          Contact Privacy
        </a>
      </div>

      {/* Mobile Sticky Action Bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-dark-bg/95 border-t border-white/10 p-4"
          >
            <div className="flex gap-2 max-w-5xl mx-auto">
              {user && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportData}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 text-xs"
                    aria-label="Export my data"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteData}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center gap-2 text-xs"
                    aria-label="Delete my data"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </>
              )}
              <a
                href="mailto:privacy@aara.ai"
                aria-label="Contact privacy team"
                className="flex-1 flex items-center justify-center gap-2 text-xs px-4 py-2 rounded-xl backdrop-blur-lg bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
              >
                <Mail className="w-4 h-4" />
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

