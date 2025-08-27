// lib/profile.ts
import { supabase } from '@/lib/supabaseClient'

type PartialProfile = {
  username?: string
  first_name?: string
  last_name?: string
  full_name?: string
}

export async function upsertProfile(partial: PartialProfile) {
  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr) throw userErr
  const user = userData.user
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...partial })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getProfile() {
  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr) throw userErr
  const user = userData.user
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}
