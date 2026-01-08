'use client'

import { useState, useEffect } from 'react'
import Modal from './Modal'
import Button from './Button'
import { FileText } from 'lucide-react'

interface TermsModalProps {
  isOpen: boolean
  onAccept: () => void
  onDecline: () => void
}

export default function TermsModal({ isOpen, onAccept, onDecline }: TermsModalProps) {
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const modal = document.querySelector('[role="dialog"]')
    if (modal) {
      const handleScroll = () => setHasScrolled(true)
      modal.addEventListener('scroll', handleScroll)
      return () => modal.removeEventListener('scroll', handleScroll)
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="" showCloseButton={false}>
      <div className="space-y-6 text-white max-h-[70vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-button flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Terms & Conditions</h2>
            <p className="text-gray-400 text-sm">Please read and accept to continue</p>
          </div>
        </div>

        <div className="space-y-4 text-gray-200 leading-relaxed">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">1. Service Disclaimer</h3>
            <p className="text-sm">
              Aara is an AI-powered mental wellness assistant and is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">2. Emergency Situations</h3>
            <p className="text-sm">
              If you are experiencing a mental health emergency or crisis, please contact your local emergency services immediately. 
              Aara is not equipped to handle emergency situations.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">3. Data Privacy</h3>
            <p className="text-sm">
              Your conversations and personal data are stored securely. We respect your privacy and handle your information in accordance 
              with our Privacy Policy. You can delete your data at any time from your profile settings.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">4. User Responsibility</h3>
            <p className="text-sm">
              You are responsible for the information you share with Aara. Please use the service responsibly and do not share 
              sensitive personal information that you would not want stored.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">5. Service Limitations</h3>
            <p className="text-sm">
              Aara uses AI technology and may not always provide accurate or appropriate responses. Use your judgment and consult 
              with healthcare professionals for serious concerns.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex gap-3">
          <Button
            variant="secondary"
            onClick={onDecline}
            className="flex-1"
          >
            Decline
          </Button>
          <Button
            variant="primary"
            onClick={onAccept}
            className="flex-1"
          >
            I Accept & Continue
          </Button>
        </div>
      </div>
    </Modal>
  )
}





