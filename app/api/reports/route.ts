

/**
 * Reports API Endpoints
 * 
 * GET /api/reports - List user reports
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { adminAuth } from '@/lib/firebase/admin';
import { getUserReports } from '@/lib/services/reports';


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

        // Normalize reports for frontend compatibility (app/reports/page.tsx)
        const normalizedReports = reports.map(report => ({
            ...report,
            generatedAt: report.createdAt.toISOString(),
            period: {
                start: report.periodStart.toISOString(),
                end: report.periodEnd.toISOString()
            },
            shares: (report.shareHistory || []).map(s => ({
                token: s.id,
                createdAt: s.sharedAt.toISOString(),
                status: s.revokedAt ? 'expired' : 'active'
            }))
        }));

        return NextResponse.json({
            success: true,
            reports: normalizedReports,
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
