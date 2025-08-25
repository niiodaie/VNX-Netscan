import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

function parseHashTokens(hash: string) {
  const p = new URLSearchParams(hash.replace(/^#/, ''))
  const access_token = p.get('access_token') || undefined
  const refresh_token = p.get('refresh_token') || undefined
  return { access_token, refresh_token }
}

export default function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const href = window.location.href
        const hasHash = window.location.hash.includes('access_token')

        if (hasHash) {
          // Handle magic-link/hash tokens
          const { access_token, refresh_token } = parseHashTokens(window.location.hash)
          if (!access_token || !refresh_token) throw new Error('Missing tokens in hash')
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) throw error
        } else {
          // Handle PKCE ?code=...
          const { error } = await supabase.auth.exchangeCodeForSession(href)
          if (error) throw error
        }

        // Clean URL and move on
        window.history.replaceState({}, '', '/')
        navigate('/profile', { replace: true })
      } catch (e: any) {
        setError(e?.message ?? 'Authentication failed')
      }
    })()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-lg border px-6 py-4">
        {error ? (
          <>
            <div className="text-red-600 font-semibold mb-2">Couldn’t complete sign-in</div>
            <div className="text-sm text-slate-600">{String(error)}</div>
          </>
        ) : (
          <div className="text-slate-700">Finishing sign-in…</div>
        )}
      </div>
    </div>
  )
}
