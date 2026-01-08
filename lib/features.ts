/**
 * Feature flags configuration
 * Environment variables should be set in .env.local
 */
export const FEATURES = {
  GAMES_PREMIUM: process.env.NEXT_PUBLIC_FEATURE_GAMES_PREMIUM === 'true',
} as const

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURES): boolean {
  return FEATURES[feature]
}


