'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#0B0C10] to-[#1C1E24] text-white">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-3xl font-bold text-white">Something went wrong!</h2>
        <p className="text-white/60">{error.message || 'An unexpected error occurred'}</p>
        {error.digest && (
          <p className="text-white/40 text-sm">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-4 justify-center">
          <button 
            onClick={reset}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#00AEEF] to-[#7A5FFF] hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors"
          >
            Go home
          </button>
        </div>
      </div>
    </div>
  )
}
