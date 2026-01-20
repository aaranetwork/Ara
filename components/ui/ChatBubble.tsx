import { ReactNode } from 'react'

interface ChatBubbleProps {
  children: ReactNode
  isUser?: boolean
  avatar?: string
  className?: string
}

export default function ChatBubble({ children, isUser = false, avatar, className = '' }: ChatBubbleProps) {
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} ${className}`}>
      {avatar && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex-shrink-0 flex items-center justify-center">
          {!avatar.startsWith('http') && <span className="text-white font-semibold">{avatar}</span>}
        </div>
      )}
      <div
        className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] text-sm sm:text-base ${isUser
            ? 'bg-dark-bg-light/60 backdrop-blur-sm md:backdrop-blur-md text-white'
            : 'bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 backdrop-blur-sm md:backdrop-blur-md text-white border border-neon-blue/30'
          }`}
      >
        {children}
      </div>
    </div>
  )
}


