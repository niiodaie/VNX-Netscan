import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        // Handles PKCE flow if used
        await supabase.auth.exchangeCodeForSession(window.location.href)
      } catch (_) {
        // Fallback: hash flow handled below
      }

      // Check for active session
      const { data, error } = await supabase.auth.getSession()
      if (!cancelled) {
        if (data.session) {
          navigate('/profile', { replace: true })
        } else {
          setError(error?.message ?? 'Could not complete sign-in. Please try again.')
        }
      }
    })()

    return () => { cancelled = true }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-slate-600">
        {error ? error : 'Signing you in…'}
      </p>
    </div>
  )
}
