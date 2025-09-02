import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wifi, 
  Download, 
  Upload, 
  Zap, 
  Clock,
  Activity,
  RefreshCw,
  Gauge
} from "lucide-react";
import { BandwidthDetector, BandwidthResult } from "@/lib/bandwidth-detector";

export default function BandwidthDetectorComponent() {
  const [bandwidthData, setBandwidthData] = useState<BandwidthResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    // Auto-detect bandwidth on component mount
    detectBandwidth();
  }, []);

  const detectBandwidth = async () => {
    setIsDetecting(true);
    setProgress(0);

    // Simulate progress updates during detection
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      const result = await BandwidthDetector.detectBandwidth();
      setBandwidthData(result);
      setLastUpdated(new Date().toLocaleTimeString());
      setProgress(100);
    } catch (error) {
      console.error('Bandwidth detection failed:', error);
      setProgress(0);
    } finally {
      clearInterval(progressInterval);
      setIsDetecting(false);
    }
  };

  const getSignalIcon = (speed: number) => {
    if (speed >= 100) return <Wifi className="w-5 h-5 text-green-600" />;
    if (speed >= 25) return <Wifi className="w-5 h-5 text-blue-600" />;
    if (speed >= 5) return <Wifi className="w-5 h-5 text-yellow-600" />;
    return <Wifi className="w-5 h-5 text-red-600" />;
  };

  const getConnectionTypeDisplay = (type: string, effectiveType: string) => {
    if (type !== 'unknown') return type.toUpperCase();
    if (effectiveType !== 'unknown') return effectiveType.toUpperCase();
    return 'DETECTED';
  };

  return (
    <Card className="vnx-glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-blue-600" />
            Bandwidth Auto-Detection
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={detectBandwidth}
            disabled={isDetecting}
            className="vnx-action-button"
          >
            {isDetecting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isDetecting && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Detecting network speed...</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {bandwidthData && !isDetecting && (
          <div className="space-y-4">
            {/* Speed Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Download Speed</p>
                      <p className="text-2xl font-bold">
                        {BandwidthDetector.formatSpeed(bandwidthData.downloadSpeed)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Upload Speed</p>
                      <p className="text-2xl font-bold">
                        {BandwidthDetector.formatSpeed(bandwidthData.uploadSpeed)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Connection Quality */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                {getSignalIcon(bandwidthData.downloadSpeed)}
                <div>
                  <p className="font-medium">Connection Quality</p>
                  <p className={`text-sm ${BandwidthDetector.getConnectionQuality(bandwidthData.downloadSpeed).color}`}>
                    {BandwidthDetector.getConnectionQuality(bandwidthData.downloadSpeed).level}
                  </p>
                </div>
              </div>
              <Badge variant="outline">
                {getConnectionTypeDisplay(bandwidthData.connectionType, bandwidthData.effectiveType)}
              </Badge>
            </div>

            {/* Network Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Latency</p>
                  <p className="font-semibold">{bandwidthData.latency.toFixed(0)}ms</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Jitter</p>
                  <p className="font-semibold">{bandwidthData.jitter.toFixed(1)}ms</p>
                </div>
              </div>
            </div>

            {/* Test Method & Timestamp */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              <span>Method: {bandwidthData.testMethod.replace('-', ' ').toUpperCase()}</span>
              {lastUpdated && <span>Updated: {lastUpdated}</span>}
            </div>
          </div>
        )}

        {!bandwidthData && !isDetecting && (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Network Speed Detection</h3>
            <p className="text-muted-foreground mb-4">
              Click the refresh button to detect your current network bandwidth automatically.
            </p>
            <Button onClick={detectBandwidth} className="vnx-action-button">
              <Zap className="w-4 h-4 mr-2" />
              Start Detection
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}