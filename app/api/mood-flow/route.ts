import { NextResponse } from 'next/server'

const API_BASE_URL = process.env.AARA_API_URL || 'http://localhost:3005'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { type, value, note } = body

        // Validate
        if (!type || typeof value !== 'number' || value < 1 || value > 10) {
            return NextResponse.json({ error: 'Invalid signal data' }, { status: 400 })
        }

        const validTypes = ['daily_state', 'energy', 'stress', 'clarity', 'safety']
        if (!validTypes.includes(type)) {
            return NextResponse.json({ error: 'Invalid signal type' }, { status: 400 })
        }

        // Get auth token
        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.split(' ')[1]

        // Forward to backend
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/v1/mood-flow`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ type, value, note })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return NextResponse.json(errorData, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error: any) {
        console.error('Mood Flow POST Error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const period = searchParams.get('period') || 'week'

        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.split(' ')[1]

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/v1/mood-flow?period=${period}`, {
            method: 'GET',
            headers
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            return NextResponse.json(errorData, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json(data)

    } catch (error: any) {
        console.error('Mood Flow GET Error:', error)
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        )
    }
}
