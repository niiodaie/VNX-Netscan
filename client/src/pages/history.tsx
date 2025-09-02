import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  History as HistoryIcon, 
  Search, 
  Calendar,
  MapPin,
  ArrowRight,
  Filter
} from "lucide-react";
import AuthenticatedLayout from "@/components/authenticated-layout";

interface HistoryEntry {
  id: string;
  timestamp: string;
  mac: string;
  ip: string;
  hostname: string;
  switch: string;
  port: string;
  vlan: number;
  action: 'first_seen' | 'moved' | 'ip_changed' | 'offline' | 'online';
  previousLocation?: {
    switch: string;
    port: string;
  };
  previousIp?: string;
}

// Historic tracking data - would come from database storing network state changes
const historyData: HistoryEntry[] = [
  {
    id: "hist-001",
    timestamp: "2024-01-15T10:30:00Z",
    mac: "00:1B:44:11:3A:B7",
    ip: "192.168.1.45",
    hostname: "workstation-dev-01",
    switch: "Switch-Floor2-01",
    port: "Gi0/12",
    vlan: 100,
    action: "moved",
    previousLocation: {
      switch: "Switch-Floor1-01",
      port: "Gi0/8"
    }
  },
  {
    id: "hist-002",
    timestamp: "2024-01-15T09:15:00Z",
    mac: "00:50:56:C0:00:08", 
    ip: "192.168.1.87",
    hostname: "printer-hp-laser",
    switch: "Switch-Floor1-02",
    port: "Fa0/24",
    vlan: 20,
    action: "offline"
  },
  {
    id: "hist-003",
    timestamp: "2024-01-14T16:20:00Z",
    mac: "A4:83:E7:12:34:56",
    ip: "192.168.1.156",
    hostname: "iphone-john",
    switch: "AP-Floor2-03",
    port: "WiFi",
    vlan: 10,
    action: "ip_changed",
    previousIp: "192.168.1.142"
  },
  {
    id: "hist-004",
    timestamp: "2024-01-14T14:45:00Z",
    mac: "00:25:B3:A1:B2:C3",
    ip: "192.168.1.95",
    hostname: "laptop-mobile-05",
    switch: "Switch-Floor2-01",
    port: "Gi0/15",
    vlan: 100,
    action: "first_seen"
  },
  {
    id: "hist-005",
    timestamp: "2024-01-14T12:30:00Z",
    mac: "00:1B:44:11:3A:B7",
    ip: "192.168.1.45",
    hostname: "workstation-dev-01",
    switch: "Switch-Floor1-01",
    port: "Gi0/8",
    vlan: 100,
    action: "online"
  }
];

export default function History() {
  const [history] = useState<HistoryEntry[]>(historyData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [filterTimeRange, setFilterTimeRange] = useState<string>("7d");

  const actionTypes = Array.from(new Set(history.map(h => h.action)));

  const filteredHistory = history.filter(entry => {
    const matchesSearch = entry.mac.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.ip.includes(searchQuery) ||
                         entry.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.switch.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = filterAction === "all" || entry.action === filterAction;
    
    // Filter by time range
    const entryDate = new Date(entry.timestamp);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let matchesTimeRange = true;
    if (filterTimeRange === "1d") matchesTimeRange = daysDiff <= 1;
    else if (filterTimeRange === "7d") matchesTimeRange = daysDiff <= 7;
    else if (filterTimeRange === "30d") matchesTimeRange = daysDiff <= 30;

    return matchesSearch && matchesAction && matchesTimeRange;
  });

  const getActionBadge = (action: string) => {
    const actionConfig = {
      first_seen: { label: "First Seen", variant: "default" as const },
      moved: { label: "Moved", variant: "secondary" as const },
      ip_changed: { label: "IP Changed", variant: "outline" as const },
      offline: { label: "Offline", variant: "destructive" as const },
      online: { label: "Online", variant: "default" as const }
    };
    
    const config = actionConfig[action as keyof typeof actionConfig] || { label: action, variant: "secondary" as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getActionDescription = (entry: HistoryEntry) => {
    switch (entry.action) {
      case 'first_seen':
        return `Device first discovered on network`;
      case 'moved':
        return `Moved from ${entry.previousLocation?.switch} port ${entry.previousLocation?.port}`;
      case 'ip_changed':
        return `IP changed from ${entry.previousIp}`;
      case 'offline':
        return `Device went offline`;
      case 'online':
        return `Device came online`;
      default:
        return entry.action;
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network History</h1>
        <p className="text-muted-foreground">
          Track device movements, IP changes, and network activity over time
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            History Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by MAC, IP, or hostname..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actionTypes.map(action => (
                  <SelectItem key={action} value={action} className="capitalize">
                    {action.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTimeRange} onValueChange={setFilterTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-muted-foreground mt-4">
            Showing {filteredHistory.length} of {history.length} history entries
          </div>
        </CardContent>
      </Card>

      {/* History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <HistoryIcon className="w-5 h-5 mr-2 text-blue-600" />
            Network Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.map((entry, index) => (
              <div key={entry.id} className="relative">
                {/* Timeline line */}
                {index < filteredHistory.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-8 bg-border" />
                )}
                
                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{entry.hostname}</h3>
                        {getActionBadge(entry.action)}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {getActionDescription(entry)}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Network:</span>
                        <div className="font-mono">
                          {entry.ip} ({entry.mac})
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {entry.switch} - {entry.port}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-muted-foreground">VLAN:</span>
                        <Badge variant="outline" className="ml-1">
                          VLAN {entry.vlan}
                        </Badge>
                      </div>
                    </div>

                    {/* Movement visualization */}
                    {entry.action === 'moved' && entry.previousLocation && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-red-500" />
                            <span>{entry.previousLocation.switch} - {entry.previousLocation.port}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-green-500" />
                            <span>{entry.switch} - {entry.port}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* IP change visualization */}
                    {entry.action === 'ip_changed' && entry.previousIp && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between text-sm font-mono">
                          <span className="text-red-600">{entry.previousIp}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <span className="text-green-600">{entry.ip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8">
              <HistoryIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No history found</h3>
              <p className="text-muted-foreground">
                No network activity matches your current filters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </AuthenticatedLayout>
  );
}