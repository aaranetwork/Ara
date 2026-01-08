import { collection, doc, addDoc, query, where, orderBy, limit, getDocs, getDoc, setDoc } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import type { GameResult, GameKey } from '../games/types'
import { validateResult } from '../games/scoring'

/**
 * Save game result to Firestore
 * First validates via server endpoint, then saves to Firestore
 */
export async function saveGameResult(uid: string, result: GameResult): Promise<void> {
  if (!validateResult(result)) {
    console.error('Invalid game result detected')
    throw new Error('Invalid game result')
  }

  if (!db) {
    console.error('Firestore not initialized')
    throw new Error('Firestore not initialized')
  }

  try {
    // Call server validation endpoint first (server-side validation + rate limiting)
    const response = await fetch('/api/games/save-result', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to validate game result')
    }

    // If validation passes, save to Firestore
    const gameRef = collection(db, 'games', uid, result.game)
    await addDoc(gameRef, {
      ...result,
      timestamp: Timestamp.fromMillis(result.createdAt),
    })

    // Update metadata
    await updateGameMetadata(uid, result)
  } catch (error) {
    console.error('Error saving game result:', error)
    throw error
  }
}

/**
 * Update personal bests and totals in metadata collection
 */
async function updateGameMetadata(uid: string, result: GameResult): Promise<void> {
  if (!db) return
  
  try {
    const metaRef = doc(db, 'games_meta', uid)
    const metaDoc = await getDoc(metaRef)
    
    const currentMeta = metaDoc.exists() ? metaDoc.data() : {
      personalBests: {},
      totals: { plays: 0, minutes: 0 }
    }

    const personalBests = { ...currentMeta.personalBests }
    const currentBest = personalBests[result.game] || 0
    
    if (result.score > currentBest) {
      personalBests[result.game] = result.score
    }

    const totals = {
      plays: (currentMeta.totals?.plays || 0) + 1,
      minutes: (currentMeta.totals?.minutes || 0) + (result.durationMs / 60000)
    }

    await setDoc(metaRef, { personalBests, totals }, { merge: true })
  } catch (error) {
    console.error('Error updating game metadata:', error)
    // Don't throw - metadata update is not critical
  }
}

/**
 * Get last N results for a game
 */
export async function getLastResults(
  uid: string,
  gameKey: GameKey,
  maxResults: number = 5
): Promise<GameResult[]> {
  if (!db) return []
  
  try {
    const gameRef = collection(db, 'games', uid, gameKey)
    const q = query(gameRef, orderBy('timestamp', 'desc'), limit(maxResults))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        createdAt: data.timestamp?.toMillis() || data.createdAt,
      } as GameResult
    })
  } catch (error) {
    console.error('Error getting last results:', error)
    return []
  }
}

/**
 * Get personal best score for a game
 */
export async function getPersonalBest(uid: string, gameKey: GameKey): Promise<number | null> {
  if (!db) return null
  
  try {
    const metaRef = doc(db, 'games_meta', uid)
    const metaDoc = await getDoc(metaRef)
    
    if (!metaDoc.exists()) return null
    
    const personalBests = metaDoc.data()?.personalBests || {}
    return personalBests[gameKey] || null
  } catch (error) {
    console.error('Error getting personal best:', error)
    return null
  }
}

/**
 * Get user stats across all games
 */
export async function getUserGameStats(uid: string): Promise<{
  totalPlays: number
  totalMinutes: number
  personalBests: Record<string, number>
}> {
  if (!db) {
    return { totalPlays: 0, totalMinutes: 0, personalBests: {} }
  }
  
  try {
    const metaRef = doc(db, 'games_meta', uid)
    const metaDoc = await getDoc(metaRef)
    
    if (!metaDoc.exists()) {
      return { totalPlays: 0, totalMinutes: 0, personalBests: {} }
    }
    
    const data = metaDoc.data()
    return {
      totalPlays: data.totals?.plays || 0,
      totalMinutes: data.totals?.minutes || 0,
      personalBests: data.personalBests || {},
    }
  } catch (error) {
    console.error('Error getting user stats:', error)
    return { totalPlays: 0, totalMinutes: 0, personalBests: {} }
  }
}

