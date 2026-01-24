/**
 * Check-In Service
 * 
 * Handles daily check-ins with progressive question depth logic
 * as defined in Section 3.2 and 6.1 of aara_backend_architecture.md v1.0
 */

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import type { CheckIn, CheckInResponses } from '@/lib/models/backend';

// =============================================================================
// CHECK-IN CREATION
// =============================================================================

/**
 * Creates a new check-in for a user.
 * Validates 24-hour frequency rule and increments progressive level.
 */
export async function createCheckIn(
    userId: string,
    responses: CheckInResponses,
    level?: number
): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
        if (!adminDb) {
            return { success: false, error: 'Database not initialized' };
        }

        // Validate 24-hour frequency rule
        const canCheckIn = await canUserCheckIn(userId);
        if (!canCheckIn.allowed) {
            return { success: false, error: canCheckIn.reason };
        }

        // Get current level or use provided level
        const checkInLevel = level || (await getCurrentCheckInLevel(userId));

        // Create check-in document
        const checkInRef = adminDb.collection('users').doc(userId).collection('check-ins').doc();

        const checkInData: Omit<CheckIn, 'id'> = {
            userId,
            createdAt: new Date(), // This will be overwritten by serverTimestamp in the actual write
            level: checkInLevel,
            responses,
            processed: false,
            processedAt: null,
        };

        // Save check-in to database
        await checkInRef.set({
            userId,
            createdAt: FieldValue.serverTimestamp(),
            level: checkInLevel,
            responses,
            processed: false,
            processedAt: null,
        });

        // BACKWARD COMPATIBILITY: Also save to 'moods' collection for mood-flow page
        // The mood-flow page reads from 'moods' collection, so we need to keep both in sync
        const moodRef = adminDb.collection('users').doc(userId).collection('moods').doc();
        await moodRef.set({
            signals: {
                emotional_state: responses.emotionalIntensity,
                energy_level: responses.emotionalIntensity,
                calm_level: 10 - responses.emotionalIntensity,
                mental_clarity: responses.emotionalIntensity,
                connection: responses.emotionalIntensity,
            },
            average: responses.emotionalIntensity,
            value: responses.emotionalIntensity,
            createdAt: FieldValue.serverTimestamp(),
        });

        // Update user's lastCheckInDate and increment level for next time
        const userRef = adminDb.collection('users').doc(userId);
        await userRef.set(
            {
                lastCheckInDate: FieldValue.serverTimestamp(),
                checkInLevel: Math.min(checkInLevel + 1, 10), // Cap at level 10
            },
            { merge: true }
        );

        return { success: true, id: checkInRef.id };
    } catch (error: any) {
        console.error('Error creating check-in:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

// =============================================================================
// CHECK-IN RETRIEVAL
// =============================================================================

/**
 * Gets the latest check-in for a user.
 */
export async function getLatestCheckIn(userId: string): Promise<CheckIn | null> {
    try {
        if (!adminDb) return null;

        const checkInsRef = adminDb.collection('users').doc(userId).collection('check-ins');
        const snapshot = await checkInsRef.orderBy('createdAt', 'desc').limit(1).get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        return {
            id: doc.id,
            userId: data.userId,
            createdAt: data.createdAt?.toDate() || new Date(),
            level: data.level,
            responses: data.responses,
            processed: data.processed || false,
            processedAt: data.processedAt?.toDate() || null,
        };
    } catch (error) {
        console.error('Error getting latest check-in:', error);
        return null;
    }
}

/**
 * Gets all check-ins for a user within a date range.
 */
export async function getCheckIns(
    userId: string,
    startDate?: Date,
    endDate?: Date
): Promise<CheckIn[]> {
    try {
        if (!adminDb) return [];

        const checkInsRef = adminDb.collection('users').doc(userId).collection('check-ins');
        let query = checkInsRef.orderBy('createdAt', 'desc');

        if (startDate) {
            query = query.where('createdAt', '>=', Timestamp.fromDate(startDate)) as any;
        }
        if (endDate) {
            query = query.where('createdAt', '<=', Timestamp.fromDate(endDate)) as any;
        }

        const snapshot = await query.get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                createdAt: data.createdAt?.toDate() || new Date(),
                level: data.level,
                responses: data.responses,
                processed: data.processed || false,
                processedAt: data.processedAt?.toDate() || null,
            };
        });
    } catch (error) {
        console.error('Error getting check-ins:', error);
        return [];
    }
}

/**
 * Gets unprocessed check-ins for insight generation.
 */
export async function getUnprocessedCheckIns(userId: string): Promise<CheckIn[]> {
    try {
        if (!adminDb) return [];

        const checkInsRef = adminDb.collection('users').doc(userId).collection('check-ins');
        const snapshot = await checkInsRef.where('processed', '==', false).get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                createdAt: data.createdAt?.toDate() || new Date(),
                level: data.level,
                responses: data.responses,
                processed: data.processed || false,
                processedAt: data.processedAt?.toDate() || null,
            };
        });
    } catch (error) {
        console.error('Error getting unprocessed check-ins:', error);
        return [];
    }
}

// =============================================================================
// PROGRESSIVE LEVEL LOGIC
// =============================================================================

/**
 * Gets the current progressive question level for the user.
 * Level increases with each check-in, capped at 10.
 */
export async function getCurrentCheckInLevel(userId: string): Promise<number> {
    try {
        if (!adminDb) return 1;

        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        return userData?.checkInLevel || 1;
    } catch (error) {
        console.error('Error getting check-in level:', error);
        return 1; // Default to level 1
    }
}

// =============================================================================
// FREQUENCY VALIDATION
// =============================================================================

/**
 * Validates if a user can check in (24-hour frequency rule).
 * Per Section 6.1: "User completes 2 check-ins/day → Only process first; inform gently"
 */
export async function canUserCheckIn(
    userId: string
): Promise<{ allowed: boolean; reason?: string; lastCheckIn?: Date }> {
    try {
        const latestCheckIn = await getLatestCheckIn(userId);

        if (!latestCheckIn) {
            return { allowed: true }; // No previous check-in, always allowed
        }

        const now = new Date();
        const hoursSinceLastCheckIn =
            (now.getTime() - latestCheckIn.createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastCheckIn < 24) {
            return {
                allowed: false,
                reason: 'You can check in once every 24 hours. Come back tomorrow! 🌸',
                lastCheckIn: latestCheckIn.createdAt,
            };
        }

        return { allowed: true };
    } catch (error) {
        console.error('Error validating check-in frequency:', error);
        // In case of error, allow check-in (fail open)
        return { allowed: true };
    }
}

// =============================================================================
// PROCESSING FLAGS
// =============================================================================

/**
 * Marks check-ins as processed for insight generation.
 * Prevents double-processing.
 */
export async function markCheckInsAsProcessed(checkInIds: string[], userId: string): Promise<void> {
    try {
        if (!adminDb) return;

        const batch = adminDb.batch();

        for (const checkInId of checkInIds) {
            const checkInRef = adminDb.collection('users').doc(userId).collection('check-ins').doc(checkInId);
            batch.update(checkInRef, {
                processed: true,
                processedAt: FieldValue.serverTimestamp(),
            });
        }

        await batch.commit();
    } catch (error) {
        console.error('Error marking check-ins as processed:', error);
    }
}
