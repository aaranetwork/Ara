'use server'

/**
 * Share Revocation API Endpoint
 * 
 * DELETE /api/reports/[id]/share/[shareId] - Revoke share
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { revokeShare } from '@/lib/services/sharing';

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; shareId: string } }
) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // Revoke share
        const result = await revokeShare(userId, params.id, params.shareId);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'Share revoked successfully',
        });
    } catch (error: any) {
        console.error('Error in DELETE /api/reports/[id]/share/[shareId]:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
