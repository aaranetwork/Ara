import { NextRequest, NextResponse } from 'next/server'

/**
 * Contact Form Submission Endpoint (Stub)
 * 
 * TODO: Implement email sending using one of:
 * - EmailJS (client-side or server-side)
 * - SendGrid API
 * - AWS SES
 * - Resend
 * - Nodemailer with SMTP
 * 
 * The endpoint should:
 * 1. Validate input fields (name, email, topic, message)
 * 2. Sanitize user inputs to prevent injection attacks
 * 3. Rate limit submissions per IP/email
 * 4. Send email to contact@aara.ai with formatted message
 * 5. Optionally save to Firestore for record-keeping
 * 6. Return success/error response
 * 
 * Security considerations:
 * - Validate email format
 * - Sanitize message content
 * - Implement CAPTCHA for spam prevention
 * - Rate limit: max 5 submissions per hour per IP
 */

interface ContactRequest {
  name: string
  email: string
  topic: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json()

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields', message: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email', message: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const sanitizedName = body.name.trim().slice(0, 100)
    const sanitizedEmail = body.email.trim().slice(0, 100)
    const sanitizedMessage = body.message.trim().slice(0, 5000)

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received. We\'ll get back to you within 24 hours.',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Failed to send message. Please try again later or email us directly at contact@aara.ai',
      },
      { status: 500 }
    )
  }
}


