import type { GameResult, GameKey, Difficulty } from './types'

/**
 * Maximum plausible scores per game and difficulty
 * These are set based on realistic high-performance gameplay
 */
const MAX_SCORES: Record<GameKey, Record<Difficulty, number>> = {
  'focus-flash': { easy: 100, medium: 200, hard: 400 },
  'math-challenge': { easy: 150, medium: 350, hard: 700 },
  'memory-flow': { easy: 200, medium: 500, hard: 1000 },
  'color-stroop': { easy: 100, medium: 200, hard: 400 },
  'calm-breather': { easy: 600, medium: 800, hard: 1000 },
  'go-nogo': { easy: 150, medium: 300, hard: 600 },
  'n-back': { easy: 200, medium: 400, hard: 800 },
  'visual-search': { easy: 200, medium: 400, hard: 800 },
  'trail-connect': { easy: 300, medium: 600, hard: 1000 },
  'sequence-sort': { easy: 160, medium: 320, hard: 640 },
  'word-match': { easy: 150, medium: 300, hard: 600 },
  'mirror-trace': { easy: 400, medium: 600, hard: 900 },
}

/**
 * Minimum duration in ms (to prevent impossibly fast games)
 */
const MIN_DURATION_MS = 1000 // 1 second

/**
 * Maximum duration in ms (to prevent overnight sessions)
 */
const MAX_DURATION_MS = 600000 // 10 minutes

/**
 * Validate a game result for server-side anti-cheat
 */
export function validateGameResult(result: GameResult): {
  valid: boolean
  reason?: string
} {
  // Basic type checks
  if (!result.game || !result.difficulty) {
    return { valid: false, reason: 'Missing game or difficulty' }
  }

  // Score validation
  if (result.score < 0) {
    return { valid: false, reason: 'Negative score not allowed' }
  }

  // Max score per game/difficulty
  const maxScore = MAX_SCORES[result.game]?.[result.difficulty]
  if (maxScore && result.score > maxScore) {
    return {
      valid: false,
      reason: `Score ${result.score} exceeds maximum ${maxScore} for ${result.game}/${result.difficulty}`,
    }
  }

  // Duration validation
  if (result.durationMs < MIN_DURATION_MS) {
    return {
      valid: false,
      reason: `Duration ${result.durationMs}ms is too short (min: ${MIN_DURATION_MS}ms)`,
    }
  }

  if (result.durationMs > MAX_DURATION_MS) {
    return {
      valid: false,
      reason: `Duration ${result.durationMs}ms is too long (max: ${MAX_DURATION_MS}ms)`,
    }
  }

  // Accuracy validation
  if (result.accuracy !== undefined) {
    if (result.accuracy < 0 || result.accuracy > 100) {
      return { valid: false, reason: 'Accuracy must be between 0 and 100' }
    }
  }

  // Streak validation (not negative)
  if (result.streak !== undefined && result.streak < 0) {
    return { valid: false, reason: 'Streak cannot be negative' }
  }

  // Metadata should have sessionNonce
  if (!result.metadata?.sessionNonce) {
    return { valid: false, reason: 'Missing sessionNonce in metadata' }
  }

  return { valid: true }
}

/**
 * Get max score for a game/difficulty (for display purposes)
 */
export function getMaxScore(game: GameKey, difficulty: Difficulty): number {
  return MAX_SCORES[game]?.[difficulty] || 1000
}


