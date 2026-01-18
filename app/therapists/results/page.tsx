'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDown, ChevronUp, X, Calendar,
    BookOpen, Users, Heart, Sparkles, ArrowRight
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'

interface Therapist {
    id: string
    name: string
    title: string
    experienceShort: string
    focusAreas: string[]
    whyMatch: string
    about: string
    howWork: {
        listeningStyle: string
        sessionStructure: string
        bestFor: string
    }
    credentials: string[]
    image: string
}

const therapists: Therapist[] = [
    {
        id: '1',
        name: 'Dr. Sarah Mitchell',
        title: 'Clinical Psychologist',
        experienceShort: '12 yrs',
        focusAreas: ['Anxiety', 'Stress', 'Self-confidence'],
        whyMatch: 'Often works with people feeling overwhelmed and self-doubting.',
        about: 'I focus on creating a space where you feel genuinely heard. My approach isn\'t about clinical checklists; it\'s about understanding the unique thread of your experience and helping you find your own footing again.',
        howWork: {
            listeningStyle: 'Active and reflective. I focus on the "why" behind the feelings, not just the "what".',
            sessionStructure: 'Collaborative. We usually start with what\'s most present for you and move towards practical insights.',
            bestFor: 'Individuals navigating major life transitions or feeling a loss of self.'
        },
        credentials: [
            'Ph.D. in Clinical Psychology, NYU',
            'Licensed in NY and CA',
            'Certified Trauma-Informed Practitioner'
        ],
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop'
    },
    {
        id: '2',
        name: 'Dr. Michael Chen',
        title: 'Senior Counselor',
        experienceShort: '15 yrs',
        focusAreas: ['Focus', 'Career Stress', 'Sleep'],
        whyMatch: 'Experienced in helping high-pressure professionals find balance.',
        about: 'Mental health is part of your overall performance and well-being. I work with people who are driven but find themselves hitting walls of burnout or persistent fatigue.',
        howWork: {
            listeningStyle: 'Direct and analytical. I help you spot patterns you might be missing.',
            sessionStructure: 'Goal-oriented. We identify specific roadblocks and build strategies to clear them.',
            bestFor: 'Professionals and students dealing with burnout and focus issues.'
        },
        credentials: [
            'M.A. in Counseling Psychology, Stanford',
            'Board Certified Counselor',
            'Somatic Experiencing Specialist'
        ],
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&h=200&auto=format&fit=crop'
    }
]

export default function TherapistResultsPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
    const [isCredentialsOpen, setIsCredentialsOpen] = useState(false)

    if (loading) return null
    if (!user) { router.push('/auth/login'); return null }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 25 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    }

    return (
        <div className="min-h-screen text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
            <Navbar />

            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto pt-28 pb-40 px-6">

                {/* Header Section */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-20 text-center"
                >
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-white/60">Curated Matches</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-medium mb-6 tracking-tight text-white">
                        Your Recommended <span className="italic text-indigo-300">Guides</span>
                    </h1>
                    <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                        Based on your resonance, we've selected these practitioners who align with your current journey and objectives.
                    </p>
                </motion.header>

                {/* Therapist Cards List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {therapists.map((therapist) => (
                        <motion.div
                            key={therapist.id}
                            variants={itemVariants}
                            whileHover={{ y: -4 }}
                            className="relative group block"
                        >
                            {/* Card Content */}
                            <div className="relative z-10 p-8 flex flex-col md:flex-row gap-8 items-start bg-[#030305]/60 backdrop-blur-xl border border-white/5 rounded-[32px] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-500 shadow-2xl">

                                {/* Photo Container */}
                                <div className="relative shrink-0 w-full md:w-auto flex justify-center md:block">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[24px] overflow-hidden bg-white/5 relative shadow-lg">
                                        <Image src={therapist.image} alt={therapist.name} fill className="object-cover" />
                                    </div>
                                    <div className="absolute bottom-2 right-2 md:-bottom-2 md:-right-2 w-6 h-6 bg-emerald-500 border-4 border-[#0e0e12] rounded-full shadow-lg" />
                                </div>

                                {/* Information Layer */}
                                <div className="flex-1 space-y-6 text-center md:text-left">
                                    <div>
                                        <h3 className="text-3xl font-serif font-medium mb-2 tracking-tight text-white">{therapist.name}</h3>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                                            <span className="text-xs font-bold text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/5">{therapist.title}</span>
                                            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/10">{therapist.experienceShort} EXPERIENCE</span>
                                        </div>
                                    </div>

                                    {/* Focus Area Tags */}
                                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                        {therapist.focusAreas.map(area => (
                                            <span key={area} className="px-3 py-1.5 bg-white/[0.02] border border-white/5 rounded-lg text-[10px] font-bold text-white/60 tracking-wider uppercase">
                                                {area}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Why This Match */}
                                    <div className="inline-flex gap-4 p-5 rounded-2xl bg-indigo-500/[0.03] border border-indigo-500/10 text-left">
                                        <Sparkles size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                                        <p className="text-indigo-100/80 text-sm leading-relaxed font-light italic">
                                            &quot;{therapist.whyMatch}&quot;
                                        </p>
                                    </div>
                                </div>

                                {/* Actions Layer */}
                                <div className="flex flex-col gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5 md:pl-8 md:border-l border-white/5 justify-center">
                                    <button
                                        onClick={() => setSelectedTherapist(therapist)}
                                        className="w-full px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] text-white rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap border border-white/5 hover:border-white/10"
                                    >
                                        View Profile
                                    </button>
                                    <button className="w-full px-8 py-4 bg-white text-black rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl shadow-white/5 whitespace-nowrap">
                                        Select Choice
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </main>

            {/* Profile Modal */}
            <AnimatePresence>
                {selectedTherapist && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#030305]/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => { setSelectedTherapist(null); setIsCredentialsOpen(false); }}
                            className="absolute inset-0"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative z-10 w-full max-w-3xl bg-[#08080c] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                        >
                            <button
                                onClick={() => { setSelectedTherapist(null); setIsCredentialsOpen(false); }}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all z-20 hover:bg-white/10 border border-white/5"
                            >
                                <X size={20} />
                            </button>

                            <div className="overflow-y-auto p-8 md:p-12 custom-scrollbar">

                                {/* A. Overview */}
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[24px] overflow-hidden bg-white/5 shrink-0 shadow-2xl relative">
                                        <Image src={selectedTherapist.image} alt={selectedTherapist.name} fill className="object-cover" />
                                    </div>
                                    <div className="text-center md:text-left pt-2">
                                        <h2 className="text-3xl md:text-4xl font-serif font-medium mb-3 text-white">{selectedTherapist.name}</h2>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                                            <span className="px-3 py-1 bg-indigo-500/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-indigo-500/10">Clinical Specialist</span>
                                            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white/40 border border-white/5">Verified Guide</span>
                                        </div>
                                    </div>
                                </div>

                                <section className="mb-12">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-4">About</h4>
                                    <p className="text-white/80 text-lg leading-relaxed font-light">
                                        {selectedTherapist.about}
                                    </p>
                                </section>

                                {/* B. How they work */}
                                <section className="mb-12 space-y-8">
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30">Methodology</h4>
                                        <div className="flex-1 h-px bg-white/5" />
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-400">
                                                <Heart size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Listening style</p>
                                                <p className="text-white/90 text-sm font-medium leading-relaxed">{selectedTherapist.howWork.listeningStyle}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-400">
                                                <BookOpen size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Session structure</p>
                                                <p className="text-white/90 text-sm font-medium leading-relaxed">{selectedTherapist.howWork.sessionStructure}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0 text-indigo-400">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Best Match For</p>
                                                <p className="text-white/90 text-sm font-medium leading-relaxed">{selectedTherapist.howWork.bestFor}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* C. Experience */}
                                <section className="mb-12 border-t border-white/5 pt-6">
                                    <button
                                        onClick={() => setIsCredentialsOpen(!isCredentialsOpen)}
                                        className="w-full flex items-center justify-between group py-2"
                                    >
                                        <span className="text-sm font-bold tracking-wide text-white/40 group-hover:text-white transition-colors">Experience & Credentials</span>
                                        <div className="text-white/40 group-hover:text-white transition-colors">
                                            {isCredentialsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {isCredentialsOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <ul className="py-6 space-y-4">
                                                    {selectedTherapist.credentials.map(c => (
                                                        <li key={c} className="text-white/70 flex items-start gap-4 text-sm font-medium leading-relaxed">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                                                            {c}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </section>

                                {/* D. Availability */}
                                <section className="mb-8 border-t border-white/5 pt-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Calendar size={18} className="text-indigo-400" />
                                        <h4 className="text-sm font-bold tracking-wide text-white">Availability</h4>
                                    </div>
                                    <div className="px-8 py-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                                        <p className="text-white/80 font-medium text-sm">
                                            Next consultation: <span className="text-white font-bold">Thursday, Jan 2nd</span>
                                        </p>
                                    </div>
                                </section>

                                {/* E. CTA */}
                                <div className="pt-2">
                                    <button className="w-full py-5 bg-white text-black rounded-full font-bold text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-3">
                                        Start Your Journey <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
