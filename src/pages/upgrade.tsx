import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { startUpgrade, getUserPlan } from '@/lib/upgrade'
import { supabase } from '@/lib/supabaseClient'
import vnxLogo from '../assets/vnx-logo.png'

export default function Upgrade() {
  const [plan, setPlan] = useState<string>('free')
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState<string>('')

  useEffect(() => {
    async function loadUserData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setEmail(session.user.email)
      }
      
      const userPlan = await getUserPlan()
      setPlan(userPlan)
      setLoading(false)
    }
    
    loadUserData()
  }, [])

  const handleUpgrade = async () => {
    setLoading(true)
    await startUpgrade()
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={vnxLogo} alt="VNX-Netscan" className="h-8 w-auto" />
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">VNX-Netscan</span>
          </div>
          <Link 
            to="/dashboard" 
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {plan === 'pro' ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center">
            <div className="text-green-600 dark:text-green-400 text-2xl mb-2">✅</div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              You're Pro!
            </h2>
            <p className="text-green-700 dark:text-green-300">
              You have access to all VNX-Netscan Pro features.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  Free Plan
                </h3>
                <div className="text-3xl font-bold text-slate-600 dark:text-slate-400 mb-2">
                  $0<span className="text-lg">/mo</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Current plan</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-600 dark:text-slate-400">Basic IP lookup</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-600 dark:text-slate-400">Simple port scanning</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-600 dark:text-slate-400">WHOIS lookup</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-red-500">✗</span>
                  <span className="text-slate-400 line-through">Unlimited scans</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-red-500">✗</span>
                  <span className="text-slate-400 line-through">Bulk scanning</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-red-500">✗</span>
                  <span className="text-slate-400 line-through">Export reports</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Recommended
                </span>
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  VNX-Netscan Pro
                </h3>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  $4.99<span className="text-lg">/mo</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Everything in Free, plus:</p>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-900 dark:text-slate-100">Unlimited network scans</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-900 dark:text-slate-100">Bulk IP scanning</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-900 dark:text-slate-100">Advanced port analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-900 dark:text-slate-100">Network topology mapping</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-900 dark:text-slate-100">Vulnerability scanning</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-900 dark:text-slate-100">Export audit reports</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-slate-900 dark:text-slate-100">Priority support</span>
                </li>
              </ul>
              
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {loading ? 'Processing...' : 'Upgrade to Pro — $4.99/mo'}
              </button>
              
              <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-3">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-slate-600 dark:text-slate-400">
            Currently signed in as: <span className="font-medium">{email}</span>
          </p>
        </div>
      </div>
    </div>
  )
}