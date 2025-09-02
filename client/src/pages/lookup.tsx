import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Network, 
  Clock,
  MapPin,
  Server,
  Activity,
  Wifi,
  Loader2
} from "lucide-react";
import AuthenticatedLayout from "@/components/authenticated-layout";

interface DeviceResult {
  mac: string;
  ip: string;
  hostname: string;
  vendor: string;
  switch: string;
  port: string;
  vlan: number;
  lastSeen: string;
  status: 'online' | 'offline';
  location: string;
}

// Mock device database - in production, this would come from real network scanning
const mockDevices: DeviceResult[] = [
  {
    mac: "00:1B:44:11:3A:B7",
    ip: "192.168.1.45",
    hostname: "workstation-dev-01",
    vendor: "Dell Inc.",
    switch: "Switch-Floor2-01",
    port: "Gi0/12",
    vlan: 100,
    lastSeen: "2024-01-15T10:30:00Z",
    status: "online",
    location: "Floor 2, Desk 12"
  },
  {
    mac: "00:50:56:C0:00:08",
    ip: "192.168.1.87",
    hostname: "printer-hp-laser",
    vendor: "Hewlett Packard",
    switch: "Switch-Floor1-02",
    port: "Fa0/24",
    vlan: 20,
    lastSeen: "2024-01-15T09:45:00Z",
    status: "offline",
    location: "Floor 1, Print Room"
  }
];

export default function Lookup() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DeviceResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'mac' | 'ip' | 'hostname'>('ip');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Search in mock database
    const results = mockDevices.filter(device => 
      device.mac.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.ip.includes(searchQuery) ||
      device.hostname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const detectSearchType = (query: string) => {
    if (/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(query)) {
      return 'mac';
    } else if (/^(\d{1,3}\.){3}\d{1,3}$/.test(query)) {
      return 'ip';
    } else {
      return 'hostname';
    }
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    setSearchType(detectSearchType(value));
  };

  const formatLastSeen = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Less than 1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Device Lookup</h1>
        <p className="text-muted-foreground">
          Search for devices by MAC address, IP address, or hostname
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-600" />
            Network Device Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter MAC address, IP address, or hostname..."
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                className="glow-border"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-xs text-muted-foreground">Detected type:</span>
                <Badge variant="outline" className="text-xs">
                  {searchType.toUpperCase()}
                </Badge>
              </div>
            </div>
            <Button 
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="vnx-action-button"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Examples:</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleInputChange("192.168.1.45")}
              className="text-xs"
            >
              192.168.1.45
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleInputChange("00:1B:44:11:3A:B7")}
              className="text-xs"
            >
              00:1B:44:11:3A:B7
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleInputChange("workstation-dev-01")}
              className="text-xs"
            >
              workstation-dev-01
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Network className="w-5 h-5 mr-2 text-blue-600" />
              Search Results ({searchResults.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {searchResults.map((device, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        device.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <h3 className="font-semibold text-lg">{device.hostname}</h3>
                      <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                        {device.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatLastSeen(device.lastSeen)}
                    </div>
                  </div>

                  <Tabs defaultValue="details" className="w-full">
                    <TabsList>
                      <TabsTrigger value="details">Device Details</TabsTrigger>
                      <TabsTrigger value="network">Network Info</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                          <p className="font-mono text-lg">{device.ip}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">MAC Address</label>
                          <p className="font-mono text-lg">{device.mac}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Vendor</label>
                          <p>{device.vendor}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <div className="flex items-center space-x-2">
                            <Activity className="w-4 h-4 text-green-500" />
                            <span className="capitalize">{device.status}</span>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="network" className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Switch</label>
                          <div className="flex items-center space-x-2">
                            <Server className="w-4 h-4 text-blue-500" />
                            <span>{device.switch}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Port</label>
                          <div className="flex items-center space-x-2">
                            <Wifi className="w-4 h-4 text-green-500" />
                            <span className="font-mono">{device.port}</span>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">VLAN</label>
                          <Badge variant="outline">VLAN {device.vlan}</Badge>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="location" className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-red-500" />
                        <span>{device.location}</span>
                      </div>
                      <Separator />
                      <p className="text-sm text-muted-foreground">
                        Device is physically located at {device.location} and connected to {device.switch} port {device.port}.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No results message */}
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <Card>
          <CardContent className="text-center py-8">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No devices found</h3>
            <p className="text-muted-foreground">
              No devices match your search criteria. Try a different MAC address, IP address, or hostname.
            </p>
          </CardContent>
        </Card>
      )}
      </div>
    </AuthenticatedLayout>
  );
}