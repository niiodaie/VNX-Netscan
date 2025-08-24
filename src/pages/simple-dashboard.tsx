import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@/hooks/useSession'
import { supabase } from '@/lib/supabaseClient'
import { Link } from 'react-router-dom'
import vnxLogo from '../assets/vnx-logo.png'

export default function SimpleDashboard() {
  const { session, ready } = useSession()
  const navigate = useNavigate()

  const email = session?.user?.email

  useEffect(() => {
    if (ready && !session) {
      navigate('/sign-in')
    }
  }, [ready, session, navigate])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <img src={vnxLogo} alt="VNX-Netscan" className="h-8 w-auto" />
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">VNX-Netscan Dashboard</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Welcome back, {email || 'user'}!</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/upgrade"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Upgrade to Pro
            </Link>
            <button 
              onClick={handleSignOut}
              className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Free Tier Tools */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Free Network Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link to="/lookup" className="group">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-xl">🌐</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">IP Address Lookup</h3>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">FREE</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Get detailed information about IP addresses including location, ISP, and network details.
                </p>
              </div>
            </Link>

            <Link to="/ports" className="group">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-green-600 dark:text-green-400 text-xl">🔍</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Port Scanner</h3>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">5/DAY LIMIT</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Scan network ports to identify open services. Limited to 5 scans per day on free tier.
                </p>
              </div>
            </Link>

            <Link to="/domain" className="group">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-400 text-xl">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">WHOIS & Domain Tools</h3>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">FREE</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Look up domain registration information, DNS records, and ownership details.
                </p>
              </div>
            </Link>

            <Link to="/ssl-analyzer" className="group">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-600 dark:text-emerald-400 text-xl">🔐</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">SSL/TLS Analyzer</h3>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">FREE</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Analyze SSL certificates, check expiry dates, and view certificate chains.
                </p>
              </div>
            </Link>

            <Link to="/network-map" className="group">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 dark:text-orange-400 text-xl">🗺️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Network Topology</h3>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">BASIC</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Basic network visualization and device relationship mapping.
                </p>
              </div>
            </Link>

            <Link to="/history" className="group">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                    <span className="text-slate-600 dark:text-slate-400 text-xl">📚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Scan History</h3>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full">LIMITED</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Access your recent scans and analysis results (last 30 days only).
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Pro Tier Promotion */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Unlock Pro Features</h2>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Get unlimited scans, bulk analysis, advanced monitoring, and export capabilities.
                </p>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <li>✓ Unlimited port scanning & IP lookups</li>
                  <li>✓ Bulk scanning (upload CSV files)</li>
                  <li>✓ Advanced SSL alerts & monitoring</li>
                  <li>✓ Export reports (PDF/CSV)</li>
                  <li>✓ Real-time network monitoring</li>
                  <li>✓ Priority support</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">$4.99<span className="text-lg">/mo</span></div>
                <Link 
                  to="/upgrade" 
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pro-Only Features Preview */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Pro-Only Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="group opacity-75">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">PRO</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 dark:text-red-400 text-xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Real-time Monitoring</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Monitor network performance, uptime, and security events with real-time alerts.
                </p>
                <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center">
                  <Link to="/upgrade" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Upgrade to Access</Link>
                </div>
              </div>
            </div>

            <div className="group opacity-75">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">PRO</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 dark:text-indigo-400 text-xl">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Bulk Analysis</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Upload CSV files to scan multiple IPs, domains, or ports simultaneously.
                </p>
                <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center">
                  <Link to="/upgrade" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Upgrade to Access</Link>
                </div>
              </div>
            </div>

            <div className="group opacity-75">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 relative overflow-hidden">
                <div className="absolute top-2 right-2">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">PRO</span>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                    <span className="text-amber-600 dark:text-amber-400 text-xl">📋</span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Security Reports</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Generate comprehensive PDF/CSV reports with vulnerability assessments.
                </p>
                <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-800/50 flex items-center justify-center">
                  <Link to="/upgrade" className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Upgrade to Access</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}