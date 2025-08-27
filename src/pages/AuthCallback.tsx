import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [msg, setMsg] = useState('Finishing sign-in…')

  useEffect(() => {
    let cancelled = false

    const cleanUrl = () => {
      // Remove hash/query so reloads don’t retry/consume the link again
      const url = new URL(window.location.href)
      url.hash = ''
      url.search = ''
      window.history.replaceState({}, '', url.toString())
    }

    const finish = (ok: boolean, message?: string) => {
      if (cancelled) return
      cleanUrl()
      if (ok) {
        navigate('/profile', { replace: true })
      } else {
        navigate(`/sign-in?message=${encodeURIComponent(message || 'Could not complete sign-in')}`, { replace: true })
      }
    }

    const run = async () => {
      try {
        const url = new URL(window.location.href)

        // 1) If Supabase embedded an error, bail out early with context
        const err = url.searchParams.get('error')
        const errCode = url.searchParams.get('error_code')
        const errDesc = url.searchParams.get('error_description')
        if (err || errCode) {
          finish(false, errDesc || 'Email link is invalid or has expired')
          return
        }

        // 2) Try PKCE first (works when the same browser initiated the request)
        //    It will succeed if either `#access_token=…` or `?code=…` + stored code_verifier exist
        const { error: pkceError } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (!pkceError) {
          finish(true)
          return
        }

        // 3) Fallback: email link opened on another device/browser.
        //    Supabase puts a `token_hash` in the URL for this case.
        //    Example: https://…/auth/callback?token_hash=…&type=magiclink
        const tokenHash = url.searchParams.get('token_hash')
        const type = (url.searchParams.get('type') || 'magiclink') as
          | 'magiclink'
          | 'signup'
          | 'recovery'
          | 'email_change'
          | 'invite'

        if (tokenHash) {
          const { data, error } = await supabase.auth.verifyOtp({ type: 'email', token_hash: tokenHash })
          if (!error && data.session) {
            finish(true)
            return
          }
          finish(false, error?.message || 'Could not complete sign-in')
          return
        }

        // 4) Nothing to exchange
        finish(false, pkceError?.message || 'Email link is invalid or has expired')
      } catch (e: any) {
        finish(false, e?.message || 'Could not complete sign-in')
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-lg border bg-white p-6 shadow-sm text-slate-700">
        {msg}
      </div>
    </div>
  )
}
