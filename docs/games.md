# AARA Games Suite Documentation

## Overview

The AARA Games Suite is a collection of 12 cognitive training and calming mini-games designed to improve focus, memory, and mental wellbeing. All games follow a consistent structure with start/play/end screens, difficulty levels, scoring, persistence, and analytics.

## Architecture

### Components

- **GameShell**: Common UI wrapper with HUD (timer, score), pause/resume, sound toggle
- **ResultPanel**: Standardized end-game screen showing score, accuracy, personal best
- **HUDTimer**: Visual countdown timer with low-time warning
- **SoundToggle**: Global sound control with localStorage persistence
- **GameErrorBoundary**: Graceful error handling wrapper

### Shared Libraries

- **lib/games/types.ts**: TypeScript types (Difficulty, GameKey, GameResult)
- **lib/games/scoring.ts**: Scoring utilities (combo bonuses, accuracy, validation)
- **lib/games/utils.ts**: Utilities (timers, haptics, reduced motion, randomization)
- **lib/games/validation.ts**: Anti-cheat validation with max scores per game/difficulty
- **lib/firebase/games.ts**: Firestore persistence and retrieval
- **lib/features.ts**: Feature flags (monetization hooks)

### API Endpoints

- **POST /api/games/save-result**: Server-side validation, rate limiting, and result persistence
- **GET /api/health**: Games module health check

## Game Catalog

### Focus Games

#### 1. Focus Flash
- **ID**: `focus-flash`
- **Description**: Click when the target circle appears; test reaction time and attention
- **Duration**: 30 seconds
- **Scoring**: Points per hit × difficulty multiplier, minus false positives
- **Max Scores**: Easy: 100, Medium: 200, Hard: 400

#### 2. Math Challenge
- **ID**: `math-challenge`
- **Description**: Solve arithmetic equations as fast as possible
- **Duration**: 30 seconds
- **Scoring**: Base points × combo bonus, quick-answer bonus
- **Max Scores**: Easy: 150, Medium: 350, Hard: 700

#### 3. Color-Stroop
- **ID**: `color-stroop`
- **Description**: Match ink color to the word meaning (classic Stroop task)
- **Duration**: 30 seconds
- **Scoring**: Points per correct match
- **Max Scores**: Easy: 100, Medium: 200, Hard: 400

#### 4. Go/No-Go
- **ID**: `go-nogo`
- **Description**: Tap when ▲ appears, ignore ●; response inhibition task
- **Duration**: 30 seconds
- **Scoring**: Points for Go responses, heavy penalty for false alarms
- **Max Scores**: Easy: 150, Medium: 300, Hard: 600

#### 5. Visual Search
- **ID**: `visual-search`
- **Description**: Find the ⭐ star symbol among distractors
- **Duration**: 60 seconds, 10 rounds
- **Scoring**: Points per find × difficulty multiplier
- **Max Scores**: Easy: 200, Medium: 400, Hard: 800

#### 6. Trail Connect
- **ID**: `trail-connect`
- **Description**: Connect numbered circles in order (Trail Making Test)
- **Duration**: 120 seconds
- **Scoring**: Completion speed + accuracy bonus
- **Max Scores**: Easy: 300, Medium: 600, Hard: 1000

### Memory Games

#### 7. Memory Flow
- **ID**: `memory-flow`
- **Description**: Memorize and repeat color sequence patterns
- **Duration**: No limit (level-based)
- **Scoring**: Level reached × difficulty multiplier
- **Max Scores**: Easy: 200, Medium: 500, Hard: 1000

#### 8. N-Back
- **ID**: `n-back`
- **Description**: Match letters from N positions back in the sequence
- **Duration**: 60 seconds
- **Scoring**: Correct matches × N-level multiplier
- **Max Scores**: Easy: 200, Medium: 400, Hard: 800

#### 9. Sequence Sort
- **ID**: `sequence-sort`
- **Description**: Sort scrambled numbers into ascending order
- **Duration**: 90 seconds, 8 rounds
- **Scoring**: Points per completed sort
- **Max Scores**: Easy: 160, Medium: 320, Hard: 640

#### 10. Word Match
- **ID**: `word-match`
- **Description**: Match synonym word pairs
- **Duration**: 60 seconds, 5 rounds
- **Scoring**: Points per match + combo bonus
- **Max Scores**: Easy: 150, Medium: 300, Hard: 600

### Calm Games

#### 11. Calm Breather
- **ID**: `calm-breather`
- **Description**: Follow 4-7-8 breathing rhythm for relaxation
- **Duration**: 180 seconds (3 minutes)
- **Scoring**: Completed cycles × difficulty multiplier
- **Max Scores**: Easy: 600, Medium: 800, Hard: 1000

#### 12. Mirror Trace
- **ID**: `mirror-trace`
- **Description**: Trace path with INVERTED controls
- **Duration**: 120 seconds, 5 paths
- **Scoring**: Accuracy (% on path) + speed completion
- **Max Scores**: Easy: 400, Medium: 600, Hard: 900

## Scoring System

### Base Scoring
Each game has a base point value per action:
- **Correct hit**: 1-5 points (varies by game)
- **Combo bonus**: +2% per combo level, capped at +50%
- **Difficulty multiplier**: Easy 1×, Medium 1.5×, Hard 2.5×

### Final Score Formula
```
finalScore = baseScore × (accuracy / 100) × comboMultiplier × difficultyMultiplier
```

### Accuracy Calculation
```
accuracy = (correct / total) × 100
```

## Anti-Cheat Measures

### Client-Side
- Debounce rapid clicks/taps (< 120ms ignored)
- SessionNonce generated per game run
- Basic sanity checks before Firestore write

### Server-Side
- Max score validation per game/difficulty
- Duration bounds: 1 second - 10 minutes
- Accuracy range: 0-100%
- Rate limiting: 10 saves/minute per user
- Reject negative scores or impossible values

## Data Model

### GameResult
```typescript
interface GameResult {
  game: GameKey
  difficulty: 'easy' | 'medium' | 'hard'
  score: number
  accuracy?: number      // 0-100
  durationMs: number
  streak?: number
  metadata?: {
    sessionNonce: string
    [key: string]: any
  }
  createdAt: number      // Date.now()
}
```

### Firestore Structure
```
/games/{uid}/{gameKey}/{autoId}: GameResult
/games_meta/{uid}: {
  personalBests: { [gameKey]: number }
  totals: { plays: number, minutes: number }
}
```

## Analytics Events

All games fire Mixpanel events:

### game_start
```json
{
  "game": "focus-flash",
  "difficulty": "medium"
}
```

### game_pause
```json
{
  "game": "focus-flash"
}
```

### game_resume
```json
{
  "game": "focus-flash"
}
```

### game_end
```json
{
  "game": "focus-flash",
  "difficulty": "medium",
  "score": 150,
  "accuracy": 85,
  "durationMs": 30000
}
```

### personal_best
```json
{
  "game": "focus-flash",
  "newScore": 200,
  "oldScore": 150
}
```

## Accessibility

### Keyboard Navigation
- **Tab**: Navigate interactive elements
- **Space/Esc**: Pause/resume game
- **Enter**: Submit answers

### Touch Controls
- All buttons ≥ 44px for mobile
- Haptic feedback via `navigator.vibrate()`
- Touch events properly handled

### Reduced Motion
- Respects `prefers-reduced-motion`
- Disables scale/transform animations
- Maintains functionality

## Performance

### Lazy Loading
All game components use React `lazy()`:
```typescript
const FocusFlash = lazy(() => import('@/components/games/FocusFlash'))
```

### Target Metrics
- **First game load**: < 1.5 seconds
- **Lighthouse Performance**: ≥ 90
- **Bundle optimization**: Code splitting per game

## Feature Flags

### GAMES_PREMIUM
- **Environment**: `NEXT_PUBLIC_FEATURE_GAMES_PREMIUM`
- **Default**: `false` (disabled)
- **When enabled**: Allows Stripe checkout for premium level access

Example integration:
```typescript
import { FEATURES } from '@/lib/features'
import { hasPremiumAccess, buyLevel } from '@/lib/stripe/games'

if (!hasPremiumAccess('mirror-trace', 'hard')) {
  <PremiumPrompt onBuy={() => buyLevel('mirror-trace', 'hard')} />
}
```

## Development

### Adding a New Game

1. Create component in `components/games/[GameName].tsx`
2. Follow existing game structure:
   - Start screen with difficulty selector
   - Play screen with GameShell wrapper
   - End screen with ResultPanel
   - SessionNonce and `performance.now()` timing
3. Add to `app/games/page.tsx`:
   - Lazy import
   - Add to `games` array with icon, description, category
4. Update `lib/games/validation.ts`:
   - Add max scores for new game
5. Update `lib/games/types.ts`:
   - Add game ID to `GameKey` union type

### Testing
```bash
# Type check
npm run typecheck

# Build
npm run build

# E2E tests (pending)
npm run test:e2e
```

## Troubleshooting

### Game Not Loading
- Check browser console for errors
- Verify lazy import path
- Ensure component exports default

### Scores Not Saving
- Check Firebase config in `.env.local`
- Verify user authentication
- Check server logs for validation errors

### Performance Issues
- Clear browser cache
- Check network tab for slow requests
- Verify lazy loading is working

## License

Copyright © AARA 2024. All rights reserved.


