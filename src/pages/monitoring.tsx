import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  Wifi, 
  Server, 
  AlertTriangle, 
  TrendingUp,
  Network,
  Eye,
  Shield,
  Zap,
  Clock,
  Users,
  Download,
  Upload
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import AuthenticatedLayout from "@/components/authenticated-layout";

interface NetworkMetrics {
  timestamp: string;
  bandwidth_in: number;
  bandwidth_out: number;
  latency: number;
  packet_loss: number;
  active_connections: number;
  cpu_usage: number;
  memory_usage: number;
}

interface SecurityAlert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  source: string;
  description: string;
  status: 'active' | 'resolved' | 'investigating';
}

interface NetworkInterface {
  name: string;
  status: 'up' | 'down';
  speed: string;
  utilization: number;
  packets_in: number;
  packets_out: number;
  errors: number;
}

export default function Monitoring() {
  const [metrics, setMetrics] = useState<NetworkMetrics[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [timeRange, setTimeRange] = useState("1h");
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Generate real-time network metrics
  const generateMetrics = (): NetworkMetrics => {
    const now = new Date();
    const baseLoad = 30 + Math.sin(Date.now() / 60000) * 20; // Oscillating base load
    
    return {
      timestamp: now.toISOString(),
      bandwidth_in: baseLoad + Math.random() * 40,
      bandwidth_out: (baseLoad * 0.3) + Math.random() * 20,
      latency: 15 + Math.random() * 10,
      packet_loss: Math.random() * 0.5,
      active_connections: 150 + Math.floor(Math.random() * 50),
      cpu_usage: 25 + Math.random() * 35,
      memory_usage: 60 + Math.random() * 20
    };
  };

  // Generate security alerts
  const generateAlert = (): SecurityAlert => {
    const alertTypes = [
      { type: "Port Scan Detected", severity: "medium" as const },
      { type: "Suspicious Traffic Pattern", severity: "high" as const },
      { type: "Failed Authentication Attempts", severity: "critical" as const },
      { type: "Unusual Data Transfer", severity: "medium" as const },
      { type: "Malware Communication", severity: "critical" as const },
      { type: "DDoS Attempt", severity: "high" as const }
    ];
    
    const sources = ["192.168.1.45", "10.0.0.23", "172.16.1.100", "203.0.113.42"];
    const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    return {
      id: `alert-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      severity: alert.severity,
      type: alert.type,
      source: sources[Math.floor(Math.random() * sources.length)],
      description: `${alert.type} detected from ${sources[Math.floor(Math.random() * sources.length)]}`,
      status: "active"
    };
  };

  // Initialize network interfaces
  const initializeInterfaces = (): NetworkInterface[] => {
    return [
      {
        name: "eth0",
        status: "up",
        speed: "1 Gbps",
        utilization: 45,
        packets_in: 2847329,
        packets_out: 1923847,
        errors: 0
      },
      {
        name: "eth1", 
        status: "up",
        speed: "100 Mbps",
        utilization: 23,
        packets_in: 847329,
        packets_out: 623847,
        errors: 2
      },
      {
        name: "wlan0",
        status: "up", 
        speed: "150 Mbps",
        utilization: 67,
        packets_in: 1247329,
        packets_out: 823847,
        errors: 5
      },
      {
        name: "lo",
        status: "up",
        speed: "Loopback",
        utilization: 1,
        packets_in: 47329,
        packets_out: 47329,
        errors: 0
      }
    ];
  };

  useEffect(() => {
    // Initialize data
    setInterfaces(initializeInterfaces());
    setMetrics([generateMetrics()]);

    if (!isMonitoring) return;

    // Update metrics every 2 seconds
    const metricsInterval = setInterval(() => {
      setMetrics(prev => {
        const newMetrics = [...prev, generateMetrics()].slice(-30); // Keep last 30 points
        return newMetrics;
      });
    }, 2000);

    // Generate alerts randomly
    const alertsInterval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance of alert
        setAlerts(prev => [generateAlert(), ...prev].slice(0, 20)); // Keep last 20 alerts
      }
    }, 5000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(alertsInterval);
    };
  }, [isMonitoring]);

  const formatBytes = (bytes: number) => {
    return `${bytes.toFixed(1)} MB/s`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const currentMetrics = metrics[metrics.length - 1];

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-time Network Monitoring</h1>
          <p className="text-muted-foreground">
            Live network performance metrics and security monitoring
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5m">Last 5 min</SelectItem>
              <SelectItem value="1h">Last 1 hour</SelectItem>
              <SelectItem value="6h">Last 6 hours</SelectItem>
              <SelectItem value="24h">Last 24 hours</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Bandwidth In</p>
                <p className="text-2xl font-bold">{currentMetrics ? formatBytes(currentMetrics.bandwidth_in) : '0 MB/s'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Bandwidth Out</p>
                <p className="text-2xl font-bold">{currentMetrics ? formatBytes(currentMetrics.bandwidth_out) : '0 MB/s'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Latency</p>
                <p className="text-2xl font-bold">{currentMetrics ? `${currentMetrics.latency.toFixed(1)}ms` : '0ms'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Connections</p>
                <p className="text-2xl font-bold">{currentMetrics ? currentMetrics.active_connections : 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bandwidth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Bandwidth Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => formatTime(value)} />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => formatTime(value)}
                    formatter={(value: number, name: string) => [formatBytes(value), name === 'bandwidth_in' ? 'In' : 'Out']}
                  />
                  <Area type="monotone" dataKey="bandwidth_in" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="bandwidth_out" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              System Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" tickFormatter={(value) => formatTime(value)} />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => formatTime(value)}
                    formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name === 'cpu_usage' ? 'CPU' : 'Memory']}
                  />
                  <Line type="monotone" dataKey="cpu_usage" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="memory_usage" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Interfaces and Security Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Interfaces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="w-5 h-5 mr-2 text-blue-600" />
              Network Interfaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interfaces.map((iface) => (
                <div key={iface.name} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={iface.status === 'up' ? 'default' : 'destructive'}>
                        {iface.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{iface.speed}</span>
                    </div>
                    <Badge variant="outline">{iface.utilization}%</Badge>
                  </div>
                  
                  <Progress value={iface.utilization} className="mb-2" />
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div>In: {iface.packets_in.toLocaleString()}</div>
                    <div>Out: {iface.packets_out.toLocaleString()}</div>
                    <div>Errors: {iface.errors}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-600" />
                Security Alerts
              </span>
              <Badge variant="destructive">{alerts.filter(a => a.status === 'active').length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-auto">
              {alerts.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No security alerts</p>
                </div>
              ) : (
                alerts.map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`} />
                        <span className="font-medium text-sm">{alert.type}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">
                      Source: {alert.source}
                    </p>
                    
                    <p className="text-xs text-muted-foreground">
                      {formatTime(alert.timestamp)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Latency Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-600" />
            Network Latency & Packet Loss
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.slice(-10)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tickFormatter={(value) => formatTime(value)} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  labelFormatter={(value) => formatTime(value)}
                  formatter={(value: number, name: string) => [
                    name === 'latency' ? `${value.toFixed(1)}ms` : `${value.toFixed(2)}%`,
                    name === 'latency' ? 'Latency' : 'Packet Loss'
                  ]}
                />
                <Bar yAxisId="left" dataKey="latency" fill="#3B82F6" />
                <Bar yAxisId="right" dataKey="packet_loss" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      </div>
    </AuthenticatedLayout>
  );
}