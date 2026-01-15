'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronLeft, Share2, Clock, Link as LinkIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'

export default function DiscoverDetail() {
    const params = useParams()
    const [item, setItem] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [relatedItems, setRelatedItems] = useState<any[]>([])

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await fetch('/api/discover')
                const data = await res.json()
                const found = data.find((i: any) => i.id === params.id)
                setItem(found)

                // Mock related items (excluding current one)
                setRelatedItems(data.filter((i: any) => i.id !== params.id).slice(0, 4))
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchItem()
    }, [params.id])

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

            {/* Background Ambience (Aara Brand) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="hidden md:block relative z-50">
                <Navbar />
            </div>

            {/* Mobile Nav Overlay */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
                <Link href="/discover" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white active:scale-90 transition-transform">
                    <ChevronLeft size={20} />
                </Link>
                <span className="text-sm font-bold tracking-widest uppercase text-white/70">Health Insight</span>
                <div className="w-10" /> {/* Spacer */}
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
                    className="mb-12 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                >
                    <img src={item.image} alt={item.title} className="w-full h-[400px] object-cover" />
                </motion.div>

                {/* Question Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[1.1] mb-6 text-white tracking-tight">
                        {item.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-12 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-2 text-indigo-400 text-sm font-medium bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                            <Clock size={14} /> Updated 2 hours ago
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
                    {/* Short Answer */}
                    <div>
                        <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Quick Answer</h2>
                        <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-serif">
                            {item.description}
                        </p>
                    </div>

                    {/* Detailed Explanation */}
                    <div className="pt-8 border-t border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Understanding the Details</h2>
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
                            <p>
                                The recent developments detailed in reports from <strong>{item.source}</strong> highlight a shifting paradigm in how we approach this specific health topic. This is not merely a temporary change, but represents a fundamental shift in understanding and best practices.
                            </p>
                            <p>
                                Research indicates a significant correlation between these factors and overall well-being. Medical professionals emphasize that understanding these connections is crucial for making informed decisions about your health and lifestyle.
                            </p>
                            <p>
                                Experts recommend taking a proactive approach rather than waiting for symptoms to appear. Early awareness and intervention can lead to significantly better outcomes and improved quality of life.
                            </p>
                        </div>
                    </div>

                    {/* Key Takeaways */}
                    <div className="pt-8 border-t border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Key Takeaways</h2>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                <div>
                                    <strong className="text-white">Immediate Relevance:</strong>
                                    <span className="text-gray-400"> This directly affects daily routines and mental well-being for many individuals.</span>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                <div>
                                    <strong className="text-white">Evidence-Based:</strong>
                                    <span className="text-gray-400"> Supported by recent peer-reviewed research and clinical studies.</span>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                <div>
                                    <strong className="text-white">Actionable Insights:</strong>
                                    <span className="text-gray-400"> Practical steps you can implement today for better health outcomes.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Why This Matters */}
                    <div className="pt-8 border-t border-white/10">
                        <h2 className="text-2xl font-bold text-white mb-6">Why This Matters</h2>
                        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
                            <p>
                                In today&apos;s complex health landscape, access to verified, evidence-based insights is more critical than ever. Understanding this topic empowers you to make informed decisions about your wellness journey.
                            </p>
                            <p>
                                The integration of modern research with practical application demonstrates how knowledge can bridge gaps in traditional approaches to health and wellness. By staying informed, you&apos;re taking an active role in your own well-being.
                            </p>
                        </div>
                    </div>
                </motion.div>

            </main>

            {/* Discover More Footer */}
            <div className="border-t border-white/5 bg-[#0a0a0d] py-20 px-4 md:px-8">
                <div className="max-w-[900px] mx-auto">
                    <h2 className="text-2xl font-bold font-serif text-white mb-8">Related Topics</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {relatedItems.map((relItem) => (
                            <Link key={relItem.id} href={`/discover/${relItem.id}`} className="group block">
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
