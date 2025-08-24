export interface IPLookupResult {
  ip: string;
  version: string;
  city: string;
  region: string;
  country_name: string;
  country: string;
  timezone: string;
  org: string;
  asn: string;
  postal: string;
  latitude: number;
  longitude: number;
  utc_offset: string;
  currency: string;
  languages: string;
  country_calling_code: string;
}

export interface PortScanResult {
  totalPorts: number;
  openPorts: Array<{
    port: number;
    state: string;
    service: string;
    version?: string;
  }>;
  closedPorts: Array<{
    port: number;
    state: string;
  }>;
  scanTime: string;
}

export interface WHOISResult {
  domain: string;
  registrar: string;
  registrationDate: string;
  expirationDate: string;
  nameServers: string[];
  status: string[];
  organization: string;
  country: string;
}

export interface TracerouteResult {
  target: string;
  totalHops: number;
  hops: Array<{
    hop: number;
    ip: string;
    hostname: string;
    rtt: string[];
  }>;
}

export interface BulkScanResult {
  target: string;
  results: {
    ipLookup: IPLookupResult;
    geoInfo: IPLookupResult;
    portScan: PortScanResult;
    whois: WHOISResult;
    traceroute: TracerouteResult;
  };
}

export class NetworkAPI {
  private static readonly API_BASE = 'https://ipapi.co';
  
  static async detectUserIP(): Promise<IPLookupResult> {
    try {
      const response = await fetch(`${this.API_BASE}/json/`);
      if (!response.ok) {
        throw new Error(`Failed to detect IP: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('IP detection error:', error);
      throw new Error('Failed to detect your IP address. Please check your internet connection.');
    }
  }

  static async performIPLookup(target: string): Promise<IPLookupResult> {
    try {
      const response = await fetch(`${this.API_BASE}/${target}/json/`);
      if (!response.ok) {
        throw new Error(`IP lookup failed: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address or domain');
      }
      
      return data;
    } catch (error) {
      console.error('IP lookup error:', error);
      throw new Error('Failed to lookup IP information. Please verify the target is correct.');
    }
  }

  static async performGeoLookup(target: string): Promise<IPLookupResult> {
    // Geo lookup is essentially the same as IP lookup for our API
    return this.performIPLookup(target);
  }

  static async performPortScan(target: string): Promise<PortScanResult> {
    // Port scanning cannot be performed from a browser due to security restrictions
    throw new Error('Port scanning requires a server-side implementation due to browser security restrictions. This feature is not available in the web interface.');
  }

  static async performWHOIS(target: string): Promise<WHOISResult> {
    // WHOIS lookups require server-side implementation due to CORS restrictions
    throw new Error('WHOIS lookups require a server-side implementation due to browser CORS restrictions. This feature is not available in the web interface.');
  }

  static async performTraceroute(target: string): Promise<TracerouteResult> {
    // Traceroute cannot be performed from a browser due to security restrictions
    throw new Error('Traceroute requires raw socket access which is not available in browsers. This feature requires a server-side implementation.');
  }

  static async performBulkScan(target: string): Promise<BulkScanResult> {
    // Only perform scans that work in browser environment
    const results: any = {};
    
    try {
      results.ipLookup = await this.performIPLookup(target);
      results.geoInfo = await this.performGeoLookup(target);
    } catch (error) {
      throw new Error(`IP lookup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Note: Port scan, WHOIS, and Traceroute require server-side implementation
    return {
      target,
      results: results as any
    };
  }
}
