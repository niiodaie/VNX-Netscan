import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let unsub: (() => void) | undefined

    ;(async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session ?? null)
      setReady(true)

      const sub = supabase.auth.onAuthStateChange((_e, s) => {
        setSession(s ?? null)
      })
      unsub = () => sub.data.subscription.unsubscribe()
    })()

    return () => {
      if (unsub) unsub()
    }
  }, [])

  return { session, ready }
}
