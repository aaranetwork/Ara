'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Check, AlertCircle, ExternalLink } from 'lucide-react'
import Link from 'next/link'

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
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-indigo-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-4 py-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6">
                        <Upload size={16} />
                        Admin Upload
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Create Discover Topic</h1>
                    <p className="text-gray-400">Fill in all sections below and push live to /discover</p>
                </motion.div>

                {/* Success Message */}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl"
                    >
                        <div className="flex items-center gap-3 text-emerald-400 mb-4">
                            <Check size={24} />
                            <span className="font-bold text-lg">Topic Published!</span>
                        </div>
                        <p className="text-gray-300 mb-4">Your topic is now live at:</p>
                        <Link
                            href={success.url}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-indigo-400 transition-colors"
                        >
                            {success.url}
                            <ExternalLink size={16} />
                        </Link>
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400"
                    >
                        <AlertCircle size={20} />
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onSubmit={handleSubmit}
                    className="space-y-8"
                >
                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Image URL *
                        </label>
                        <input
                            type="url"
                            required
                            placeholder="https://example.com/image.jpg or /images/discover/image.png"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                        {formData.image && (
                            <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                                <img src={formData.image} alt="Preview" className="w-full h-48 object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Title (Question) *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Why does my anxiety spike at night?"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        />
                    </div>

                    {/* Category & Source Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Category *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-[#0a0a0a]">
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Source *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="Aara Health"
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-white/10 pt-6">
                        <h2 className="text-lg font-bold text-indigo-400 mb-2">Content Sections</h2>
                        <p className="text-sm text-gray-500">Fill in the detailed content for each section</p>
                    </div>

                    {/* Quick Answer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Quick Answer *
                        </label>
                        <p className="text-xs text-gray-500 mb-2">A brief, one-paragraph summary shown at the top</p>
                        <textarea
                            required
                            rows={3}
                            placeholder="Regular meditation practice reduces cortisol levels and activates the parasympathetic nervous system, helping you feel calmer within minutes."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        />
                    </div>

                    {/* Understanding the Details */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Understanding the Details *
                        </label>
                        <p className="text-xs text-gray-500 mb-2">Full explanation with multiple paragraphs (separate paragraphs with blank lines)</p>
                        <textarea
                            required
                            rows={8}
                            placeholder="The recent developments detailed in reports highlight a shifting paradigm...

Research indicates a significant correlation between these factors...

Experts recommend taking a proactive approach..."
                            value={formData.detailedAnswer}
                            onChange={(e) => setFormData({ ...formData, detailedAnswer: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        />
                    </div>

                    {/* Key Takeaways */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Key Takeaways *
                        </label>
                        <p className="text-xs text-gray-500 mb-2">3 bullet points (one per line, format: Title: Description)</p>
                        <textarea
                            required
                            rows={4}
                            placeholder="Immediate Relevance: This directly affects daily routines and mental well-being.
Evidence-Based: Supported by recent peer-reviewed research and clinical studies.
Actionable Insights: Practical steps you can implement today for better health outcomes."
                            value={formData.keyTakeaways}
                            onChange={(e) => setFormData({ ...formData, keyTakeaways: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        />
                    </div>

                    {/* Why This Matters */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Why This Matters *
                        </label>
                        <p className="text-xs text-gray-500 mb-2">Closing section explaining importance (separate paragraphs with blank lines)</p>
                        <textarea
                            required
                            rows={5}
                            placeholder="In today's complex health landscape, access to verified insights is critical...

The integration of modern research with practical application demonstrates..."
                            value={formData.whyMatters}
                            onChange={(e) => setFormData({ ...formData, whyMatters: e.target.value })}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Publishing...
                            </>
                        ) : (
                            <>
                                <Upload size={20} />
                                Push Live
                            </>
                        )}
                    </motion.button>
                </motion.form>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <Link
                        href="/discover"
                        className="text-gray-500 hover:text-indigo-400 text-sm transition-colors"
                    >
                        ← Back to Discover
                    </Link>
                </div>
            </div>
        </div>
    )
}
