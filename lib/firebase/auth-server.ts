import { auth } from './config'

/**
 * Verify ID token on server-side
 * This is a placeholder - in production, use Firebase Admin SDK
 */
export async function verifyIdToken(token: string) {
  try {
    const { adminAuth } = await import('./admin')

    if (!adminAuth) {
      console.warn('Firebase Admin Auth not initialized, falling back to mock (dev only)')
      // Only for local dev without admin creds
      return {
        uid: 'dev-user',
        email: 'dev@example.com',
        name: 'Dev User',
      }
    }

    const decodedToken = await adminAuth.verifyIdToken(token)
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name || decodedToken.email?.split('@')[0],
    }
  } catch (error) {
    console.error('Verify ID Token Error:', error)
    throw new Error('Invalid token')
  }
}

// Note: For production, use Firebase Admin SDK:
// import admin from 'firebase-admin'
// const decodedToken = await admin.auth().verifyIdToken(token)


