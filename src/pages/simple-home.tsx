import { Link } from 'react-router-dom'
import vnxLogo from '../assets/vnx-logo.png'

export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img src={vnxLogo} alt="VNX-Netscan" className="h-8 w-auto" />
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">VNX-Netscan</span>
          </div>
          <div className="flex gap-4">
            <Link 
              to="/sign-in" 
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Network Diagnostic Tools
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Comprehensive network analysis and monitoring tools for IP lookup, port scanning, 
            WHOIS queries, and network management. Professional-grade diagnostics made simple.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-blue-600 dark:text-blue-400 text-2xl">🔍</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">IP Address Lookup</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Get detailed geolocation, ISP information, and network details for any IP address
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-green-600 dark:text-green-400 text-2xl">🔓</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Port Scanner</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Scan for open ports, identify running services, and assess network security
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-purple-600 dark:text-purple-400 text-2xl">🌐</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Domain Tools</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              WHOIS lookups, DNS analysis, domain registration and hosting information
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-orange-600 dark:text-orange-400 text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Network Monitoring</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Real-time network performance monitoring and connection tracking
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-red-600 dark:text-red-400 text-2xl">🛡️</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Security Scans</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Vulnerability assessment and security analysis of network infrastructure
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4">
              <span className="text-teal-600 dark:text-teal-400 text-2xl">📈</span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Network Topology</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Visualize network connections and trace routes between destinations
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/sign-in" 
            className="inline-flex px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}