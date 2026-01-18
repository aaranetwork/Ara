'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Check, AlertCircle, ExternalLink, Sparkles, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const categories = [
    'Anxiety',
    'Wellness',
    'Fitness',
    'Sleep',
    'Nutrition',
    'Psychology',
    'You'
]

export default function AdminUploadPage() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        detailedAnswer: '',
        keyTakeaways: '',
        whyMatters: '',
        image: '',
        category: 'Anxiety',
        source: 'Aara Health'
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState<{ url: string } | null>(null)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess(null)

        try {
            const res = await fetch('/api/discover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create topic')
            }

            setSuccess({ url: data.url })
            // Reset form
            setFormData({
                title: '',
                description: '',
                detailedAnswer: '',
                keyTakeaways: '',
                whyMatters: '',
                image: '',
                category: 'Anxiety',
                source: 'Aara Health'
            })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen text-white pt-32 pb-20 px-6">
            {/* Nav */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 bg-[#030305]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-3 text-white/60 hover:text-white transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
                            <LayoutDashboard size={16} />
                        </div>
                        <span className="text-sm font-medium">Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-2 opacity-50">
                        <Image src="/aara-logo.png" alt="AARA" width={24} height={24} className="rounded-md" />
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6">
                        <Sparkles size={12} />
                        <span>Admin Console</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Content Upload</h1>
                    <p className="text-white/40">Publish new insights to the Discover feed.</p>
                </motion.div>

                {/* Success Message */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[20px] backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3 text-emerald-400 mb-4">
                            <Check size={24} />
                            <span className="font-serif text-lg">Topic Published Successfully</span>
                        </div>
                        <p className="text-white/60 mb-4 text-sm">Your content is now live and accessible to users.</p>
                        <Link
                            href={success.url}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-emerald-400 text-sm font-medium transition-colors"
                        >
                            View Live Page
                            <ExternalLink size={14} />
                        </Link>
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 backdrop-blur-md"
                    >
                        <AlertCircle size={20} />
                        <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                )}

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="space-y-8 bg-[#0e0e12]/50 border border-white/5 p-8 md:p-10 rounded-[32px] backdrop-blur-sm"
                >
                    {/* Image URL */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">
                            Cover Image
                        </label>
                        <div className="relative group">
                            <input
                                type="url"
                                required
                                placeholder="https://example.com/image.jpg"
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all pl-10"
                            />
                            <Upload className="absolute left-3.5 top-3.5 text-white/20 group-focus-within:text-indigo-400 transition-colors" size={18} />
                        </div>

                        {formData.image && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="pt-2"
                            >
                                <div className="rounded-xl overflow-hidden border border-white/10 h-48 relative">
                                    <Image src={formData.image} alt="Preview" fill className="object-cover" unoptimized />
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">
                            Title (Question)
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g., Why does anxiety spike at night?"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all font-serif text-lg"
                        />
                    </div>

                    {/* Category & Source Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all appearance-none cursor-pointer"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="bg-[#1a1a20]">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                    ▼
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">
                                Source
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Aara Health"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                            />
                        </div>
                    </div>

                    <div className="h-px bg-white/5 my-8" />

                    {/* Quick Answer */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">
                                Quick Answer
                            </label>
                            <span className="text-[10px] text-white/20">Brief summary (displayed at top)</span>
                        </div>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none leading-relaxed"
                        />
                    </div>

                    {/* Understanding the Details */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">
                                Understanding the Details
                            </label>
                            <span className="text-[10px] text-white/20">Multi-paragraph deep dive</span>
                        </div>
                        <textarea
                            required
                            rows={8}
                            value={formData.detailedAnswer}
                            onChange={(e) => setFormData({ ...formData, detailedAnswer: e.target.value })}
                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none leading-relaxed"
                        />
                    </div>

                    {/* Key Takeaways */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">
                                Key Takeaways
                            </label>
                            <span className="text-[10px] text-white/20">3 Format: Title: Description</span>
                        </div>
                        <textarea
                            required
                            rows={4}
                            placeholder="Relevance: Why it matters...&#10;Science: The research says...&#10;Action: What to do..."
                            value={formData.keyTakeaways}
                            onChange={(e) => setFormData({ ...formData, keyTakeaways: e.target.value })}
                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none leading-relaxed font-mono text-sm"
                        />
                    </div>

                    {/* Why This Matters */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-white/40 ml-1">
                            Why This Matters
                        </label>
                        <textarea
                            required
                            rows={5}
                            value={formData.whyMatters}
                            onChange={(e) => setFormData({ ...formData, whyMatters: e.target.value })}
                            className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all resize-none leading-relaxed"
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-4 bg-white text-black rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-white/5"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                Push to Discover
                                <Upload size={16} />
                            </>
                        )}
                    </motion.button>
                </motion.form>

                {/* Footer */}
                <div className="mt-12 text-center pb-8">
                    <Link
                        href="/discover"
                        className="text-white/40 hover:text-white text-xs uppercase tracking-widest transition-colors"
                    >
                        Back to Feed
                    </Link>
                </div>
            </div>
        </div>
    )
}
