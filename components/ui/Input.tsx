import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full bg-[#10121A]/80 backdrop-blur-sm text-white placeholder-gray-400 rounded-xl px-4 py-3 border border-white/10 shadow-inner focus:outline-none focus:ring-2 focus:ring-[#00AEEF] focus:border-[#00AEEF] focus:shadow-md focus:shadow-[#00AEEF]/20 transition-all duration-200 ${className}`}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input
