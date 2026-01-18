'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, MessageSquare, BookOpen, TrendingUp, User } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
    const { user } = useAuth()
    return (
        <nav className="flex justify-between md:justify-center items-center px-4 py-3 relative max-w-7xl mx-auto">
            {/* Left - Logo (Desktop) */}
            <div className="absolute left-4 hidden md:flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 group">
                    <Image
                        src="/aara-logo.png"
                        alt="AARA"
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
                <Link
                    href="/"
                    className="relative flex items-center gap-3 px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.25em] transition-all group text-gray-400 hover:text-white"
                >
                    <Home size={16} className="relative z-10 transition-colors duration-300 group-hover:text-blue-300" />
                    <span className="relative z-10 opacity-70 group-hover:opacity-100">Home</span>
                </Link>
                <Link
                    href="/chat"
                    className="relative flex items-center gap-3 px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.25em] transition-all group text-gray-400 hover:text-white"
                >
                    <MessageSquare size={16} className="relative z-10 transition-colors duration-300 group-hover:text-blue-300" />
                    <span className="relative z-10 opacity-70 group-hover:opacity-100">Chat</span>
                </Link>
                <Link
                    href="/journal"
                    className="relative flex items-center gap-3 px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.25em] transition-all group text-gray-400 hover:text-white"
                >
                    <BookOpen size={16} className="relative z-10 transition-colors duration-300 group-hover:text-blue-300" />
                    <span className="relative z-10 opacity-70 group-hover:opacity-100">Journal</span>
                </Link>
                <Link
                    href="/growth"
                    className="relative flex items-center gap-3 px-6 py-3 rounded-full text-[11px] font-bold uppercase tracking-[0.25em] transition-all group text-gray-400 hover:text-white"
                >
                    <TrendingUp size={16} className="relative z-10 transition-colors duration-300 group-hover:text-blue-300" />
                    <span className="relative z-10 opacity-70 group-hover:opacity-100">Growth</span>
                </Link>
            </div>

            {/* Mobile Navigation - Fixed Bottom */}
            <div className="fixed bottom-0 left-0 right-0 z-[100] md:hidden">
                <div className="flex items-center justify-around w-full px-2 py-2 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10">
                    <Link href="/" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-blue-400">
                        <div className="relative p-1.5 rounded-xl bg-blue-500/10">
                            <Home size={20} />
                        </div>
                        <span className="text-[9px] font-bold tracking-wide">Home</span>
                    </Link>
                    <Link href="/chat" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-zinc-500 hover:text-zinc-300">
                        <div className="relative p-1.5 rounded-xl">
                            <MessageSquare size={20} />
                        </div>
                        <span className="text-[9px] font-bold tracking-wide">Chat</span>
                    </Link>
                    <Link href="/journal" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-zinc-500 hover:text-zinc-300">
                        <div className="relative p-1.5 rounded-xl">
                            <BookOpen size={20} />
                        </div>
                        <span className="text-[9px] font-bold tracking-wide">Journal</span>
                    </Link>
                    <Link href="/growth" className="flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-zinc-500 hover:text-zinc-300">
                        <div className="relative p-1.5 rounded-xl">
                            <TrendingUp size={20} />
                        </div>
                        <span className="text-[9px] font-bold tracking-wide">Growth</span>
                    </Link>
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
