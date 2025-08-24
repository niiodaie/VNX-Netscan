import { supabase } from '@/lib/supabaseClient'

export async function startUpgrade() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    window.location.href = '/sign-in'
    return
  }
  
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}` 
    }
  })
  const { url, error } = await res.json()
  if (error) {
    alert(error)
    return
  }
  if (url) window.location.href = url
}

export async function getUserPlan() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return 'free'
  
  try {
    const res = await fetch('/api/user-plan', {
      headers: { 'Authorization': `Bearer ${session.access_token}` }
    })
    const data = await res.json()
    return data.plan || 'free'
  } catch (error) {
    console.error('Get plan error:', error)
    return 'free'
  }
}