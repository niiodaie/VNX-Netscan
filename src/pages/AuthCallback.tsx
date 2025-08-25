// FILE: src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        // Supabase sends tokens in the hash fragment (#...), so pass the full URL
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) throw error

        // Clean the URL (no tokens) and go to profile
        window.history.replaceState({}, '', '/')
        navigate('/profile', { replace: true })
      } catch (e: any) {
        setErr(e?.message ?? 'Sign-in link is invalid or expired.')
      }
    })()
  }, [navigate])

  if (err) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="p-6 rounded-lg border bg-white shadow-sm max-w-md text-center">
          <h1 className="text-lg font-semibold mb-2">Couldn’t complete sign-in</h1>
          <p className="text-slate-600 mb-4">{err}</p>
          <a
            className="inline-block px-4 py-2 rounded-md bg-blue-600 text-white"
            href="/sign-in"
          >
            Try again
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  )
}
