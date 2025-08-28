import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Square,
  Download,
  Filter,
  Search,
  Clock,
  Network,
  AlertTriangle,
  Activity,
  FileText,
  Wifi,
  Globe
} from "lucide-react";

interface PacketCapture {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  length: number;
  info: string;
  data: string;
  flags: string[];
}

interface CaptureStats {
  totalPackets: number;
  protocols: { [key: string]: number };
  dataVolume: string;
  duration: string;
  packetsPerSecond: number;
}

export default function PacketCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [packets, setPackets] = useState<PacketCapture[]>([]);
  const [filteredPackets, setFilteredPackets] = useState<PacketCapture[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<PacketCapture | null>(null);
  const [filter, setFilter] = useState("");
  const [protocolFilter, setProtocolFilter] = useState("all");
  const [stats, setStats] = useState<CaptureStats>({
    totalPackets: 0,
    protocols: {},
    dataVolume: "0 B",
    duration: "00:00:00",
    packetsPerSecond: 0
  });

  // Simulate packet capture
  const generatePacket = (): PacketCapture => {
    const protocols = ['HTTP', 'HTTPS', 'TCP', 'UDP', 'DNS', 'ICMP', 'SSH', 'FTP', 'SMTP'];
    const sources = ['192.168.1.45', '192.168.1.67', '192.168.1.100', '10.0.0.1', '8.8.8.8', '1.1.1.1'];
    const destinations = ['192.168.1.1', '192.168.1.45', '74.125.224.72', '151.101.193.140', '172.217.164.100'];
    
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    const length = Math.floor(Math.random() * 1500) + 64;
    
    const infos = {
      HTTP: `GET /api/data HTTP/1.1`,
      HTTPS: `Client Hello, TLS 1.3`,
      TCP: `[SYN] Seq=0 Win=65535`,
      UDP: `Src Port: ${Math.floor(Math.random() * 65535)}, Dst Port: 53`,
      DNS: `Standard query 0x${Math.floor(Math.random() * 0xffff).toString(16)} A example.com`,
      ICMP: `Echo (ping) request`,
      SSH: `Protocol: SSH-2.0-OpenSSH_8.9`,
      FTP: `Response: 220 Welcome to FTP`,
      SMTP: `Response: 250 OK`
    };

    const flags = [];
    if (Math.random() > 0.7) flags.push('SYN');
    if (Math.random() > 0.8) flags.push('ACK');
    if (Math.random() > 0.9) flags.push('FIN');

    return {
      id: `packet-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      source,
      destination,
      protocol,
      length,
      info: infos[protocol as keyof typeof infos] || `${protocol} packet`,
      data: `${Array.from({length: Math.floor(length/16)}, () => Math.floor(Math.random() * 255).toString(16).padStart(2, '0')).join(' ')}`,
      flags
    };
  };

  const startCapture = () => {
    setIsCapturing(true);
    setPackets([]);
    
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        const newPacket = generatePacket();
        setPackets(prev => [...prev, newPacket].slice(-1000)); // Keep last 1000 packets
      }
    }, 100 + Math.random() * 500);

    // Store interval ID for cleanup
    (window as any).captureInterval = interval;
  };

  const stopCapture = () => {
    setIsCapturing(false);
    if ((window as any).captureInterval) {
      clearInterval((window as any).captureInterval);
    }
  };

  const clearCapture = () => {
    stopCapture();
    setPackets([]);
    setSelectedPacket(null);
  };

  const exportCapture = () => {
    const csvContent = [
      'Timestamp,Source,Destination,Protocol,Length,Info',
      ...packets.map(p => `${p.timestamp},${p.source},${p.destination},${p.protocol},${p.length},"${p.info}"`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packet-capture-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Update filtered packets and stats
  useEffect(() => {
    let filtered = packets;
    
    if (filter) {
      filtered = packets.filter(p => 
        p.source.includes(filter) || 
        p.destination.includes(filter) || 
        p.protocol.toLowerCase().includes(filter.toLowerCase()) ||
        p.info.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    if (protocolFilter !== 'all') {
      filtered = filtered.filter(p => p.protocol === protocolFilter);
    }
    
    setFilteredPackets(filtered);

    // Update stats
    const protocols: { [key: string]: number } = {};
    let totalBytes = 0;
    
    packets.forEach(p => {
      protocols[p.protocol] = (protocols[p.protocol] || 0) + 1;
      totalBytes += p.length;
    });

    const dataVolume = totalBytes > 1024 * 1024 
      ? `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`
      : totalBytes > 1024 
        ? `${(totalBytes / 1024).toFixed(2)} KB`
        : `${totalBytes} B`;

    setStats({
      totalPackets: packets.length,
      protocols,
      dataVolume,
      duration: "00:00:00", // Would calculate from first packet timestamp
      packetsPerSecond: Math.floor(packets.length / 10) // Simplified calculation
    });
  }, [packets, filter, protocolFilter]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getProtocolColor = (protocol: string) => {
    const colors: { [key: string]: string } = {
      HTTP: 'bg-blue-500',
      HTTPS: 'bg-green-500',
      TCP: 'bg-gray-500',
      UDP: 'bg-yellow-500',
      DNS: 'bg-purple-500',
      ICMP: 'bg-red-500',
      SSH: 'bg-indigo-500',
      FTP: 'bg-orange-500',
      SMTP: 'bg-pink-500'
    };
    return colors[protocol] || 'bg-gray-400';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Packet Capture</h1>
        <p className="text-muted-foreground">
          Real-time network packet analysis and monitoring
        </p>
      </div>

      {/* Capture Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Capture Controls
            </span>
            <div className="flex items-center space-x-2">
              {isCapturing && (
                <Badge variant="destructive" className="animate-pulse">
                  Recording
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                {packets.length} packets captured
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={isCapturing ? stopCapture : startCapture}
              variant={isCapturing ? "destructive" : "default"}
            >
              {isCapturing ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isCapturing ? "Stop Capture" : "Start Capture"}
            </Button>
            
            <Button variant="outline" onClick={clearCapture}>
              <Square className="w-4 h-4 mr-2" />
              Clear
            </Button>
            
            <Button variant="outline" onClick={exportCapture} disabled={packets.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            <div className="flex items-center space-x-2 ml-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Filter packets..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-48"
              />
              
              <Select value={protocolFilter} onValueChange={setProtocolFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Protocols</SelectItem>
                  <SelectItem value="HTTP">HTTP</SelectItem>
                  <SelectItem value="HTTPS">HTTPS</SelectItem>
                  <SelectItem value="TCP">TCP</SelectItem>
                  <SelectItem value="UDP">UDP</SelectItem>
                  <SelectItem value="DNS">DNS</SelectItem>
                  <SelectItem value="ICMP">ICMP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Network className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Packets</p>
                <p className="text-2xl font-bold">{stats.totalPackets}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Data Volume</p>
                <p className="text-2xl font-bold">{stats.dataVolume}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-2xl font-bold">{stats.duration}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Packets/sec</p>
                <p className="text-2xl font-bold">{stats.packetsPerSecond}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Packet List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Captured Packets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Length</TableHead>
                    <TableHead>Info</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPackets.slice(-20).reverse().map((packet) => (
                    <TableRow
                      key={packet.id}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        selectedPacket?.id === packet.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedPacket(packet)}
                    >
                      <TableCell className="font-mono text-xs">
                        {formatTimestamp(packet.timestamp)}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {packet.source}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {packet.destination}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getProtocolColor(packet.protocol)} text-white text-xs`}>
                          {packet.protocol}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{packet.length}B</TableCell>
                      <TableCell className="text-xs max-w-48 truncate">
                        {packet.info}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredPackets.length === 0 && (
                <div className="text-center py-8">
                  <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No packets captured</h3>
                  <p className="text-muted-foreground">
                    {isCapturing ? "Waiting for network traffic..." : "Start capture to begin monitoring packets"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Packet Details & Protocol Stats */}
        <div className="space-y-6">
          {/* Protocol Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Protocol Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.protocols).slice(0, 6).map(([protocol, count]) => (
                  <div key={protocol} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded ${getProtocolColor(protocol)}`}></div>
                      <span className="text-sm font-medium">{protocol}</span>
                    </div>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Packet Details */}
          {selectedPacket && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Packet Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-3">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Timestamp:</span>
                        <p className="font-mono">{formatTimestamp(selectedPacket.timestamp)}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Source:</span>
                        <p className="font-mono">{selectedPacket.source}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Destination:</span>
                        <p className="font-mono">{selectedPacket.destination}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Protocol:</span>
                        <Badge className={`${getProtocolColor(selectedPacket.protocol)} text-white ml-2`}>
                          {selectedPacket.protocol}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Length:</span>
                        <p>{selectedPacket.length} bytes</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Info:</span>
                        <p className="text-xs">{selectedPacket.info}</p>
                      </div>
                      {selectedPacket.flags.length > 0 && (
                        <div>
                          <span className="text-muted-foreground">Flags:</span>
                          <div className="flex space-x-1 mt-1">
                            {selectedPacket.flags.map(flag => (
                              <Badge key={flag} variant="outline" className="text-xs">
                                {flag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="data">
                    <div className="space-y-2">
                      <span className="text-muted-foreground text-sm">Raw Data (Hex):</span>
                      <div className="bg-muted p-3 rounded font-mono text-xs leading-relaxed max-h-32 overflow-auto">
                        {selectedPacket.data.match(/.{1,32}/g)?.map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}