import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0B0C10] to-[#1C1E24]">
      <div className="container-custom text-center space-y-6 max-w-md">
        <div className="w-24 h-24 rounded-full bg-gradient-button mx-auto flex items-center justify-center shadow-glow-button mb-4">
          <span className="text-white text-4xl font-bold">404</span>
        </div>
        <h1 className="text-6xl font-bold text-white">404</h1>
        <h2 className="text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="text-gray-300/80">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link 
          href="/"
          className="inline-block px-6 py-3 rounded-xl font-semibold text-white bg-gradient-button shadow-glow-button hover:scale-105 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}

