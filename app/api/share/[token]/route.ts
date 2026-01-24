'use server'

/**
 * Public Share Access API Endpoint
 * 
 * GET /api/share/[token] - Access shared report via token

This is a public endpoint (no authentication required).
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateShareToken } from '@/lib/services/sharing';
import { getReport } from '@/lib/services/reports';

export async function GET(
    request: NextRequest,
    { params }: { params: { token: string } }
) {
    try {
        // Validate the share token
        const validation = await validateShareToken(params.token);

        if (!validation.valid) {
            return NextResponse.json(
                { error: validation.error || 'Invalid share link' },
                { status: 403 }
            );
        }

        // Get the report
        const report = await getReport(validation.userId!, validation.reportId!);

        if (!report) {
            return NextResponse.json({ error: 'Report not found' }, { status: 404 });
        }

        // Return report data (access logging happens in validateShareToken)
        return NextResponse.json({
            success: true,
            data: {
                id: report.id,
                type: report.type,
                createdAt: report.createdAt,
                periodStart: report.periodStart,
                periodEnd: report.periodEnd,
                content: report.content,
                // Do not expose userId, insightIds, or shareHistory
            },
        });
    } catch (error: any) {
        console.error('Error in GET /api/share/[token]:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
