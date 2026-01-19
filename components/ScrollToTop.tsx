'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ScrollToTop() {
    const pathname = usePathname()

    useEffect(() => {
        // Instant scroll to top on route change, bypassing smooth scroll if any
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        })
    }, [pathname])

    return null
}
