'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import ContactForm from './ContactForm'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTopic?: string
}

export default function ContactModal({ isOpen, onClose, defaultTopic = 'general' }: ContactModalProps) {
  const handleSubmit = () => {
    // Close modal after successful submission (with a slight delay)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="pointer-events-auto w-full max-w-2xl"
            >
              <GlassCard className="p-6 lg:p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="pr-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
                  <p className="text-gray-300/80 mb-8">
                    Fill out the form below and we&apos;ll get back to you as soon as possible.
                  </p>
                  
                  <ContactForm defaultTopic={defaultTopic} onSubmit={handleSubmit} />
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}


