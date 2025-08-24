import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Shield, 
  Info, 
  Route,
  MapPin,
  Layers,
  Loader2
} from "lucide-react";

interface NetworkScannerProps {
  target: string;
  isScanning: boolean;
  currentScan: string | null;
  onScan: (scanType: string) => void;
}

const scanTools = [
  {
    id: 'ip-lookup',
    name: 'IP Lookup',
    description: 'Basic IP information',
    icon: Globe,
    color: 'bg-blue-500 hover:bg-blue-600',
    iconColor: 'text-blue-600'
  },
  {
    id: 'geo-info',
    name: 'Geo Info',
    description: 'Location & ISP details',
    icon: MapPin,
    color: 'bg-emerald-500 hover:bg-emerald-600',
    iconColor: 'text-emerald-600'
  },
  {
    id: 'port-scan',
    name: 'Port Scan',
    description: 'Check open ports',
    icon: Shield,
    color: 'bg-orange-500 hover:bg-orange-600',
    iconColor: 'text-orange-600'
  },
  {
    id: 'whois',
    name: 'WHOIS',
    description: 'Domain registration info',
    icon: Info,
    color: 'bg-purple-500 hover:bg-purple-600',
    iconColor: 'text-purple-600'
  },
  {
    id: 'traceroute',
    name: 'Traceroute',
    description: 'Network path analysis',
    icon: Route,
    color: 'bg-red-500 hover:bg-red-600',
    iconColor: 'text-red-600'
  },
  {
    id: 'bulk',
    name: 'Bulk Scan',
    description: 'All tools at once',
    icon: Layers,
    color: 'bg-indigo-500 hover:bg-indigo-600',
    iconColor: 'text-indigo-600'
  }
];

export default function NetworkScanner({ target, isScanning, currentScan, onScan }: NetworkScannerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Diagnostic Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {scanTools.map((tool) => {
            const Icon = tool.icon;
            const isCurrentScan = currentScan === tool.id;
            
            return (
              <div key={tool.id} className="group">
                <Card className="h-full transition-all hover:shadow-md hover:scale-105 hover:border-slate-300">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        isCurrentScan ? 'bg-blue-100' : 'bg-slate-50'
                      } group-hover:bg-slate-100 transition-colors`}>
                        {isCurrentScan ? (
                          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        ) : (
                          <Icon className={`w-5 h-5 ${tool.iconColor}`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-800">{tool.name}</h3>
                        <p className="text-xs text-slate-500">{tool.description}</p>
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full ${tool.color} text-white scan-button`}
                      onClick={() => onScan(tool.id)}
                      disabled={isScanning || !target.trim()}
                    >
                      {isCurrentScan ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Scanning...
                        </>
                      ) : (
                        <>
                          <Icon className="w-4 h-4 mr-2" />
                          Start {tool.name}
                        </>
                      )}
                    </Button>
                    
                    {!target.trim() && (
                      <Badge variant="outline" className="w-full mt-2 text-xs justify-center">
                        Enter target first
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
