import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Clock, Target, Database } from "lucide-react";

interface ScanResult {
  type: string;
  data: any;
  timestamp: string;
  target: string;
}

interface ScanResultsProps {
  results: ScanResult[];
}

export default function ScanResults({ results }: ScanResultsProps) {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const renderResultData = (result: ScanResult) => {
    const { type, data } = result;
    
    switch (type) {
      case 'ip-lookup':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><span className="text-slate-500">IP Address:</span> <span className="font-mono text-slate-800">{data.ip}</span></div>
              <div><span className="text-slate-500">Version:</span> <span className="font-mono text-slate-800">IPv{data.version}</span></div>
              <div><span className="text-slate-500">City:</span> <span className="font-mono text-slate-800">{data.city || 'Unknown'}</span></div>
              <div><span className="text-slate-500">Region:</span> <span className="font-mono text-slate-800">{data.region || 'Unknown'}</span></div>
              <div><span className="text-slate-500">Country:</span> <span className="font-mono text-slate-800">{data.country_name || 'Unknown'}</span></div>
              <div><span className="text-slate-500">Timezone:</span> <span className="font-mono text-slate-800">{data.timezone || 'Unknown'}</span></div>
              <div className="md:col-span-2"><span className="text-slate-500">Organization:</span> <span className="font-mono text-slate-800">{data.org || 'Unknown'}</span></div>
              <div><span className="text-slate-500">ASN:</span> <span className="font-mono text-slate-800">{data.asn || 'Unknown'}</span></div>
              <div><span className="text-slate-500">Postal Code:</span> <span className="font-mono text-slate-800">{data.postal || 'Unknown'}</span></div>
            </div>
          </div>
        );

      case 'geo-info':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-emerald-600" />
                Geographic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Country:</span> <span className="font-mono text-slate-800">{data.country_name} ({data.country})</span></div>
                <div><span className="text-slate-500">Region:</span> <span className="font-mono text-slate-800">{data.region}</span></div>
                <div><span className="text-slate-500">City:</span> <span className="font-mono text-slate-800">{data.city}</span></div>
                <div><span className="text-slate-500">Timezone:</span> <span className="font-mono text-slate-800">{data.timezone}</span></div>
                <div><span className="text-slate-500">Latitude:</span> <span className="font-mono text-slate-800">{data.latitude}</span></div>
                <div><span className="text-slate-500">Longitude:</span> <span className="font-mono text-slate-800">{data.longitude}</span></div>
                <div><span className="text-slate-500">UTC Offset:</span> <span className="font-mono text-slate-800">{data.utc_offset}</span></div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                <Database className="w-4 h-4 mr-2 text-blue-600" />
                Network Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="md:col-span-2"><span className="text-slate-500">Organization:</span> <span className="font-mono text-slate-800">{data.org}</span></div>
                <div><span className="text-slate-500">ISP:</span> <span className="font-mono text-slate-800">{data.org}</span></div>
                <div><span className="text-slate-500">ASN:</span> <span className="font-mono text-slate-800">{data.asn}</span></div>
              </div>
            </div>
          </div>
        );

      case 'port-scan':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xl font-bold text-blue-600">{data.totalPorts}</div>
                <div className="text-xs text-slate-500">Total Scanned</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xl font-bold text-green-600">{data.openPorts?.length || 0}</div>
                <div className="text-xs text-slate-500">Open Ports</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xl font-bold text-red-600">{data.closedPorts?.length || 0}</div>
                <div className="text-xs text-slate-500">Closed Ports</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-xl font-bold text-purple-600">{data.scanTime}</div>
                <div className="text-xs text-slate-500">Scan Time</div>
              </div>
            </div>
            
            {data.openPorts && data.openPorts.length > 0 && (
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">Open Ports ({data.openPorts.length})</h4>
                <div className="space-y-2">
                  {data.openPorts.map((port: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-mono text-slate-800">{port.port}</span>
                        <span className="text-green-600">{port.service}</span>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">OPEN</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'whois':
        return (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><span className="text-slate-500">Domain:</span> <span className="font-mono text-slate-800">{data.domain}</span></div>
              <div><span className="text-slate-500">Registrar:</span> <span className="font-mono text-slate-800">{data.registrar}</span></div>
              <div><span className="text-slate-500">Registration Date:</span> <span className="font-mono text-slate-800">{data.registrationDate ? new Date(data.registrationDate).toLocaleDateString() : 'Unknown'}</span></div>
              <div><span className="text-slate-500">Expiration Date:</span> <span className="font-mono text-slate-800">{data.expirationDate ? new Date(data.expirationDate).toLocaleDateString() : 'Unknown'}</span></div>
              <div><span className="text-slate-500">Organization:</span> <span className="font-mono text-slate-800">{data.organization}</span></div>
              <div><span className="text-slate-500">Country:</span> <span className="font-mono text-slate-800">{data.country}</span></div>
            </div>
            
            {data.nameServers && (
              <div>
                <div className="text-slate-500 mb-2">Name Servers:</div>
                <div className="bg-slate-50 rounded p-3">
                  {data.nameServers.map((ns: string, index: number) => (
                    <div key={index} className="text-blue-600 font-mono">{ns}</div>
                  ))}
                </div>
              </div>
            )}
            
            {data.status && (
              <div>
                <div className="text-slate-500 mb-2">Status:</div>
                <div className="bg-slate-50 rounded p-3">
                  {data.status.map((status: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-green-600 border-green-200 mr-2">{status}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'traceroute':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-xl font-bold text-blue-600">{data.totalHops}</div>
                <div className="text-xs text-slate-500">Total Hops</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-lg font-bold text-green-600 font-mono">{data.target}</div>
                <div className="text-xs text-slate-500">Destination</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-slate-800 mb-4">Route Hops</h4>
              <div className="space-y-3">
                {data.hops?.map((hop: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-sm">
                      {hop.hop}
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-slate-800">{hop.hostname}</div>
                      <div className="text-sm text-slate-500">{hop.ip}</div>
                    </div>
                    <div className="text-right">
                      {hop.rtt?.map((time: string, i: number) => (
                        <div key={i} className="text-sm font-mono text-blue-600">{time}ms</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'bulk':
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-2">Comprehensive Network Analysis</h4>
              <p className="text-slate-600">Complete diagnostic results for <span className="font-mono text-blue-600">{data.target}</span></p>
            </div>
            
            {data.results && Object.entries(data.results).map(([scanType, scanData]: [string, any]) => (
              <div key={scanType}>
                <h5 className="font-medium text-slate-700 mb-3 capitalize">{scanType.replace(/([A-Z])/g, ' $1').trim()}</h5>
                {renderResultData({ type: scanType.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''), data: scanData, timestamp: '', target: '' })}
                <Separator className="mt-4" />
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="bg-slate-50 rounded-lg p-4">
            <pre className="text-sm font-mono text-slate-600 whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Terminal className="w-5 h-5 mr-2 text-blue-600" />
          Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="0" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.slice(0, 4).map((result, index) => (
              <TabsTrigger 
                key={index} 
                value={index.toString()}
                className="text-xs"
              >
                {result.type.replace('-', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {results.map((result, index) => (
            <TabsContent key={index} value={index.toString()} className="mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="capitalize">
                      {result.type.replace('-', ' ')}
                    </Badge>
                    <span className="font-mono text-sm text-slate-600">{result.target}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatTimestamp(result.timestamp)}
                  </div>
                </div>
                
                <Separator />
                
                <div className="min-h-[200px]">
                  {renderResultData(result)}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
