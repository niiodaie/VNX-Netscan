import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react'

type Mode = 'magic' | 'password'

export default function AuthSignIn() {
  const navigate = useNavigate()

  const [mode, setMode] = useState<Mode>('magic')

  // Magic link
  const [email, setEmail] = useState('')
  const [mlLoading, setMlLoading] = useState(false)
  const [mlMessage, setMlMessage] = useState('')
  const [mlError, setMlError] = useState('')

  // Password sign in
  const [pwEmail, setPwEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')

  // Errors from callback exchange (if the user hits this page with a broken link)
  const [callbackError, setCallbackError] = useState('')

  // For the “redirected from sign-up: check your email” banner
  const showCheckEmail = useMemo(() => {
    const sp = new URLSearchParams(window.location.search)
    return sp.get('check-email') === '1'
  }, [])

  // If already signed in, go to /profile
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

  // If someone comes here with a hash that *should* be handled by /auth/callback,
  // try to exchange (this makes the page resilient if the email template points here).
  useEffect(() => {
    const h = window.location.hash || ''
    const looksLikeMagic =
      h.includes('access_token=') ||
      h.includes('type=magiclink') ||
      h.includes('provider_token=') ||
      h.includes('code=')

    if (!looksLikeMagic) return

    ;(async () => {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)
        if (error) throw error
        window.history.replaceState({}, '', '/sign-in')
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          navigate('/profile', { replace: true })
        }
      } catch (e: any) {
        setCallbackError(e?.message || 'Link invalid or expired.')
      }
    })()
  }, [navigate])

  // Magic link submit
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setMlLoading(true)
    setMlError('')
    setMlMessage('')
    try {
      const APP_URL = import.meta.env.VITE_PUBLIC_APP_URL ?? window.location.origin
      const redirect = `${APP_URL}/auth/callback`

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirect },
      })
      if (error) throw error
      setMlMessage('Check your email for the magic link.')
    } catch (err: any) {
      setMlError(err?.message ?? 'Something went wrong.')
    } finally {
      setMlLoading(false)
    }
  }

  // Password sign-in (unique name so there’s no symbol duplication)
  const onPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwLoading(true)
    setPwError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: pwEmail,
        password: pw,
      })
      if (error) throw error
      navigate('/profile', { replace: true })
    } catch (err: any) {
      setPwError(err?.message ?? 'Invalid email or password.')
    } finally {
      setPwLoading(false)
    }
  }

  // Forgot password → send recovery email to /auth/callback
  const onForgotPassword = async () => {
    setPwError('')
    try {
      const APP_URL = import.meta.env.VITE_PUBLIC_APP_URL ?? window.location.origin
      const redirect = `${APP_URL}/auth/callback`
      const { error } = await supabase.auth.resetPasswordForEmail(pwEmail, {
        redirectTo: redirect,
      })
      if (error) throw error
      setPwError('We emailed you a link to reset your password.')
    } catch (err: any) {
      setPwError(err?.message ?? 'Could not send reset email.')
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

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              {mode === 'magic' ? (
                <>
                  <Mail className="w-5 h-5 text-blue-600" />
                  Sign In with Email
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-blue-600" />
                  Sign In with Password
                </>
              )}
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

            {/* Toggle */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <Button
                variant={mode === 'magic' ? 'default' : 'outline'}
                onClick={() => setMode('magic')}
                size="sm"
              >
                Magic Link
              </Button>
              <Button
                variant={mode === 'password' ? 'default' : 'outline'}
                onClick={() => setMode('password')}
                size="sm"
              >
                Password
              </Button>
            </div>

            {mode === 'magic' ? (
              <form onSubmit={handleMagicLink} className="space-y-4">
                {mlMessage && (
                  <Alert className="mb-2 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-700">{mlMessage}</AlertDescription>
                  </Alert>
                )}
                {mlError && (
                  <Alert className="mb-2 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{mlError}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={mlLoading}
                    className="mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  disabled={mlLoading}
                >
                  {mlLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending Magic Link…
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={onPasswordSignIn} className="space-y-4">
                {pwError && (
                  <Alert className="mb-2 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-700">{pwError}</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="pwEmail">Email Address</Label>
                  <Input
                    id="pwEmail"
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

                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    className="px-0 text-blue-600"
                    onClick={onForgotPassword}
                    disabled={!pwEmail || pwLoading}
                  >
                    Forgot password?
                  </Button>

                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={pwLoading}
                  >
                    {pwLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in…
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-slate-600">
              <p>
                Don&apos;t have an account?{' '}
                <Link to="/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
                  Create one here
                </Link>
              </p>
            </div>
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
