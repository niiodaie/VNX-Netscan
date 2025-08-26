 import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'working' | 'ok' | 'error'>('working')
  const [message, setMessage] = useState('Completing sign-in…')

  useEffect(() => {
    let cancelled = false

    const complete = async () => {
      try {
        // Works for both PKCE code flow (?code=…&code_verifier=…) and hash magic links (#access_token=…)
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) throw error

        if (!cancelled) {
          setStatus('ok')
          setMessage('Signed in successfully. Redirecting…')
          // Small delay so users can see the success state
          setTimeout(() => navigate('/profile', { replace: true }), 300)
        }
      } catch (e: any) {
        if (!cancelled) {
          setStatus('error')
          setMessage(e?.message || 'Could not complete sign-in. Please try again.')
          // After a short pause, bounce to /sign-in where users can retry
          setTimeout(() => navigate('/sign-in', { replace: true }), 1200)
        }
      }
    }

    complete()
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md text-center">
        <div className="rounded-xl border bg-white/70 backdrop-blur p-6 shadow">
          {status === 'working' && (
            <>
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              <h1 className="text-lg font-semibold text-slate-800">Finishing up…</h1>
              <p className="mt-2 text-slate-600">{message}</p>
            </>
          )}

          {status === 'ok' && (
            <>
              <h1 className="text-lg font-semibold text-slate-800">Success</h1>
              <p className="mt-2 text-slate-600">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <h1 className="text-lg font-semibold text-red-700">Couldn’t complete sign-in</h1>
              <p className="mt-2 text-slate-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
