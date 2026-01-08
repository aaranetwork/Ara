'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { Home, MessageSquare, Compass, BookOpen, Users, ChevronLeft, ChevronRight } from 'lucide-react'

const pages = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/chat', label: 'Chat', icon: MessageSquare },
    { href: '/journal', label: 'Journal', icon: BookOpen },
]

interface MobileSwipeNavProps {
    children: React.ReactNode
}

export default function MobileSwipeNav({ children }: MobileSwipeNavProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    // Find current page index
    useEffect(() => {
        const index = pages.findIndex(p => p.href === pathname)
        if (index !== -1) {
            setCurrentIndex(index)
        }
    }, [pathname])

    const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50
        const velocity = 0.5

        if (info.offset.x > threshold || info.velocity.x > velocity) {
            // Swiped right - go to previous page
            if (currentIndex > 0) {
                setDirection(-1)
                router.push(pages[currentIndex - 1].href)
            }
        } else if (info.offset.x < -threshold || info.velocity.x < -velocity) {
            // Swiped left - go to next page
            if (currentIndex < pages.length - 1) {
                setDirection(1)
                router.push(pages[currentIndex + 1].href)
            }
        }
    }

    const goToPrev = () => {
        if (currentIndex > 0) {
            setDirection(-1)
            router.push(pages[currentIndex - 1].href)
        }
    }

    const goToNext = () => {
        if (currentIndex < pages.length - 1) {
            setDirection(1)
            router.push(pages[currentIndex + 1].href)
        }
    }

    return (
        <div className="relative">
            {/* Swipe hint indicators */}
            <div className="fixed top-1/2 -translate-y-1/2 left-2 z-50 md:hidden">
                {currentIndex > 0 && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        onClick={goToPrev}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </motion.button>
                )}
            </div>
            <div className="fixed top-1/2 -translate-y-1/2 right-2 z-50 md:hidden">
                {currentIndex < pages.length - 1 && (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        onClick={goToNext}
                        className="p-2 rounded-full bg-white/10 backdrop-blur-sm"
                    >
                        <ChevronRight size={20} className="text-white" />
                    </motion.button>
                )}
            </div>

            {/* Page indicator dots */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 md:hidden">
                {pages.map((page, i) => (
                    <button
                        key={page.href}
                        onClick={() => router.push(page.href)}
                        className={`w-2 h-2 rounded-full transition-all ${i === currentIndex
                            ? 'bg-blue-500 w-6'
                            : 'bg-white/30'
                            }`}
                    />
                ))}
            </div>

            {/* Swipeable content */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                className="md:!transform-none"
            >
                {children}
            </motion.div>
        </div>
    )
}
