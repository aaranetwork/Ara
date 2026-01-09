import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verifyAuth'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
    try {
        const user = await verifyAuth(request)
        const { message, type } = await request.json()

        if (!message || !message.trim()) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        const feedbackTitle = type === 'bug' ? 'Bug Report 🐛' : 'User Feedback 💭'

        // In production, sending to the admin (you)
        // Using the user's email as the 'from' might fail if domain not verified.
        // Best practice: Send FROM 'onboarding@resend.dev' (or your domain)
        // and set Reply-To as the user's email.

        try {
            await resend.emails.send({
                from: 'AARA App <onboarding@resend.dev>',
                to: process.env.ADMIN_EMAIL || 'rapid9310@gmail.com',
                replyTo: user.email || 'noreply@aara.ai',
                subject: `${feedbackTitle} from ${user.displayName || 'User'}`,
                html: `
          <h3>New Feedback Received</h3>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>User:</strong> ${user.email} (${user.uid})</p>
          <hr />
          <p style="white-space: pre-wrap;">${message}</p>
          <br />
          <p style="font-size: 12px; color: #666;">Sent from AARA App Alpha</p>
        `
            })
        } catch (emailError) {
            console.error('Resend Error:', emailError)
            // Don't block the UI if email fails silently, or throw? 
            // Let's log but return success to user for now, or throw to specific error
            throw new Error('Failed to send email via Resend')
        }

        return NextResponse.json({ success: true, message: 'Feedback sent' })
    } catch (error: any) {
        console.error('Feedback API Error:', error)
        return NextResponse.json(
            { error: error.message || 'Failed to submit feedback' },
            { status: 500 }
        )
    }
}
