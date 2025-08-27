import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [msg, setMsg] = useState('Completing sign‑in…')
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      try {
        // Full URL including hash fragment (?/#) for PKCE flow
        const fullUrl = window.location.href
        const { error } = await supabase.auth.exchangeCodeForSession(fullUrl)
        if (error) throw error

        if (!cancelled) {
          setMsg('Signed in! Redirecting…')
          // Clean the URL so refreshes don't retry the exchange
          window.history.replaceState({}, '', '/auth/callback')
          navigate('/profile', { replace: true })
        }
      } catch (e: any) {
        if (!cancelled) {
          const detail = e?.message ?? 'Could not complete sign‑in.'
          setErr(detail)
          setMsg('')
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
            <p className="font-medium">Couldn’t complete sign‑in</p>
            <p className="text-sm mt-1">{err}</p>
            <a href="/sign-in" className="inline-block mt-4 text-blue-600 underline">
              Back to sign‑in
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
