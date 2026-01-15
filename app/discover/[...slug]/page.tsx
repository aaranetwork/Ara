'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ChevronLeft, Share2, Clock, Link as LinkIcon, Home, Compass, Bookmark, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { useReadHistory } from '@/contexts/ReadHistoryContext'
import { useAuth } from '@/hooks/useAuth'

// Utility to decode ID from slug (browser-compatible)
function decodeIdFromSlug(slugParam: string | string[]): string {
    try {
        const slugString = Array.isArray(slugParam) ? slugParam.join('/') : slugParam
        const parts = slugString.split('/')
        const titleWithId = parts[parts.length - 1]
        const encodedId = titleWithId.split('-').pop() || ''
        const base64 = encodedId.replace(/-/g, '+').replace(/_/g, '/')
        return atob(base64)
    } catch (error) {
        console.error('Error decoding slug:', error)
        return ''
    }
}

export default function DiscoverDetail() {
    const params = useParams()
    const [item, setItem] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [relatedItems, setRelatedItems] = useState<any[]>([])
    const { markAsRead, readItems } = useReadHistory()
    const { user } = useAuth()

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch('/api/discover')
                const data = await res.json()
                const slugArray = Array.isArray(params.slug) ? params.slug : [params.slug]
                const decodedId = decodeIdFromSlug(slugArray)
                const found = data.find((i: any) => i.id === decodedId)
                setItem(found)
                if (found) {
                    markAsRead(found.id)
                }
                setRelatedItems(data.filter((i: any) => i.id !== decodedId).slice(0, 4))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchItem()
    }, [params.slug, markAsRead])

    if (loading) return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        </div>
    )

    if (!item) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Item not found</div>

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-hidden relative">

            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            {/* Desktop Header */}
            <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image src="/aara-logo.png" alt="AARA" width={32} height={32} className="rounded-lg border border-white/10 group-hover:scale-105 transition-transform" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-white/60 uppercase group-hover:text-white transition-colors">AARA</span>
                    </Link>

                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                        <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all group">
                            <Home size={14} className="group-hover:text-blue-300 transition-colors" />
                            <span className="opacity-70 group-hover:opacity-100">Home</span>
                        </Link>
                        <Link href="/discover" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-white bg-white/10">
                            <Compass size={14} className="text-indigo-400" />
                            <span>Discover</span>
                        </Link>
                        <Link href="/discover/history" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all group">
                            <Clock size={14} className="group-hover:text-indigo-400 transition-colors" />
                            <span className="opacity-70 group-hover:opacity-100">History</span>
                        </Link>
                        <Link href="/discover/saved" className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all group">
                            <Bookmark size={14} className="group-hover:text-yellow-400 transition-colors" />
                            <span className="opacity-70 group-hover:opacity-100">Saved</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
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

            {/* Mobile Nav */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <Link href="/discover" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                    <ChevronLeft size={20} />
                </Link>
                <span className="text-sm font-bold tracking-widest uppercase text-white/70">Topic</span>
                <div className="w-10" />
            </div>

            <main className="pt-24 pb-32 px-4 md:px-8 max-w-[900px] mx-auto min-h-screen relative z-10">

                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-6 text-sm text-gray-500">
                        <Link href="/discover" className="hover:text-indigo-400 transition-colors">Discover</Link>
                        <span>/</span>
                        <span className="text-gray-300">{item.category || "Health"}</span>
                    </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                >
                    <img src={item.image} alt={item.title} className="w-full h-[350px] md:h-[450px] object-cover" />
                </motion.div>

                {/* Question Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h1 className="text-3xl md:text-5xl font-serif font-bold leading-[1.1] mb-6 text-white tracking-tight">
                        {item.title}
                    </h1>

                    {/* Meta Info & Actions */}
                    <div className="flex flex-wrap items-center gap-4 mb-10 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                            <Clock size={14} />
                            <span>{item.time || 'Just now'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <span className="text-gray-600">Source:</span>
                            <span className="font-medium text-gray-300">{item.source}</span>
                        </div>
                        <div className="flex items-center gap-2 ml-auto">
                            <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-colors" title="Copy Link">
                                <LinkIcon size={18} />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-colors" title="Share">
                                <Share2 size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Q&A Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-12"
                >
                    {/* Quick Answer */}
                    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-2xl p-6 md:p-8">
                        <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                            Quick Answer
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-100 leading-relaxed font-serif">
                            {item.description}
                        </p>
                    </div>

                    {/* Detailed Explanation */}
                    <div className="pt-8 border-t border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1 h-6 bg-indigo-500 rounded-full" />
                            Understanding the Details
                        </h2>
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
                            {item.detailedAnswer ? (
                                item.detailedAnswer.split('\n\n').map((para: string, i: number) => (
                                    <p key={i}>{para}</p>
                                ))
                            ) : (
                                <>
                                    <p>
                                        The recent developments detailed in reports from <strong>{item.source}</strong> highlight a shifting paradigm in how we approach this specific health topic. This is not merely a temporary change, but represents a fundamental shift in understanding and best practices.
                                    </p>
                                    <p>
                                        Research indicates a significant correlation between these factors and overall well-being. Medical professionals emphasize that understanding these connections is crucial for making informed decisions about your health and lifestyle.
                                    </p>
                                    <p>
                                        Experts recommend taking a proactive approach rather than waiting for symptoms to appear. Early awareness and intervention can lead to significantly better outcomes and improved quality of life.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Key Takeaways */}
                    <div className="pt-8 border-t border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1 h-6 bg-green-500 rounded-full" />
                            Key Takeaways
                        </h2>
                        <ul className="space-y-4">
                            {item.keyTakeaways ? (
                                item.keyTakeaways.split('\n').filter((line: string) => line.trim()).map((takeaway: string, i: number) => {
                                    const [title, ...descParts] = takeaway.split(':')
                                    const desc = descParts.join(':').trim()
                                    return (
                                        <li key={i} className="flex gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                                                <span className="text-green-400 font-bold text-sm">{i + 1}</span>
                                            </div>
                                            <div>
                                                <strong className="text-white block mb-1">{title}</strong>
                                                <span className="text-gray-400 text-sm">{desc}</span>
                                            </div>
                                        </li>
                                    )
                                })
                            ) : (
                                <>
                                    <li className="flex gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                                            <span className="text-green-400 font-bold text-sm">1</span>
                                        </div>
                                        <div>
                                            <strong className="text-white block mb-1">Immediate Relevance</strong>
                                            <span className="text-gray-400 text-sm">This directly affects daily routines and mental well-being for many individuals.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                                            <span className="text-green-400 font-bold text-sm">2</span>
                                        </div>
                                        <div>
                                            <strong className="text-white block mb-1">Evidence-Based</strong>
                                            <span className="text-gray-400 text-sm">Supported by recent peer-reviewed research and clinical studies.</span>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
                                        <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center shrink-0">
                                            <span className="text-green-400 font-bold text-sm">3</span>
                                        </div>
                                        <div>
                                            <strong className="text-white block mb-1">Actionable Insights</strong>
                                            <span className="text-gray-400 text-sm">Practical steps you can implement today for better health outcomes.</span>
                                        </div>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Why This Matters */}
                    <div className="pt-8 border-t border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-1 h-6 bg-amber-500 rounded-full" />
                            Why This Matters
                        </h2>
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
                            {item.whyMatters ? (
                                item.whyMatters.split('\n\n').map((para: string, i: number) => (
                                    <p key={i}>{para}</p>
                                ))
                            ) : (
                                <>
                                    <p>
                                        In today&apos;s complex health landscape, access to verified, evidence-based insights is more critical than ever. Understanding this topic empowers you to make informed decisions about your wellness journey.
                                    </p>
                                    <p>
                                        The integration of modern research with practical application demonstrates how knowledge can bridge gaps in traditional approaches to health and wellness. By staying informed, you&apos;re taking an active role in your own well-being.
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

            </main>

            {/* Related Topics Footer */}
            <div className="border-t border-white/5 bg-[#0a0a0d] py-20 px-4 md:px-8">
                <div className="max-w-[900px] mx-auto">
                    <h2 className="text-2xl font-bold font-serif text-white mb-8">Related Topics</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {relatedItems.map((relItem) => (
                            <Link key={relItem.id} href={`/discover/${relItem.slug}`} className="group block">
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300">
                                    <div className="aspect-[16/9] relative overflow-hidden">
                                        <img src={relItem.image} alt={relItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                                    </div>
                                    <div className="p-6">
                                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 block">{relItem.category || "Health"}</span>
                                        <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">{relItem.title}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}
