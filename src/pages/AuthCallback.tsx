import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    let unsub: (() => void) | undefined

    const cleanUrl = () => {
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
      const url = new URL(window.location.href)

      // If Supabase provided an error in query, bail early with context
      const err = url.searchParams.get('error')
      const errDesc = url.searchParams.get('error_description')
      if (err) {
        finish(false, errDesc || 'Email link is invalid or has expired')
        return
      }

      // 1) Try PKCE
      const pkce = await supabase.auth.exchangeCodeForSession(window.location.href)
      if (!pkce.error) {
        // double-check session exists
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          finish(true)
          return
        }
      }

      // 2) Fallback: verify token_hash (works when link opened on another device)
      const tokenHash = url.searchParams.get('token_hash')
      const urlType =
        (url.searchParams.get('type') ||
          'magiclink') as 'magiclink' | 'signup' | 'recovery' | 'email_change' | 'invite'

      if (tokenHash) {
        const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: urlType })
        if (!error && data.session) {
          finish(true)
          return
        }
        finish(false, error?.message || 'Could not complete sign-in')
        return
      }

      // 3) As a final guard, subscribe briefly for SIGNED_IN (race-y environments)
      const sub = supabase.auth.onAuthStateChange((_e, session) => {
        if (session) {
          finish(true)
        }
      })
      unsub = () => sub.data.subscription.unsubscribe()

      // Give it a short moment, then decide
      setTimeout(async () => {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          finish(true)
        } else {
          finish(false, pkce.error?.message || 'Email link is invalid or has expired')
        }
      }, 600)
    }

    run()
    return () => {
      cancelled = true
      if (unsub) unsub()
    }
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="rounded-lg border bg-white p-6 shadow-sm text-slate-700">
        Finishing sign-in…
      </div>
    </div>
  )
}
