'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Compass } from 'lucide-react'

interface DiscoverItem {
    id: string
    title: string
    description?: string
    image: string
    category?: string
    color?: string
}

export default function DiscoverCards() {
    const [items, setItems] = useState<DiscoverItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch('/api/discover')
                const data = await res.json()
                setItems(data.slice(0, 2))
            } catch (e) {
                console.error('Failed to load discover items', e)
            } finally {
                setLoading(false)
            }
        }
        fetchItems()
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map(i => (
                    <div key={i} className="h-48 bg-[#0e0e12] rounded-2xl animate-pulse" />
                ))}
            </div>
        )
    }

    if (items.length === 0) return null

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Compass size={16} className="text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Featured Topics</h3>
                </div>
                <Link
                    href="/discover"
                    className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                    View All <ArrowRight size={12} />
                </Link>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Link
                            href={`/discover/${item.id}`}
                            className="block group relative overflow-hidden rounded-2xl h-48 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {/* Background Image with Gradient Overlay */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundColor: item.color || '#1a1a2e'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                            {/* Content */}
                            <div className="absolute inset-0 p-5 flex flex-col justify-end">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 mb-1.5">
                                    {item.category || 'Health'}
                                </span>
                                <h4 className="text-base font-bold text-white leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
                                    {item.title}
                                </h4>
                                {item.description && (
                                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                                        {item.description}
                                    </p>
                                )}
                            </div>

                            {/* Hover Arrow */}
                            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                <ArrowRight size={14} className="text-white" />
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
