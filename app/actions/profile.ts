'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { auth } from '@/lib/firebaseAdmin'
import { Auth } from 'firebase-admin/auth'

export async function getUserProfile(token: string) {
    if (!auth) throw new Error('Auth not initialized')
    const firebaseAuth = auth as Auth
    try {
        const decodedToken = await firebaseAuth.verifyIdToken(token)
        const uid = decodedToken.uid

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', uid)
            .single()

        if (error) return { data: null } // No profile yet
        return { data }
    } catch (error: any) {
        return { error: error.message }
    }
}

export async function saveUserProfile(token: string, profile: any) {
    if (!auth) throw new Error('Auth not initialized')
    const firebaseAuth = auth as Auth
    try {
        const decodedToken = await firebaseAuth.verifyIdToken(token)
        const uid = decodedToken.uid

        console.log('[PROFILE] Saving for uid:', uid, profile);

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .upsert({
                id: uid,
                email: decodedToken.email,
                full_name: profile.name,
                // If we want to store other fields, we need columns or a jsonb 'metadata' column.
                // For now, let's assume 'metadata' doesn't exist, so we only save name.
                // If the user *needs* these fields, I should check schema.
                updated_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            console.error('[PROFILE] Save error:', error);
            throw error
        }

        console.log('[PROFILE] Saved:', data);
        return { success: true, data }
    } catch (error: any) {
        console.error('[PROFILE] Exception:', error);
        return { error: error.message }
    }
}
