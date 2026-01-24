/**
 * Authentication Helper for API Routes
 * 
 * Provides a reusable function to verify Firebase Auth tokens
 * with proper null checking for adminAuth.
 */

import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function verifyAuthToken(authHeader: string | null): Promise<
    { success: true; userId: string } | { success: false; response: NextResponse }
> {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
            success: false,
            response: NextResponse.json(
                { success: false, error: 'Missing or invalid authorization header' },
                { status: 401 }
            ),
        };
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify Firebase Admin is initialized
    if (!adminAuth) {
        return {
            success: false,
            response: NextResponse.json(
                { success: false, error: 'Firebase Admin not initialized. Check your environment variables.' },
                { status: 500 }
            ),
        };
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        return {
            success: true,
            userId: decodedToken.uid,
        };
    } catch (error: any) {
        return {
            success: false,
            response: NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 401 }
            ),
        };
    }
}
