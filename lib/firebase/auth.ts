import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { auth } from './config'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from './config'

// Check if Firebase is initialized
const checkAuth = () => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please check your .env.local configuration.')
  }
  return auth
}

export const signInWithGoogle = async () => {
  const authInstance = checkAuth()
  const provider = new GoogleAuthProvider()
  const result = await signInWithPopup(authInstance, provider)
  await createUserProfile(result.user)
  return result.user
}

export const signInWithEmail = async (email: string, password: string) => {
  const authInstance = checkAuth()
  const result = await signInWithEmailAndPassword(authInstance, email, password)
  return result.user
}

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  const authInstance = checkAuth()
  const result = await createUserWithEmailAndPassword(authInstance, email, password)
  await updateProfile(result.user, { displayName })
  await createUserProfile(result.user)
  return result.user
}

export const logout = async () => {
  const authInstance = checkAuth()
  await signOut(authInstance)
}

export const getCurrentUser = (): User | null => {
  return auth?.currentUser || null
}

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.warn('Firebase Auth not initialized')
    // Call callback immediately with null to prevent infinite loading
    callback(null)
    return () => {} // Return no-op unsubscribe function
  }
  return onAuthStateChanged(auth, callback)
}

const createUserProfile = async (user: User) => {
  if (!db) {
    console.warn('Firestore not initialized, skipping user profile creation')
    return
  }
  const userRef = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userRef)
  
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date().toISOString(),
      streaks: 0,
      moodData: [],
      preferences: {},
    })
  }
}

