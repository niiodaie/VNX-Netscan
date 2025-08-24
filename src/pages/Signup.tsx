import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import vnxLogo from '../assets/vnx-logo.png'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function passwordIssues(pw: string) {
  const issues: string[] = []
  if (pw.length < 8) issues.push('At least 8 characters')
  if (!/[A-Z]/.test(pw)) issues.push('One uppercase letter (A–Z)')
  if (!/[a-z]/.test(pw)) issues.push('One lowercase letter (a–z)')
  if (!/\d/.test(pw)) issues.push('One number (0–9)')
  if (!/[!@#$%^&*()_+\-=[\]{};':",.<>/?`~]/.test(pw)) issues.push('One special character')
  return issues
}

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const navigate = useNavigate()

  const emailValid = useMemo(() => emailRegex.test(email.trim()), [email])
  const pwIssues = useMemo(() => passwordIssues(password), [password])
  const pwValid = pwIssues.length === 0

  const canSubmit = emailValid && pwValid && !loading

  const redirect = `${import.meta.env.VITE_PUBLIC_APP_URL}/sign-in`

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null); setMsg(null)
    if (!canSubmit) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: redirect
        }
      })
      if (error) {
        setErr(error.message)
      } else {
        setMsg('Check your inbox to confirm your email. Then come back to sign in.')
        // Optionally route back to sign-in after a short delay
        setTimeout(() => navigate('/sign-in', { replace: true }), 1200)
      }
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <form onSubmit={onSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 space-y-4">
          <div className="text-center mb-8">
            <img src={vnxLogo} alt="VNX-Netscan" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">VNX-Netscan</h1>
            <p className="text-slate-600 dark:text-slate-400">Create your account</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Email</label>
            <input
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
            />
            {!emailValid && email.length > 0 && (
              <p className="text-xs text-red-600 dark:text-red-400">Enter a valid email address.</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-900 dark:text-slate-100">Password</label>
            <div className="flex gap-2">
              <input
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                className="px-3 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
            {pwIssues.length > 0 && (
              <ul className="text-xs text-red-600 dark:text-red-400 list-disc pl-4 space-y-0.5">
                {pwIssues.map((i) => <li key={i}>{i}</li>)}
              </ul>
            )}
          </div>

          <button
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            type="submit"
            disabled={!canSubmit}
          >
            {loading ? 'Creating…' : 'Create Account'}
          </button>

          {msg && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-800 dark:text-green-200">{msg}</p>
            </div>
          )}
          {err && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-200">{err}</p>
            </div>
          )}

          <div className="text-center text-sm">
            <Link to="/sign-in" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline">
              Have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}