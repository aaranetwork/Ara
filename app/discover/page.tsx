'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    SlidersHorizontal,
    Share2,
    Heart,
    Search,
    ArrowRight,
    ChevronLeft,
    Clock,
    Home,
    Compass,
    Bookmark
} from 'lucide-react'
import { useReadHistory } from '@/contexts/ReadHistoryContext'
import { useSavedItems } from '@/contexts/SavedItemsContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'

export default function DiscoverPage() {
    const [activeTab, setActiveTab] = useState('you')
    const { user } = useAuth()
    const [feedItems, setFeedItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const { readItems, markAsRead, isRead } = useReadHistory()
    const { toggleSave, isSaved } = useSavedItems()

    // Filter out read items from the feed
    const unreadItems = feedItems.filter(item => !isRead(item.id))

    // Filter items based on search query
    const filteredItems = searchQuery.trim()
        ? unreadItems.filter(item =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : unreadItems

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/discover')
                if (!res.ok) throw new Error('Network response was not ok')
                const data = await res.json()
                // Mix in some random source counts or metadata if missing
                const enhanced = data.map((item: any) => ({
                    ...item,
                    type: item.id === '1' ? 'hero' : 'standard',
                    sourceCount: Math.floor(Math.random() * 50) + 10,
                    time: 'Just now'
                }))
                setFeedItems(enhanced)
            } catch (error) {
                console.error('Failed to load feed:', error)
                setError('Failed to load content. Please refresh.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const toggleLike = (id: string) => {
        const newLiked = new Set(likedItems)
        if (newLiked.has(id)) {
            newLiked.delete(id)
        } else {
            newLiked.add(id)
        }
        setLikedItems(newLiked)
    }

    const handleShare = async (item: any) => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: item.title,
                    text: item.description,
                    url: window.location.href,
                })
            } catch (err) {
                // Share cancelled
            }
        } else {
            alert('Link copied to clipboard')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-500 animate-pulse">Loading Insights...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="text-center p-6">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="px-4 py-2 bg-white/10 rounded-full text-sm">Retry</button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-hidden">

            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* --- DESKTOP VIEW (Full Screen Snap Scroll like Mobile) --- */}
            <div className="hidden md:block fixed inset-0 z-50 bg-[#000000] snap-y snap-mandatory overflow-y-scroll h-[100dvh]">

                {/* Desktop Header (Floating Nav) */}
                <nav className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
                    <div className="px-6 py-4 flex justify-between items-center">
                        {/* Left - Logo & Brand */}
                        <Link href="/" className="pointer-events-auto flex items-center gap-2 group">
                            <Image src="/aara-logo.png" alt="AARA" width={32} height={32} className="rounded-lg border border-white/10 group-hover:scale-105 transition-transform" />
                            <span className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase group-hover:text-white transition-colors">AARA</span>
                        </Link>

                        {/* Center - Discover Navigation (Aligned with card - max-w-lg = 512px) */}
                        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-1 px-2 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                            <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all group">
                                <Home size={14} className="group-hover:text-blue-300 transition-colors" />
                                <span className="opacity-70 group-hover:opacity-100">Home</span>
                            </Link>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-white bg-white/10">
                                <Compass size={14} className="text-indigo-400" />
                                <span>Discover</span>
                            </div>
                            <Link href="/discover/history" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all group relative">
                                <Clock size={14} className="group-hover:text-indigo-400 transition-colors" />
                                <span className="opacity-70 group-hover:opacity-100">History</span>
                            </Link>
                            <Link href="/discover/saved" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all group">
                                <Bookmark size={14} className="group-hover:text-yellow-400 transition-colors" />
                                <span className="opacity-70 group-hover:opacity-100">Saved</span>
                            </Link>
                        </div>

                        {/* Right - Search, Join */}
                        <div className="pointer-events-auto flex items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 w-40 focus:w-64 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 transition-all"
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

                {/* Centered Cards with Snap */}
                {filteredItems.length === 0 ? (
                    <div className="h-[100dvh] w-full flex items-center justify-center p-8">
                        <div className="text-center max-w-md">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                {searchQuery ? <Search size={40} className="text-indigo-400" /> : <Clock size={40} className="text-indigo-400" />}
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">
                                {searchQuery ? 'No Results Found' : 'All Caught Up!'}
                            </h2>
                            <p className="text-gray-400 mb-8">
                                {searchQuery
                                    ? `No topics match "${searchQuery}". Try a different search term.`
                                    : "You've read all available topics. Check back later for new content!"
                                }
                            </p>
                            <div className="flex flex-col gap-3">
                                {searchQuery ? (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <>
                                        <Link href="/discover/history" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium transition-colors">
                                            View Reading History
                                        </Link>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('aara_discover_read_history')
                                                window.location.reload()
                                            }}
                                            className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-gray-300 font-medium transition-colors"
                                        >
                                            Start Fresh
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : filteredItems.map((item, index) => (
                    <div key={item.id} className="snap-center h-[100dvh] w-full flex items-center justify-center p-8 relative">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0.2 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: false, margin: "-20%" }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 25,
                                mass: 0.8
                            }}
                            className="w-full max-w-lg h-[85vh] rounded-[2rem] overflow-hidden flex flex-col relative origin-center will-change-transform"
                            style={{
                                background: `radial-gradient(circle at 50% 0%, ${item.color} 0%, #000000 120%)`,
                                boxShadow: `0 20px 60px -15px ${item.color}40`,
                            }}
                        >
                            {/* Dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none z-10" />

                            {/* Image Section (Top 52%) */}
                            <div className="h-[52%] w-full relative p-3 pb-0 z-20">
                                <div className="w-full h-full relative rounded-t-[1.5rem] rounded-b-[1rem] overflow-hidden shadow-2xl">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    <Link href={`/discover/${item.slug}`} className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                                </div>
                            </div>

                            {/* Content Section (Bottom ~48%) */}
                            <div className="flex-1 px-6 pb-6 pt-4 flex flex-col justify-between text-white relative z-30">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col gap-3"
                                >
                                    {/* Source Pill */}
                                    <div className="flex items-center gap-2 mb-1 opacity-80">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 shadow-sm">
                                            <span className="text-[10px] font-bold tracking-wider uppercase">{item.source}</span>
                                        </div>
                                        <span className="text-[10px] font-medium tracking-wide">{item.time}</span>
                                    </div>

                                    <h2 className="text-4xl font-bold leading-[1.05] font-serif tracking-tight drop-shadow-xl text-white">
                                        {item.title}
                                    </h2>
                                    <p className="text-white/80 text-sm leading-relaxed line-clamp-3 font-medium opacity-90">
                                        {item.description}
                                    </p>
                                </motion.div>

                                {/* Action Footer */}
                                <div className="flex items-center justify-between mt-auto pt-4 relative z-20">
                                    <div className="flex gap-5">
                                        <button
                                            onClick={() => toggleLike(item.id)}
                                            className="transition-transform active:scale-75 hover:scale-110"
                                        >
                                            <Heart
                                                size={24}
                                                strokeWidth={1.5}
                                                className={`transition-colors duration-300 ${likedItems.has(item.id) ? 'fill-red-500 text-red-500' : 'text-white/80 hover:text-white'}`}
                                            />
                                        </button>
                                        <button
                                            onClick={() => toggleSave(item.id)}
                                            className="transition-transform active:scale-75 hover:scale-110"
                                        >
                                            <Bookmark
                                                size={24}
                                                strokeWidth={1.5}
                                                className={`transition-colors duration-300 ${isSaved(item.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/80 hover:text-white'}`}
                                            />
                                        </button>
                                    </div>
                                    <Link href={`/discover/${item.slug}`} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform">
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* --- MOBILE VIEW (Vertical Snap Feed) --- */}
            <div className="md:hidden fixed inset-0 z-50 bg-[#000000] snap-y snap-mandatory overflow-y-scroll h-[100dvh] pt-20 pb-24">

                {/* Mobile Header (Full Navigation like Desktop) */}
                <nav className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
                    <div className="px-4 py-3 flex justify-between items-center">
                        {/* Left - Logo & Brand */}
                        <Link href="/" className="pointer-events-auto flex items-center gap-2 group">
                            <Image src="/aara-logo.png" alt="AARA" width={28} height={28} className="rounded-lg border border-white/10 group-hover:scale-105 transition-transform" />
                            <span className="text-[9px] font-black tracking-[0.3em] text-white/60 uppercase group-hover:text-white transition-colors">AARA</span>
                        </Link>

                        {/* Center - Discover Navigation */}
                        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center gap-0.5 px-1.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                            <Link href="/" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-all group">
                                <Home size={12} className="group-hover:text-blue-300 transition-colors" />
                                <span className="opacity-70 group-hover:opacity-100 hidden xs:inline">Home</span>
                            </Link>
                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] text-white bg-white/10">
                                <Compass size={12} className="text-indigo-400" />
                                <span className="hidden xs:inline">Discover</span>
                            </div>
                            <Link href="/discover/history" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-all group">
                                <Clock size={12} className="group-hover:text-indigo-400 transition-colors" />
                                <span className="opacity-70 group-hover:opacity-100 hidden xs:inline">History</span>
                            </Link>
                            <Link href="/discover/saved" className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] text-gray-400 hover:text-white transition-all group">
                                <Bookmark size={12} className="group-hover:text-yellow-400 transition-colors" />
                                <span className="opacity-70 group-hover:opacity-100 hidden xs:inline">Saved</span>
                            </Link>
                        </div>

                        {/* Right - Join (only for non-logged-in users) */}
                        <div className="pointer-events-auto">
                            {!user && (
                                <Link
                                    href="/auth/login"
                                    className="bg-white text-black px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] hover:bg-gray-100 transition-all active:scale-95 shadow-[0_10px_20px_rgba(255,255,255,0.1)]"
                                >
                                    Join
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Centered Cards */}
                {filteredItems.length === 0 ? (
                    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4">
                        <div className="text-center max-w-sm">
                            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                {searchQuery ? <Search size={32} className="text-indigo-400" /> : <Clock size={32} className="text-indigo-400" />}
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">
                                {searchQuery ? 'No Results' : 'All Caught Up!'}
                            </h2>
                            <p className="text-gray-400 text-sm mb-6">
                                {searchQuery ? `No topics match "${searchQuery}"` : "You've read all topics."}
                            </p>
                            <div className="flex flex-col gap-3">
                                {searchQuery ? (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium transition-colors text-sm"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <>
                                        <Link href="/discover/history" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium transition-colors text-sm">
                                            View History
                                        </Link>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('aara_discover_read_history')
                                                window.location.reload()
                                            }}
                                            className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors"
                                        >
                                            Start Fresh
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ) : filteredItems.map((item, index) => (
                    <div key={item.id} className="snap-center min-h-[100dvh] w-full flex items-center justify-center p-4 relative">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0.2 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: false, margin: "-20%" }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 25,
                                mass: 0.8
                            }}
                            className="w-full h-full rounded-[2rem] overflow-hidden flex flex-col relative origin-center will-change-transform"
                            style={{
                                background: `radial-gradient(circle at 50% 0%, ${item.color} 0%, #000000 120%)`,
                                boxShadow: `0 20px 60px -15px ${item.color}40`,
                            }}
                        >
                            {/* Dark gradient overlay for better text contrast */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none z-10" />
                            {/* Image Section (Top 52%) */}
                            <div className="h-[52%] w-full relative p-3 pb-0 z-20">
                                <div className="w-full h-full relative rounded-t-[1.5rem] rounded-b-[1rem] overflow-hidden shadow-2xl">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    {/* Subtle overlay on image to blend slightly */}
                                    {/* Click image to open details as well */}
                                    <Link href={`/discover/${item.slug}`} className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                                </div>
                            </div>

                            {/* Content Section (Bottom ~48%) */}
                            <div className="flex-1 px-6 pb-6 pt-4 flex flex-col justify-between text-white relative z-30">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="flex flex-col gap-3"
                                >
                                    {/* Source Pill */}
                                    <div className="flex items-center gap-2 mb-1 opacity-80">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 shadow-sm">
                                            {item.source === 'CNBC' ? <span className="font-bold font-serif italic text-xs">CNBC</span> : <span className="text-[10px] font-bold tracking-wider uppercase">{item.source}</span>}
                                        </div>
                                        <span className="text-[10px] font-medium tracking-wide">{item.time}</span>
                                    </div>

                                    <h2 className="text-4xl font-bold leading-[1.05] font-serif tracking-tight drop-shadow-xl text-white">
                                        {item.title}
                                    </h2>
                                    <p className="text-white/80 text-sm leading-relaxed line-clamp-3 font-medium opacity-90">
                                        {item.description}
                                    </p>
                                </motion.div>

                                {/* Action Footer */}
                                <div className="flex items-center justify-between mt-auto pt-4 relative z-20">
                                    <div className="flex gap-5">
                                        <button
                                            onClick={() => toggleLike(item.id)}
                                            className="transition-transform active:scale-75 hover:scale-110"
                                        >
                                            <Heart
                                                size={24}
                                                strokeWidth={1.5}
                                                className={`transition-colors duration-300 ${likedItems.has(item.id) ? 'fill-red-500 text-red-500' : 'text-white/80 hover:text-white'}`}
                                            />
                                        </button>
                                        <button
                                            onClick={() => toggleSave(item.id)}
                                            className="transition-transform active:scale-75 hover:scale-110"
                                        >
                                            <Bookmark
                                                size={24}
                                                strokeWidth={1.5}
                                                className={`transition-colors duration-300 ${isSaved(item.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white/80 hover:text-white'}`}
                                            />
                                        </button>
                                    </div>
                                    <Link href={`/discover/${item.slug}`} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform">
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </div >
    )
}
