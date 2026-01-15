'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Compass, ArrowRight } from 'lucide-react'

interface DiscoverItem {
    id: string
    title: string
    image: string
    category?: string
    color?: string
}

interface DiscoverPreviewProps {
    variant?: 'icon' | 'card'
}

export default function DiscoverPreview({ variant = 'icon' }: DiscoverPreviewProps) {
    const [isHovered, setIsHovered] = useState(false)
    const [items, setItems] = useState<DiscoverItem[]>([])

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch('/api/discover')
                const data = await res.json()
                // Get first 3 items
                setItems(data.slice(0, 3))
            } catch (e) {
                console.error('Failed to load discover items', e)
            }
        }
        fetchItems()
    }, [])

    // Icon variant (for mobile header)
    if (variant === 'icon') {
        return (
            <div
                className="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Icon Button */}
                <Link
                    href="/discover"
                    className="w-10 h-10 rounded-full bg-[#0d0d0d] flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors shadow-2xl group"
                >
                    <Compass size={18} className="text-white/60 group-hover:text-indigo-400 transition-colors" />
                </Link>

                {/* Hover Cards Preview */}
                <AnimatePresence>
                    {isHovered && items.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="absolute top-full right-0 mt-3 w-72 z-50"
                        >
                            <PreviewDropdown items={items} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    // Card variant (for desktop sidebar)
    return (
        <div
            className="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Card Button */}
            <Link
                href="/discover"
                className="block group p-5 bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-2xl transition-all hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/30 transition-all">
                        <Compass size={22} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-white mb-0.5 group-hover:text-indigo-300 transition-colors">Discover Topics</h3>
                        <p className="text-[11px] text-gray-500">Explore health insights</p>
                    </div>
                    <ArrowRight size={16} className="text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </div>
            </Link>

            {/* Hover Cards Preview */}
            <AnimatePresence>
                {isHovered && items.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="absolute top-full left-0 right-0 mt-3 z-50"
                    >
                        <PreviewDropdown items={items} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Shared Preview Dropdown Component
function PreviewDropdown({ items }: { items: DiscoverItem[] }) {
    return (
        <div className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-3 shadow-2xl backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Discover</span>
                <Link href="/discover" className="text-[10px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                    View All →
                </Link>
            </div>

            {/* Cards Stack */}
            <div className="space-y-2">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            href="/discover"
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                            {/* Thumbnail */}
                            <div
                                className="w-14 h-14 rounded-xl bg-cover bg-center shrink-0 border border-white/10"
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundColor: item.color || '#1a1a2e'
                                }}
                            />
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 mb-0.5 block">
                                    {item.category || 'Health'}
                                </span>
                                <h4 className="text-sm font-medium text-white/90 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                                    {item.title}
                                </h4>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Footer CTA */}
            <Link
                href="/discover"
                className="mt-3 w-full py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
                <Compass size={14} />
                Explore All Topics
            </Link>
        </div>
    )
}
