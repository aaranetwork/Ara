import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

export async function POST(req: Request) {
    try {
        // 1. Verify Auth Token
        const authHeader = req.headers.get('Authorization')
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split('Bearer ')[1]

        if (!adminAuth || !adminDb) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const decodedToken = await adminAuth.verifyIdToken(token)
        const uid = decodedToken.uid

        console.log(`[DELETE] Starting account deletion for ${uid}`)

        // 2. Recursive Delete Firestore Data
        // Deletes 'users/{uid}' and all subcollections
        const userRef = adminDb.collection('users').doc(uid)
        await adminDb.recursiveDelete(userRef)

        console.log(`[DELETE] Firestore data deleted for ${uid}`)

        // 3. Delete from Authentication
        await adminAuth.deleteUser(uid)

        console.log(`[DELETE] Auth user deleted for ${uid}`)

        return NextResponse.json({ success: true, message: 'Account deleted successfully' })
    } catch (error: any) {
        console.error('[DELETE] Error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to delete account' },
            { status: 500 }
        )
    }
}
