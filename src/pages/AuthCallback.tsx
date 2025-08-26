// src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [state, setState] = useState<'working'|'empty'|'ok'|'error'>('working')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const run = async () => {
      const href = window.location.href
      const hasMagic = href.includes('access_token=')
      const hasOAuth = href.includes('code=')

      if (!hasMagic && !hasOAuth) {
        setState('empty')
        return
      }

      try {
        const { error } = await supabase.auth.exchangeCodeForSession(href)
        if (error) throw error

        // Clean URL so refresh doesn't redo the exchange
        window.history.replaceState({}, '', '/auth/callback')

        // Make sure we actually have a session then go
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setState('ok')
          navigate('/profile', { replace: true })
          return
        }

        // Last safety check
        setTimeout(async () => {
          const { data: again } = await supabase.auth.getSession()
          if (again.session) navigate('/profile', { replace: true })
          else {
            setState('error')
            setMsg('Could not complete sign-in. Please try again.')
          }
        }, 600)
      } catch (e: any) {
        setState('error')
        setMsg(e?.message ?? 'Could not complete sign-in. Please try again.')
      }
    }
    run()
  }, [navigate])

  if (state === 'working') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Completing sign-in…
        </div>
      </div>
    )
  }

  if (state === 'ok') return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Couldn’t complete sign-in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            {state === 'empty'
              ? 'This page expects a sign-in code or token, but none was found in the URL.'
              : msg || 'Something went wrong.'}
          </p>
          <Button asChild className="w-full">
            <Link to="/sign-in">Try again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
