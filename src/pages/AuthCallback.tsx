// src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

function parseHashTokens(hash: string) {
  const p = new URLSearchParams(hash.replace(/^#/, ''))
  return {
    access_token: p.get('access_token') || undefined,
    refresh_token: p.get('refresh_token') || undefined,
    error: p.get('error') || undefined
  }
}

export default function AuthCallback() {
  const navigate = useNavigate()
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const href = window.location.href
        const hasHash = window.location.hash.includes('access_token')
        console.log('[callback] href=', href)

        if (hasHash) {
          // Magic-link flow
          const { access_token, refresh_token, error } = parseHashTokens(window.location.hash)
          if (error) throw new Error(error)
          if (!access_token || !refresh_token) throw new Error('Missing tokens in hash')
          const { error: setErrRes } = await supabase.auth.setSession({ access_token, refresh_token })
          if (setErrRes) throw setErrRes
        } else {
          // PKCE flow
          const { error: exErr } = await supabase.auth.exchangeCodeForSession(href)
          if (exErr) throw exErr
        }

        window.history.replaceState({}, '', '/')
        navigate('/profile', { replace: true })
      } catch (e: any) {
        console.error('[callback] failed:', e)
        setErr(e?.message ?? 'Authentication failed')
      }
    })()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      {err ? (
        <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          Couldn’t complete sign-in<br/>{err}
        </div>
      ) : (
        <div className="rounded border px-4 py-3 text-slate-700">Finishing sign-in…</div>
      )}
    </div>
  )
}
