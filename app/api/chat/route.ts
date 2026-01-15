import { NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase/admin'

// API Base URL from environment
const API_BASE_URL = process.env.AARA_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { message, sessionId } = body

        // Get the auth token from the incoming request headers
        const authHeader = req.headers.get('Authorization')
        const token = authHeader?.split(' ')[1] || process.env.AARA_API_TOKEN

        // Enforce Plan Limits (Server-Side)
        let context_depth = 'session'
        try {
            if (adminAuth && adminDb && token && token !== process.env.AARA_API_TOKEN) {
                const decoded = await adminAuth.verifyIdToken(token)
                const uid = decoded.uid

                const subRef = adminDb.collection('users').doc(uid).collection('subscription').doc('current')
                const subSnap = await subRef.get()
                const plan = subSnap.exists ? subSnap.data()?.plan : 'free'

                if (plan === 'unlimited') context_depth = 'long_term'
                else if (plan === 'plus') context_depth = 'short_term'

                console.log(`[CHAT] User ${uid} plan: ${plan}, depth: ${context_depth}`)
            }
        } catch (e) {
            console.warn('[CHAT] Failed to verify plan, defaulting to session:', e)
        }

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // Check if backend URL is configured
        if (!process.env.AARA_API_URL && !process.env.NEXT_PUBLIC_API_URL) {
            console.warn('AARA_API_URL is not set. Returning mock response.')
            return NextResponse.json({
                message: `[MOCK] Backend URL not configured. Received: "${message}"`,
                sessionId: sessionId || 'mock-session-id',
            })
        }

        // Build headers for the backend request
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        // Forward to AARA backend using the FAST endpoint for quick responses
        console.log(`Calling backend: ${API_BASE_URL}/v1/chat/fast`)
        console.log(`Token present: ${!!token}`)

        const response = await fetch(`${API_BASE_URL}/v1/chat/fast`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                sessionId,
                messages: [{ role: 'user', content: message }],
                context_depth // Injected by BFF based on authoritative plan check
            }),
        })

        // Get response as text first to handle non-JSON responses
        const responseText = await response.text()

        let data
        try {
            data = JSON.parse(responseText)
        } catch (parseError) {
            console.error('Failed to parse backend response:', responseText.substring(0, 500))
            return NextResponse.json(
                { error: `Backend returned invalid response (${response.status}): ${responseText.substring(0, 200)}` },
                { status: 502 }
            )
        }

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status })
        }

        // Transform backend response to expected format
        // Log the keys to find the correct field
        console.log('Backend response keys:', Object.keys(data))
        console.log('Full backend response:', JSON.stringify(data).substring(0, 500))

        // Try multiple possible field locations for the message content
        const messageContent =
            data.content ||                           // Direct content field
            data.message ||                           // Direct message field
            data.text ||                              // Direct text field
            data.choices?.[0]?.message?.content ||    // OpenAI-style format
            data.response ||                          // Response field
            data.reply ||                             // Reply field
            ''

        const transformedResponse = {
            message: messageContent,
            sessionId: data.sessionId,
            id: data.id,
            requestId: data.requestId,
        }

        console.log('Extracted message:', messageContent?.substring(0, 100))

        return NextResponse.json(transformedResponse)
    } catch (error: any) {
        // Check for ECONNREFUSED to prevent log spam in dev
        const isConnectionRefused =
            error?.cause?.code === 'ECONNREFUSED' ||
            (error?.cause?.errors && Array.isArray(error.cause.errors) && error.cause.errors.some((e: any) => e.code === 'ECONNREFUSED'));

        if (isConnectionRefused) {
            console.warn('[CHAT] Backend unreachable (ECONNREFUSED).');
        } else {
            console.error('Proxy Error:', error);
        }

        return NextResponse.json(
            { error: error.message || 'Internal Server Error', details: 'Check that AARA_API_URL and AARA_API_TOKEN are set correctly in .env.local' },
            { status: 500 }
        )
    }
}
