/**
 * Premium game monetization hooks
 * These are disabled by default (FEATURE_GAMES_PREMIUM = false)
 */

import { FEATURES } from '../features'
import type { GameKey } from '../games/types'

/**
 * Buy premium level access for a game
 * This is a stub that can be integrated with Stripe checkout when the feature flag is enabled
 */
export async function buyLevel(gameKey: GameKey, level: 'hard'): Promise<void> {
  if (!FEATURES.GAMES_PREMIUM) {
    console.warn('Premium games feature is disabled')
    return
  }
  
  // TODO: Implement Stripe checkout integration
  // const response = await fetch('/api/payments/create-checkout', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ gameKey, level, price: 4.99 }),
  // })
  //
  // if (!response.ok) {
  //   throw new Error('Failed to initiate payment')
  // }
  //
  // const { checkoutUrl } = await response.json()
  // window.location.href = checkoutUrl
  
  console.log('Premium level purchase stub:', { gameKey, level })
}

/**
 * Check if user has premium access to a game level
 */
export function hasPremiumAccess(gameKey: GameKey, level: string): boolean {
  if (!FEATURES.GAMES_PREMIUM) {
    return true // If feature is disabled, all levels are accessible
  }
  
  // TODO: Check user's subscription/payment status
  // For now, return false for premium levels
  return false
}


