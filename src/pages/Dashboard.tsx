import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useSession } from '@/hooks/useSession'
import { 
  Globe, 
  Shield, 
  Search, 
  Activity, 
  BarChart3,
  Network,
  Lock,
  Eye,
  ArrowRight,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

export default function Dashboard() {
  const { session } = useSession()
  const [activeTab, setActiveTab] = useState('overview')

  const tools = [
    {
      id: 'ip-lookup',
      title: 'IP Address Lookup',
      description: 'Get detailed information about any IP address',
      icon: Globe,
      color: 'from-blue-500 to-blue-600',
      href: '/lookup'
    },
    {
      id: 'port-scanner',
      title: 'Port Scanner',
      description: 'Scan for open ports and running services',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      href: '/ports'
    },
    {
      id: 'domain-tools',
      title: 'Domain Tools',
      description: 'WHOIS lookups and DNS analysis',
      icon: Search,
      color: 'from-green-500 to-green-600',
      href: '/domain'
    },
    {
      id: 'ssl-analyzer',
      title: 'SSL Analyzer',
      description: 'Analyze SSL certificates and security',
      icon: Lock,
      color: 'from-purple-500 to-purple-600',
      href: '/ssl-analyzer'
    },
    {
      id: 'network-monitor',
      title: 'Network Monitor',
      description: 'Real-time network monitoring',
      icon: Activity,
      color: 'from-orange-500 to-orange-600',
      href: '/monitoring'
    },
    {
      id: 'network-map',
      title: 'Network Topology',
      description: 'Visualize network connections',
      icon: Eye,
      color: 'from-indigo-500 to-indigo-600',
      href: '/network-map'
    }
  ]

  const recentActivity = [
    { type: 'IP Lookup', target: '8.8.8.8', time: '2 minutes ago', status: 'success' },
    { type: 'Port Scan', target: 'example.com', time: '5 minutes ago', status: 'success' },
    { type: 'SSL Check', target: 'github.com', time: '10 minutes ago', status: 'warning' },
    { type: 'WHOIS', target: 'google.com', time: '15 minutes ago', status: 'success' },
  ]

  const stats = [
    { label: 'Total Scans', value: '1,247', change: '+12%', icon: BarChart3 },
    { label: 'Active Monitors', value: '8', change: '+2', icon: Activity },
    { label: 'Alerts Today', value: '3', change: '-1', icon: AlertTriangle },
    { label: 'Uptime', value: '99.9%', change: '0%', icon: Zap }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome back{session?.user?.user_metadata?.full_name ? `, ${session.user.user_metadata.full_name}` : ''}!
            </h1>
            <p className="text-slate-600">Monitor your network and analyze security with professional tools</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                      <p className="text-sm text-green-600">{stat.change}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <stat.icon className="text-white w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Quick Actions */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Quick IP Lookup</span>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Enter IP address" className="flex-1" />
                        <Button size="sm">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-red-600" />
                        <span className="font-medium">Port Scan</span>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Enter hostname" className="flex-1" />
                        <Button size="sm">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <Search className="w-5 h-5 text-green-600" />
                        <span className="font-medium">WHOIS Lookup</span>
                      </div>
                      <div className="flex gap-2">
                        <Input placeholder="Enter domain" className="flex-1" />
                        <Button size="sm">
                          <Search className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            activity.status === 'success' ? 'bg-green-500' : 
                            activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <span className="font-medium text-slate-800">{activity.type}</span>
                            <span className="text-slate-600 ml-2">{activity.target}</span>
                          </div>
                        </div>
                        <span className="text-sm text-slate-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tools" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <Card key={tool.id} className="shadow-lg border-0 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <tool.icon className="text-white w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{tool.title}</h3>
                      <p className="text-slate-600 mb-4">{tool.description}</p>
                      <Button className="w-full" variant="outline">
                        Launch Tool
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.status === 'success' ? 'bg-green-100' : 
                            activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                          }`}>
                            {activity.status === 'success' ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : activity.status === 'warning' ? (
                              <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            ) : (
                              <AlertTriangle className="w-5 h-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-slate-800">{activity.type}</div>
                            <div className="text-sm text-slate-600">{activity.target}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-slate-500">{activity.time}</div>
                          <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

