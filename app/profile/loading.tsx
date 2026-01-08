import Image from 'next/image'

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <Image
                        src="/aara-logo.png"
                        alt="AARA"
                        width={48}
                        height={48}
                        className="rounded-xl animate-pulse"
                    />
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                </div>
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full animate-pulse" />
            </div>
        </div>
    )
}
