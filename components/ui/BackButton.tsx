'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface BackButtonProps {
    href?: string
    className?: string
}

export default function BackButton({ href, className = '' }: BackButtonProps) {
    const router = useRouter()

    const handleClick = () => {
        if (href) {
            // let Link handle navigation
            return
        }
        router.back()
    }

    const content = (
        <>
            <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
        </>
    )

    const baseClasses = `pointer-events-auto p-3 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all active:scale-95 shadow-2xl group ${className}`

    if (href) {
        return (
            <Link href={href} className={baseClasses}>
                {content}
            </Link>
        )
    }

    return (
        <button onClick={handleClick} className={baseClasses}>
            {content}
        </button>
    )
}
