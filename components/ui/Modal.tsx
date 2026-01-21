'use client'

import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  showCloseButton?: boolean
}

export default function Modal({ isOpen, onClose, children, title, showCloseButton = true }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#0a0a0f]/95 backdrop-blur-2xl border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {title && (
                <div className="flex items-center justify-between p-6 sm:p-8 border-b border-white/5">
                  <h2 className="text-2xl sm:text-3xl font-serif font-light text-white">{title}</h2>
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95 text-white/60 hover:text-white"
                      aria-label="Close modal"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
              {!title && showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-95 z-10 text-white/60 hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <div className={title ? 'p-6 sm:p-8' : (showCloseButton ? 'p-6 sm:p-8 pt-16' : 'p-6 sm:p-8')}>{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

