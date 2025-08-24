import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const appUrl = import.meta.env.VITE_PUBLIC_APP_URL as string

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!/.+@.+\..+/.test(email)) return setError('Enter a valid email')
    if (password.length < 8) return setError('Password must be at least 8 characters')

    setLoading(true)
    try {
      const redirectTo = `${appUrl}/sign-in`
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: redirectTo }
      })
      if (error) throw error
      navigate('/sign-in?check-email=1', { replace: true })
    } catch (e: any) {
      setError(e?.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border px-3 py-2"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 8 chars)"
          className="w-full rounded-md border px-3 py-2"
        />
        <button disabled={loading} className="w-full rounded-md bg-blue-600 text-white py-2">
          {loading ? 'Creating…' : 'Create Account'}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}

