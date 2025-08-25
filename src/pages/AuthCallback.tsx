import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    (async () => {
      // Supabase puts tokens in the hash (/#access_token=…)
      // Exchange the whole URL for a session
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (cancelled) return

      if (error) {
        setError(error.message || 'Link invalid or expired.')
        // send them back to sign-in after a short pause
        setTimeout(() => navigate('/sign-in', { replace: true }), 1500)
        return
      }

      // SUCCESS: replace URL to /profile (removes auth hash too)
      navigate('/profile', { replace: true })
    })()

    return () => { cancelled = true }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center text-slate-700">
        <div className="animate-spin mx-auto mb-4 h-8 w-8 rounded-full border-b-2 border-blue-600" />
        <p>{error ? error : 'Signing you in…'}</p>
      </div>
    </div>
  )
}
