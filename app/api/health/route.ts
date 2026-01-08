import { NextResponse } from 'next/server'

/**
 * GET /api/health
 * Health check endpoint for games module status
 */
export async function GET() {
  const gameCount = 12 // Total games in the suite
  
  return NextResponse.json({
    status: 'ok',
    games: gameCount,
    timestamp: Date.now(),
    version: '1.0.0',
    features: {
      validation: true,
      analytics: true,
      persistence: true,
      accessibility: true,
    },
  })
}


