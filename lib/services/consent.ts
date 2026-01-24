/**
 * Consent Logging Service
 * 
 * Handles granular consent tracking for journals, reports, and sharing
 * as defined in Section 3.7 and 7.1 of aara_backend_architecture.md v1.0
 */

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { ConsentLog } from '@/lib/models/backend';

// =============================================================================
// CONSENT LOGGING
// =============================================================================

/**
 * Logs a consent grant action.
 */
export async function grantConsent(
    userId: string,
    resourceType: 'journal' | 'quote' | 'report_share',
    resourceId: string,
    purpose: string
): Promise<{ success: boolean; logId?: string; error?: string }> {
    try {
        if (!adminDb) {
            return { success: false, error: 'Database not initialized' };
        }

        const consentLogRef = adminDb.collection('consent_logs').doc();

        const consentLog: Omit<ConsentLog, 'id'> = {
            userId,
            timestamp: new Date(),
            action: 'grant',
            resourceType,
            resourceId,
            purpose,
        };

        await consentLogRef.set({
            userId,
            timestamp: FieldValue.serverTimestamp(),
            action: 'grant',
            resourceType,
            resourceId,
            purpose,
        });

        return { success: true, logId: consentLogRef.id };
    } catch (error: any) {
        console.error('Error granting consent:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

/**
 * Logs a consent revoke action.
 */
export async function revokeConsent(
    userId: string,
    resourceType: 'journal' | 'quote' | 'report_share',
    resourceId: string,
    purpose: string
): Promise<{ success: boolean; logId?: string; error?: string }> {
    try {
        if (!adminDb) {
            return { success: false, error: 'Database not initialized' };
        }

        const consentLogRef = adminDb.collection('consent_logs').doc();

        const consentLog: Omit<ConsentLog, 'id'> = {
            userId,
            timestamp: new Date(),
            action: 'revoke',
            resourceType,
            resourceId,
            purpose,
        };

        await consentLogRef.set({
            userId,
            timestamp: FieldValue.serverTimestamp(),
            action: 'revoke',
            resourceType,
            resourceId,
            purpose,
        });

        return { success: true, logId: consentLogRef.id };
    } catch (error: any) {
        console.error('Error revoking consent:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

// =============================================================================
// CONSENT HISTORY
// =============================================================================

/**
 * Gets consent history for a user, optionally filtered by resource type or ID.
 */
export async function getConsentHistory(
    userId: string,
    resourceType?: 'journal' | 'quote' | 'report_share',
    resourceId?: string
): Promise<ConsentLog[]> {
    try {
        if (!adminDb) return [];

        let query = adminDb.collection('consent_logs').where('userId', '==', userId);

        if (resourceType) {
            query = query.where('resourceType', '==', resourceType) as any;
        }

        if (resourceId) {
            query = query.where('resourceId', '==', resourceId) as any;
        }

        const snapshot = await query.orderBy('timestamp', 'desc').get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                timestamp: data.timestamp?.toDate() || new Date(),
                action: data.action,
                resourceType: data.resourceType,
                resourceId: data.resourceId,
                purpose: data.purpose,
            };
        });
    } catch (error) {
        console.error('Error getting consent history:', error);
        return [];
    }
}

/**
 * Checks if consent is currently active for a specific resource.
 * Returns true if the most recent action was 'grant'.
 */
export async function isConsentActive(
    userId: string,
    resourceType: 'journal' | 'quote' | 'report_share',
    resourceId: string
): Promise<boolean> {
    try {
        const history = await getConsentHistory(userId, resourceType, resourceId);

        if (history.length === 0) {
            return false; // No consent history = no consent
        }

        // Most recent action determines current state
        const mostRecentAction = history[0].action;
        return mostRecentAction === 'grant';
    } catch (error) {
        console.error('Error checking consent status:', error);
        return false; // Fail closed (no consent)
    }
}

// =============================================================================
// GDPR COMPLIANCE - DATA EXPORT
// =============================================================================

/**
 * Exports all consent history for a user (GDPR compliance).
 * Returns a structured JSON object.
 */
export async function exportConsentHistory(userId: string): Promise<any> {
    try {
        const history = await getConsentHistory(userId);

        return {
            userId,
            exportDate: new Date().toISOString(),
            totalLogs: history.length,
            consentLogs: history.map((log) => ({
                timestamp: log.timestamp.toISOString(),
                action: log.action,
                resourceType: log.resourceType,
                resourceId: log.resourceId,
                purpose: log.purpose,
            })),
        };
    } catch (error) {
        console.error('Error exporting consent history:', error);
        return null;
    }
}

/**
 * Deletes all consent logs for a user (GDPR right to deletion).
 */
export async function deleteAllConsentLogs(userId: string): Promise<{ success: boolean; deletedCount: number }> {
    try {
        if (!adminDb) {
            return { success: false, deletedCount: 0 };
        }

        const snapshot = await adminDb.collection('consent_logs').where('userId', '==', userId).get();

        const batch = adminDb.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        return { success: true, deletedCount: snapshot.size };
    } catch (error) {
        console.error('Error deleting consent logs:', error);
        return { success: false, deletedCount: 0 };
    }
}
