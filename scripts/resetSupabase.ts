import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
})

async function resetAllData() {
    console.log('Resetting all data...')

    // Truncate tables
    await supabase.from('messages').delete().neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    await supabase.from('sessions').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('journal_entries').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    // Profiles?
    // await supabase.from('profiles').delete().neq('id', 'ignore')

    console.log('Done.')
}

resetAllData()
