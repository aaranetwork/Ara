

/**
 * Reports API Endpoints
 * 
 * POST /api/reports/generate - Generate new report
 * GET /api/reports - List user reports
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { adminAuth } from '@/lib/firebase/admin';
import { generateReport, getUserReports } from '@/lib/services/reports';
import type { ReportType } from '@/lib/models/backend';

// POST /api/reports/generate - Generate new report
export async function POST(request: NextRequest) {
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
            type,
            periodStart,
            periodEnd,
        }: {
            type: ReportType;
            periodStart?: string;
            periodEnd?: string;
        } = body;

        // Validate type
        if (!type || !['pre_therapy', 'therapy', 'self_insight'].includes(type)) {
            return NextResponse.json(
                { error: 'Invalid report type. Must be: pre_therapy, therapy, or self_insight' },
                { status: 400 }
            );
        }

        // Parse dates if provided
        const startDate = periodStart ? new Date(periodStart) : undefined;
        const endDate = periodEnd ? new Date(periodEnd) : undefined;

        // Generate report
        const result = await generateReport(userId, type, startDate, endDate);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            reportId: result.reportId,
            message: 'Report generated successfully',
        });
    } catch (error: any) {
        console.error('Error in POST /api/reports/generate:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// GET /api/reports - List user reports
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

        // Get all reports
        const reports = await getUserReports(userId);

        // Calculate Eligibility for Pre-Therapy Report
        const { getFirstCheckInDate, getCheckInCount } = await import('@/lib/services/checkIn');
        const firstCheckIn = await getFirstCheckInDate(userId);
        const checkInCount = await getCheckInCount(userId);

        const hasBaseline = reports.some(r => r.type === 'pre_therapy');

        let daysRemaining = 7;
        let daysSinceFirst = 0;

        if (firstCheckIn) {
            const now = new Date();
            daysSinceFirst = (now.getTime() - firstCheckIn.getTime()) / (1000 * 60 * 60 * 24);
            daysRemaining = Math.max(0, Math.ceil(7 - daysSinceFirst));
        }

        const eligibility = {
            canGeneratePreTherapy: !hasBaseline && daysRemaining === 0 && checkInCount >= 3,
            daysRemaining,
            checkInsRemaining: Math.max(0, 3 - checkInCount),
            hasBaseline,
            firstCheckIn: firstCheckIn || null,
        };

        return NextResponse.json({
            success: true,
            reports: reports, // Renaming data to reports for clarity, but supporting old format if needed
            eligibility,
            count: reports.length,
        });
    } catch (error: any) {
        console.error('Error in GET /api/reports:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
