import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  Query,
} from 'firebase/firestore'
import { db } from './config'

// Check if Firestore is initialized
const checkDb = () => {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check your .env.local configuration.')
  }
  return db
}

// Users Collection
export const getUserData = async (userId: string) => {
  const dbInstance = checkDb()
  const userRef = doc(dbInstance, 'users', userId)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? userSnap.data() : null
}

export const updateUserData = async (userId: string, data: any) => {
  const dbInstance = checkDb()
  const userRef = doc(dbInstance, 'users', userId)
  await updateDoc(userRef, data)
}

// User Profile (AARA-specific data)
export const getUserProfile = async (userId: string) => {
  const userData = await getUserData(userId)
  return userData?.profile || null
}

export const updateUserProfile = async (userId: string, profileData: {
  displayName?: string
  occupation?: string
  interests?: string[]
  notes?: string[]
}) => {
  const dbInstance = checkDb()
  const userRef = doc(dbInstance, 'users', userId)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    const currentProfile = userSnap.data().profile || {}
    await updateDoc(userRef, {
      profile: { ...currentProfile, ...profileData, lastSeen: Date.now() }
    })
  } else {
    // Create user document if it doesn't exist
    await setDoc(userRef, {
      profile: { ...profileData, lastSeen: Date.now() },
      createdAt: Timestamp.now()
    })
  }
}

// Chats Collection
export const createChatSession = async (userId: string, initialMessage?: string) => {
  const dbInstance = checkDb()
  const chatRef = doc(collection(dbInstance, 'chats'))
  const chatData = {
    userId,
    messages: initialMessage ? [{ role: 'user', content: initialMessage, timestamp: Timestamp.now() }] : [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    summary: null,
  }
  await setDoc(chatRef, chatData)
  return chatRef.id
}

export const getChatSessions = async (userId: string) => {
  const dbInstance = checkDb()
  const chatsRef = collection(dbInstance, 'chats')
  const q = query(chatsRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const updateChatSession = async (sessionId: string, message: any) => {
  const dbInstance = checkDb()
  const chatRef = doc(dbInstance, 'chats', sessionId)
  const chatSnap = await getDoc(chatRef)
  if (chatSnap.exists()) {
    const currentMessages = chatSnap.data().messages || []
    await updateDoc(chatRef, {
      messages: [...currentMessages, message],
      updatedAt: Timestamp.now(),
    })
  }
}

export const saveChatSummary = async (sessionId: string, summary: any) => {
  const dbInstance = checkDb()
  const chatRef = doc(dbInstance, 'chats', sessionId)
  await updateDoc(chatRef, { summary, updatedAt: Timestamp.now() })
}

export const getChatSession = async (sessionId: string) => {
  const dbInstance = checkDb()
  const chatRef = doc(dbInstance, 'chats', sessionId)
  const chatSnap = await getDoc(chatRef)
  return chatSnap.exists() ? { id: chatSnap.id, ...chatSnap.data() } : null
}

export const getLatestChatSession = async (userId: string) => {
  const dbInstance = checkDb()
  const chatsRef = collection(dbInstance, 'chats')
  const q = query(chatsRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'), limit(1))
  const querySnapshot = await getDocs(q)
  if (querySnapshot.empty) return null
  const doc = querySnapshot.docs[0]
  return { id: doc.id, ...doc.data() }
}

export const addMessageToChat = async (sessionId: string, role: 'user' | 'assistant', content: string) => {
  const dbInstance = checkDb()
  const chatRef = doc(dbInstance, 'chats', sessionId)
  const chatSnap = await getDoc(chatRef)
  if (chatSnap.exists()) {
    const currentMessages = chatSnap.data().messages || []
    await updateDoc(chatRef, {
      messages: [...currentMessages, { role, content, timestamp: Timestamp.now() }],
      updatedAt: Timestamp.now(),
    })
  }
}

// Journal Collection
export const createJournalEntry = async (userId: string, entry: any) => {
  const dbInstance = checkDb()
  const journalRef = collection(dbInstance, 'journal', userId, 'entries')
  const entryData = {
    ...entry,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
  const docRef = await addDoc(journalRef, entryData)
  return docRef.id
}

export const getJournalEntries = async (userId: string) => {
  const dbInstance = checkDb()
  const journalRef = collection(dbInstance, 'journal', userId, 'entries')
  const q = query(journalRef, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const updateJournalEntry = async (userId: string, entryId: string, entry: any) => {
  const dbInstance = checkDb()
  const entryRef = doc(dbInstance, 'journal', userId, 'entries', entryId)
  await updateDoc(entryRef, {
    ...entry,
    updatedAt: Timestamp.now(),
  })
}

export const deleteJournalEntry = async (userId: string, entryId: string) => {
  const dbInstance = checkDb()
  const entryRef = doc(dbInstance, 'journal', userId, 'entries', entryId)
  await deleteDoc(entryRef)
}

// Games Collection - Structure: /games/{uid}/{gameId}
export const saveGameScore = async (userId: string, gameType: string, score: number) => {
  const dbInstance = checkDb()
  const gamesRef = collection(dbInstance, 'games', userId, 'scores')
  const scoreData = {
    gameType,
    score,
    timestamp: Timestamp.now(),
    createdAt: Timestamp.now(),
  }
  await addDoc(gamesRef, scoreData)
}

export const getGameScores = async (userId: string, gameType?: string) => {
  const dbInstance = checkDb()
  const gamesRef = collection(dbInstance, 'games', userId, 'scores')
  let q: Query
  if (gameType) {
    q = query(gamesRef, where('gameType', '==', gameType), orderBy('timestamp', 'desc'))
  } else {
    q = query(gamesRef, orderBy('timestamp', 'desc'))
  }
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

// Therapists Collection
export const getTherapists = async () => {
  const dbInstance = checkDb()
  const therapistsRef = collection(dbInstance, 'therapists')
  const querySnapshot = await getDocs(therapistsRef)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export const getTherapist = async (therapistId: string) => {
  const dbInstance = checkDb()
  const therapistRef = doc(dbInstance, 'therapists', therapistId)
  const therapistSnap = await getDoc(therapistRef)
  return therapistSnap.exists() ? { id: therapistSnap.id, ...therapistSnap.data() } : null
}

// Bookings Collection - Structure: /bookings/{uid}/{bookingId}
export const createBooking = async (userId: string, bookingData: any) => {
  const dbInstance = checkDb()
  const bookingsRef = collection(dbInstance, 'bookings', userId, 'sessions')
  const booking = {
    ...bookingData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }
  const docRef = await addDoc(bookingsRef, booking)
  return docRef.id
}

export const getBookings = async (userId: string) => {
  const dbInstance = checkDb()
  const bookingsRef = collection(dbInstance, 'bookings', userId, 'sessions')
  const q = query(bookingsRef, orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
