'use server'

import { adminDb, adminAuth } from '@/lib/firebase/admin'
import { FieldValue } from 'firebase-admin/firestore'

/**
 * Saves or updates a journal entry
 */
export async function saveJournalEntry(idToken: string, entry: {
    id?: string,
    title?: string,
    content: string,
    category?: string,
    isOneLine?: boolean
}) {
    try {
        if (!adminAuth || !adminDb) {
            return { error: 'Firebase Admin not initialized. Check server logs/env vars.' }
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken)
        const uid = decodedToken.uid
        const journalRef = adminDb.collection('users').doc(uid).collection('journal')
        const entryId = entry.id || journalRef.doc().id

        const data = {
            title: entry.title || '',
            content: entry.content,
            category: entry.category || 'general',
            isOneLine: entry.isOneLine || false,
            updatedAt: FieldValue.serverTimestamp(),
            createdAt: entry.id ? undefined : FieldValue.serverTimestamp()
        }

        // Remove undefined fields
        const cleanedData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        )

        await journalRef.doc(entryId).set(cleanedData, { merge: true })

        return { success: true, id: entryId }
    } catch (error: any) {
        console.error('Error saving journal entry:', error)
        return { error: error.message || 'Unknown server error' }
    }
}

/**
 * Fetches all journal entries for a user
 */
export async function getJournalEntries(idToken: string) {
    try {
        if (!adminAuth || !adminDb) {
            return { error: 'Firebase Admin not initialized' }
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken)
        const uid = decodedToken.uid

        const snapshot = await adminDb
            .collection('users')
            .doc(uid)
            .collection('journal')
            .orderBy('updatedAt', 'desc')
            .get()

        const entries = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            updatedAt: doc.data().updatedAt?.toDate()?.toISOString(),
            createdAt: doc.data().createdAt?.toDate()?.toISOString()
        }))

        return { data: entries }
    } catch (error: any) {
        console.error('Error fetching journal entries:', error)
        return { error: error.message }
    }
}

/**
 * Deletes a journal entry
 */
export async function deleteJournalEntry(idToken: string, entryId: string) {
    try {
        if (!adminAuth || !adminDb) {
            return { error: 'Firebase Admin not initialized' }
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken)
        const uid = decodedToken.uid

        await adminDb
            .collection('users')
            .doc(uid)
            .collection('journal')
            .doc(entryId)
            .delete()

        return { success: true }
    } catch (error: any) {
        console.error('Error deleting journal entry:', error)
        return { error: error.message }
    }
}
