'use server'

/**
 * Check-In API Endpoints
 * 
 * POST /api/check-in - Submit daily check-in
 * GET /api/check-in/latest - Get latest check-in
 * GET /api/check-in/level - Get current progressive level
 */


import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { adminAuth } from '@/lib/firebase/admin';
import { createCheckIn, getLatestCheckIn, canUserCheckIn } from '@/lib/services/checkIn';
import type { CheckInResponses } from '@/lib/models/backend';

// POST /api/check-in - Submit check-in
export async function POST(request: Request) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { success: false, error: 'Missing or invalid authorization header' },
                { status: 401 }
            );
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

        // Parse request body
        const body = await request.json();
        const { responses, level }: { responses: CheckInResponses; level?: number } = body;

        // Validate responses
        if (!responses || !responses.emotionalIntensity) {
            return NextResponse.json(
                { error: 'Missing required fields: responses.emotionalIntensity' },
                { status: 400 }
            );
        }

        // Create check-in
        const result = await createCheckIn(userId, responses, level);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            id: result.id,
            message: 'Check-in saved successfully',
        });
    } catch (error: any) {
        console.error('Error in POST /api/check-in:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/check-in/latest - Get latest check-in
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
        console.error('Error in GET /api/check-in:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
