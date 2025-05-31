import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NetworkScanner from "@/components/network-scanner";
import ScanResults from "@/components/scan-results";
import SocialShare from "@/components/social-share";
import { NetworkAPI } from "@/lib/network-api";
import { trackEvent } from "@/lib/analytics";
import { 
  Network, 
  Globe, 
  Shield, 
  Info, 
  Route,
  Search,
  Zap,
  Download,
  Share2,
  Copy,
  Trash2,
  MapPin,
  Activity
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaLinkedin } from "react-icons/fa";

interface ScanResult {
  type: string;
  data: any;
  timestamp: string;
  target: string;
}

export default function Home() {
  const [target, setTarget] = useState("");
  const [currentScan, setCurrentScan] = useState<string | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [userIP, setUserIP] = useState<string>("");

  // Detect user IP on component mount
  useEffect(() => {
    const detectUserIP = async () => {
      try {
        const ipData = await NetworkAPI.detectUserIP();
        setUserIP(ipData.ip);
      } catch (error) {
        console.error("Failed to detect user IP:", error);
      }
    };
    detectUserIP();
  }, []);

  const performScan = async (scanType: string) => {
    if (!target.trim()) {
      alert("Please enter an IP address or domain name");
      return;
    }

    if (isScanning) {
      alert("Scan already in progress...");
      return;
    }

    setIsScanning(true);
    setCurrentScan(scanType);
    
    // Track the scan event
    trackEvent('scan_started', 'network_diagnostic', scanType);

    try {
      let result;
      
      switch (scanType) {
        case 'ip-lookup':
          result = await NetworkAPI.performIPLookup(target);
          break;
        case 'geo-info':
          result = await NetworkAPI.performGeoLookup(target);
          break;
        case 'port-scan':
          result = await NetworkAPI.performPortScan(target);
          break;
        case 'whois':
          result = await NetworkAPI.performWHOIS(target);
          break;
        case 'traceroute':
          result = await NetworkAPI.performTraceroute(target);
          break;
        case 'bulk':
          result = await NetworkAPI.performBulkScan(target);
          break;
        default:
          throw new Error(`Unknown scan type: ${scanType}`);
      }

      const scanResult: ScanResult = {
        type: scanType,
        data: result,
        timestamp: new Date().toISOString(),
        target: target
      };

      setScanResults(prev => [scanResult, ...prev]);
      
      // Track successful scan
      trackEvent('scan_completed', 'network_diagnostic', scanType);
      
    } catch (error) {
      console.error(`${scanType} failed:`, error);
      alert(`Scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Track failed scan
      trackEvent('scan_failed', 'network_diagnostic', scanType);
    } finally {
      setIsScanning(false);
      setCurrentScan(null);
    }
  };

  const handleScanMyIP = async () => {
    try {
      const ipData = await NetworkAPI.detectUserIP();
      setTarget(ipData.ip);
      setUserIP(ipData.ip);
      trackEvent('detect_user_ip', 'user_action', 'auto_fill');
    } catch (error) {
      console.error("Failed to detect IP:", error);
      alert("Failed to detect your IP address");
    }
  };

  const exportResults = () => {
    if (scanResults.length === 0) {
      alert("No results to export");
      return;
    }

    const exportData = {
      generatedBy: "VNX-Netscan",
      timestamp: new Date().toISOString(),
      results: scanResults
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `vnx-netscan-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    trackEvent('export_results', 'user_action', 'json_download');
  };

  const copyResults = () => {
    if (scanResults.length === 0) {
      alert("No results to copy");
      return;
    }

    const resultsText = scanResults.map(result => 
      `=== ${result.type.toUpperCase()} RESULTS ===\n` +
      `Target: ${result.target}\n` +
      `Timestamp: ${result.timestamp}\n` +
      `Data: ${JSON.stringify(result.data, null, 2)}\n\n`
    ).join('');

    navigator.clipboard.writeText(resultsText).then(() => {
      alert('Results copied to clipboard!');
      trackEvent('copy_results', 'user_action', 'clipboard');
    }).catch(() => {
      alert('Failed to copy results');
    });
  };

  const clearResults = () => {
    setScanResults([]);
    trackEvent('clear_results', 'user_action', 'reset');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Network className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">VNX-Netscan</h1>
                <p className="text-xs text-slate-500">Visnec Nexus - Network Diagnostics</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-200">
                <Activity className="w-3 h-3 mr-1" />
                Online
              </Badge>
              {userIP && (
                <Badge variant="secondary">
                  <MapPin className="w-3 h-3 mr-1" />
                  {userIP}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Network Diagnostic <span className="text-blue-600">Toolkit</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Comprehensive network analysis tools for IP lookup, port scanning, WHOIS queries, and traceroute diagnostics. 
            Professional-grade insights for developers and network administrators.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Scanner Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Input Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2 text-blue-600" />
                  Target Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="glow-border rounded-lg">
                  <Input
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Enter IP address or domain name (e.g., 8.8.8.8 or google.com)"
                    className="text-lg py-3"
                    disabled={isScanning}
                  />
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={handleScanMyIP}
                    disabled={isScanning}
                    className="vnx-action-button px-4 py-2"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Scan My IP
                  </Button>
                  <Button 
                    onClick={() => setTarget("")}
                    disabled={isScanning}
                    className="vnx-action-button px-4 py-2"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Network Scanner Component */}
            <NetworkScanner 
              target={target}
              isScanning={isScanning}
              currentScan={currentScan}
              onScan={performScan}
            />
          </div>

          {/* Status Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-600" />
                  Scan Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">
                    {isScanning ? `Running ${currentScan}...` : "Ready to scan"}
                  </span>
                  <div className={`w-3 h-3 rounded-full ${
                    isScanning ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                  }`} />
                </div>

                {isScanning && (
                  <div className="w-full bg-slate-200 rounded-full h-2 scan-line">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }} />
                  </div>
                )}

                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium text-slate-700">Quick Actions</h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={exportResults}
                    disabled={scanResults.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={copyResults}
                    disabled={scanResults.length === 0}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Results
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={clearResults}
                    disabled={scanResults.length === 0}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Results
                  </Button>
                </div>

                <Separator />

                <div className="text-center">
                  <Badge variant="secondary" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    {scanResults.length} scan{scanResults.length !== 1 ? 's' : ''} completed
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Results Section */}
        {scanResults.length > 0 && (
          <section className="mt-8">
            <ScanResults results={scanResults} />
          </section>
        )}

        {/* Social Share Section */}
        <section className="mt-8">
          <SocialShare />
        </section>

        {/* Features Section */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Why Choose VNX-Netscan?</h3>
            <p className="text-slate-600">Professional-grade network diagnostics in your browser</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-blue-600 w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Lightning Fast</h4>
              <p className="text-slate-600 text-sm">Instant results with optimized API calls and efficient processing</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-green-600 w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Secure & Private</h4>
              <p className="text-slate-600 text-sm">No data logging, client-side processing, and encrypted connections</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-purple-600 w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Global Coverage</h4>
              <p className="text-slate-600 text-sm">Comprehensive global IP database with accurate geolocation data</p>
            </Card>
            
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="text-yellow-600 w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-slate-800 mb-2">Export Ready</h4>
              <p className="text-slate-600 text-sm">Export results in multiple formats for reporting and analysis</p>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Network className="text-white w-4 h-4" />
                </div>
                <span className="font-bold text-lg">VNX-Netscan</span>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Professional network diagnostic tools powered by Visnec Nexus. 
                Reliable, fast, and comprehensive network analysis.
              </p>
              <p className="text-slate-500 text-xs">
                Powered by <strong>Visnec Nexus</strong>
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><button onClick={() => performScan('ip-lookup')} className="hover:text-white transition-colors">IP Lookup</button></li>
                <li><button onClick={() => performScan('geo-info')} className="hover:text-white transition-colors">Geo Location</button></li>
                <li><button onClick={() => performScan('port-scan')} className="hover:text-white transition-colors">Port Scanner</button></li>
                <li><button onClick={() => performScan('whois')} className="hover:text-white transition-colors">WHOIS Query</button></li>
                <li><button onClick={() => performScan('traceroute')} className="hover:text-white transition-colors">Traceroute</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect with VNX</h4>
              <div className="flex space-x-3 mb-4">
                <a href="https://www.facebook.com/profile.php?id=61576882583780" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <FaFacebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/vnxplatform/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-700 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                  <FaInstagram className="w-4 h-4" />
                </a>
                <a href="https://www.tiktok.com/@vnxplatform" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-700 hover:bg-black rounded-lg flex items-center justify-center transition-colors">
                  <FaTiktok className="w-4 h-4" />
                </a>
                <a href="https://www.youtube.com/@VNXPlatform" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-700 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                  <FaYoutube className="w-4 h-4" />
                </a>
                <a href="https://www.linkedin.com/company/107405663/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-700 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                  <FaLinkedin className="w-4 h-4" />
                </a>
              </div>
              
              <div className="text-xs text-slate-400">
                <p>&copy; 2024 Visnec Nexus. All rights reserved.</p>
                <div className="flex space-x-4 mt-2">
                  <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
