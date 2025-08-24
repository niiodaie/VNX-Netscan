import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Globe, 
  Shield, 
  Search, 
  Activity, 
  Lock,
  Eye,
  ArrowRight,
  Info,
  Zap
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function DemoDashboard() {
  const [demoInput, setDemoInput] = useState('')
  const [demoResult, setDemoResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleDemoLookup = async () => {
    if (!demoInput.trim()) return
    
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setDemoResult({
        ip: demoInput,
        location: 'Mountain View, CA, US',
        isp: 'Google LLC',
        asn: 'AS15169',
        type: 'Public DNS',
        security: 'Safe'
      })
      setLoading(false)
    }, 1500)
  }

  const demoTools = [
    {
      id: 'ip-lookup',
      title: 'IP Address Lookup',
      description: 'Get detailed information about any IP address',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      demo: true
    },
    {
      id: 'port-scanner',
      title: 'Port Scanner',
      description: 'Scan for open ports and running services',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      demo: false
    },
    {
      id: 'domain-tools',
      title: 'Domain Tools',
      description: 'WHOIS lookups and DNS analysis',
      icon: Search,
      color: 'from-green-500 to-green-600',
      demo: false
    },
    {
      id: 'ssl-analyzer',
      title: 'SSL Analyzer',
      description: 'Analyze SSL certificates and security',
      icon: Lock,
      color: 'from-purple-500 to-purple-600',
      demo: false
    },
    {
      id: 'network-monitor',
      title: 'Network Monitor',
      description: 'Real-time network monitoring',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      demo: false
    },
    {
      id: 'network-map',
      title: 'Network Topology',
      description: 'Visualize network connections',
      icon: Eye,
      color: 'from-indigo-500 to-indigo-600',
      demo: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Try VNX-Netscan Demo
            </h1>
            <p className="text-slate-600 mb-4">
              Experience our network diagnostic tools with limited demo functionality
            </p>
            <Alert className="max-w-2xl mx-auto">
              <Info className="h-4 w-4" />
              <AlertDescription>
                This is a demo version with limited features. 
                <Link to="/sign-in" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                  Sign up for free
                </Link> to access all tools and features.
              </AlertDescription>
            </Alert>
          </div>

          {/* Demo IP Lookup */}
          <Card className="shadow-lg border-0 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Demo: IP Address Lookup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Try 8.8.8.8 or 1.1.1.1"
                    value={demoInput}
                    onChange={(e) => setDemoInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleDemoLookup}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Search className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {demoResult && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-800 mb-3">Results for {demoResult.ip}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-slate-600">Location:</span>
                        <div className="font-medium">{demoResult.location}</div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">ISP:</span>
                        <div className="font-medium">{demoResult.isp}</div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">ASN:</span>
                        <div className="font-medium">{demoResult.asn}</div>
                      </div>
                      <div>
                        <span className="text-sm text-slate-600">Type:</span>
                        <div className="font-medium">{demoResult.type}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {demoTools.map((tool) => (
              <Card key={tool.id} className={`shadow-lg border-0 ${!tool.demo ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mb-4`}>
                    <tool.icon className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">{tool.title}</h3>
                  <p className="text-slate-600 mb-4">{tool.description}</p>
                  {tool.demo ? (
                    <Badge variant="secondary" className="mb-2">
                      <Zap className="w-3 h-3 mr-1" />
                      Demo Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mb-2">
                      <Lock className="w-3 h-3 mr-1" />
                      Pro Feature
                    </Badge>
                  )}
                  <Button 
                    className="w-full" 
                    variant={tool.demo ? "default" : "outline"}
                    disabled={!tool.demo}
                  >
                    {tool.demo ? "Try Demo" : "Sign Up to Access"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready for Full Access?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Sign up for free to unlock all network diagnostic tools, save your results, 
                and access advanced features like real-time monitoring and detailed reports.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/sign-in">
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-2">
                    Sign Up Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/upgrade">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-2">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

