// src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [msg, setMsg] = useState('Completing sign-in…')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        // If user is already signed in (e.g., clicking the link twice), just continue.
        const { data: pre } = await supabase.auth.getSession()
        if (!cancelled && pre.session) {
          navigate('/profile', { replace: true })
          return
        }

        const url = new URL(window.location.href)

        // If Supabase returned an error via query params, surface that and stop.
        const errParam = url.searchParams.get('error') || url.searchParams.get('error_description')
        if (errParam) {
          throw new Error(decodeURIComponent(errParam))
        }

        // For PKCE magic-link the tokens come in the hash (after '#').
        // Only attempt the exchange if we actually have a hash or a code.
        const hasHash = Boolean(url.hash && url.hash.includes('access_token'))
        const hasCode = Boolean(url.searchParams.get('code'))

        if (!hasHash && !hasCode) {
          throw new Error('No auth credentials found in callback URL.')
        }

        // Important: pass the FULL URL (with hash) to Supabase.
        const { error } = await supabase.auth.exchangeCodeForSession(url.toString())
        if (error) throw error

        if (!cancelled) {
          setMsg('Signed in! Redirecting…')

          // Clean the URL to prevent retry on refresh.
          window.history.replaceState({}, '', '/auth/callback')

          // Navigate to profile
          navigate('/profile', { replace: true })
        }
      } catch (e: any) {
        if (!cancelled) {
          setMsg('')
          setErr(e?.message ?? 'Could not complete sign-in.')
        }
      }
    }

    run()
    return () => { cancelled = true }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-4">
        {msg && <p className="text-slate-700">{msg}</p>}
        {err && (
          <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-medium">Couldn’t complete sign-in</p>
            <p className="text-sm mt-1">{err}</p>
            <a href="/sign-in" className="inline-block mt-4 text-blue-600 underline">
              Back to sign-in
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
