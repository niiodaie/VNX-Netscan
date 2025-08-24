import { useEffect, useState } from 'react'
import { supabase, ensureProfile } from '@/lib/supabaseClient'

type UseSession = {
  session: import('@supabase/supabase-js').Session | null
  ready: boolean
}

export function useSession(): UseSession {
  const [session, setSession] = useState<import('@supabase/supabase-js').Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let unsub: (() => void) | undefined

    const init = async () => {
      // 1) initial load
      const { data } = await supabase.auth.getSession()
      setSession(data.session ?? null)
      setReady(true)

      // 2) subscribe to changes
      const sub = supabase.auth.onAuthStateChange(async (_event, s) => {
        setSession(s ?? null)
        if (s) await ensureProfile()
      })
      unsub = () => sub.data.subscription.unsubscribe()
    }

    init()
    return () => { if (unsub) unsub() }
  }, [])

  return { session, ready }
}