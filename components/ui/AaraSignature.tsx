import React from 'react'

type SignatureVariant = 'origin' | 'system' | 'process' | 'breakthrough' | 'truth' | 'community' | 'checkin' | 'reflect' | 'insights' | 'outcomes' | 'lock' | 'shield' | 'ai' | 'loop' | 'path' | 'arrow' | 'message'

interface AaraSignatureProps {
    variant?: SignatureVariant
    className?: string
}

export default function AaraSignature({ variant = 'origin', className = '' }: AaraSignatureProps) {
    // Base 4-point star for continuity
    const BaseStar = (
        <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    )

    // Core Sparkle (sharper, inner)
    const Core = (
        <path d="M12 6L13.5 10.5L18 12L13.5 13.5L12 18L10.5 13.5L6 12L10.5 10.5L12 6Z" fill="white" />
    )

    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {variant === 'origin' && (
                <>
                    {BaseStar}
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.5" />
                </>
            )}

            {variant === 'system' && (
                <>
                    {BaseStar}
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" strokeOpacity="0.5" />
                    <circle cx="12" cy="2" r="1.5" fill="currentColor" />
                    <circle cx="12" cy="22" r="1.5" fill="currentColor" />
                </>
            )}

            {variant === 'process' && (
                <>
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M2 12L9.5 9.5L12 2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M4 20L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M20 4L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {variant === 'breakthrough' && (
                <>
                    <path d="M12 4V10M12 14V20M4 12H10M14 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
                    <circle cx="12" cy="12" r="2" fill="white" />
                </>
            )}

            {variant === 'truth' && (
                <>
                    {BaseStar}
                    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
                    <path d="M12 5C15.866 5 19 8.13401 19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5Z" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" strokeOpacity="0.5" />
                </>
            )}

            {variant === 'checkin' && (
                <>
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" fillOpacity="0.2" />
                </>
            )}

            {variant === 'reflect' && (
                <>
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
                </>
            )}

            {variant === 'insights' && (
                <>
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" stroke="currentColor" strokeWidth="1" strokeOpacity="0.2" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
                    <path d="M12 15V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {variant === 'outcomes' && (
                <>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 18V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 14L12 10L16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}

            {variant === 'lock' && (
                <>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                </>
            )}

            {variant === 'shield' && (
                <>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {variant === 'ai' && (
                <>
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V10h-2V5.73A2 2 0 0 1 12 2z" fill="currentColor" />
                    <path d="M6 10a2 2 0 0 1 1.73-1H16.27A2 2 0 0 1 18 10v0c0 .74-.4 1.39-1 1.73v9.54c.6.34 1 .99 1 1.73v0a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v0c0-.74.4-1.39 1-1.73V11.73A2 2 0 0 1 6 10z" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="12" cy="15" r="2" stroke="currentColor" strokeWidth="1.5" />
                </>
            )}

            {variant === 'loop' && (
                <>
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 21v-5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}

            {variant === 'path' && (
                <>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}

            {variant === 'arrow' && (
                <path d="M5 12h14m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            )}

            {variant === 'message' && (
                <>
                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}

            {variant === 'community' && (
                <>
                    {BaseStar}
                    <path d="M7 17C7 17 9.5 19 12 19C14.5 19 17 17 17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M8 8C8 8 10 7 12 7C14 7 16 8 16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}
        </svg>
    )
}
