'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Compass,
  User,
  Plus,
  LogOut,
  Home,
} from 'lucide-react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

const navLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const handleLogout = async () => {
    if (!auth) return
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleNewChat = () => {
    window.location.href = '/chat?new=true'
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[72px] bg-[#050505] border-r border-white/10 py-4 flex-col items-center z-40">
      {/* Logo */}
      <Link href="/" className="mb-6" aria-label="Home">
        <Image src="/aara-logo.png" alt="AARA Prep" width={40} height={40} className="rounded-xl" />
      </Link>

      {/* New Chat Button */}
      <button
        onClick={handleNewChat}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center hover:shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] transition-all duration-300 mb-6"
        aria-label="New Chat"
      >
        <Plus size={20} />
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col items-center gap-2">
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${isActive
                ? 'bg-blue-600/20 text-blue-400'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              aria-label={link.label}
            >
              <Icon size={20} />
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="mt-auto flex flex-col items-center gap-2 pb-4">
        {user ? (
          <>
            <Link
              href="/profile"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold"
              aria-label="Profile"
            >
              {user.email?.[0].toUpperCase() || <User size={16} />}
            </Link>
            <button
              onClick={handleLogout}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <Link
            href="/auth/login"
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white"
            aria-label="Sign In"
          >
            <User size={18} />
          </Link>
        )}
      </div>
    </aside>
  )
}
