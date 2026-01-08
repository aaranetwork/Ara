export type Difficulty = 'easy' | 'medium' | 'hard'

export type GameKey =
  | 'focus-flash'
  | 'math-challenge'
  | 'memory-flow'
  | 'color-stroop'
  | 'calm-breather'
  | 'go-nogo'
  | 'n-back'
  | 'visual-search'
  | 'trail-connect'
  | 'sequence-sort'
  | 'word-match'
  | 'mirror-trace'

export interface GameResult {
  game: GameKey
  difficulty: Difficulty
  score: number
  accuracy?: number // 0..100
  durationMs: number
  streak?: number
  metadata?: Record<string, any>
  createdAt: number // Date.now()
  sessionNonce?: string
}

export interface GameConfig {
  difficulty: Difficulty
  soundEnabled: boolean
  reducedMotion: boolean
}

export interface GameMetadata {
  name: string
  description: string
  category: 'focus' | 'memory' | 'calm'
  icon: React.ComponentType<{ className?: string }>
  estimatedDuration: number // seconds
}

export interface GameState {
  isActive: boolean
  isPaused: boolean
  timeLeft: number
  score: number
  accuracy: number
  streak: number
}


