import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export function useSession() {
  const [session, setSession] = useState(null as any)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let off: any
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session ?? null)
      setReady(true)
      const sub = supabase.auth.onAuthStateChange((_e, s) => setSession(s ?? null))
      off = () => sub.data.subscription.unsubscribe()
    })()
    return () => off && off()
  }, [])

  return { session, ready }
}

