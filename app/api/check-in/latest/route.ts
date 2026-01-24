'use server'

/**
 * Get Latest Check-In
 * GET /api/check-in/latest
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { getLatestCheckIn, canUserCheckIn } from '@/lib/services/checkIn';

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify Firebase Admin is initialized
        if (!adminAuth) {
            return NextResponse.json(
                { success: false, error: 'Firebase Admin not initialized' },
                { status: 500 }
            );
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // Check if user can check in (includes latest check-in info)
        const canCheck = await canUserCheckIn(userId);

        // Get latest check-in
        const latestCheckIn = await getLatestCheckIn(userId);

        return NextResponse.json({
            success: true,
            data: latestCheckIn,
            canCheckIn: canCheck.allowed,
            reason: canCheck.reason,
        });
    } catch (error: any) {
        console.error('Error in GET /api/check-in/latest:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
