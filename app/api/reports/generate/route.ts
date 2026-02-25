
/**
 * Reports Generation API Endpoint
 * 
 * POST /api/reports/generate - Generate new report
 */

import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { adminAuth } from '@/lib/firebase/admin';
import { generateReport, getReport } from '@/lib/services/reports';
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

        if (!result.success || !result.reportId) {
            return NextResponse.json({ error: result.error || 'Failed to generate report' }, { status: 400 });
        }

        // Fetch the full report object
        const report = await getReport(userId, result.reportId);

        if (!report) {
            return NextResponse.json({ error: 'Failed to retrieve generated report' }, { status: 500 });
        }

        // Normalize for frontend compatibility (app/reports/page.tsx)
        const normalizedReport = {
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
        };

        return NextResponse.json({
            success: true,
            report: normalizedReport,
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
