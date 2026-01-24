'use server'

/**
 * Check-In Level API Endpoint
 * 
 * GET /api/check-in/level - Get current progressive level
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { getCurrentCheckInLevel } from '@/lib/services/checkIn';

export async function GET(request: Request) {
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

        // Get current level
        const level = await getCurrentCheckInLevel(userId);

        return NextResponse.json({
            success: true,
            level,
        });
    } catch (error: any) {
        console.error('Error in GET /api/check-in/level:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
