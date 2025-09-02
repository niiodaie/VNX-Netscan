import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Network, Search, Globe, Activity, Users } from 'lucide-react';
import { useLocation } from 'wouter';

export default function DemoDashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              VNX-Netscan Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Enterprise Network Diagnostic and Security Platform
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
              Demo Mode
            </Badge>
            <Button onClick={() => setLocation('/sign-in')} className="bg-blue-600 hover:bg-blue-700">
              Sign In to Access Full Features
            </Button>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="text-yellow-600 dark:text-yellow-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Demo Mode Active</h3>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                You're viewing a demonstration of VNX-Netscan. Sign in with Google to access all network diagnostic tools and save your scan results.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Networks Scanned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">12,847</div>
              <p className="text-xs text-green-600 dark:text-green-400">+2.5% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Security Issues Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">1,023</div>
              <p className="text-xs text-red-600 dark:text-red-400">Critical issues resolved</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Active Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">3,456</div>
              <p className="text-xs text-blue-600 dark:text-blue-400">Across 24 networks</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</div>
              <p className="text-xs text-green-600 dark:text-green-400">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Network Scanning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-600" />
                Network Scanning
              </CardTitle>
              <CardDescription>
                Comprehensive network discovery and port analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="font-semibold">IP Range Scan</div>
                  <div className="text-xs text-slate-500">Discover active devices</div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="font-semibold">Port Analysis</div>
                  <div className="text-xs text-slate-500">Check open ports</div>
                </Button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Recent Scan Results</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>192.168.1.0/24</span>
                    <Badge variant="secondary">45 devices</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>10.0.0.0/16</span>
                    <Badge variant="secondary">128 devices</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security Analysis
              </CardTitle>
              <CardDescription>
                Vulnerability assessment and security monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="font-semibold">Vulnerability Scan</div>
                  <div className="text-xs text-slate-500">CVE detection</div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="font-semibold">Security Audit</div>
                  <div className="text-xs text-slate-500">Compliance check</div>
                </Button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Security Status</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Critical Issues</span>
                    <Badge variant="destructive">2</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Warnings</span>
                    <Badge variant="secondary">12</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Secure Devices</span>
                    <Badge variant="default" className="bg-green-600">234</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Domain Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-600" />
                Domain & IP Analysis
              </CardTitle>
              <CardDescription>
                WHOIS lookups and geolocation services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="font-semibold">WHOIS Lookup</div>
                  <div className="text-xs text-slate-500">Domain information</div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="font-semibold">IP Geolocation</div>
                  <div className="text-xs text-slate-500">Location tracking</div>
                </Button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Popular Lookups</div>
                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <div>google.com → 142.250.185.78</div>
                  <div>github.com → 140.82.113.4</div>
                  <div>cloudflare.com → 104.16.133.229</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                Real-time Monitoring
              </CardTitle>
              <CardDescription>
                Live network traffic and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="font-semibold">Traffic Monitor</div>
                  <div className="text-xs text-slate-500">Live bandwidth</div>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex-col items-start">
                  <div className="font-semibold">Performance</div>
                  <div className="text-xs text-slate-500">Latency tracking</div>
                </Button>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Network Status</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Bandwidth Usage</span>
                    <span className="text-blue-600">847 Mbps</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Average Latency</span>
                    <span className="text-green-600">12ms</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Sign in with Google to access all network diagnostic tools, save scan results, 
            and unlock advanced security features.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setLocation('/sign-in')}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Users className="h-5 w-5 mr-2" />
              Sign In with Google
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setLocation('/')}
              className="border-white text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}