'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Brain, Megaphone, Settings } from 'lucide-react'
import GlassCard from '@/components/ui/GlassCard'
import ContactModal from './ContactModal'

type ContactType = 'general' | 'therapy' | 'press' | 'tech'

interface ContactOption {
  id: ContactType
  icon: typeof MessageSquare
  title: string
  description: string
  email?: string
  action: 'modal' | 'email' | 'chat'
}

const contactOptions: ContactOption[] = [
  {
    id: 'general',
    icon: MessageSquare,
    title: 'General Inquiries',
    description: 'Have a question or feedback? We\'d love to hear from you.',
    action: 'modal',
  },
  {
    id: 'therapy',
    icon: Brain,
    title: 'Therapist Partnerships',
    description: 'Collaborate or integrate with Aara to expand mental health access.',
    email: 'partners@aara.ai',
    action: 'email',
  },
  {
    id: 'press',
    icon: Megaphone,
    title: 'Press & Media',
    description: 'Interviews, PR inquiries, and media coverage opportunities.',
    email: 'press@aara.ai',
    action: 'email',
  },
  {
    id: 'tech',
    icon: Settings,
    title: 'Technical Support',
    description: 'App issues, bugs, or technical questions. We\'re here to help.',
    action: 'modal',
  },
]

export default function ContactGrid() {
  const [selectedOption, setSelectedOption] = useState<ContactType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (option: ContactOption) => {
    if (option.action === 'email' && option.email) {
      window.location.href = `mailto:${option.email}?subject=${encodeURIComponent(option.title)}`
      return
    }
    
    if (option.action === 'chat') {
      window.location.href = '/chat'
      return
    }
    
    if (option.action === 'modal') {
      setSelectedOption(option.id)
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <section id="contact-grid" className="py-16 lg:py-24">
        <motion.h2
          className="text-3xl lg:text-4xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
        >
          Choose Your Path
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {contactOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard
                  className="p-6 lg:p-8 cursor-pointer h-full group"
                  onClick={() => handleCardClick(option)}
                  hover={true}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center flex-shrink-0 group-hover:from-neon-blue/30 group-hover:to-neon-purple/30 transition-all"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-neon-blue" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2 group-hover:text-neon-blue/90 transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-gray-300/80 text-sm lg:text-base leading-relaxed">
                        {option.description}
                      </p>
                      {option.email && (
                        <p className="text-neon-blue text-sm mt-3 font-medium">
                          → {option.email}
                        </p>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </section>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedOption(null)
        }}
        defaultTopic={selectedOption || 'general'}
      />
    </>
  )
}


