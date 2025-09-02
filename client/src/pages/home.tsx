import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import PublicLayout from "@/components/public-layout";
import { GoogleLogin } from "@/components/google-login";
import { 
  Network, 
  Globe, 
  Shield, 
  Search,
  Zap,
  Download,
  Activity,
  ArrowRight,
  Play,
  CheckCircle,
  Layers,
  Users,
  TrendingUp
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
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
              Advanced network analysis, security scanning, and real-time monitoring 
              for IT professionals and cybersecurity experts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <>
                  <GoogleLogin className="px-8 py-3 text-lg rounded-xl shadow-lg" />
                  <div className="text-slate-400 text-sm">or</div>
                  <Link href="/demo">
                    <Button variant="outline" className="px-8 py-3 text-lg rounded-xl border-2 hover:bg-slate-50">
                      <Search className="w-5 h-5 mr-2" />
                      Try Demo
                    </Button>
                  </Link>
                </>
              ) : (
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg rounded-xl shadow-lg">
                    <Play className="w-5 h-5 mr-2" />
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
            
            {isAuthenticated && user && (
              <div className="mt-6">
                <Badge variant="secondary" className="px-4 py-2 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Welcome back, {user.name}
                  {user.is_pro && <span className="ml-2 text-blue-600 font-semibold">Pro</span>}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Overview */}
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
            {/* IP & Geolocation */}
            <Card className="p-8 hover:shadow-lg transition-shadow border-0 shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="text-white w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">IP & Geolocation</h3>
              <p className="text-slate-600 mb-4">
                Real-time IP address lookup with precise geolocation data, ISP information, and network details
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />IPv4 & IPv6 support</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />ISP & ASN details</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Geographic mapping</li>
              </ul>
            </Card>

            {/* Network Security */}
            <Card className="p-8 hover:shadow-lg transition-shadow border-0 shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-white w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Security Scanning</h3>
              <p className="text-slate-600 mb-4">
                Advanced vulnerability assessment and security analysis with detailed reporting
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Vulnerability detection</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Security scoring</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Compliance checks</li>
              </ul>
            </Card>

            {/* Real-time Monitoring */}
            <Card className="p-8 hover:shadow-lg transition-shadow border-0 shadow-md">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <Activity className="text-white w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Live Monitoring</h3>
              <p className="text-slate-600 mb-4">
                Real-time network monitoring with alerts, performance metrics, and historical data
              </p>
              <ul className="space-y-2 text-sm text-slate-500">
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Live status tracking</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Performance metrics</li>
                <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Custom alerts</li>
              </ul>
            </Card>
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
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Network Topology Mapping</h3>
                  <p className="text-slate-600">
                    Visualize network infrastructure with interactive topology maps and device discovery
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
                    Share findings, collaborate on investigations, and maintain audit trails
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">Advanced Analytics</h3>
                  <p className="text-slate-600">
                    Deep insights with historical trending, anomaly detection, and predictive analysis
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6">
                Join thousands of IT professionals using VNX-Netscan for comprehensive network analysis
              </p>
              <div className="space-y-4">
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
              <Link href={isAuthenticated ? "/dashboard" : "/sign-in"}>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 mt-6 px-6 py-2 rounded-lg font-semibold">
                  {isAuthenticated ? "Access Dashboard" : "Sign Up Free"}
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
            <Link href={isAuthenticated ? "/dashboard" : "/sign-in"}>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg rounded-xl">
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/demo">
              <Button variant="outline" className="px-8 py-3 text-lg rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                Try Demo
                <Globe className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/support">
              <Button variant="ghost" className="px-8 py-3 text-lg rounded-xl">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    </PublicLayout>
  );
}