import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { PremiumFeature } from "@/components/premium-feature";
import { 
  Map, 
  Zap,
  Server,
  Monitor,
  Printer,
  Smartphone,
  Network,
  Activity,
  Settings,
  Shield,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface NetworkNode {
  id: string;
  name: string;
  type: 'switch' | 'router' | 'server' | 'workstation' | 'printer' | 'mobile' | 'firewall';
  ip: string;
  status: 'online' | 'offline' | 'warning';
  x: number;
  y: number;
  connections: string[];
  details: {
    model?: string;
    ports?: number;
    uptime?: string;
    load?: number;
  };
}

interface NetworkConnection {
  id: string;
  from: string;
  to: string;
  type: 'ethernet' | 'fiber' | 'wireless';
  speed: string;
  status: 'active' | 'inactive';
}

interface NetworkPacket {
  id: string;
  from: string;
  to: string;
  connectionId: string;
  progress: number;
  type: 'data' | 'control' | 'broadcast';
  size: string;
  protocol: string;
}

// Network topology data - would come from network discovery protocols
const networkNodes: NetworkNode[] = [
  {
    id: "firewall-01",
    name: "Edge Firewall",
    type: "firewall",
    ip: "192.168.1.1",
    status: "online",
    x: 400,
    y: 50,
    connections: ["switch-core-01"],
    details: { model: "SonicWall TZ570", uptime: "45 days", load: 23 }
  },
  {
    id: "switch-core-01",
    name: "Core Switch",
    type: "switch",
    ip: "192.168.1.2",
    status: "online",
    x: 400,
    y: 150,
    connections: ["switch-floor1-01", "switch-floor2-01", "server-01"],
    details: { model: "Cisco Catalyst 3750", ports: 48, uptime: "67 days", load: 45 }
  },
  {
    id: "switch-floor1-01",
    name: "Floor 1 Switch",
    type: "switch",
    ip: "192.168.1.10",
    status: "online",
    x: 200,
    y: 250,
    connections: ["workstation-01", "printer-01"],
    details: { model: "Cisco Catalyst 2960", ports: 24, uptime: "32 days", load: 67 }
  },
  {
    id: "switch-floor2-01",
    name: "Floor 2 Switch",
    type: "switch",
    ip: "192.168.1.20",
    status: "online",
    x: 600,
    y: 250,
    connections: ["workstation-02", "mobile-01"],
    details: { model: "Cisco Catalyst 2960", ports: 24, uptime: "28 days", load: 34 }
  },
  {
    id: "server-01",
    name: "File Server",
    type: "server",
    ip: "192.168.1.100",
    status: "online",
    x: 400,
    y: 300,
    connections: [],
    details: { model: "Dell PowerEdge R720", uptime: "89 days", load: 78 }
  },
  {
    id: "workstation-01",
    name: "Dev Workstation",
    type: "workstation",
    ip: "192.168.1.45",
    status: "online",
    x: 100,
    y: 350,
    connections: [],
    details: { model: "HP EliteDesk 800", uptime: "2 days", load: 42 }
  },
  {
    id: "workstation-02",
    name: "Design Workstation",
    type: "workstation",
    ip: "192.168.1.67",
    status: "online",
    x: 700,
    y: 350,
    connections: [],
    details: { model: "iMac Pro", uptime: "5 days", load: 65 }
  },
  {
    id: "printer-01",
    name: "HP LaserJet",
    type: "printer",
    ip: "192.168.1.87",
    status: "offline",
    x: 300,
    y: 350,
    connections: [],
    details: { model: "HP LaserJet Pro M404n", uptime: "0 days" }
  },
  {
    id: "mobile-01",
    name: "iPhone-John",
    type: "mobile",
    ip: "192.168.1.156",
    status: "online",
    x: 500,
    y: 350,
    connections: [],
    details: { model: "iPhone 14", uptime: "12 hours" }
  }
];

const networkConnections: NetworkConnection[] = [
  { id: "conn-1", from: "firewall-01", to: "switch-core-01", type: "fiber", speed: "10Gbps", status: "active" },
  { id: "conn-2", from: "switch-core-01", to: "switch-floor1-01", type: "fiber", speed: "1Gbps", status: "active" },
  { id: "conn-3", from: "switch-core-01", to: "switch-floor2-01", type: "fiber", speed: "1Gbps", status: "active" },
  { id: "conn-4", from: "switch-core-01", to: "server-01", type: "ethernet", speed: "1Gbps", status: "active" },
  { id: "conn-5", from: "switch-floor1-01", to: "workstation-01", type: "ethernet", speed: "1Gbps", status: "active" },
  { id: "conn-6", from: "switch-floor1-01", to: "printer-01", type: "ethernet", speed: "100Mbps", status: "inactive" },
  { id: "conn-7", from: "switch-floor2-01", to: "workstation-02", type: "ethernet", speed: "1Gbps", status: "active" },
  { id: "conn-8", from: "switch-floor2-01", to: "mobile-01", type: "wireless", speed: "150Mbps", status: "active" }
];

export default function NetworkMap() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [packets, setPackets] = useState<NetworkPacket[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<number>();

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'firewall': return <Shield className="w-4 h-4" />;
      case 'switch': return <Network className="w-4 h-4" />;
      case 'router': return <Zap className="w-4 h-4" />;
      case 'server': return <Server className="w-4 h-4" />;
      case 'workstation': return <Monitor className="w-4 h-4" />;
      case 'printer': return <Printer className="w-4 h-4" />;
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      default: return <Network className="w-4 h-4" />;
    }
  };

  const getNodeColor = (status: string) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'offline': return '#EF4444';
      case 'warning': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getConnectionColor = (type: string) => {
    switch (type) {
      case 'fiber': return '#3B82F6';
      case 'ethernet': return '#10B981';
      case 'wireless': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  // Packet simulation functions
  const generatePacket = (): NetworkPacket => {
    const activeConnections = networkConnections.filter(c => c.status === 'active');
    const randomConnection = activeConnections[Math.floor(Math.random() * activeConnections.length)];
    
    const packetTypes = ['data', 'control', 'broadcast'] as const;
    const protocols = ['HTTP', 'TCP', 'UDP', 'ICMP', 'DNS', 'SSH'];
    const sizes = ['64B', '128B', '512B', '1KB', '1.5KB'];
    
    return {
      id: `packet-${Date.now()}-${Math.random()}`,
      from: randomConnection.from,
      to: randomConnection.to,
      connectionId: randomConnection.id,
      progress: 0,
      type: packetTypes[Math.floor(Math.random() * packetTypes.length)],
      size: sizes[Math.floor(Math.random() * sizes.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)]
    };
  };

  const updatePackets = () => {
    setPackets(prevPackets => {
      return prevPackets
        .map(packet => ({
          ...packet,
          progress: Math.min(packet.progress + (simulationSpeed * 2), 100)
        }))
        .filter(packet => packet.progress < 100);
    });
  };

  const startSimulation = () => {
    setIsSimulating(true);
    
    const animate = () => {
      updatePackets();
      
      // Add new packets randomly
      if (Math.random() < 0.3) {
        setPackets(prev => [...prev, generatePacket()]);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setPackets([]);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const drawConnection = (connection: NetworkConnection) => {
    const fromNode = networkNodes.find(n => n.id === connection.from);
    const toNode = networkNodes.find(n => n.id === connection.to);
    
    if (!fromNode || !toNode) return null;

    const color = getConnectionColor(connection.type);
    const opacity = connection.status === 'active' ? 1 : 0.3;

    return (
      <g key={connection.id}>
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke={color}
          strokeWidth={connection.type === 'fiber' ? 3 : 2}
          strokeOpacity={opacity}
          strokeDasharray={connection.type === 'wireless' ? '5,5' : 'none'}
        />
        {/* Connection label */}
        <text
          x={(fromNode.x + toNode.x) / 2}
          y={(fromNode.y + toNode.y) / 2 - 5}
          textAnchor="middle"
          fontSize="10"
          fill="#6B7280"
          className="pointer-events-none"
        >
          {connection.speed}
        </text>
      </g>
    );
  };

  const drawPacket = (packet: NetworkPacket) => {
    const connection = networkConnections.find(c => c.id === packet.connectionId);
    if (!connection) return null;

    const fromNode = networkNodes.find(n => n.id === packet.from);
    const toNode = networkNodes.find(n => n.id === packet.to);
    
    if (!fromNode || !toNode) return null;

    // Calculate packet position along the connection
    const progress = packet.progress / 100;
    const x = fromNode.x + (toNode.x - fromNode.x) * progress;
    const y = fromNode.y + (toNode.y - fromNode.y) * progress;

    const packetColor = {
      data: '#3B82F6',
      control: '#EF4444', 
      broadcast: '#8B5CF6'
    }[packet.type];

    return (
      <g key={packet.id}>
        <circle
          cx={x}
          cy={y}
          r="4"
          fill={packetColor}
          className="animate-pulse"
        />
        <text
          x={x}
          y={y - 8}
          textAnchor="middle"
          fontSize="8"
          fill={packetColor}
          className="pointer-events-none font-mono"
        >
          {packet.protocol}
        </text>
      </g>
    );
  };

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network Topology Map</h1>
          <p className="text-muted-foreground">
          Interactive visualization of your network infrastructure
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Network Map */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Map className="w-5 h-5 mr-2 text-blue-600" />
                Network Topology
              </CardTitle>
              <div className="flex items-center space-x-4">
                {/* Packet Simulation Controls */}
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant={isSimulating ? "destructive" : "default"}
                    onClick={isSimulating ? stopSimulation : startSimulation}
                  >
                    {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetSimulation}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {packets.length} packets
                  </span>
                </div>
                
                {/* Status Legend */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Offline</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Warning</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-96 border rounded-lg bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 800 400"
                className="absolute inset-0"
              >
                {/* Draw connections first (behind nodes) */}
                {networkConnections.map(drawConnection)}
                
                {/* Draw animated packets */}
                {packets.map(drawPacket)}
                
                {/* Draw nodes */}
                {networkNodes.map((node) => (
                  <g key={node.id}>
                    {/* Node circle */}
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={hoveredNode === node.id ? 25 : 20}
                      fill={getNodeColor(node.status)}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(node)}
                    />
                    
                    {/* Node label */}
                    <text
                      x={node.x}
                      y={node.y + 35}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="500"
                      fill="currentColor"
                      className="pointer-events-none"
                    >
                      {node.name}
                    </text>
                    
                    {/* Node IP */}
                    <text
                      x={node.x}
                      y={node.y + 50}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6B7280"
                      className="pointer-events-none font-mono"
                    >
                      {node.ip}
                    </text>

                    {/* Activity indicator */}
                    {node.status === 'online' && (
                      <circle
                        cx={node.x + 15}
                        cy={node.y - 15}
                        r="3"
                        fill="#10B981"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Node Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-600" />
              {selectedNode ? "Device Details" : "Network Overview"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNode ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {getNodeIcon(selectedNode.type)}
                  <div>
                    <h3 className="font-semibold">{selectedNode.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedNode.type}
                    </p>
                  </div>
                  <Badge 
                    variant={selectedNode.status === 'online' ? 'default' : 'destructive'}
                  >
                    {selectedNode.status}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                    <p className="font-mono">{selectedNode.ip}</p>
                  </div>

                  {selectedNode.details.model && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Model</label>
                      <p>{selectedNode.details.model}</p>
                    </div>
                  )}

                  {selectedNode.details.ports && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Ports</label>
                      <p>{selectedNode.details.ports} ports</p>
                    </div>
                  )}

                  {selectedNode.details.uptime && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Uptime</label>
                      <p>{selectedNode.details.uptime}</p>
                    </div>
                  )}

                  {selectedNode.details.load && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Load</label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${selectedNode.details.load}%` }}
                          />
                        </div>
                        <span className="text-sm">{selectedNode.details.load}%</span>
                      </div>
                    </div>
                  )}
                </div>

                {selectedNode.connections.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        Connected Devices ({selectedNode.connections.length})
                      </label>
                      <div className="space-y-1">
                        {selectedNode.connections.map(connectionId => {
                          const connectedNode = networkNodes.find(n => n.id === connectionId);
                          return connectedNode ? (
                            <div key={connectionId} className="flex items-center space-x-2 text-sm">
                              {getNodeIcon(connectedNode.type)}
                              <span>{connectedNode.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </>
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setSelectedNode(null)}
                >
                  Close Details
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click on any device to view detailed information
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Network Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Devices</p>
                      <p className="font-semibold">{networkNodes.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Online</p>
                      <p className="font-semibold text-green-600">
                        {networkNodes.filter(n => n.status === 'online').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Connections</p>
                      <p className="font-semibold">{networkConnections.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Links</p>
                      <p className="font-semibold text-blue-600">
                        {networkConnections.filter(c => c.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Connection Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-1 bg-blue-500 rounded"></div>
                <div>
                  <p className="font-medium">Fiber Optic</p>
                  <p className="text-sm text-muted-foreground">High-speed backbone connections</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-1 bg-green-500 rounded"></div>
                <div>
                  <p className="font-medium">Ethernet</p>
                  <p className="text-sm text-muted-foreground">Standard wired connections</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-1 bg-purple-500 rounded dashed"></div>
                <div>
                  <p className="font-medium">Wireless</p>
                  <p className="text-sm text-muted-foreground">WiFi and mobile connections</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Packet Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium">Data Packets</p>
                  <p className="text-sm text-muted-foreground">User data and file transfers</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium">Control Packets</p>
                  <p className="text-sm text-muted-foreground">Network management and routing</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium">Broadcast Packets</p>
                  <p className="text-sm text-muted-foreground">Network discovery and announcements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}