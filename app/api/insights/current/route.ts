'use server'

/**
 * Insights API Endpoints
 * 
 * GET /api/insights/current - Get current real-time insights
 * GET /api/insights/:id - Get specific insight
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { generateInsights, getInsight, getUserInsights } from '@/lib/services/insights';

// GET /api/insights/current - Generate real-time insights
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

        // Get period from query params (defaults to last 30 days)
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');

        const periodEnd = new Date();
        const periodStart = new Date();
        periodStart.setDate(periodStart.getDate() - days);

        // Generate insights
        const insights = await generateInsights(userId, periodStart, periodEnd);

        return NextResponse.json({
            success: true,
            data: insights,
            period: {
                start: periodStart.toISOString(),
                end: periodEnd.toISOString(),
                days,
            },
        });
    } catch (error: any) {
        console.error('Error in GET /api/insights/current:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
