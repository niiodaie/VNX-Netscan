import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useSession } from '@/hooks/useSession'
import { startUpgrade } from '@/lib/upgrade'
import vnxLogo from '../assets/vnx-logo.png'

type ProfileRow = {
  id: string
  email: string | null
  plan: string | null
  created_at: string | null
}

export default function Profile() {
  const { session, ready } = useSession()
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!ready) return
    
    if (!session) {
      // If no session after ready, redirect to sign in
      setTimeout(() => {
        navigate('/sign-in', { replace: true })
      }, 2000) // Give 2 seconds for session to load
      return
    }

    if (session) {
      // Load profile data when we have a session
      (async () => {
        setLoading(true)
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, email, plan, created_at')
            .eq('id', session.user.id)
            .maybeSingle()
          if (error) throw error
          setProfile(data as any)
        } finally { setLoading(false) }
      })()
    }
  }, [ready, session, navigate])

  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <img src={vnxLogo} alt="VNX-Netscan" className="h-12 w-auto mx-auto mb-4" />
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Loading...</h2>
        </div>
      </div>
    )
  }
  
  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6">
        <div className="text-center">
          <img src={vnxLogo} alt="VNX-Netscan" className="h-12 w-auto mx-auto mb-4" />
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Finalizing login...</h2>
          <p className="text-slate-600 dark:text-slate-400">If this takes more than a few seconds, <a className="underline text-blue-600 hover:text-blue-700 dark:text-blue-400" href="/sign-in">click here to sign in</a>.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <img src={vnxLogo} alt="VNX-Netscan" className="h-12 w-auto mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Your Profile</h1>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
          <div className="space-y-6">
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Email</div>
              <div className="text-slate-700 dark:text-slate-300">{profile?.email ?? session?.user.email}</div>
            </div>

            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Plan</div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium">
                  {(profile?.plan || 'free').toUpperCase()}
                </span>
                {(profile?.plan ?? 'free') === 'free' ? (
                  <button 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    onClick={startUpgrade}
                  >
                    Upgrade to Pro — $4.99
                  </button>
                ) : (
                  <span className="text-green-600 dark:text-green-400 font-medium">Thanks for supporting Pro!</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button 
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
                onClick={() => supabase.auth.signOut()}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <div><span className="font-semibold">Member since:</span> {profile?.created_at ? new Date(profile.created_at).toLocaleString() : '—'}</div>
            <div><span className="font-semibold">User ID:</span> {profile?.id || session?.user.id}</div>
          </div>
        </div>
      </div>
    </div>
  )
}