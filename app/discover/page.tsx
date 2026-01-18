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
        <div className="min-h-screen text-white selection:bg-indigo-500/30 overflow-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Desktop Header (Floating Nav) */}
            <nav className="hidden md:block fixed top-0 left-0 right-0 z-[60] pointer-events-none">
                <div className="px-8 py-6 flex justify-between items-center">
                    {/* Left - Logo & Brand */}
                    <Link href="/" className="pointer-events-auto flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-white/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <Image src="/aara-logo.png" alt="AARA" width={40} height={40} className="relative rounded-xl shadow-2xl border border-white/10" />
                        </div>
                        <span className="font-serif text-lg tracking-wide text-white/90 group-hover:text-white transition-colors">AARA</span>
                    </Link>

                    {/* Center - Discover Navigation */}
                    <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto flex items-center p-1.5 rounded-full bg-white/[0.03] backdrop-blur-2xl border border-white/5 shadow-2xl">
                        <Link href="/" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all group">
                            <Home size={14} className="group-hover:text-white transition-colors" />
                            <span className="opacity-0 group-hover:opacity-100 hidden lg:inline max-w-0 group-hover:max-w-xs transition-all duration-300 overflow-hidden whitespace-nowrap">Home</span>
                        </Link>
                        <div className="flex items-center gap-2 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-white bg-white/10 border border-white/5 shadow-inner">
                            <Compass size={14} className="text-indigo-300" />
                            <span>Discover</span>
                        </div>
                        <Link href="/discover/history" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all group">
                            <Clock size={14} className="group-hover:text-white transition-colors" />
                        </Link>
                        <Link href="/discover/saved" className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all group">
                            <Bookmark size={14} className="group-hover:text-white transition-colors" />
                        </Link>
                    </div>

                    {/* Right - Search */}
                    <div className="pointer-events-auto flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search insights..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-6 py-3 w-48 focus:w-72 bg-white/[0.03] hover:bg-white/[0.06] backdrop-blur-xl border border-white/5 rounded-full text-sm font-medium text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white/10 transition-all font-serif"
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- DESKTOP VIEW (Full Screen Snap Scroll) --- */}
            <div className="hidden md:block fixed inset-0 z-50 bg-black/40 backdrop-blur-3xl snap-y snap-mandatory overflow-y-scroll h-[100dvh] scrollbar-hide">

                {/* Desktop Header (Floating Nav) */}


                {/* Centered Cards with Snap */}
                {filteredItems.length === 0 ? (
                    <div className="h-[100dvh] w-full flex items-center justify-center p-8">
                        <div className="text-center max-w-md">
                            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center backdrop-blur-xl">
                                {searchQuery ? <Search size={40} className="text-white/50" /> : <Clock size={40} className="text-white/50" />}
                            </div>
                            <h2 className="text-4xl font-serif text-white mb-4">
                                {searchQuery ? 'No Results Found' : 'All Caught Up'}
                            </h2>
                            <p className="text-white/60 mb-10 text-lg font-light leading-relaxed">
                                {searchQuery
                                    ? `We couldn't find anything matching "${searchQuery}".`
                                    : "You've explored all current insights. Return later for fresh perspectives."
                                }
                            </p>
                            <div className="flex flex-col gap-4">
                                {searchQuery ? (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-medium transition-colors"
                                    >
                                        Clear Search
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('aara_discover_read_history')
                                            window.location.reload()
                                        }}
                                        className="px-8 py-4 bg-white/[0.05] border border-white/5 hover:bg-white/10 rounded-xl text-white font-medium transition-colors backdrop-blur-lg"
                                    >
                                        Refresh Feed
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : filteredItems.map((item, index) => (
                    <div key={item.id} className="snap-center h-[100dvh] w-full flex items-center justify-center p-8 relative">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: false, amount: 0.5 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            className="w-full max-w-5xl h-[85vh] grid grid-cols-1 md:grid-cols-2 rounded-[3rem] overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl relative"
                        >
                            {/* Left: Image (Desktop) / Top: Image (Mobile) */}
                            <div className="relative h-1/2 md:h-full overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    priority={index === 0}
                                    className="object-cover transition-transform duration-[20s] hover:scale-110 ease-linear"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>

                            {/* Right: Content (Desktop) / Bottom: Content (Mobile) */}
                            <div className="relative h-1/2 md:h-full p-8 md:p-16 flex flex-col justify-center bg-black/40 backdrop-blur-3xl border-l border-white/5">
                                <div className="mb-auto">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="px-4 py-1.5 bg-white/5 rounded-full border border-white/5 flex items-center gap-2">
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-white/80">{item.source}</span>
                                        </div>
                                        <span className="text-[10px] font-medium tracking-wide text-white/50">{item.time}</span>
                                    </div>

                                    <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-[1.1]">
                                        {item.title}
                                    </h2>
                                    <p className="text-white/50 text-base md:text-lg leading-relaxed line-clamp-4 font-light">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-8">
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => toggleLike(item.id)}
                                            className="group p-3 hover:bg-white/5 rounded-full transition-colors"
                                        >
                                            <Heart
                                                size={24}
                                                strokeWidth={1.5}
                                                className={`transition-all duration-300 ${likedItems.has(item.id) ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white/40 group-hover:text-white'}`}
                                            />
                                        </button>
                                        <button
                                            onClick={() => toggleSave(item.id)}
                                            className="group p-3 hover:bg-white/5 rounded-full transition-colors"
                                        >
                                            <Bookmark
                                                size={24}
                                                strokeWidth={1.5}
                                                className={`transition-all duration-300 ${isSaved(item.id) ? 'fill-amber-400 text-amber-400 scale-110' : 'text-white/40 group-hover:text-white'}`}
                                            />
                                        </button>
                                    </div>
                                    <Link href={`/discover/${item.slug}`} className="flex items-center gap-3 px-6 py-3 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">
                                        Read Article <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* --- MOBILE VIEW --- */}
            <div className="md:hidden fixed inset-0 z-50 bg-black snap-y snap-mandatory overflow-y-scroll h-[100dvh]">
                {/* Mobile Header */}
                <nav className="fixed top-0 left-0 right-0 z-[60] p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                    <Link href="/" className="pointer-events-auto">
                        <Image src="/aara-logo.png" alt="AARA" width={32} height={32} className="rounded-lg shadow-lg" />
                    </Link>
                    <div className="pointer-events-auto bg-black/30 backdrop-blur-xl border border-white/10 rounded-full px-1 py-1 flex gap-1">
                        <Link href="/" className="p-2 text-white/40 hover:text-white"><Home size={16} /></Link>
                        <div className="p-2 bg-white/10 rounded-full text-white"><Compass size={16} /></div>
                    </div>
                </nav>

                {filteredItems.map((item, index) => (
                    <div key={item.id} className="snap-center h-[100dvh] w-full relative flex items-center justify-center p-4">

                        {/* Card Container - User Provided Design */}
                        <div
                            className="w-full h-full max-h-[85vh] rounded-[2rem] overflow-hidden flex flex-col relative origin-center will-change-transform bg-black border border-white/5"
                            style={{
                                background: 'radial-gradient(circle at 50% 0%, rgb(12, 74, 110) 0%, rgb(0, 0, 0) 120%)',
                                boxShadow: 'rgba(12, 74, 110, 0.25) 0px 20px 60px -15px'
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none z-10" />

                            {/* Top Image Section */}
                            <div className="h-[52%] w-full relative p-3 pb-0 z-20">
                                <div className="w-full h-full relative rounded-t-[1.5rem] rounded-b-[1rem] overflow-hidden shadow-2xl">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        priority={index === 0}
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                    <Link href={`/discover/${item.slug}`} className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                                </div>
                            </div>

                            {/* Bottom Content Section */}
                            <div className="flex-1 px-6 pb-6 pt-4 flex flex-col justify-between text-white relative z-30">
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2 mb-1 opacity-80">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2 shadow-sm">
                                            <span className="text-[10px] font-bold tracking-wider uppercase">
                                                {item.source || 'Aara Health'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-medium tracking-wide">
                                            {item.time || 'Just now'}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-bold leading-[1.05] font-serif tracking-tight drop-shadow-xl text-white">
                                        {item.title}
                                    </h2>
                                    <p className="text-white/80 text-sm leading-relaxed line-clamp-3 font-medium opacity-90">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 relative z-20">
                                    <div className="flex gap-5">
                                        <button
                                            onClick={() => toggleLike(item.id)}
                                            className="transition-transform active:scale-75 hover:scale-110"
                                        >
                                            <Heart
                                                size={24}
                                                strokeWidth={1.5}
                                                className={`transition-colors duration-300 ${likedItems.has(item.id) ? 'fill-rose-500 text-rose-500' : 'text-white/80 hover:text-white'}`}
                                            />
                                        </button>
                                        <button
                                            onClick={() => toggleSave(item.id)}
                                            className="transition-transform active:scale-75 hover:scale-110"
                                        >
                                            <Bookmark
                                                size={24}
                                                strokeWidth={1.5}
                                                className={`transition-colors duration-300 ${isSaved(item.id) ? 'fill-amber-400 text-amber-400' : 'text-white/80 hover:text-white'}`}
                                            />
                                        </button>
                                    </div>
                                    <Link
                                        href={`/discover/${item.slug}`}
                                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform"
                                    >
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}
