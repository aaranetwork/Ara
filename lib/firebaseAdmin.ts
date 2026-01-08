import { initializeApp, cert, getApps, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getAuth, Auth } from 'firebase-admin/auth'

let adminApp: App | null = null
let adminDb: Firestore | null = null
let adminAuth: Auth | null = null

function initializeAdmin() {
  if (adminApp && adminDb && adminAuth) {
    return
  }

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      try {
        const serviceAccount = JSON.parse(
          Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf-8')
        )
        adminApp = getApps().length === 0
          ? initializeApp({
            credential: cert(serviceAccount),
          })
          : getApps()[0]
        adminDb = getFirestore(adminApp)
        adminAuth = getAuth(adminApp)
        return
      } catch (error) {
        console.error('Firebase Admin: Failed to initialize with Service Account:', error)
      }
    }

    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID

    if (projectId) {
      try {
        adminApp = getApps().length === 0
          ? initializeApp({
            projectId: projectId,
          })
          : getApps()[0]
        adminDb = getFirestore(adminApp)
        adminAuth = getAuth(adminApp)
        return
      } catch (error) {
        console.error('Firebase Admin: Failed to initialize with Project ID:', error)
      }
    }

    try {
      if (getApps().length === 0) {
        adminApp = initializeApp()
        adminDb = getFirestore(adminApp)
        adminAuth = getAuth(adminApp)
      } else {
        adminApp = getApps()[0]
        adminDb = getFirestore(adminApp)
        adminAuth = getAuth(adminApp)
      }
    } catch (error: any) {
      console.error('Firebase Admin: Failed to initialize with default credentials:', error)
    }
  } catch (error: any) {
    console.error('Firebase Admin: general initialization error', error)
  }
}

if (typeof window === 'undefined') {
  initializeAdmin()
}

export const db = (() => {
  if (!adminDb) {
    initializeAdmin()
  }
  return adminDb
})()

export const auth = (() => {
  if (!adminAuth) {
    initializeAdmin()
  }
  return adminAuth
})()

export const isAdminInitialized = () => {
  if (!adminDb) {
    initializeAdmin()
  }
  return adminDb !== null
}

