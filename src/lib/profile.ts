// lib/profile.ts
import { supabase } from '@/lib/supabaseClient'

export async function upsertProfile(partial: {
  username?: string
  first_name?: string
  last_name?: string
  full_name?: string
}) {
  const user = (await supabase.auth.getUser()).data.user
  if (!user) throw new Error('Not authenticated')
  return supabase.from('profiles').upsert({ id: user.id, ...partial }).select().single()
}
