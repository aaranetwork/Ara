import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Use environment variables for service account
// Use environment variables for service account
const getServiceAccount = () => {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        } catch (e) {
            console.error('FIREBASE_ADMIN: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY', e)
        }
    }
    return {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }
}

const serviceAccount = getServiceAccount()

export function initAdmin() {
    if (getApps().length === 0) {
        if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
            try {
                initializeApp({
                    credential: cert(serviceAccount)
                })
                console.log('FIREBASE_ADMIN: Initialized successfully')
            } catch (error) {
                console.error('FIREBASE_ADMIN: Initialization failed', error)
            }
        } else {
            console.warn('FIREBASE_ADMIN: Missing credentials')
            if (!serviceAccount.projectId) console.warn(' - Missing FIREBASE_PROJECT_ID')
            if (!serviceAccount.clientEmail) console.warn(' - Missing FIREBASE_CLIENT_EMAIL')
            if (!serviceAccount.privateKey) console.warn(' - Missing FIREBASE_PRIVATE_KEY')
        }
    }

    // Return services if app exists (or throw if init failed)
    // We check getApps again
    if (getApps().length > 0) {
        const app = getApp()
        return {
            adminAuth: getAuth(app),
            adminDb: getFirestore(app)
        }
    }

    return { adminAuth: null, adminDb: null }
}

// Singleton instances
const { adminAuth, adminDb } = initAdmin()

export { adminAuth, adminDb }
