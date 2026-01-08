import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { auth } from '@/lib/firebase/config'
import { verifyIdToken } from '@/lib/firebase/auth-server'

export interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
}

/**
 * Verify authentication on server-side API routes
 * Returns user data if authenticated, throws error if not
 */
export async function verifyAuth(request?: NextRequest): Promise<AuthUser> {
  try {
    // Get token from Authorization header or cookies
    let token: string | null = null

    if (request) {
      // Try Authorization header first
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7)
      } else {
        // Fallback to cookies
        const cookieStore = await cookies()
        token = cookieStore.get('authToken')?.value || null
      }
    } else {
      // Direct cookie access when no request object
      const cookieStore = await cookies()
      token = cookieStore.get('authToken')?.value || null
    }

    if (!token) {
      throw new Error('No authentication token provided')
    }

    // Verify token with Firebase Admin SDK or client SDK
    const decodedToken = await verifyIdToken(token)
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      displayName: decodedToken.name || null,
    }
  } catch (error: any) {
    throw new Error(`Authentication failed: ${error.message}`)
  }
}

/**
 * Optional auth verification - returns null if not authenticated
 */
export async function optionalAuth(request?: NextRequest): Promise<AuthUser | null> {
  try {
    return await verifyAuth(request)
  } catch {
    return null
  }
}


