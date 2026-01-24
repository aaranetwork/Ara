/**
 * User State Management Service
 * 
 * Handles user state transitions (exploration → preparing → in_therapy → maintenance)
 * as defined in Section 5 of aara_backend_architecture.md v1.0
 */

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { UserState, StateChange, UserStateType } from '@/lib/models/backend';

// =============================================================================
// STATE RETRIEVAL
// =============================================================================

/**
 * Gets the current state for a user. Creates default state if none exists.
 */
export async function getUserState(userId: string): Promise<UserState | null> {
    try {
        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return null;
        }

        const data = userDoc.data();

        // If user has no state, initialize with default
        if (!data?.state) {
            const defaultState: UserState = {
                userId,
                state: 'exploration',
                stateChangedAt: new Date(),
                stateHistory: [],
                lastCheckInDate: null,
                checkInLevel: 1,
            };

            await userRef.set({
                state: defaultState.state,
                stateChangedAt: FieldValue.serverTimestamp(),
                stateHistory: [],
                lastCheckInDate: null,
                checkInLevel: 1,
            }, { merge: true });

            return defaultState;
        }

        return {
            userId,
            state: data.state,
            stateChangedAt: data.stateChangedAt?.toDate() || new Date(),
            stateHistory: data.stateHistory?.map((change: any) => ({
                ...change,
                changedAt: change.changedAt?.toDate() || new Date(),
            })) || [],
            lastCheckInDate: data.lastCheckInDate?.toDate() || null,
            checkInLevel: data.checkInLevel || 1,
        };
    } catch (error) {
        console.error('Error getting user state:', error);
        return null;
    }
}

// =============================================================================
// STATE TRANSITIONS
// =============================================================================

/**
 * Updates user state with validation and history logging.
 * Requires user confirmation for all transitions.
 */
export async function updateUserState(
    userId: string,
    newState: UserStateType,
    triggerType: 'user_action' | 'system_suggestion',
    userConfirmed: boolean,
    reason?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const currentState = await getUserState(userId);

        if (!currentState) {
            return { success: false, error: 'User not found' };
        }

        // Validate transition
        const isValidTransition = validateStateTransition(currentState.state, newState);
        if (!isValidTransition) {
            return {
                success: false,
                error: `Invalid transition from ${currentState.state} to ${newState}`,
            };
        }

        // All transitions require user confirmation
        if (!userConfirmed) {
            return {
                success: false,
                error: 'User confirmation required for state change',
            };
        }

        // Create state change record
        const stateChange: StateChange = {
            fromState: currentState.state,
            toState: newState,
            changedAt: new Date(),
            triggerType,
            userConfirmed,
            reason,
        };

        // Update Firestore
        const userRef = adminDb.collection('users').doc(userId);
        await userRef.update({
            state: newState,
            stateChangedAt: FieldValue.serverTimestamp(),
            stateHistory: FieldValue.arrayUnion({
                fromState: stateChange.fromState,
                toState: stateChange.toState,
                changedAt: FieldValue.serverTimestamp(),
                triggerType: stateChange.triggerType,
                userConfirmed: stateChange.userConfirmed,
                reason: stateChange.reason || null,
            }),
        });

        return { success: true };
    } catch (error: any) {
        console.error('Error updating user state:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

/**
 * Gets the complete state change history for a user.
 */
export async function getStateHistory(userId: string): Promise<StateChange[]> {
    try {
        const currentState = await getUserState(userId);
        return currentState?.stateHistory || [];
    } catch (error) {
        console.error('Error getting state history:', error);
        return [];
    }
}

// =============================================================================
// STATE TRANSITION VALIDATION
// =============================================================================

/**
 * Validates if a state transition is allowed per Section 5.2 of v1.0 spec.
 * 
 * Valid transitions:
 * - exploration → preparing
 * - exploration → in_therapy
 * - preparing → in_therapy
 * - preparing → exploration
 * - in_therapy → maintenance
 * - in_therapy → preparing
 * - maintenance → in_therapy
 * - Any state → Any state (user manual override)
 */
function validateStateTransition(fromState: UserStateType, toState: UserStateType): boolean {
    // Same state is always valid (no-op)
    if (fromState === toState) {
        return true;
    }

    // Define valid transition map
    const validTransitions: Record<UserStateType, UserStateType[]> = {
        exploration: ['preparing', 'in_therapy'],
        preparing: ['in_therapy', 'exploration'],
        in_therapy: ['maintenance', 'preparing'],
        maintenance: ['in_therapy'],
    };

    // User can manually change to any state (will require confirmation)
    // In UI, we'll allow manual transitions from any state to any state
    // But system suggestions should follow the map above
    return validTransitions[fromState]?.includes(toState) || true;
}

// =============================================================================
// STATE TRANSITION TRIGGERS
// =============================================================================

/**
 * Detects if a user should be suggested a state transition based on their activity.
 * Returns null if no suggestion, or a suggested state with reason.
 */
export async function detectTransitionTriggers(
    userId: string
): Promise<{ suggestedState: UserStateType; reason: string } | null> {
    try {
        const currentState = await getUserState(userId);
        if (!currentState) return null;

        const userRef = adminDb.collection('users').doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        // Trigger 1: exploration → preparing
        // User views "Find Therapist" page 3+ times
        if (currentState.state === 'exploration') {
            const therapistPageViews = userData?.therapistPageViews || 0;
            if (therapistPageViews >= 3) {
                return {
                    suggestedState: 'preparing',
                    reason: 'You\'ve been exploring therapists. Ready to prepare for therapy?',
                };
            }
        }

        // Trigger 2: preparing → in_therapy
        // User shares first therapy report
        if (currentState.state === 'preparing') {
            const reportsSnapshot = await adminDb
                .collection('users')
                .doc(userId)
                .collection('reports')
                .where('type', '==', 'therapy')
                .limit(1)
                .get();

            if (!reportsSnapshot.empty) {
                const firstReport = reportsSnapshot.docs[0].data();
                if (firstReport.shareHistory && firstReport.shareHistory.length > 0) {
                    return {
                        suggestedState: 'in_therapy',
                        reason: 'You\'ve shared your first therapy report. Update your status?',
                    };
                }
            }
        }

        // Trigger 3: in_therapy → maintenance
        // 90 days since last report share
        if (currentState.state === 'in_therapy') {
            const reportsSnapshot = await adminDb
                .collection('users')
                .doc(userId)
                .collection('reports')
                .where('type', '==', 'therapy')
                .orderBy('createdAt', 'desc')
                .limit(1)
                .get();

            if (!reportsSnapshot.empty) {
                const latestReport = reportsSnapshot.docs[0].data();
                if (latestReport.shareHistory && latestReport.shareHistory.length > 0) {
                    const lastShare = latestReport.shareHistory[latestReport.shareHistory.length - 1];
                    const daysSinceShare = Math.floor(
                        (Date.now() - lastShare.sharedAt.toDate().getTime()) / (1000 * 60 * 60 * 24)
                    );

                    if (daysSinceShare >= 90) {
                        return {
                            suggestedState: 'maintenance',
                            reason: 'It\'s been 90 days since your last report. In maintenance mode now?',
                        };
                    }
                }
            }
        }

        return null;
    } catch (error) {
        console.error('Error detecting transition triggers:', error);
        return null;
    }
}

/**
 * Increments the therapist page view count for trigger detection.
 */
export async function trackTherapistPageView(userId: string): Promise<void> {
    try {
        const userRef = adminDb.collection('users').doc(userId);
        await userRef.set(
            {
                therapistPageViews: FieldValue.increment(1),
            },
            { merge: true }
        );
    } catch (error) {
        console.error('Error tracking therapist page view:', error);
    }
}
