import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getDatabase, Database } from 'firebase/database'
import { getAnalytics, Analytics } from 'firebase/analytics'

interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId?: string
}

const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate Firebase config
if (typeof window !== 'undefined' && !firebaseConfig.apiKey) {
  console.warn('⚠️ Firebase API key is missing. Please add NEXT_PUBLIC_FIREBASE_API_KEY to your .env.local file.')
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let realtimeDb: Database | null = null
let analytics: Analytics | null = null

// Only initialize Firebase if we have valid config
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.projectId

if (hasValidConfig) {
  try {
    if (typeof window !== 'undefined') {
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
      auth = getAuth(app)
      db = getFirestore(app)
      realtimeDb = getDatabase(app)
      if (firebaseConfig.measurementId) {
        analytics = getAnalytics(app)
      }
    } else {
      // Server-side initialization
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
      db = getFirestore(app)
    }
  } catch (error) {
    console.error('Firebase initialization error:', error)
    if (typeof window !== 'undefined') {
      console.error('Please check your Firebase configuration in .env.local')
    }
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ Firebase not initialized. Missing configuration. Please set up your .env.local file.')
  }
}

export { app, auth, db, realtimeDb, analytics }

