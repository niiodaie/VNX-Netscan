import { useState } from 'react'
import { Link } from 'react-router-dom'
import vnxLogo from '../assets/vnx-logo.png'

type Result = {
  ok?: boolean
  host?: string
  port?: number
  info?: {
    subjectCN?: string
    altNames?: string[]
    issuer?: string
    validFrom?: string
    validTo?: string
    daysRemaining?: number
    expired?: boolean
    selfSigned?: boolean
    protocol?: string | null
    cipher?: any
    authorizationError?: string | null
    serialNumber?: string | null
    fingerprint256?: string | null
    chain?: Array<{ subject?: string; issuer?: string; validFrom?: string; validTo?: string }>
  }
  error?: string
}

export default function SSLAnalyzer() {
  const [host, setHost] = useState('example.com')
  const [port, setPort] = useState(443)
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState<Result | null>(null)

  const run = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setRes(null)
    try {
      const r = await fetch(`/api/ssl-analyzer?host=${encodeURIComponent(host)}&port=${port}`)
      const j = await r.json()
      setRes(j)
    } catch (e: any) {
      setRes({ error: e?.message || 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  const warn =
    res?.info?.expired ? 'Expired' :
    (typeof res?.info?.daysRemaining === 'number' && res!.info!.daysRemaining <= 30) ? `Expiring in ${res!.info!.daysRemaining} days` :
    ''

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

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">SSL/TLS Analyzer</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Analyze SSL/TLS certificates, check expiry dates, and view certificate chains
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={run} className="flex gap-3 mb-6">
              <input 
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                placeholder="example.com"
                value={host} 
                onChange={e => setHost(e.target.value)} 
                required
              />
              <input 
                className="w-24 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                type="number"
                placeholder="443"
                value={port} 
                onChange={e => setPort(parseInt(e.target.value || '443'))} 
              />
              <button 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-md transition-colors" 
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Analyze SSL'}
              </button>
            </form>

            {res?.error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 mb-6">
                {res.error}
              </div>
            )}

            {res?.ok && res.info && (
              <div className="space-y-6">
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Certificate Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Common Name (CN)</div>
                      <div className="text-slate-900 dark:text-slate-100">{res.info.subjectCN || '—'}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Days Remaining</div>
                      <div className={`font-medium ${
                        res.info.expired ? 'text-red-600 dark:text-red-400' :
                        (res.info.daysRemaining !== undefined && res.info.daysRemaining <= 30) ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-green-600 dark:text-green-400'
                      }`}>
                        {res.info.daysRemaining ?? '—'} {warn && `(${warn})`}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Issuer</div>
                      <div className="text-slate-900 dark:text-slate-100 break-words">{res.info.issuer || '—'}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Protocol / Cipher</div>
                      <div className="text-slate-900 dark:text-slate-100">{res.info.protocol || '—'} / {res.info.cipher?.name || '—'}</div>
                    </div>
                    
                    <div className="md:col-span-2">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Valid Period</div>
                      <div className="text-slate-900 dark:text-slate-100">{res.info.validFrom} → {res.info.validTo}</div>
                    </div>
                  </div>

                  {res.info.authorizationError && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                      <div className="text-sm font-medium text-red-800 dark:text-red-200">Authorization Error</div>
                      <div className="text-red-700 dark:text-red-300">{res.info.authorizationError}</div>
                    </div>
                  )}

                  {res.info.altNames?.length ? (
                    <div className="mt-4">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject Alternative Names</div>
                      <div className="flex flex-wrap gap-2">
                        {res.info.altNames.map((name, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {res.info.chain?.length ? (
                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Certificate Chain</h3>
                    <div className="space-y-4">
                      {res.info.chain.map((cert, i) => (
                        <div key={i} className="border-l-4 border-blue-500 pl-4">
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">Level {i + 1}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 break-words">
                            <span className="font-medium">Subject:</span> {cert.subject}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 break-words">
                            <span className="font-medium">Issuer:</span> {cert.issuer}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-medium">Valid:</span> {cert.validFrom} → {cert.validTo}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}