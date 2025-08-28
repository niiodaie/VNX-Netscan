import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Network, 
  Power, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from "lucide-react";
import AuthenticatedLayout from "@/components/authenticated-layout";

interface Port {
  id: string;
  switch: string;
  port: string;
  status: 'up' | 'down' | 'disabled';
  vlan: number;
  poe: boolean;
  device: string | null;
  speed: string;
  duplex: string;
  lastChange: string;
}

// Network port data - in production this would come from SNMP or network management APIs
const mockPorts: Port[] = [
  {
    id: "sw1-gi0-1",
    switch: "Switch-Core-01",
    port: "Gi0/1",
    status: "up",
    vlan: 100,
    poe: true,
    device: "workstation-dev-01",
    speed: "1000",
    duplex: "full",
    lastChange: "2024-01-15T08:30:00Z"
  },
  {
    id: "sw1-gi0-2",
    switch: "Switch-Core-01", 
    port: "Gi0/2",
    status: "up",
    vlan: 20,
    poe: false,
    device: "printer-hp-laser",
    speed: "100",
    duplex: "full",
    lastChange: "2024-01-14T14:20:00Z"
  },
  {
    id: "sw1-gi0-3",
    switch: "Switch-Core-01",
    port: "Gi0/3",
    status: "down",
    vlan: 100,
    poe: true,
    device: null,
    speed: "auto",
    duplex: "auto",
    lastChange: "2024-01-13T16:45:00Z"
  },
  {
    id: "sw2-fa0-24",
    switch: "Switch-Floor2-01",
    port: "Fa0/24",
    status: "disabled",
    vlan: 999,
    poe: false,
    device: null,
    speed: "100",
    duplex: "full",
    lastChange: "2024-01-12T09:15:00Z"
  }
];

const portChangeLog = [
  { timestamp: "2024-01-15T10:30:00Z", port: "Gi0/1", action: "VLAN changed from 1 to 100", user: "admin" },
  { timestamp: "2024-01-15T09:15:00Z", port: "Fa0/24", action: "Port disabled", user: "netops" },
  { timestamp: "2024-01-14T16:20:00Z", port: "Gi0/2", action: "PoE enabled", user: "admin" },
  { timestamp: "2024-01-14T14:45:00Z", port: "Gi0/3", action: "Port administratively shutdown", user: "security" }
];

export default function Ports() {
  const [ports, setPorts] = useState<Port[]>(mockPorts);
  const [selectedSwitch, setSelectedSwitch] = useState<string>("all");
  
  const switches = Array.from(new Set(ports.map(p => p.switch)));

  const updatePortStatus = (portId: string, newStatus: 'up' | 'down' | 'disabled') => {
    setPorts(prev => prev.map(port => 
      port.id === portId 
        ? { ...port, status: newStatus, lastChange: new Date().toISOString() }
        : port
    ));
  };

  const updatePortVlan = (portId: string, newVlan: number) => {
    setPorts(prev => prev.map(port => 
      port.id === portId 
        ? { ...port, vlan: newVlan, lastChange: new Date().toISOString() }
        : port
    ));
  };

  const updatePortPoe = (portId: string, poeEnabled: boolean) => {
    setPorts(prev => prev.map(port => 
      port.id === portId 
        ? { ...port, poe: poeEnabled, lastChange: new Date().toISOString() }
        : port
    ));
  };

  const filteredPorts = selectedSwitch === "all" 
    ? ports 
    : ports.filter(port => port.switch === selectedSwitch);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'up': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'down': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'disabled': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      up: 'default',
      down: 'destructive', 
      disabled: 'secondary'
    } as const;
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Port Management</h1>
        <p className="text-muted-foreground">
          Manage network switch ports, VLANs, and PoE settings
        </p>
      </div>

      <Tabs defaultValue="ports" className="w-full">
        <TabsList>
          <TabsTrigger value="ports">Port Configuration</TabsTrigger>
          <TabsTrigger value="logs">Change Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="ports" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Network className="w-5 h-5 mr-2 text-blue-600" />
                  Network Ports
                </CardTitle>
                <Select value={selectedSwitch} onValueChange={setSelectedSwitch}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Switches</SelectItem>
                    {switches.map(switchName => (
                      <SelectItem key={switchName} value={switchName}>
                        {switchName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPorts.map((port) => (
                  <Card key={port.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(port.status)}
                        <div>
                          <h3 className="font-semibold">{port.switch} - {port.port}</h3>
                          <p className="text-sm text-muted-foreground">
                            {port.device || "No device connected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(port.status)}
                        {port.poe && <Badge variant="outline"><Zap className="w-3 h-3 mr-1" />PoE</Badge>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">VLAN</label>
                        <Select 
                          value={port.vlan.toString()} 
                          onValueChange={(value) => updatePortVlan(port.id, parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">VLAN 1 (Default)</SelectItem>
                            <SelectItem value="20">VLAN 20 (Printers)</SelectItem>
                            <SelectItem value="100">VLAN 100 (Workstations)</SelectItem>
                            <SelectItem value="200">VLAN 200 (Servers)</SelectItem>
                            <SelectItem value="999">VLAN 999 (Isolated)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Speed/Duplex</label>
                        <p className="text-sm font-mono">{port.speed}Mbps {port.duplex}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-muted-foreground">PoE</label>
                        <Switch 
                          checked={port.poe}
                          onCheckedChange={(checked) => updatePortPoe(port.id, checked)}
                        />
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(port.lastChange).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      {port.status !== 'disabled' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Power className="w-4 h-4 mr-2" />
                              Disable Port
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Disable Port {port.port}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will administratively shut down the port and disconnect any connected device.
                                This action can be reversed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => updatePortStatus(port.id, 'disabled')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Disable Port
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      {port.status === 'disabled' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updatePortStatus(port.id, 'up')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Enable Port
                        </Button>
                      )}

                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Advanced
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Port Change History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portChangeLog.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-medium">{log.port}: {log.action}</p>
                        <p className="text-sm text-muted-foreground">by {log.user}</p>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AuthenticatedLayout>
  );
}