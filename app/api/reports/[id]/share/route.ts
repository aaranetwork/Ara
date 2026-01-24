'use server'

/**
 * Report Sharing API Endpoints
 * 
 * POST /api/reports/[id]/share - Create share (PDF or link)
 * DELETE /api/reports/[id]/share/[shareId] - Revoke share
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { createShare, revokeShare } from '@/lib/services/sharing';

// POST /api/reports/[id]/share - Create share
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
            shareMethod,
            recipientType,
        }: {
            shareMethod: 'pdf' | 'secure_link';
            recipientType?: 'therapist';
        } = body;

        // Validate shareMethod
        if (!shareMethod || !['pdf', 'secure_link'].includes(shareMethod)) {
            return NextResponse.json(
                { error: 'Invalid share method. Must be: pdf or secure_link' },
                { status: 400 }
            );
        }

        // Create share
        const result = await createShare(userId, params.id, shareMethod, recipientType);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            shareId: result.shareId,
            accessToken: result.accessToken,
            shareUrl: result.accessToken
                ? `${process.env.NEXT_PUBLIC_APP_URL}/share/${result.accessToken}`
                : undefined,
            message: 'Share created successfully',
        });
    } catch (error: any) {
        console.error('Error in POST /api/reports/[id]/share:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
