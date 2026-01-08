'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { auth } from '@/lib/firebaseAdmin'
import { Auth } from 'firebase-admin/auth'

export async function getChatSessions(token: string) {
    if (!auth) throw new Error('Auth not initialized')
    const firebaseAuth = auth as Auth
    try {
        const decodedToken = await firebaseAuth.verifyIdToken(token)
        const uid = decodedToken.uid

        // Fetch sessions
        const { data: sessions, error } = await supabaseAdmin
            .from('sessions')
            .select(`
        id,
        created_at,
        updated_at,
        messages (
            role,
            content,
            created_at
        )
      `)
            .eq('user_id', uid)
            .order('updated_at', { ascending: false })

        if (error) throw error

        // Transform to frontend format if needed
        // Frontend expects: { id, messages: [], updatedAt, preview }
        const formattedSessions = sessions?.map((s: any) => ({
            id: s.id,
            messages: s.messages.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
            updatedAt: s.updated_at,
            preview: s.messages[0]?.content || 'New chat' // simplified preview
        })) || []

        return { data: formattedSessions }
    } catch (error: any) {
        console.error('Error fetching chat sessions:', error)
        return { error: error.message }
    }
}

export async function saveChatSession(token: string, session: { id: string, messages: any[] }) {
    if (!auth) throw new Error('Auth not initialized')
    const firebaseAuth = auth as Auth
    try {
        const decodedToken = await firebaseAuth.verifyIdToken(token)
        const uid = decodedToken.uid

        // 1. Upsert Session
        const { error: sessionError } = await supabaseAdmin
            .from('sessions')
            .upsert({
                id: session.id,
                user_id: uid,
                updated_at: new Date().toISOString()
            })

        if (sessionError) throw sessionError

        // 2. Sync Messages
        // Strategy: Delete existing for this session and re-insert (Cleanest for consistency without complex diffing)
        // Warning: This generates ID churn. For production, better to upsert.
        // For now, let's just insert new ones? No, duplicates.
        // Let's Delete and Insert.

        await supabaseAdmin.from('messages').delete().eq('session_id', session.id)

        const messagesToInsert = session.messages.map(m => ({
            session_id: session.id,
            role: m.role,
            content: m.content,
            created_at: m.timestamp || new Date().toISOString()
        }))

        if (messagesToInsert.length > 0) {
            const { error: msgError } = await supabaseAdmin
                .from('messages')
                .insert(messagesToInsert)
            if (msgError) throw msgError
        }

        return { success: true }

    } catch (error: any) {
        console.error('Error saving chat session:', error)
        return { error: error.message }
    }
}

export async function deleteChatSession(token: string, sessionId: string) {
    if (!auth) throw new Error('Auth not initialized')
    const firebaseAuth = auth as Auth
    try {
        const decodedToken = await firebaseAuth.verifyIdToken(token)
        const uid = decodedToken.uid

        const { error } = await supabaseAdmin
            .from('sessions')
            .delete()
            .eq('id', sessionId)
            .eq('user_id', uid)

        if (error) throw error
        return { success: true }
    } catch (error: any) {
        return { error: error.message }
    }
}
