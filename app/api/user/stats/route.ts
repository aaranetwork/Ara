import { NextResponse } from 'next/server'

// API Base URL from environment
const API_BASE_URL = process.env.AARA_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

export async function POST(req: Request) {
    try {
        // Get the auth token from the incoming request headers
        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.split(' ')[1] || process.env.AARA_API_TOKEN

        // Check if backend URL is configured
        if (!process.env.AARA_API_URL && !process.env.NEXT_PUBLIC_API_URL) {
            console.warn('AARA_API_URL is not set. Returning mock user stats.')
            return NextResponse.json({
                entries: 12,
                totalMinutes: 340,
                clarityScore: 78,
                mock: true
            })
        }

        // Build headers for the backend request
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        // Forward to AARA backend
        const response = await fetch(`${API_BASE_URL}/v1/user/stats`, {
            method: 'GET', // Backend likely uses GET for stats
            headers,
        })

        if (!response.ok) {
            // If backend is configured but fails/is down, we might want to fallback to mock data 
            // BUT usually we want to know it failed. 
            // However, for this specific "localhost:3005" issue where the user might have config but no server
            // we can try to catch fetch errors.
            // For now, return proxy response.
            try {
                const data = await response.json()
                return NextResponse.json(data, { status: response.status })
            } catch (e) {
                return NextResponse.json({ error: 'Backend error' }, { status: response.status })
            }
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error: any) {
        // Fallback to mock data if connection fails (e.g. backend down)
        console.error('User Stats Fetch Error, falling back to mock:', error)
        return NextResponse.json({
            entries: 10,
            totalMinutes: 120,
            clarityScore: 75,
            mock: true,
            error: 'Backend unreachable'
        })
    }
}

// Allow GET as well for flexibility
export async function GET(req: Request) {
    return POST(req)
}
