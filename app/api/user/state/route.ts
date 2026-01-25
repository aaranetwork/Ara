

/**
 * User State API Endpoints
 * 
 * GET /api/user/state - Get current state
 * PATCH /api/user/state - Update state with confirmation
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { adminAuth } from '@/lib/firebase/admin';
import { getUserState, updateUserState, detectTransitionTriggers } from '@/lib/services/userState';
import type { UserStateType } from '@/lib/models/backend';

// GET /api/user/state - Get current state and suggested transitions
export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];

        if (!adminAuth) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // Get current state
        const currentState = await getUserState(userId);

        if (!currentState) {
            return NextResponse.json({ error: 'User state not found' }, { status: 404 });
        }

        // Detect potential transition triggers
        const suggestion = await detectTransitionTriggers(userId);

        return NextResponse.json({
            success: true,
            data: currentState,
            suggestion,
        });
    } catch (error: any) {
        console.error('Error in GET /api/user/state:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/user/state - Update state
export async function PATCH(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];

        if (!adminAuth) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // Parse request body
        const body = await request.json();
        const {
            newState,
            triggerType,
            userConfirmed,
            reason,
        }: {
            newState: UserStateType;
            triggerType: 'user_action' | 'system_suggestion';
            userConfirmed: boolean;
            reason?: string;
        } = body;

        // Validate required fields
        if (!newState || !triggerType || userConfirmed === undefined) {
            return NextResponse.json(
                { error: 'Missing required fields: newState, triggerType, userConfirmed' },
                { status: 400 }
            );
        }

        // Update state
        const result = await updateUserState(userId, newState, triggerType, userConfirmed, reason);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'State updated successfully',
        });
    } catch (error: any) {
        console.error('Error in PATCH /api/user/state:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
