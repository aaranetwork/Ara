import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'aara-dark': '#121212',
        'aara-accent': '#00AEEF',
        'aara-purple': '#7A5FFF',
        'neon-blue': '#00AEEF',
        'neon-purple': '#7A5FFF',
        'dark-bg': '#121212',
        'dark-bg-light': '#1C1E24',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(to bottom, #121212, #1C1E24)',
        'gradient-button': 'linear-gradient(135deg, #00AEEF 0%, #7A5FFF 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'fluid-1': 'clamp(1rem, 2vw, 2rem)',
        'fluid-2': 'clamp(2rem, 4vw, 4rem)',
        'fluid-3': 'clamp(3rem, 6vw, 6rem)',
        '18': '4.5rem',
        '88': '22rem',
      },
      fontSize: {
        'fluid-h1': ['clamp(2.5rem, 8vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.04em' }],
        'fluid-h2': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'fluid-body': ['clamp(1rem, 1.2vw, 1.25rem)', { lineHeight: '1.6' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'glow-button': '0 0 20px rgba(0, 174, 239, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
}
export default config

// Force rebuild: 1339
