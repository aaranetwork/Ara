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
        <div className="min-h-screen bg-[#08080c] text-white font-sans selection:bg-blue-600/30 overflow-x-hidden">
            <Navbar />

            <main className="relative z-10 max-w-4xl mx-auto pt-20 pb-40 px-6">

                {/* Header Section */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16 text-center"
                >
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Recommended Therapists</h1>
                    <p className="text-gray-400 text-base max-w-xl mx-auto leading-relaxed">
                        Based on what you shared, these practitioners align with your personal objectives and current headspace.
                    </p>
                </motion.header>

                {/* Therapist Cards List */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                >
                    {therapists.map((therapist) => (
                        <motion.div
                            key={therapist.id}
                            variants={itemVariants}
                            whileHover={{ y: -4 }}
                            className="relative group block"
                        >
                            {/* Card Content */}
                            <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start bg-[#0e0e12] rounded-3xl shadow-xl hover:bg-[#111116] transition-all">

                                {/* Photo Container */}
                                <div className="relative shrink-0">
                                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-white/5 relative">
                                        <Image src={therapist.image} alt={therapist.name} fill className="object-cover" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-[#0e0e12] rounded-full" />
                                </div>

                                {/* Information Layer */}
                                <div className="flex-1 space-y-5">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1 tracking-tight text-white">{therapist.name}</h3>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                                            <span>{therapist.title}</span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-blue-400">{therapist.experienceShort} PRACTICE</span>
                                        </div>
                                    </div>

                                    {/* Focus Area Tags */}
                                    <div className="flex flex-wrap gap-2">
                                        {therapist.focusAreas.map(area => (
                                            <span key={area} className="px-3 py-1 bg-white/5 rounded-lg text-xs font-bold text-gray-400 tracking-wide">
                                                {area}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Why This Match */}
                                    <div className="flex gap-3 p-4 rounded-xl bg-blue-500/5">
                                        <Sparkles size={16} className="text-blue-400 shrink-0 mt-0.5" />
                                        <p className="text-gray-300 text-sm leading-relaxed font-medium">
                                            &quot;{therapist.whyMatch}&quot;
                                        </p>
                                    </div>
                                </div>

                                {/* Actions Layer */}
                                <div className="flex flex-col gap-3 w-full md:w-auto pt-2 md:pt-0">
                                    <button
                                        onClick={() => setSelectedTherapist(therapist)}
                                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap"
                                    >
                                        View Profile
                                    </button>
                                    <button className="px-6 py-3 bg-white text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-200 transition-all shadow-lg whitespace-nowrap">
                                        Select
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
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
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
                            className="relative z-10 w-full max-w-2xl bg-[#111116] rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                        >
                            <button
                                onClick={() => { setSelectedTherapist(null); setIsCredentialsOpen(false); }}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-all z-20 hover:bg-white/10"
                            >
                                <X size={20} />
                            </button>

                            <div className="overflow-y-auto p-8 md:p-10 custom-scrollbar">

                                {/* A. Overview */}
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                                    <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 shrink-0 shadow-xl relative">
                                        <Image src={selectedTherapist.image} alt={selectedTherapist.name} fill className="object-cover" />
                                    </div>
                                    <div className="text-center md:text-left pt-2">
                                        <h2 className="text-3xl font-bold mb-2 text-white">{selectedTherapist.name}</h2>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                                            <span className="px-3 py-1 bg-blue-500/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-blue-400">Clinical Specialist</span>
                                            <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-400">Verified Guide</span>
                                        </div>
                                    </div>
                                </div>

                                <section className="mb-10">
                                    <p className="text-gray-300 text-lg leading-relaxed font-medium">
                                        {selectedTherapist.about}
                                    </p>
                                </section>

                                {/* B. How they work */}
                                <section className="mb-10 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Methodology</h4>
                                        <div className="flex-1 h-px bg-white/5" />
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="flex gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-blue-400">
                                                <Heart size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Listening style</p>
                                                <p className="text-gray-300 text-sm font-medium leading-relaxed">{selectedTherapist.howWork.listeningStyle}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-blue-400">
                                                <BookOpen size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Session structure</p>
                                                <p className="text-gray-300 text-sm font-medium leading-relaxed">{selectedTherapist.howWork.sessionStructure}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 text-blue-400">
                                                <Users size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Best Match For</p>
                                                <p className="text-gray-300 text-sm font-medium leading-relaxed">{selectedTherapist.howWork.bestFor}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* C. Experience */}
                                <section className="mb-10 border-t border-white/5 pt-6">
                                    <button
                                        onClick={() => setIsCredentialsOpen(!isCredentialsOpen)}
                                        className="w-full flex items-center justify-between group py-2"
                                    >
                                        <span className="text-sm font-bold tracking-wide text-gray-400 group-hover:text-white transition-colors">Experience & Credentials</span>
                                        <div className="text-gray-500 group-hover:text-white transition-colors">
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
                                                <ul className="py-4 space-y-3">
                                                    {selectedTherapist.credentials.map(c => (
                                                        <li key={c} className="text-gray-400 flex items-start gap-4 text-sm font-medium leading-relaxed">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 mt-1.5 shrink-0" />
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
                                    <div className="flex items-center gap-3 mb-4">
                                        <Calendar size={16} className="text-blue-400" />
                                        <h4 className="text-sm font-bold tracking-wide text-white">Availability</h4>
                                    </div>
                                    <div className="px-6 py-6 bg-white/5 rounded-2xl text-center">
                                        <p className="text-gray-300 font-medium text-sm">
                                            Next consultation: Thursday, Jan 2nd
                                        </p>
                                    </div>
                                </section>

                                {/* E. CTA */}
                                <div className="pt-2">
                                    <button className="w-full py-4 bg-white text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-gray-200 transition-all shadow-xl flex items-center justify-center gap-3">
                                        Start Your Journey <ArrowRight size={16} />
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
