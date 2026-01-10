'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Home, MessageSquare, BookOpen, TrendingUp, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/growth', label: 'Growth', icon: TrendingUp },
]

export default function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()

    const currentIndex = navItems.findIndex(item => item.href === pathname)

    const goToPrev = () => {
        if (currentIndex > 0) router.push(navItems[currentIndex - 1].href)
    }

    const goToNext = () => {
        if (currentIndex < navItems.length - 1) router.push(navItems[currentIndex + 1].href)
    }

    return (
        <header className="fixed w-full z-[100] transition-all duration-300 bottom-0 border-t bg-[#050505]/80 backdrop-blur-md pb-safe border-white/5 md:top-0 md:bottom-auto md:border-b md:border-t-0 md:bg-[#050505]/50 md:backdrop-blur-xl md:py-0">
            <nav className="flex justify-between md:justify-center items-center px-4 py-3 relative max-w-7xl mx-auto">

                {/* Left Section - Logo (Desktop Only) */}
                <div className="absolute left-4 hidden md:flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/aara-logo.png"
                            alt="AARA"
                            width={32}
                            height={32}
                            className="rounded-lg border border-white/10 group-hover:scale-105 transition-transform"
                        />
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase group-hover:text-white transition-colors">AARA</span>
                    </Link>
                </div>

                {/* Desktop Navigation - Centered */}
                <div className="hidden md:flex items-center gap-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`relative flex items-center gap-3 px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.25em] transition-all group ${isActive
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="desktop-pill"
                                        className="absolute inset-0 bg-white/[0.08] rounded-full shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/5"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                                    />
                                )}
                                <Icon size={16} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-300'}`} />
                                <span className={`relative z-10 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{item.label}</span>
                            </Link>
                        )
                    })}
                </div>

                {/* 📱 Mobile Navigation - Standard Tabs */}
                <div className="flex md:hidden items-center justify-between w-full px-2">
                    {/* Main Nav Items */}
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                <div className={`relative p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-blue-600/20 text-blue-400' : ''}`}>
                                    {isActive && <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />}
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className="relative z-10" />
                                </div>
                                <span className={`text-[10px] font-bold tracking-wide ${isActive ? 'text-blue-400' : ''}`}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}

                    {/* Profile Tab (Integrated for Mobile) */}

                </div>

                {/* Right Section - Profile Absolute (Desktop Only) */}
                <div className="absolute right-3 md:right-4 hidden md:flex items-center">
                    {authLoading ? (
                        <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
                    ) : user ? (
                        <Link
                            href="/profile"
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all group relative overflow-hidden ${pathname === '/profile'
                                ? 'bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                : 'bg-white/[0.03] hover:bg-white/[0.08]'
                                }`}
                        >
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 blur-md transition-all duration-500" />
                            {user.email?.[0].toUpperCase() || <User size={18} className="relative z-10" />}
                        </Link>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="bg-white text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                        >
                            Join
                        </Link>
                    )}
                </div>
            </nav>



            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                .font-sans { font-family: 'Inter', sans-serif; }
                /* Mobile: bottom navbar padding */
                @media (max-width: 768px) {
                    body { padding-bottom: 5rem !important; }
                }
                /* Desktop: top navbar - no body padding needed, handled by page pt-20 */
                @media (min-width: 769px) {
                    body { 
                        padding-top: 0 !important;
                        padding-bottom: 0 !important;
                        overflow-x: hidden !important;
                    }
                }
                .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
            `}</style>
        </header>
    )
}
