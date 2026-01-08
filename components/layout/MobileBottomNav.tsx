'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, MessageSquare, Compass, BookOpen, Users, User } from 'lucide-react'

const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/profile', label: 'Profile', icon: User },
]

export default function MobileBottomNav() {
    const pathname = usePathname()
    const router = useRouter()
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    const currentIndex = navItems.findIndex(item => item.href === pathname)

    // Minimum swipe distance
    const minSwipeDistance = 80

    const onTouchStart = (e: TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe && currentIndex < navItems.length - 1) {
            router.push(navItems[currentIndex + 1].href)
        }
        if (isRightSwipe && currentIndex > 0) {
            router.push(navItems[currentIndex - 1].href)
        }
    }

    useEffect(() => {
        document.addEventListener('touchstart', onTouchStart)
        document.addEventListener('touchmove', onTouchMove)
        document.addEventListener('touchend', onTouchEnd)

        return () => {
            document.removeEventListener('touchstart', onTouchStart)
            document.removeEventListener('touchmove', onTouchMove)
            document.removeEventListener('touchend', onTouchEnd)
        }
    }, [touchStart, touchEnd, currentIndex])

    // Don't show on auth pages or landing page when not logged in
    const hiddenPaths = ['/auth', '/privacy', '/terms', '/about', '/contact']
    if (hiddenPaths.some(path => pathname.startsWith(path))) return null

    return (
        <>
            {/* Page indicator dots - shows current position */}
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 flex gap-1.5 md:hidden">
                {navItems.map((item, i) => (
                    <div
                        key={item.href}
                        className={`h-1 rounded-full transition-all duration-300 ${i === currentIndex
                            ? 'bg-blue-500 w-6'
                            : 'bg-white/20 w-1'
                            }`}
                    />
                ))}
            </div>

            {/* Swipe hint on edges */}
            {currentIndex > 0 && (
                <div className="fixed left-0 top-1/2 -translate-y-1/2 w-1 h-24 bg-gradient-to-r from-white/10 to-transparent rounded-r-full md:hidden" />
            )}
            {currentIndex < navItems.length - 1 && (
                <div className="fixed right-0 top-1/2 -translate-y-1/2 w-1 h-24 bg-gradient-to-l from-white/10 to-transparent rounded-l-full md:hidden" />
            )}

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#08080c]/95 backdrop-blur-xl border-t border-white/10 safe-bottom">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex flex-col items-center gap-1 p-2 min-w-[60px]"
                            >
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-blue-600/20' : ''
                                        }`}
                                >
                                    <Icon
                                        size={22}
                                        className={isActive ? 'text-blue-500' : 'text-gray-500'}
                                    />
                                </motion.div>
                                <span className={`text-[10px] ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </>
    )
}
