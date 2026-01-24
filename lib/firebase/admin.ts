import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// Get service account from environment variables
const getServiceAccount = () => {
    // First try the new FIREBASE_ADMIN_* variables
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKey) {
        return {
            projectId,
            clientEmail,
            privateKey: privateKey.replace(/\\n/g, '\n'), // Handle escaped newlines
        };
    }

    // Fallback: try JSON service account key
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        try {
            return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } catch (e) {
            console.error('FIREBASE_ADMIN: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY', e);
        }
    }

    return null;
}

const serviceAccount = getServiceAccount();

export function initAdmin() {
    if (getApps().length === 0) {
        if (serviceAccount) {
            try {
                initializeApp({
                    credential: cert(serviceAccount)
                });
                console.log('✅ FIREBASE_ADMIN: Initialized successfully');
                console.log('   Project ID:', serviceAccount.projectId);
            } catch (error) {
                console.error('❌ FIREBASE_ADMIN: Initialization failed', error);
            }
        } else {
            console.error('❌ FIREBASE_ADMIN: Missing credentials');
            console.error('   Checked: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_PROJECT_ID');
            console.error('   Checked: FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_CLIENT_EMAIL');
            console.error('   Checked: FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_PRIVATE_KEY');
            console.error('   Checked: FIREBASE_SERVICE_ACCOUNT_KEY');
        }
    }

    // Return services if app exists
    if (getApps().length > 0) {
        const app = getApp();
        return {
            adminAuth: getAuth(app),
            adminDb: getFirestore(app)
        };
    }

    return { adminAuth: null, adminDb: null };
}

// Singleton instances
const { adminAuth, adminDb } = initAdmin();

export { adminAuth, adminDb };
