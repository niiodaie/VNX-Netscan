import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock, User, IdCard, ArrowLeft, AtSign } from 'lucide-react'

type FormState = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  confirm: string
}

const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/

export default function AuthSignUp() {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const passwordScore = useMemo(() => {
    const p = form.password
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[a-z]/.test(p)) score++
    if (/\d/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    return score
  }, [form.password])

  const passwordStrengthLabel = useMemo(() => {
    if (!form.password) return ''
    if (passwordScore <= 2) return 'Weak'
    if (passwordScore === 3) return 'Medium'
    return 'Strong'
  }, [passwordScore, form.password])

  const onChange =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = (): string | null => {
    if (!form.firstName.trim()) return 'Please enter your first name.'
    if (!form.lastName.trim()) return 'Please enter your last name.'
    if (!usernamePattern.test(form.username))
      return 'Username must be 3–20 characters (letters, numbers, underscore).'
    if (!form.email.includes('@')) return 'Please enter a valid email address.'
    if (form.password.length < 8)
      return 'Password must be at least 8 characters.'
    if (form.password !== form.confirm)
      return 'Passwords do not match.'
    return null
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    const v = validate()
    if (v) {
      setError(v)
      return
    }

    setLoading(true)
    try {
      const redirect = `${window.location.origin}/sign-in`
      // send user metadata now; it will be available once email confirmed
      const { error } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          emailRedirectTo: redirect,
          data: {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            username: form.username.trim(),
            full_name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
          },
        },
      })
      if (error) throw error

      setMessage(
        'Account created! Please check your email to confirm your address. After confirming, sign in with your magic link.'
      )
    } catch (err: any) {
      setError(err?.message || 'Unable to create account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Create account</h1>
          <p className="text-slate-600">Get started with VNX‑Netscan</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
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

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <div className="relative mt-1">
                    <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="firstName"
                      placeholder="Jane"
                      className="pl-9"
                      value={form.firstName}
                      onChange={onChange('firstName')}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <div className="relative mt-1">
                    <IdCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      className="pl-9"
                      value={form.lastName}
                      onChange={onChange('lastName')}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative mt-1">
                  <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="username"
                    placeholder="jane_doe"
                    className="pl-9"
                    value={form.username}
                    onChange={onChange('username')}
                    disabled={loading}
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">3–20 chars: letters, numbers, underscores.</p>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                    value={form.email}
                    onChange={onChange('email')}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password (min 8 chars)"
                      className="pl-9"
                      value={form.password}
                      onChange={onChange('password')}
                      disabled={loading}
                      minLength={8}
                      required
                    />
                  </div>
                  {!!form.password && (
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-slate-500">Strength: {passwordStrengthLabel}</span>
                      <div className="flex gap-1">
                        {[0,1,2,3,4].map(i => (
                          <span
                            key={i}
                            className={`h-1.5 w-8 rounded ${
                              i < passwordScore
                                ? i >= 3 ? 'bg-green-500' : 'bg-yellow-500'
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirm">Confirm password</Label>
                  <div className="relative mt-1">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="Repeat password"
                      className="pl-9"
                      value={form.confirm}
                      onChange={onChange('confirm')}
                      disabled={loading}
                      required
                    />
                  </div>
                  {form.confirm && form.confirm !== form.password && (
                    <p className="text-xs text-red-600 mt-1">Passwords do not match.</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>Create Account</>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-500">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
