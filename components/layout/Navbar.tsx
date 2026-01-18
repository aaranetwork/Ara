'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, BookOpen, TrendingUp, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
    const { user } = useAuth()
    const pathname = usePathname()

    const navItems = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/chat', label: 'Chat', icon: MessageSquare },
        { href: '/journal', label: 'Journal', icon: BookOpen },
        { href: '/growth', label: 'Growth', icon: TrendingUp },
    ]

    return (
        <nav className="flex justify-between md:justify-center items-center px-4 py-3 relative max-w-7xl mx-auto">
            {/* Left - Logo (Desktop) */}
            <div className="absolute left-4 hidden md:flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 group">
                    <Image
                        src="/aara-logo.png"
                        alt=""
                        width={32}
                        height={32}
                        className="rounded-lg border border-white/10 group-hover:scale-105 transition-transform"
                    />
                    <span className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase group-hover:text-white transition-colors">
                        AARA
                    </span>
                </Link>
            </div>

            {/* Center - Navigation Links (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
                {navItems.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className="relative flex items-center gap-3 px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.25em] transition-all group text-gray-300 hover:text-white"
                    >
                        <Icon size={16} className="relative z-10 transition-colors duration-300 group-hover:text-blue-300" />
                        <span className="relative z-10 group-hover:opacity-100">{label}</span>
                    </Link>
                ))}
            </div>

            {/* Mobile Navigation - Apple / iOS Style with Curve */}
            <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
                <div className="w-full bg-[#121212]/90 backdrop-blur-2xl border-t border-white/5 pb-safe-area rounded-t-[24px] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                    <div className="flex items-center justify-around h-[64px] px-4">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex-1 flex flex-col items-center gap-1 group cursor-pointer select-none transition-all duration-300 ${isActive ? 'text-[#007AFF]' : 'text-[#8E8E93] hover:text-white'}`}
                                >
                                    <div className="relative w-6 h-6 flex items-center justify-center">
                                        <Icon
                                            size={22}
                                            strokeWidth={isActive ? 2.5 : 2}
                                            className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_10px_rgba(0,122,255,0.4)]' : 'scale-100'}`}
                                        />
                                    </div>
                                    <span className={`text-[9px] font-medium tracking-wide transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                                        {label}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Right - Profile Icon (Desktop) */}
            <div className="absolute right-3 md:right-4 hidden md:flex items-center">
                <Link
                    href="/profile"
                    className="group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                >
                    <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-white/30 transition-colors" />
                    <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity blur-md" />

                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-black/20 shadow-sm group-active:scale-95 transition-transform">
                        {user?.photoURL ? (
                            <Image
                                src={user.photoURL}
                                alt="Profile"
                                width={36}
                                height={36}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                                {user?.email?.[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                </Link>
            </div>
        </nav>
    )
}

