import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      try {
        const url = window.location.href
        const hasHash = url.includes('#')
        const hasCode = new URL(url).searchParams.has('code')

        if (hasCode) {
          // PKCE code flow (?code=...)
          const { error } = await supabase.auth.exchangeCodeForSession(url)
          if (error) throw error
        } else if (hasHash) {
          // Access token in hash (#access_token=...)
          const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true })
          if (error) throw error
        } else {
          // Nothing to do, bounce to sign-in
          navigate('/sign-in', { replace: true })
          return
        }

        // Clean the URL and go to profile
        window.history.replaceState({}, '', '/')
        navigate('/profile', { replace: true })
      } catch (err) {
        // If anything goes wrong, send back to sign-in with a hint
        navigate('/sign-in?callback=error', { replace: true })
      }
    }
    run()
  }, [navigate])

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-slate-600">Signing you in…</div>
    </div>
  )
}
