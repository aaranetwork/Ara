'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Toast from '@/components/ui/Toast'
import { Calendar, Video, Phone, MessageSquare } from 'lucide-react'
import { createBooking } from '@/lib/firebase/firestore'
import { getStripe } from '@/lib/stripe/config'
import { useAuth } from '@/hooks/useAuth'

interface Therapist {
  id: string
  name: string
  specialization: string
  rating: number
  avatar: string
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  therapist: Therapist
}

export default function BookingModal({ isOpen, onClose, therapist }: BookingModalProps) {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [sessionType, setSessionType] = useState<'Video' | 'Audio' | 'Chat'>('Video')
  const [duration, setDuration] = useState<'30' | '60'>('60')
  const [shareSummary, setShareSummary] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00']

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !user) {
      setToastMessage('Please select date and time')
      setShowToast(true)
      return
    }

    setIsProcessing(true)
    try {
      const bookingData = {
        therapistId: therapist.id,
        therapistName: therapist.name,
        date: selectedDate,
        time: selectedTime,
        sessionType,
        duration: parseInt(duration),
        shareSummary,
        paymentStatus: 'pending',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      
      const bookingId = await createBooking(user.uid, bookingData)

      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionType,
          duration,
          therapistId: therapist.id,
          bookingId,
          price: duration === '30' ? 50 : 90,
        }),
      })

      if (!response.ok) throw new Error('Payment failed')

      const { sessionId } = await response.json()
      setBookingSuccess(true)
      setToastMessage(`Your appointment with ${therapist.name} is booked!`)
      setShowToast(true)
      
      const stripe = await getStripe()
      if (stripe) {
        setTimeout(() => {
          stripe.redirectToCheckout({ sessionId })
        }, 2000)
      }
    } catch (error) {
      setToastMessage('Failed to process booking. Please try again.')
      setShowToast(true)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleClose = () => {
    setBookingSuccess(false)
    setSelectedDate('')
    setSelectedTime('')
    setSessionType('Video')
    setDuration('60')
    setShareSummary(false)
    onClose()
  }

  const sessionTypes = [
    { id: 'Video', icon: Video, label: 'Video Call' },
    { id: 'Audio', icon: Phone, label: 'Audio Call' },
    { id: 'Chat', icon: MessageSquare, label: 'Chat' },
  ]

  const price = duration === '30' ? 50 : 90

  return (
    <>
      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        title={bookingSuccess ? 'Booking Confirmed!' : `Book Session with ${therapist.name}`}
      >
        {bookingSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#7A5FFF] flex items-center justify-center"
            >
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Your appointment with {therapist.name} is booked!
            </h3>
            <p className="text-gray-400 mb-6">
              Redirecting to payment...
            </p>
            <Button
              variant="primary"
              onClick={handleClose}
              className="w-full"
            >
              Close
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
          {/* Session Type */}
          <div>
            <label className="text-white font-medium mb-3 block">Session Type</label>
            <div className="grid grid-cols-3 gap-3">
              {sessionTypes.map((type) => {
                const Icon = type.icon
                return (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSessionType(type.id as 'Video' | 'Audio' | 'Chat')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      sessionType === type.id
                        ? 'border-neon-blue bg-neon-blue/20'
                        : 'border-white/20 bg-white/5 hover:border-neon-blue/50'
                    }`}
                    aria-label={`Select ${type.label}`}
                  >
                    <Icon className="w-6 h-6 text-white mx-auto mb-2" />
                    <div className="text-white text-sm">{type.label}</div>
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="text-white font-medium mb-3 block">Duration</label>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDuration('30')}
                className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                  duration === '30'
                    ? 'border-neon-blue bg-neon-blue/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-neon-blue/50'
                }`}
              >
                30 mins - $50
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDuration('60')}
                className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                  duration === '60'
                    ? 'border-neon-blue bg-neon-blue/20 text-white'
                    : 'border-white/20 bg-white/5 text-gray-300 hover:border-neon-blue/50'
                }`}
              >
                60 mins - $90
              </motion.button>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="text-white font-medium mb-3 block">Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full"
              aria-label="Select booking date"
            />
          </div>

          {/* Time */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden"
            >
              <label className="text-white font-medium mb-3 block">Time</label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <motion.button
                    key={time}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 px-3 rounded-lg border transition-all ${
                      selectedTime === time
                        ? 'border-neon-blue bg-neon-blue/20 text-white'
                        : 'border-white/20 bg-white/5 text-gray-300 hover:border-neon-blue/50'
                    }`}
                  >
                    {time}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Share Summary Toggle */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
            <input
              type="checkbox"
              id="shareSummary"
              checked={shareSummary}
              onChange={(e) => setShareSummary(e.target.checked)}
              className="w-5 h-5 rounded accent-neon-blue"
              aria-label="Share Aara summary with therapist"
            />
            <label htmlFor="shareSummary" className="text-white text-sm flex-1 cursor-pointer">
              Share Aara summary with therapist
            </label>
          </div>

          {/* Total */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between p-4 bg-neon-blue/10 rounded-xl border border-neon-blue/30"
          >
            <span className="text-white font-semibold">Total</span>
            <span className="text-2xl font-bold text-neon-blue">${price}</span>
          </motion.div>

          <Button
            variant="primary"
            glow
            className="w-full py-4 text-lg"
            onClick={handleBooking}
            disabled={!selectedDate || !selectedTime || isProcessing}
            aria-label={`Book session for $${price}`}
          >
            {isProcessing ? 'Processing...' : `Book Session - $${price}`}
          </Button>
        </div>
        )}
      </Modal>

      <Toast
        message={toastMessage}
        type={toastMessage.includes('Redirecting') ? 'info' : toastMessage.includes('Failed') ? 'error' : 'success'}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  )
}
