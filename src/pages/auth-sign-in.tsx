import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft, Lock } from 'lucide-react'

export default function AuthSignIn() {
  // --- Magic-link state ---
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [callbackError, setCallbackError] = useState('')

  // --- Password sign-in state (optional) ---
  const [pwEmail, setPwEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  // --- Reset password state ---
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMsg, setResetMsg] = useState<string | null>(null)
  const [resetErr, setResetErr] = useState<string | null>(null)

  const navigate = useNavigate()

  // show success banner if redirected from sign-up
  const showCheckEmail = useMemo(() => {
    const sp = new URLSearchParams(window.location.search)
    return sp.get('check-email') === '1'
  }, [])

  // If already signed in, go straight to /profile
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!cancelled && data.session) {
        navigate('/profile', { replace: true })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [navigate])

  // Handle magic-link callback (hash fragment -> exchange -> redirect)
  useEffect(() => {
    let unsub: (() => void) | undefined

    const run = async () => {
      const hash = window.location.hash || ''
      const looksLikeMagic =
        hash.includes('access_token=') ||
        hash.includes('type=magiclink') ||
        hash.includes('provider_token=')

      if (!looksLikeMagic) return

      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) throw error

        // clean URL so refresh doesn't repeat exchange
        window.history.replaceState({}, '', '/sign-in')

        const { data } = await supabase.auth.getSession()
        if (data.session) {
          navigate('/profile', { replace: true })
          return
        }

        const sub = supabase.auth.onAuthStateChange((e, s) => {
          if (e === 'SIGNED_IN' && s) navigate('/profile', { replace: true })
        })
        unsub = () => sub.data.subscription.unsubscribe()

        setTimeout(async () => {
          const { data: again } = await supabase.auth.getSession()
          if (again.session) navigate('/profile', { replace: true })
        }, 800)
      } catch (e: any) {
        setCallbackError(e?.message || 'Link invalid or expired.')
      }
    }

    run()
    return () => {
      if (unsub) unsub()
    }
  }, [navigate])

  // --- Magic link submit ---
  const onMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const appUrl = import.meta.env.VITE_PUBLIC_APP_URL ?? window.location.origin
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${appUrl}/auth/callback` },
      })
      setMessage('Check your email for the magic link!')
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  // --- Password sign-in submit (renamed to avoid duplicates) ---
  const onPasswordSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setPwLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: pwEmail,
        password: pw,
      })
      if (error) throw error
      navigate('/profile', { replace: true })
    } catch (err: any) {
      setError(err?.message ?? 'Could not sign in with password.')
    } finally {
      setPwLoading(false)
    }
  }

  // --- Reset password submit ---
  const onSendResetEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetErr(null)
    setResetMsg(null)
    setResetLoading(true)
    try {
      const appUrl = import.meta.env.VITE_PUBLIC_APP_URL ?? window.location.origin
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${appUrl}/auth/callback`,
      })
      if (error) throw error
      setResetMsg('If that email is registered, a reset link has been sent.')
    } catch (err: any) {
      setResetErr(err?.message ?? 'Could not send reset email.')
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to access your network tools</p>
        </div>

        {/* MAGIC LINK CARD */}
        <Card className="shadow-lg border-0 mb-6">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Sign In with Email (Magic Link)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showCheckEmail && (
              <Alert className="mb-4 border-blue-200 bg-blue-50">
                <AlertDescription className="text-blue-700">
                  Check your email to confirm your account, then click the link to sign in.
                </AlertDescription>
              </Alert>
            )}

            {callbackError && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {callbackError}
                </AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="mb-4 border-green-200 bg-green-50">
                <AlertDescription className="text-green-700">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="mb-4 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={onMagicLinkSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Magic Link...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Magic Link
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* PASSWORD SIGN-IN CARD (optional) */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Lock className="w-5 h-5 text-slate-600" />
              Sign In with Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onPasswordSignInSubmit} className="space-y-4">
              <div>
                <Label htmlFor="pw-email">Email Address</Label>
                <Input
                  id="pw-email"
                  type="email"
                  value={pwEmail}
                  onChange={(e) => setPwEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={pwLoading}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pw">Password</Label>
                <Input
                  id="pw"
                  type="password"
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={pwLoading}
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full" disabled={pwLoading}>
                {pwLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Forgot Password */}
            <div className="mt-3 text-right">
              <button
                type="button"
                onClick={() => {
                  setShowReset((s) => !s)
                  if (!resetEmail && pwEmail) setResetEmail(pwEmail)
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showReset ? 'Hide password reset' : 'Forgot password?'}
              </button>
            </div>

            {/* Reset Password Panel */}
            {showReset && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-700 mb-3">
                  We’ll email you a link to reset your password.
                </p>

                {resetMsg && (
                  <Alert className="mb-3 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-700">{resetMsg}</AlertDescription>
                  </Alert>
                )}
                {resetErr && (
                  <Alert className="mb-3 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{resetErr}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={onSendResetEmail} className="space-y-3">
                  <div>
                    <Label htmlFor="reset-email">Email Address</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      disabled={resetLoading}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" disabled={resetLoading}>
                    {resetLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </Button>
                </form>

                <p className="mt-2 text-xs text-slate-500">
                  Follow the link in your email; you’ll be routed back here and signed into a
                  recovery session. Then set your new password on your Profile page.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
