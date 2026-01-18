'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, X } from 'lucide-react'
import Image from 'next/image'

interface Video {
    id: string
    title: string
    description: string
    thumbnail: string
    url: string
    category: string
}

const VIDEOS: Video[] = [
    {
        id: '1',
        title: 'Emotional Decryption',
        description: 'How AARA processes complex signals into actionable insights.',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
        url: '#',
        category: 'Method'
    },
    {
        id: '2',
        title: 'User Experience',
        description: 'Walking through a 3-day clarity trial.',
        thumbnail: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=1000',
        url: '#',
        category: 'Trial'
    },
    {
        id: '3',
        title: 'The Science of AARA',
        description: 'Deep dive into our AI signal processing algorithms.',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010958384e?auto=format&fit=crop&q=80&w=1000',
        url: '#',
        category: 'AI'
    }
]

export default function VideoGallery() {
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

    return (
        <section className="py-32 px-fluid-2 relative">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20 px-4">
                    <div className="text-left">
                        <p className="text-[10px] font-black text-aara-accent uppercase tracking-[0.5em] mb-4">Exploration</p>
                        <h2 className="text-4xl md:text-6xl font-black text-white uppercase leading-none">Visual <br /><span className="text-white/30">Intelligence</span></h2>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-fluid-body text-white/30 max-w-xs leading-relaxed font-medium">
                            A visual guide to understanding how AARA transforms your digital footprint into clarity.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {VIDEOS.map((video, i) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="group relative cursor-pointer"
                            onClick={() => setSelectedVideo(video)}
                        >
                            <div className="aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/5 relative">
                                <Image
                                    src={video.thumbnail}
                                    alt={video.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:blur-sm"
                                />
                                <div className="absolute inset-0 bg-aara-dark/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center scale-90 group-hover:scale-100 transition-transform duration-500">
                                        <Play fill="currentColor" size={24} className="ml-1" />
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6">
                                    <span className="px-4 py-1.5 rounded-full glass-card text-[9px] font-black text-white/60 uppercase tracking-widest border-white/10 group-hover:border-aara-accent/30 transition-colors">
                                        {video.category}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-8 px-4">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-aara-accent transition-colors">{video.title}</h3>
                                <p className="text-sm text-white/30 leading-relaxed font-medium">{video.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-aara-dark/95 backdrop-blur-xl flex items-center justify-center p-6"
                        onClick={() => setSelectedVideo(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-6xl aspect-video glass-card overflow-hidden relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-8 right-8 z-10">
                                <button
                                    onClick={() => setSelectedVideo(null)}
                                    className="w-12 h-12 rounded-full glass-card border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="w-full h-full bg-black/60 flex items-center justify-center">
                                <div className="text-center">
                                    <Play size={64} className="text-aara-accent animate-pulse mx-auto mb-6" />
                                    <p className="text-[10px] font-black tracking-[0.5em] text-white/30 uppercase italic">Stream Simulation Active</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
