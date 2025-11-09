import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Supabase environment variables are missing. Check your .env file.")
  // Create a dummy client to prevent crash
  supabase = {
    from: () => ({
      select: () => ({ order: () => ({ limit: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) }) }) }),
      insert: () => Promise.resolve({ error: { message: 'Supabase not configured' } })
    })
  }
} else {
   supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
     auth: {
       persistSession: true,
       autoRefreshToken: true
     },
     global: {
       headers: {
         'X-Client-Info': 'biovance-admin-panel'
       }
     }
   })
   console.log("✅ Supabase connected successfully")
   console.log("🔗 Project URL:", SUPABASE_URL)
   console.log("🌍 Region: ap-southeast-2 (Sydney)")
 }

export { supabase }