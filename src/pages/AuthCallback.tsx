import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Recovery state (only used when type=recovery)
  const [isRecovery, setIsRecovery] = useState(false)
  const [pw1, setPw1] = useState('')
  const [pw2, setPw2] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)

  // does hash look like a supabase link?
  const looksLikeAuthHash = useMemo(() => {
    const h = window.location.hash || ''
    return (
      h.includes('access_token=') ||
      h.includes('refresh_token=') ||
      h.includes('code=') ||
      h.includes('type=')
    )
  }, [])

  useEffect(() => {
    let unsub: (() => void) | undefined
    ;(async () => {
      try {
        if (!looksLikeAuthHash) {
          setError('Invalid or missing auth parameters.')
          setLoading(false)
          return
        }

        // Grab "type" from the hash (e.g., type=recovery, type=signup, type=magiclink)
        const hash = new URLSearchParams((window.location.hash || '').replace(/^#/, ''))
        const type = (hash.get('type') || '').toLowerCase()

        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) throw error

        // Clean URL (remove fragment & query to avoid re-exchange on refresh)
        window.history.replaceState({}, '', '/auth/callback')

        // If it's a password recovery session, show the set password form here
        if (type === 'recovery') {
          setIsRecovery(true)
          setLoading(false)
          // Keep a safety listener: if the user gets fully signed-in by some means, go to profile
          const sub = supabase.auth.onAuthStateChange((e, s) => {
            if (e === 'SIGNED_IN' && s) navigate('/profile', { replace: true })
          })
          unsub = () => sub.data.subscription.unsubscribe()
          return
        }

        // Otherwise, normal magic-link/sign-in flow → go to profile
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          navigate('/profile', { replace: true })
          return
        }

        // Fallback listener
        const sub = supabase.auth.onAuthStateChange((e, s) => {
          if (e === 'SIGNED_IN' && s) navigate('/profile', { replace: true })
        })
        unsub = () => sub.data.subscription.unsubscribe()
        setLoading(false)
      } catch (e: any) {
        setError(e?.message ?? 'Could not complete sign-in.')
        setLoading(false)
      }
    })()

    return () => {
      if (unsub) unsub()
    }
  }, [looksLikeAuthHash, navigate])

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError(null)
    if (!pw1 || pw1.length < 8) {
      setPwError('Password must be at least 8 characters.')
      return
    }
    if (pw1 !== pw2) {
      setPwError('Passwords do not match.')
      return
    }
    setPwLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: pw1 })
      if (error) throw error
      // Password updated; go to profile
      navigate('/profile', { replace: true })
    } catch (e: any) {
      setPwError(e?.message ?? 'Could not set password.')
    } finally {
      setPwLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-slate-600">Finishing sign-in…</p>
        </div>
      </div>
    )
  }

  // Error state (broken/expired link)
  if (error && !isRecovery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Couldn’t complete sign-in</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
              <div className="flex items-center justify-between">
                <Link
                  to="/sign-in"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to sign-in
                </Link>
                <Button onClick={() => (window.location.href = '/sign-in')}>Try again</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Password recovery form
  if (isRecovery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Set a New Password</CardTitle>
            </CardHeader>
            <CardContent>
              {pwError && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{pwError}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="pw1">New Password</Label>
                  <Input
                    id="pw1"
                    type="password"
                    value={pw1}
                    onChange={(e) => setPw1(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pw2">Confirm New Password</Label>
                  <Input
                    id="pw2"
                    type="password"
                    value={pw2}
                    onChange={(e) => setPw2(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="mt-1"
                  />
                </div>
                <Button type="submit" disabled={pwLoading} className="w-full">
                  {pwLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
              <p className="mt-4 text-xs text-slate-500">
                After updating your password you’ll be redirected to your Profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // No recovery, no error → we already attached listeners; provide a simple fallback UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-slate-600 mb-3">Almost there…</p>
        <Button onClick={() => navigate('/profile', { replace: true })}>Go to Profile</Button>
      </div>
    </div>
  )
}
