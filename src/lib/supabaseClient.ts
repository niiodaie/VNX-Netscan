import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

/** Ensures a profile row exists for the current user (defensive). */
export async function ensureProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data, error } = await supabase
    .from('profiles').select('id').eq('id', user.id).maybeSingle()
  if (!data && !error) {
    await supabase.from('profiles').insert({ id: user.id, email: user.email })
  }
}