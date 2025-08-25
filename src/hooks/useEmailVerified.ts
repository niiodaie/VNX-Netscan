import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

/**
 * Returns { verifying, emailVerified, refresh }
 * - verifying: true while checking latest status
 * - emailVerified: true/false depending on Supabase user.email_confirmed_at
 * - refresh(): re-fetch from Supabase auth
 */
export function useEmailVerified(session: any) {
  const [verifying, setVerifying] = useState(true)
  const [emailVerified, setEmailVerified] = useState<boolean>(false)

  const refresh = async () => {
    if (!session) return
    setVerifying(true)
    const { data } = await supabase.auth.getUser()
    setEmailVerified(!!data.user?.email_confirmed_at)
    setVerifying(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id])

  return { verifying, emailVerified, refresh }
}
