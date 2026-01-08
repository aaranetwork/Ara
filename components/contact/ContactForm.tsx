'use client'

import { useState, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface ContactFormProps {
  defaultTopic?: string
  onSubmit?: () => void
}

type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export default function ContactForm({ defaultTopic = 'general', onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: defaultTopic,
    message: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error')
      setErrorMessage('Please fill in all required fields.')
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', topic: defaultTopic, message: '' })
        onSubmit?.()
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setStatus('idle')
        }, 5000)
      } else {
        setStatus('error')
        setErrorMessage(data.message || 'Failed to send message. Please try again or email us directly.')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setStatus('error')
      setErrorMessage('An unexpected error occurred. Please try again or email us at contact@aara.ai')
    }
  }

  const topicOptions = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'therapy', label: 'Therapist Partnership' },
    { value: 'press', label: 'Press & Media' },
    { value: 'tech', label: 'Technical Support' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-300 mb-2">
          Name <span className="text-red-400">*</span>
        </label>
        <Input
          id="contact-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Your name"
          className="w-full"
          aria-label="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-300 mb-2">
          Email <span className="text-red-400">*</span>
        </label>
        <Input
          id="contact-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          placeholder="your.email@example.com"
          className="w-full"
          aria-label="Your email address"
        />
      </div>

      {/* Topic */}
      <div>
        <label htmlFor="contact-topic" className="block text-sm font-medium text-gray-300 mb-2">
          Topic <span className="text-red-400">*</span>
        </label>
        <select
          id="contact-topic"
          value={formData.topic}
          onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl bg-[#10121A]/80 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] focus:shadow-md focus:shadow-[#00AEEF]/20 transition-all duration-200"
          aria-label="Select topic"
        >
          {topicOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-dark-bg">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-300 mb-2">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="contact-message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={6}
          placeholder="Tell us how we can help..."
          className="w-full px-4 py-3 rounded-xl bg-[#10121A]/80 backdrop-blur-sm border border-white/10 text-white placeholder-gray-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] focus:shadow-md focus:shadow-[#00AEEF]/20 transition-all duration-200 resize-none"
          aria-label="Your message"
        />
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400"
          >
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm font-medium">Message sent successfully! We&apos;ll get back to you within 24 hours.</p>
          </motion.div>
        )}
        
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center gap-2"
        aria-label="Send message"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Message Sent
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Message
          </>
        )}
      </Button>
    </form>
  )
}


