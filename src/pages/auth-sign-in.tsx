import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useSession } from '@/hooks/useSession'
import vnxLogo from '../assets/vnx-logo.png'

export default function AuthSignIn() {
  const [mode, setMode] = useState<'magic'|'signin'>('magic')
  const [email, setEmail] = useState(localStorage.getItem('lastAuthEmail') || '')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { session, ready } = useSession()
  const redirect = `${import.meta.env.VITE_PUBLIC_APP_URL}/sign-in`

  const [magicLinkProcessing, setMagicLinkProcessing] = useState(false)

  // Check if this looks like a magic link callback
  const urlHasAuthTokens = () => {
    const url = window.location.href
    return url.includes('access_token=') || url.includes('refresh_token=') || url.includes('type=recovery') || url.includes('type=signup')
  }

  // Handle magic link processing
  useEffect(() => {
    if (urlHasAuthTokens()) {
      console.log('[auth] Magic link detected, processing...')
      setMagicLinkProcessing(true)
      // Supabase will automatically process this with detectSessionInUrl: true
      // We just need to wait for the session to be established
    }
  }, [])

  // Navigate to profile when session is ready
  useEffect(() => {
    if (ready && session) {
      console.log('[auth] Session established, navigating to profile')
      // Clean up the URL first
      if (urlHasAuthTokens()) {
        window.history.replaceState({}, '', '/profile')
      }
      navigate('/profile', { replace: true })
    }
  }, [ready, session, navigate])

  // Show processing state for magic links
  if (magicLinkProcessing && !session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <img src={vnxLogo} alt="VNX-Netscan" className="h-12 w-auto mx-auto mb-4" />
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Signing you in...</h2>
          <p className="text-slate-600 dark:text-slate-400">Processing your magic link</p>
        </div>
      </div>
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setMsg(null); setLoading(true)
    try {
      if (mode === 'magic') {
        localStorage.setItem('lastAuthEmail', email)
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: redirect }
        })
        setMsg(error ? error.message : 'Magic link sent. Check your email.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setMsg(error.message); else navigate('/profile', { replace: true })
      }
    } finally { setLoading(false) }
  }

  async function resend() {
    setLoading(true); setMsg(null)
    try {
      const last = email || localStorage.getItem('lastAuthEmail') || ''
      if (!last) { setMsg('Enter your email first.'); return }
      const { error } = await supabase.auth.signInWithOtp({
        email: last,
        options: { emailRedirectTo: redirect }
      })
      setMsg(error ? error.message : 'Magic link resent. Check your email.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center mb-8">
            <img src={vnxLogo} alt="VNX-Netscan" className="h-12 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">VNX-Netscan</h1>
            <p className="text-slate-600 dark:text-slate-400">
              {mode==='signin' ? 'Sign In' : 'Use Magic Link'}
            </p>
          </div>


          <form onSubmit={onSubmit} className="space-y-4">
            <input 
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              type="email" 
              placeholder="you@example.com"
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              required 
            />

            {mode!=='magic' && (
              <input 
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                type="password" 
                placeholder="Password"
                value={password} 
                onChange={e=>setPassword(e.target.value)} 
                required 
              />
            )}

            <button 
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors" 
              disabled={loading}
            >
              {loading ? 'Working…' : mode==='magic' ? 'Send Magic Link' : 'Sign In'}
            </button>

            {msg && (
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">{msg}</p>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <button 
                type="button" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline" 
                onClick={()=>setMode(mode==='magic'?'signin':'magic')}
              >
                {mode==='magic' ? 'Use password' : 'Use magic link'}
              </button>
              <Link 
                to="/signup" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Create account
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button 
                type="button" 
                className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" 
                disabled={loading} 
                onClick={resend}
              >
                Resend Magic Link
              </button>
            </div>

            <div className="text-center pt-4">
              <Link 
                to="/" 
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                ← Back to home
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}