export interface BandwidthResult {
  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  latency: number; // ms
  jitter: number; // ms
  connectionType: string;
  effectiveType: string;
  timestamp: string;
  testMethod: 'network-api' | 'speed-test' | 'mixed';
}

export interface NetworkConnection extends EventTarget {
  type?: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

declare global {
  interface Navigator {
    connection?: NetworkConnection;
    mozConnection?: NetworkConnection;
    webkitConnection?: NetworkConnection;
  }
}

export class BandwidthDetector {
  private static readonly TEST_FILE_SIZE = 1024 * 1024; // 1MB for speed test
  private static readonly TEST_DURATION = 10000; // 10 seconds max
  private static readonly PING_COUNT = 5;

  static async detectBandwidth(): Promise<BandwidthResult> {
    const timestamp = new Date().toISOString();
    
    // Try Network Information API first
    const networkInfo = this.getNetworkInformation();
    
    if (networkInfo.downlink && networkInfo.rtt !== undefined) {
      // Enhanced with speed test for accuracy
      const speedTest = await this.performSpeedTest();
      
      return {
        downloadSpeed: speedTest.downloadSpeed || networkInfo.downlink || 0,
        uploadSpeed: speedTest.uploadSpeed || (networkInfo.downlink ? networkInfo.downlink * 0.1 : 0),
        latency: speedTest.latency || networkInfo.rtt || 0,
        jitter: speedTest.jitter || 0,
        connectionType: networkInfo.type,
        effectiveType: networkInfo.effectiveType,
        timestamp,
        testMethod: speedTest.downloadSpeed ? 'mixed' : 'network-api'
      };
    }
    
    // Fallback to speed test only
    const speedTest = await this.performSpeedTest();
    
    return {
      downloadSpeed: speedTest.downloadSpeed || 0,
      uploadSpeed: speedTest.uploadSpeed || 0,
      latency: speedTest.latency || 0,
      jitter: speedTest.jitter || 0,
      connectionType: 'unknown',
      effectiveType: this.estimateConnectionType(speedTest.downloadSpeed || 0),
      timestamp,
      testMethod: 'speed-test'
    };
  }

  private static getNetworkInformation() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    return {
      type: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink, // Mbps
      rtt: connection?.rtt, // ms
      saveData: connection?.saveData || false
    };
  }

  private static async performSpeedTest(): Promise<{
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    jitter: number;
  }> {
    try {
      // Perform latency test first
      const latencyResults = await this.measureLatency();
      
      // Perform download speed test
      const downloadSpeed = await this.measureDownloadSpeed();
      
      // Perform upload speed test (simplified)
      const uploadSpeed = await this.measureUploadSpeed();
      
      return {
        downloadSpeed,
        uploadSpeed,
        latency: latencyResults.averageLatency,
        jitter: latencyResults.jitter
      };
    } catch (error) {
      console.warn('Speed test failed:', error);
      return {
        downloadSpeed: 0,
        uploadSpeed: 0,
        latency: 0,
        jitter: 0
      };
    }
  }

  private static async measureLatency(): Promise<{ averageLatency: number; jitter: number }> {
    const latencies: number[] = [];
    
    for (let i = 0; i < this.PING_COUNT; i++) {
      try {
        const start = performance.now();
        const response = await fetch('/api/ping?' + Math.random(), {
          method: 'GET',
          cache: 'no-cache'
        });
        const end = performance.now();
        
        if (response.ok) {
          latencies.push(end - start);
        }
      } catch (error) {
        // Skip failed pings
      }
      
      // Small delay between pings
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    if (latencies.length === 0) {
      return { averageLatency: 0, jitter: 0 };
    }
    
    const averageLatency = latencies.reduce((sum, lat) => sum + lat, 0) / latencies.length;
    const jitter = this.calculateJitter(latencies);
    
    return { averageLatency, jitter };
  }

  private static calculateJitter(latencies: number[]): number {
    if (latencies.length < 2) return 0;
    
    const differences = [];
    for (let i = 1; i < latencies.length; i++) {
      differences.push(Math.abs(latencies[i] - latencies[i - 1]));
    }
    
    return differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
  }

  private static async measureDownloadSpeed(): Promise<number> {
    try {
      // Create a test payload URL - use a known endpoint
      const testUrl = '/api/bandwidth-test/download?' + Math.random();
      
      const start = performance.now();
      const response = await fetch(testUrl, {
        method: 'GET',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        // Fallback: estimate based on a small request
        return this.estimateSpeedFromSmallRequest();
      }
      
      const data = await response.arrayBuffer();
      const end = performance.now();
      
      const duration = (end - start) / 1000; // Convert to seconds
      const bytes = data.byteLength;
      const bitsPerSecond = (bytes * 8) / duration;
      const mbps = bitsPerSecond / (1024 * 1024);
      
      return Math.round(mbps * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      return this.estimateSpeedFromSmallRequest();
    }
  }

  private static async estimateSpeedFromSmallRequest(): Promise<number> {
    try {
      const start = performance.now();
      const response = await fetch('/api/geolocation?' + Math.random(), {
        method: 'GET',
        cache: 'no-cache'
      });
      const data = await response.text();
      const end = performance.now();
      
      const duration = (end - start) / 1000;
      const bytes = new Blob([data]).size;
      const bitsPerSecond = (bytes * 8) / duration;
      const mbps = bitsPerSecond / (1024 * 1024);
      
      // Scale up estimate (small requests don't represent true bandwidth)
      return Math.min(Math.round(mbps * 10 * 100) / 100, 100); // Cap at 100 Mbps
    } catch (error) {
      return 0;
    }
  }

  private static async measureUploadSpeed(): Promise<number> {
    try {
      // Create test data to upload
      const testData = new ArrayBuffer(64 * 1024); // 64KB test
      
      const start = performance.now();
      const response = await fetch('/api/bandwidth-test/upload', {
        method: 'POST',
        body: testData,
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
      const end = performance.now();
      
      if (!response.ok) {
        // Estimate upload as typically 10% of download
        const downloadSpeed = await this.estimateSpeedFromSmallRequest();
        return Math.round(downloadSpeed * 0.1 * 100) / 100;
      }
      
      const duration = (end - start) / 1000;
      const bytes = testData.byteLength;
      const bitsPerSecond = (bytes * 8) / duration;
      const mbps = bitsPerSecond / (1024 * 1024);
      
      return Math.round(mbps * 100) / 100;
    } catch (error) {
      return 0;
    }
  }

  private static estimateConnectionType(downloadSpeed: number): string {
    if (downloadSpeed >= 100) return '4g';
    if (downloadSpeed >= 25) return '3g';
    if (downloadSpeed >= 1) return '2g';
    return 'slow-2g';
  }

  static formatSpeed(speed: number): string {
    if (speed >= 1000) {
      return `${(speed / 1000).toFixed(1)} Gbps`;
    }
    return `${speed.toFixed(1)} Mbps`;
  }

  static getConnectionQuality(speed: number): { level: string; color: string } {
    if (speed >= 100) return { level: 'Excellent', color: 'text-green-600' };
    if (speed >= 25) return { level: 'Good', color: 'text-blue-600' };
    if (speed >= 5) return { level: 'Fair', color: 'text-yellow-600' };
    if (speed >= 1) return { level: 'Poor', color: 'text-orange-600' };
    return { level: 'Very Poor', color: 'text-red-600' };
  }
}