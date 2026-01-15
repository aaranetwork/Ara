import { NextResponse } from 'next/server'

// API Base URL from environment
const API_BASE_URL = process.env.AARA_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { userId, userName } = body

        // Get the auth token from the incoming request headers
        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.split(' ')[1] || process.env.AARA_API_TOKEN

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }

        // Check if backend URL is configured
        if (!process.env.AARA_API_URL && !process.env.NEXT_PUBLIC_API_URL) {
            console.warn('AARA_API_URL is not set. Returning mock session.')
            return NextResponse.json({
                sessionId: `mock-session-${Date.now()}`,
                userId,
                userName,
                createdAt: new Date().toISOString(),
            })
        }

        // Build headers for the backend request
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        // Forward to AARA backend /v1/sessions endpoint with userName
        const response = await fetch(`${API_BASE_URL}/v1/sessions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ userId, userName }),
        })

        const data = await response.json()

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status })
        }

        return NextResponse.json(data)
    } catch (error: any) {
        // Check for ECONNREFUSED to prevent log spam in dev
        const isConnectionRefused =
            error?.cause?.code === 'ECONNREFUSED' ||
            (error?.cause?.errors && Array.isArray(error.cause.errors) && error.cause.errors.some((e: any) => e.code === 'ECONNREFUSED'));

        if (isConnectionRefused) {
            console.warn('[SESSION] Backend unreachable (ECONNREFUSED).');
        } else {
            console.error('Session Creation Error:', error);
        }

        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
