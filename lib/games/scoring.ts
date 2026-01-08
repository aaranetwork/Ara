import type { GameResult } from './types'

/**
 * Calculate combo bonus for streak
 */
export function comboScore(base: number, combo: number): number {
  if (combo <= 1) return base
  // Small bonus: +2% per combo level, capped at +50%
  const bonus = Math.min(combo * 0.02, 0.5)
  return Math.round(base * (1 + bonus))
}

/**
 * Calculate accuracy percentage
 */
export function accuracy(correct: number, total: number): number {
  if (total === 0) return 100
  return Math.round((correct / total) * 100)
}

/**
 * Normalize score by duration (per-minute equivalent)
 */
export function normalize(score: number, durationMs: number): number {
  if (durationMs === 0) return score
  const minutes = durationMs / 60000
  return Math.round(score / minutes)
}

/**
 * Calculate improvement percentage vs previous score
 */
export function improvement(current: number, previous: number): number | null {
  if (!previous || previous === 0) return null
  const diff = current - previous
  const percent = Math.round((diff / previous) * 100)
  return percent
}

/**
 * Calculate final score with accuracy modifier
 */
export function finalScore(
  baseScore: number,
  accuracy: number,
  combo?: number
): number {
  let score = baseScore
  
  // Apply combo bonus
  if (combo) {
    score = comboScore(score, combo)
  }
  
  // Apply accuracy modifier (0.8x to 1.2x)
  const accuracyMod = 0.8 + (accuracy / 100) * 0.4
  score = Math.round(score * accuracyMod)
  
  return Math.max(0, score)
}

/**
 * Sanity check result for anti-cheat
 */
export function validateResult(result: GameResult): boolean {
  // Basic validation
  if (result.score < 0) return false
  if (result.durationMs < 0) return false
  if (result.accuracy !== undefined && (result.accuracy < 0 || result.accuracy > 100)) return false
  if (result.streak && result.streak < 0) return false
  
  // Duration sanity (max 2 hours)
  if (result.durationMs > 7200000) return false
  
  // Score sanity (max 1M for any game)
  if (result.score > 1000000) return false
  
  return true
}


