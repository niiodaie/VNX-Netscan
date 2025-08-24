import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useSession } from '@/hooks/useSession'
import { useEffect, useState } from 'react'
import vnxLogo from '../assets/vnx-logo.png'

export default function Header() {
  const { session, ready } = useSession()
  const [plan, setPlan] = useState<'free' | 'pro'>('free')

  useEffect(() => {
    (async () => {
      if (!session) return
      const { data } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', session.user.id)
        .maybeSingle()
      if (data?.plan) setPlan(data.plan as 'free' | 'pro')
    })()
  }, [session])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <img src={vnxLogo} alt="VNX-Netscan" className="h-8 w-auto" />
          <span className="text-xl font-bold text-slate-900 dark:text-slate-100">VNX-Netscan</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {ready && session ? (
            <>
              <Link 
                to="/profile" 
                className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium underline"
              >
                Profile ({plan})
              </Link>
              {plan === 'free' && (
                <Link 
                  to="/upgrade" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Upgrade
                </Link>
              )}
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/sign-in" 
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}