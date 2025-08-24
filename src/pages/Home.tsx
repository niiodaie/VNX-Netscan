import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useSession } from '@/hooks/useSession'
import { 
  Network, 
  Globe, 
  Shield, 
  Search,
  Activity,
  ArrowRight,
  Play,
  CheckCircle,
  Layers,
  Users,
  TrendingUp,
  Zap,
  Lock,
  Eye,
  BarChart3
} from 'lucide-react'

export default function Home() {
  const { session } = useSession()

  const features = [
    {
      icon: Globe,
      title: "IP Address Lookup",
      description: "Get detailed geolocation, ISP information, and network details for any IP address",
      features: ["IPv4 & IPv6 support", "ISP & ASN details", "Geographic mapping"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Port Scanner",
      description: "Scan for open ports, identify running services, and assess network security",
      features: ["TCP & UDP scanning", "Service detection", "Security analysis"],
      color: "from-red-500 to-red-600"
    },
    {
      icon: Search,
      title: "Domain Tools",
      description: "WHOIS lookups, DNS analysis, domain registration and hosting information",
      features: ["WHOIS data", "DNS records", "Domain history"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: Lock,
      title: "SSL Analyzer",
      description: "Comprehensive SSL certificate analysis and security assessment",
      features: ["Certificate validation", "Security scoring", "Expiration alerts"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Activity,
      title: "Network Monitoring",
      description: "Real-time network performance monitoring and connection tracking",
      features: ["Live status tracking", "Performance metrics", "Custom alerts"],
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Eye,
      title: "Network Topology",
      description: "Visualize network connections and trace routes between destinations",
      features: ["Interactive maps", "Route tracing", "Connection analysis"],
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const stats = [
    { label: "Network Scans", value: "1M+", icon: BarChart3 },
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Uptime", value: "99.9%", icon: TrendingUp },
    { label: "Countries", value: "180+", icon: Globe }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-float">
                <Network className="text-white w-8 h-8" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-slate-800 mb-6 leading-tight">
              Professional
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Network Diagnostics
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Comprehensive network analysis and monitoring tools for IP lookup, port 
              scanning, WHOIS queries, and network management. Professional-grade 
              diagnostics made simple.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!session ? (
                <>
                  <Link to="/sign-in">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg">
                      <Play className="w-5 h-5 mr-2" />
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <div className="text-slate-400 text-sm">or</div>
                  <Link to="/demo-dashboard">
                    <Button variant="outline" className="px-8 py-3 text-lg rounded-xl border-2 hover:bg-slate-50">
                      <Search className="w-5 h-5 mr-2" />
                      Try Demo
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg">
                    <Play className="w-5 h-5 mr-2" />
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Complete Network Analysis Suite
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need for comprehensive network diagnostics and security assessment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 hover:shadow-lg transition-all duration-300 border-0 shadow-md group hover:-translate-y-1">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white w-7 h-7" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 mb-4">{feature.description}</p>
                <ul className="space-y-2 text-sm text-slate-500">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Features */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Built for Professionals
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Enterprise-grade tools designed for network administrators, security professionals, and IT teams
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Layers className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Advanced Analytics</h3>
                  <p className="text-slate-600">
                    Deep insights with historical trending, anomaly detection, and predictive analysis for proactive network management
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Team Collaboration</h3>
                  <p className="text-slate-600">
                    Share findings, collaborate on investigations, and maintain comprehensive audit trails for compliance
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Real-time Monitoring</h3>
                  <p className="text-slate-600">
                    Continuous network monitoring with instant alerts, performance metrics, and automated reporting
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6">
                Join thousands of IT professionals using VNX-Netscan for comprehensive network analysis and security assessment
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                  Free tier with essential tools
                </div>
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                  Pro features for advanced analysis
                </div>
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="w-5 h-5 mr-3 text-blue-200" />
                  Enterprise solutions available
                </div>
              </div>
              <Link to={session ? "/dashboard" : "/sign-in"}>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold">
                  {session ? "Access Dashboard" : "Sign Up Free"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Start Your Network Analysis Today
          </h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Experience the power of professional network diagnostics with our comprehensive toolkit
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={session ? "/dashboard" : "/sign-in"}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg rounded-xl">
                {session ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/demo-dashboard">
              <Button variant="outline" className="px-8 py-3 text-lg rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                Try Demo
                <Globe className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link to="/support">
              <Button variant="ghost" className="px-8 py-3 text-lg rounded-xl">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

