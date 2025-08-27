// src/hooks/useSession.ts
import { useEffect, useState } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

export function useSession() {
  const [session, setSession] = useState<Session | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let unsub: (() => void) | undefined

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session ?? null)
      setReady(true)

      const sub = supabase.auth.onAuthStateChange((_event, s) => {
        setSession(s ?? null)
      })
      unsub = () => sub.data.subscription.unsubscribe()
    }

    init()
    return () => unsub?.()
  }, [])

  return { session, ready }
}
