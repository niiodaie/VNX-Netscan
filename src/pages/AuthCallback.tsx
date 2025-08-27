// FILE: src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const [status, setStatus] = useState<'working' | 'error' | 'done'>('working')
  const [message, setMessage] = useState<string>('Finishing sign-in…')
  const navigate = useNavigate()

  useEffect(() => {
    const run = async () => {
      try {
        // 1) If Supabase sent an error via query params (e.g., otp_expired), show it.
        const url = new URL(window.location.href)
        const err = url.searchParams.get('error')
        const errDesc = url.searchParams.get('error_description')
        if (err || errDesc) {
          setStatus('error')
          setMessage(errDesc || err || 'Could not complete sign-in.')
          // Clean the URL to avoid repeating on refresh
          window.history.replaceState({}, '', '/auth/callback')
          return
        }

        // 2) Try to exchange the full URL (works with both #fragment and ?query styles)
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) throw error

        // 3) Clean URL (remove tokens) so reloads don't retry exchange.
        window.history.replaceState({}, '', '/auth/callback')

        // 4) Confirm we have a session; then go to /profile
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setStatus('done')
          navigate('/profile', { replace: true })
          return
        }

        // 5) Fallback: wait for auth event briefly
        const sub = supabase.auth.onAuthStateChange((e, s) => {
          if (e === 'SIGNED_IN' && s) {
            setStatus('done')
            navigate('/profile', { replace: true })
          }
        })
        // Safety timeout
        setTimeout(async () => {
          sub.data.subscription.unsubscribe()
          const { data: again } = await supabase.auth.getSession()
          if (again.session) {
            setStatus('done')
            navigate('/profile', { replace: true })
          } else {
            throw new Error('Could not complete sign-in. Please try again.')
          }
        }, 800)
      } catch (e: any) {
        setStatus('error')
        setMessage(e?.message || 'Could not complete sign-in.')
      }
    }

    run()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-lg bg-white/70 shadow p-6 text-center">
        {status === 'working' && (
          <>
            <div className="mx-auto mb-4 h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-slate-700">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-red-600 font-medium mb-2">Couldn’t complete sign-in</p>
            <p className="text-slate-700">{message}</p>
            <a
              href="/sign-in"
              className="inline-block mt-4 text-sm text-blue-600 hover:text-blue-700"
            >
              Back to sign-in
            </a>
          </>
        )}
      </div>
    </div>
  )
}
