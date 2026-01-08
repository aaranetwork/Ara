import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add any authentication checks here if needed
  // For now, we'll handle auth client-side
  return NextResponse.next()
}

export const config = {
  matcher: ['/chat/:path*', '/mode/:path*', '/profile/:path*', '/journal/:path*'],
}


