'use client'

export default function FirebaseError() {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-400 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Firebase Configuration Error</h2>
        </div>
        
        <p className="text-white/80">
          Your Firebase API key is missing or invalid. Please set up your Firebase configuration.
        </p>

        <div className="bg-dark-bg-light/60 p-4 rounded-lg space-y-2 text-sm">
          <p className="text-white font-semibold">Quick Fix:</p>
          <ol className="list-decimal list-inside space-y-1 text-white/80">
            <li>Create a <code className="bg-white/10 px-1 rounded">.env.local</code> file in the root directory</li>
            <li>Add your Firebase configuration values</li>
            <li>Restart the development server</li>
          </ol>
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-white/60 text-sm mb-2">See <code className="bg-white/10 px-1 rounded">QUICK_START.md</code> for detailed instructions.</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-neon-blue text-white rounded-lg hover:bg-neon-blue/90 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}





