import { adminDb, adminAuth } from '@/lib/firebase/admin'

export const db = adminDb
export const auth = adminAuth

export const isAdminInitialized = () => {
  return adminDb !== null
}

