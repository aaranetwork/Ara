import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth/verifyAuth'
import { createBooking } from '@/lib/firebase/firestore'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyAuth(request)

    // Validate request body
    const body = await request.json()
    const { therapistId, date, time, sessionType, duration, shareSummary } = body

    if (!therapistId || !date || !time || !sessionType || !duration) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate sessionType
    if (!['Video', 'Audio', 'Chat'].includes(sessionType)) {
      return NextResponse.json(
        { error: 'Invalid session type' },
        { status: 400 }
      )
    }

    // Validate duration
    if (!['30', '60'].includes(duration.toString())) {
      return NextResponse.json(
        { error: 'Invalid duration' },
        { status: 400 }
      )
    }

    // Create booking
    const bookingData = {
      therapistId,
      therapistName: therapistId, // You may want to fetch therapist name
      date,
      time,
      sessionType,
      duration: parseInt(duration),
      shareSummary: shareSummary === true,
      paymentStatus: 'pending',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    const bookingId = await createBooking(user.uid, bookingData)

    return NextResponse.json({ 
      success: true, 
      bookingId,
      message: 'Booking created successfully' 
    })
  } catch (error: any) {
    if (error.message.includes('Authentication failed')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}

