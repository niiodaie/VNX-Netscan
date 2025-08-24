import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Package, 
  Search, 
  Filter,
  Download,
  Server,
  Monitor,
  Printer,
  Smartphone
} from "lucide-react";
import AuthenticatedLayout from "@/components/authenticated-layout";

interface Device {
  id: string;
  hostname: string;
  ip: string;
  mac: string;
  vendor: string;
  model: string;
  type: 'server' | 'workstation' | 'printer' | 'mobile' | 'network';
  os: string;
  firmware: string;
  location: string;
  status: 'online' | 'offline';
  lastSeen: string;
}

// Device inventory - would come from network discovery tools like Nmap, SNMP
const deviceInventory: Device[] = [
  {
    id: "dev-001",
    hostname: "fileserver-01",
    ip: "192.168.1.10",
    mac: "00:1B:44:11:3A:B7",
    vendor: "Dell Inc.",
    model: "PowerEdge R720",
    type: "server",
    os: "Ubuntu Server 20.04",
    firmware: "2.15.0",
    location: "Server Room Rack A1",
    status: "online",
    lastSeen: "2024-01-15T10:30:00Z"
  },
  {
    id: "dev-002", 
    hostname: "workstation-dev-01",
    ip: "192.168.1.45",
    mac: "00:50:56:C0:00:08",
    vendor: "HP Inc.",
    model: "EliteDesk 800 G6",
    type: "workstation",
    os: "Windows 11 Pro",
    firmware: "1.04.00",
    location: "Floor 2, Desk 12",
    status: "online",
    lastSeen: "2024-01-15T10:25:00Z"
  },
  {
    id: "dev-003",
    hostname: "printer-hp-105",
    ip: "192.168.1.87",
    mac: "00:25:B3:A1:B2:C3",
    vendor: "Hewlett Packard",
    model: "LaserJet Pro M404n",
    type: "printer",
    os: "Embedded",
    firmware: "002.2049A.00_49.95.00",
    location: "Floor 1, Print Room",
    status: "offline",
    lastSeen: "2024-01-15T09:45:00Z"
  },
  {
    id: "dev-004",
    hostname: "iphone-john",
    ip: "192.168.1.156",
    mac: "A4:83:E7:12:34:56",
    vendor: "Apple Inc.",
    model: "iPhone 14",
    type: "mobile",
    os: "iOS 17.2",
    firmware: "N/A",
    location: "WiFi - Floor 2",
    status: "online",
    lastSeen: "2024-01-15T10:20:00Z"
  }
];

export default function Inventory() {
  const [devices] = useState<Device[]>(deviceInventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVendor, setFilterVendor] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const vendors = Array.from(new Set(devices.map(d => d.vendor)));
  const deviceTypes = Array.from(new Set(devices.map(d => d.type)));

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.ip.includes(searchQuery);
    
    const matchesVendor = filterVendor === "all" || device.vendor === filterVendor;
    const matchesType = filterType === "all" || device.type === filterType;
    const matchesStatus = filterStatus === "all" || device.status === filterStatus;

    return matchesSearch && matchesVendor && matchesType && matchesStatus;
  });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'server': return <Server className="w-4 h-4 text-blue-500" />;
      case 'workstation': return <Monitor className="w-4 h-4 text-green-500" />;
      case 'printer': return <Printer className="w-4 h-4 text-purple-500" />;
      case 'mobile': return <Smartphone className="w-4 h-4 text-orange-500" />;
      default: return <Server className="w-4 h-4 text-gray-500" />;
    }
  };

  const exportInventory = () => {
    const csvContent = [
      ["Hostname", "IP", "MAC", "Vendor", "Model", "Type", "OS", "Firmware", "Location", "Status"],
      ...filteredDevices.map(device => [
        device.hostname, device.ip, device.mac, device.vendor, device.model,
        device.type, device.os, device.firmware, device.location, device.status
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `network-inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Device Inventory</h1>
        <p className="text-muted-foreground">
          Complete inventory of network devices by vendor, model, and firmware
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2 text-blue-600" />
            Filters and Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search devices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterVendor} onValueChange={setFilterVendor}>
              <SelectTrigger>
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                {vendors.map(vendor => (
                  <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {deviceTypes.map(type => (
                  <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredDevices.length} of {devices.length} devices
            </div>
            <Button onClick={exportInventory} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Device Inventory ({filteredDevices.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Hardware</TableHead>
                  <TableHead>Software</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.type)}
                        <div>
                          <p className="font-medium">{device.hostname}</p>
                          <p className="text-sm text-muted-foreground capitalize">{device.type}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-mono text-sm">{device.ip}</p>
                        <p className="font-mono text-xs text-muted-foreground">{device.mac}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{device.vendor}</p>
                        <p className="text-sm text-muted-foreground">{device.model}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{device.os}</p>
                        <p className="text-xs text-muted-foreground">FW: {device.firmware}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{device.location}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <Badge variant={device.status === 'online' ? 'default' : 'destructive'}>
                          {device.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground">
                          {new Date(device.lastSeen).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{devices.length}</p>
              <p className="text-sm text-muted-foreground">Total Devices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {devices.filter(d => d.status === 'online').length}
              </p>
              <p className="text-sm text-muted-foreground">Online</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{vendors.length}</p>
              <p className="text-sm text-muted-foreground">Vendors</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{deviceTypes.length}</p>
              <p className="text-sm text-muted-foreground">Device Types</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </AuthenticatedLayout>
  );
}