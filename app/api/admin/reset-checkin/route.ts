'use server'

/**
 * Admin endpoint to reset check-in for testing
 * DELETE /api/admin/reset-checkin
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function DELETE(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.split('Bearer ')[1];

        if (!adminAuth) {
            return NextResponse.json(
                { error: 'Firebase Admin not initialized' },
                { status: 500 }
            );
        }

        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        if (!adminDb) {
            return NextResponse.json(
                { error: 'Firestore not initialized' },
                { status: 500 }
            );
        }

        // Get today's check-ins
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkInsRef = adminDb.collection('users').doc(userId).collection('check-ins');
        const snapshot = await checkInsRef
            .where('createdAt', '>=', today)
            .get();

        // Delete all check-ins from today
        const deletePromises = snapshot.docs.map(doc => doc.ref.delete());
        await Promise.all(deletePromises);

        return NextResponse.json({
            success: true,
            message: `Deleted ${snapshot.size} check-in(s) from today`,
            count: snapshot.size,
        });
    } catch (error: any) {
        console.error('Error in DELETE /api/admin/reset-checkin:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
