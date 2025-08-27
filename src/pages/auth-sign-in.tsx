// src/pages/auth-sign-in.tsx
import { useMemo, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function AuthSignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState<string>('')
  const [err, setErr] = useState<string>('')

  // Read URL params once (on first render)
  const { showCheckEmail, initialError, nextPath } = useMemo(() => {
    const sp = new URLSearchParams(window.location.search)
    const showCheckEmail = sp.get('check-email') === '1'
    const initialError = sp.get('message') || ''
    // Prefer explicit ?next=, else anything we stored when user tried to hit a protected route,
    // else default to /profile after sign-in.
    const nextPath = sp.get('next') || sessionStorage.getItem('nl_next') || '/profile'
    return { showCheckEmail, initialError, nextPath }
  }, [])

  // hydrate any incoming error from /auth/callback
  useMemo(() => {
    if (initialError) setErr(initialError)
  }, [initialError])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErr('')
    setOk('')

    try {
      // Remember next (extra safety if the email client strips params)
      try {
        sessionStorage.setItem('nl_next', nextPath)
      } catch {}

      const appUrl = import.meta.env.VITE_PUBLIC_APP_URL ?? window.location.origin
      // Pass next through so /auth/callback can pick it up if sessionStorage is unavailable
      const redirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent(nextPath)}`

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo },
      })
      if (error) throw error

      setOk('Check your email for the magic link. Once you click it, you will be signed in automatically.')
    } catch (e: any) {
      setErr(e?.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-2">Sign in</h1>
        <p className="text-slate-600 mb-6">We’ll send you a magic link.</p>

        {showCheckEmail && (
          <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-700">
            Please confirm your email, then return here.
          </div>
        )}

        {ok && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-green-700">
            {ok}
          </div>
        )}

        {err && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
            {err}
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <label className="block">
            <span className="block text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded border border-slate-300 p-2"
              placeholder="you@example.com"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-blue-600 px-3 py-2 font-medium text-white disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send magic link'}
          </button>
        </form>
      </div>
    </div>
  )
}
