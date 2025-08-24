import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase-simple'
import vnxLogo from '../assets/vnx-logo.png'

export default function SimpleSignIn() {
  const [mode, setMode] = useState<'magic'|'signup'|'signin'>('magic')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()
  const [params] = useSearchParams()
  const redirect = `${window.location.origin}/sign-in`

  useEffect(() => {
    (async () => {
      const code = params.get('code')
      if (code) {
        const { data, error } = await supabase.auth.getSession()
        if (!data.session || error) {
          await supabase.auth.exchangeCodeForSession(window.location.href)
        }
        window.history.replaceState({}, '', '/sign-in')
        nav('/dashboard', { replace: true })
      }
    })()
  }, [params, nav])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg(''); setLoading(true)
    try {
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect } })
        setMsg(error ? error.message : 'Magic link sent. Check your email.')
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirect } })
        setMsg(error ? error.message : 'Check your email to confirm your account.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setMsg(error ? error.message : '')
        if (!error) nav('/dashboard')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-900">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 shadow-sm">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={vnxLogo} alt="VNX-Netscan" className="h-10 w-auto" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">VNX-Netscan</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {mode==='signup'?'Create Account': mode==='magic'?'Sign In with Magic Link':'Sign In'}
          </p>
        </div>
        
        <input 
          className="w-full border border-slate-300 dark:border-slate-600 rounded-md p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
          type="email" 
          placeholder="you@domain.com"
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          required 
        />
        
        {mode!=='magic' && (
          <input 
            className="w-full border border-slate-300 dark:border-slate-600 rounded-md p-3 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
            type="password" 
            placeholder="Password"
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required 
          />
        )}
        
        <button 
          className="w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          disabled={loading}
        >
          {loading ? 'Working…' : mode==='magic' ? 'Send Magic Link' : mode==='signup' ? 'Create Account' : 'Sign In'}
        </button>
        
        {msg && <p className="text-sm text-slate-600 dark:text-slate-400 text-center">{msg}</p>}
        
        <div className="flex items-center justify-between text-sm">
          <button 
            type="button" 
            className="text-blue-600 hover:text-blue-700 underline" 
            onClick={()=>setMode(mode==='signup'?'signin':'signup')}
          >
            {mode==='signup' ? 'Have an account? Sign in' : 'New here? Create account'}
          </button>
          <button 
            type="button" 
            className="text-blue-600 hover:text-blue-700 underline" 
            onClick={()=>setMode('magic')}
          >
            Use Magic Link
          </button>
        </div>
      </form>
    </div>
  )
}