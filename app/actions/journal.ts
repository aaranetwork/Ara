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

/**
 * Toggles journal consent for report inclusion
 * Per v1.0 spec: Journals are private by default and require explicit consent
 */
export async function toggleJournalConsent(
    idToken: string,
    entryId: string,
    includeInReport: boolean
) {
    try {
        if (!adminAuth || !adminDb) {
            return { error: 'Firebase Admin not initialized' }
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken)
        const uid = decodedToken.uid

        const journalRef = adminDb
            .collection('users')
            .doc(uid)
            .collection('journal')
            .doc(entryId)

        // Get current journal to check if already processed
        const journalDoc = await journalRef.get()
        if (!journalDoc.exists) {
            return { error: 'Journal entry not found' }
        }

        const journalData = journalDoc.data()

        // Prevent consent toggle if journal already processed
        if (journalData?.processed && journalData?.processedInReportId) {
            return {
                error: 'This journal has already been used in a report and cannot be modified',
                processedInReportId: journalData.processedInReportId
            }
        }

        // Update journal with consent fields
        await journalRef.update({
            includeInReport,
            consentGivenAt: includeInReport ? FieldValue.serverTimestamp() : null,
        })

        // Log consent action
        const { grantConsent, revokeConsent } = await import('@/lib/services/consent')

        if (includeInReport) {
            await grantConsent(uid, 'journal', entryId, 'Include in therapy report')
        } else {
            await revokeConsent(uid, 'journal', entryId, 'Exclude from therapy report')
        }

        return { success: true, includeInReport }
    } catch (error: any) {
        console.error('Error toggling journal consent:', error)
        return { error: error.message }
    }
}
