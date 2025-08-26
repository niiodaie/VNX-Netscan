// FILE: src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'working'|'ok'|'error'|'empty'>('working')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const run = async () => {
      const href = window.location.href
      const hasParams = href.includes('code=') || href.includes('access_token=') || href.includes('provider_token=')

      if (!hasParams) {
        setStatus('empty')
        return
      }

      try {
        const { error } = await supabase.auth.exchangeCodeForSession(href)
        if (error) throw error

        // Clean the URL so refresh doesn't repeat the exchange
        window.history.replaceState({}, '', '/auth/callback')

        // Confirm session, then go
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          setStatus('ok')
          navigate('/profile', { replace: true })
          return
        }

        // final safety net
        setTimeout(async () => {
          const { data: again } = await supabase.auth.getSession()
          if (again.session) navigate('/profile', { replace: true })
          else {
            setStatus('error')
            setMessage('Could not complete sign-in. Please try again.')
          }
        }, 600)
      } catch (e: any) {
        setStatus('error')
        setMessage(e?.message ?? 'Could not complete sign-in. Please try again.')
      }
    }

    run()
  }, [navigate])

  if (status === 'working') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Completing sign-in…
        </div>
      </div>
    )
  }

  if (status === 'ok') return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Couldn’t complete sign-in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            {status === 'empty'
              ? 'This page expects a sign-in code or token, but none was found in the URL.'
              : message || 'Something went wrong.'}
          </p>
          <Button asChild className="w-full">
            <Link to="/sign-in">Try again</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
