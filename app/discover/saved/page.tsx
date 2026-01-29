'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, Trash2, Bookmark, Home, Compass, Clock, Search } from 'lucide-react'
import { useSavedItems } from '@/contexts/SavedItemsContext'
import { useAuth } from '@/hooks/useAuth'

export default function DiscoverSavedPage() {
    const { savedItems, clearSaved, isSaved, toggleSave } = useSavedItems()
    const { user } = useAuth()
    const [savedItemsList, setSavedItemsList] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSaved = async () => {
            try {
                const res = await fetch('/api/discover')
                const data = await res.json()

                // Filter to only show saved items
                const savedItemsArray = [...savedItems]
                const filtered = data.filter((item: any) => savedItemsArray.includes(item.id))
                setSavedItemsList(filtered)
            } catch (error) {
                console.error('Error fetching saved items:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSaved()
    }, [savedItems])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-yellow-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Desktop Header - Discover Specific */}
            <nav className="hidden md:block fixed top-0 left-0 right-0 z-[60] pointer-events-none">
                <div className="px-6 py-4 flex justify-between items-center">
                    {/* Left - Logo & Brand */}
                    <Link href="/" className="pointer-events-auto flex items-center gap-2 group">
                        <Image src="/aara-logo.png" alt="AARA Prep" width={32} height={32} className="rounded-lg border border-white/10 group-hover:scale-105 transition-transform" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase group-hover:text-white transition-colors">AARA</span>
                    </Link>

                    {/* Center - Discover Navigation (Saved Active) */}
                    <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                        <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all group">
                            <Home size={14} className="group-hover:text-blue-300 transition-colors" />
                            <span className="opacity-70 group-hover:opacity-100">Home</span>
                        </Link>
                        <Link href="/discover" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all group">
                            <Compass size={14} className="group-hover:text-indigo-400 transition-colors" />
                            <span className="opacity-70 group-hover:opacity-100">Discover</span>
                        </Link>
                        <Link href="/discover/history" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all group">
                            <Clock size={14} className="group-hover:text-indigo-400 transition-colors" />
                            <span className="opacity-70 group-hover:opacity-100">History</span>
                        </Link>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-white bg-white/10">
                            <Bookmark size={14} className="text-yellow-400" />
                            <span>Saved</span>
                        </div>
                    </div>

                    {/* Right - Search, Join */}
                    <div className="pointer-events-auto flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 w-40 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                            />
                        </div>
                        {!user && (
                            <Link
                                href="/auth/login"
                                className="bg-white text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-gray-100 transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                            >
                                Join
                            </Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <Link href="/discover" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                    <ChevronLeft size={20} />
                </Link>
                <span className="text-sm font-bold tracking-widest uppercase text-white/70">Saved Topics</span>
                <div className="w-10" />
            </div>

            <main className="relative z-10 pt-24 md:pt-32 pb-32 px-4 md:px-8 max-w-3xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                                <Bookmark size={24} className="text-yellow-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold font-serif">Saved Topics</h1>
                                <p className="text-gray-500 text-sm">{savedItemsList.length} topics saved</p>
                            </div>
                        </div>
                        {savedItemsList.length > 0 && (
                            <button
                                onClick={clearSaved}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm hover:bg-red-500/20 transition-colors"
                            >
                                <Trash2 size={16} />
                                Clear All
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Saved Items */}
                {savedItemsList.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                            <Bookmark size={40} className="text-gray-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-400 mb-2">No saved topics yet</h2>
                        <p className="text-gray-500 mb-6">Tap the bookmark icon to save topics for later</p>
                        <Link
                            href="/discover"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-500 rounded-xl text-white font-medium transition-colors"
                        >
                            Explore Topics
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {savedItemsList.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <div className="flex gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-white/10 transition-all group">
                                    <Link href={`/discover/${item.slug}`} className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">
                                            {item.category}
                                        </span>
                                        <Link href={`/discover/${item.slug}`}>
                                            <h3 className="text-lg font-bold text-white line-clamp-2 mt-1 group-hover:text-yellow-300 transition-colors">
                                                {item.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                                            {item.description}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => toggleSave(item.id)}
                                        className="shrink-0 w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                                    >
                                        <Bookmark size={18} className="fill-yellow-400" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}
