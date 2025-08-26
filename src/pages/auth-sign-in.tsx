import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'

export default function AuthSignIn() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [callbackError, setCallbackError] = useState('')
  const navigate = useNavigate()
  const [pwEmail, setPwEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  // NEW: reset password state
const [showReset, setShowReset] = useState(false)
const [resetEmail, setResetEmail] = useState('')
const [resetLoading, setResetLoading] = useState(false)
const [resetMsg, setResetMsg] = useState<string | null>(null)
const [resetErr, setResetErr] = useState<string | null>(null)

  const appUrl = import.meta.env.VITE_PUBLIC_APP_URL as string

  // show success banner if redirected from sign-up
  const showCheckEmail = useMemo(() => {
    const sp = new URLSearchParams(window.location.search)
    return sp.get('check-email') === '1'
  }, [])

  // 0) If already signed in, go straight to /profile (prevents flicker/bounce)
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

  // 1) Handle magic-link callback (hash fragment -> exchange -> redirect)
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

        // Clean up URL so refresh doesn't repeat exchange
        window.history.replaceState({}, '', '/sign-in')

        // Check session immediately
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          navigate('/profile', { replace: true })
          return
        }

        // Listen for auth state changes as a fallback
        const sub = supabase.auth.onAuthStateChange((e, s) => {
          if (e === 'SIGNED_IN' && s) navigate('/profile', { replace: true })
        })
        unsub = () => sub.data.subscription.unsubscribe()

        // Final guard after a short delay
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

  // 2) Send magic link
  const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  setMessage('')

    // Existing password sign-in handler (you may already have this)
const handlePasswordSignIn = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setMessage('')
  setPwLoading(true)
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
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

    
    // Existing password sign-in handler (you may already have this)
const handlePasswordSignIn = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setMessage('')
  setPwLoading(true)
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
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


  try {
    // IMPORTANT: use canonical app URL so emails never point to the wrong origin
    const appUrl = import.meta.env.VITE_PUBLIC_APP_URL ?? window.location.origin
    const redirect = `${appUrl}/auth/callback`

    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirect }
    })

    setMessage('Check your email for the magic link!')
  } catch (err: any) {
    setError(err?.message ?? 'Something went wrong.')
  } finally {
    setLoading(false)
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
              <Mail className="w-5 h-5 text-blue-600" />
              Sign In with Email
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

            <form onSubmit={handleSignIn} className="space-y-4">
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

            <div className="mt-6 text-center text-sm text-slate-600">
              <p>
                Don&apos;t have an account?{' '}
                <Link to="/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
                  Create one here
                </Link>
              </p>
            </div>

            {/* Forgot Password link */}
<div className="mt-3 text-right">
  <button
    type="button"
    onClick={() => {
      setShowReset((s) => !s)
      // pre-fill with whatever the user typed above if available
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

    <form onSubmit={handleResetPassword} className="space-y-3">
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
      Follow the link in your email; you’ll be routed back here and signed into a recovery session.
      Then set your new password on your Profile page.
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
