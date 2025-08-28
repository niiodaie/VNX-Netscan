import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Globe, 
  Search, 
  ExternalLink,
  Calendar,
  Building,
  Shield,
  Loader2
} from "lucide-react";
import AuthenticatedLayout from "@/components/authenticated-layout";

interface DomainInfo {
  domain: string;
  available: boolean;
  registrar?: string;
  registrationDate?: string;
  expirationDate?: string;
  nameServers?: string[];
  status?: string[];
  organization?: string;
  country?: string;
}

interface AffiliateLink {
  provider: string;
  name: string;
  url: string;
  description: string;
  price: string;
}

export default function Domain() {
  const [domainQuery, setDomainQuery] = useState("");
  const [domainInfo, setDomainInfo] = useState<DomainInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const affiliateLinks: AffiliateLink[] = [
    {
      provider: "namecheap",
      name: "Namecheap",
      url: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domainQuery)}&aff=AFFILIATE_ID_GO_HERE`,
      description: "Popular domain registrar with competitive pricing",
      price: "Starting at $8.88/year"
    },
    {
      provider: "godaddy",
      name: "GoDaddy",
      url: `https://www.godaddy.com/domainsearch/find?checkAvail=1&domainToCheck=${encodeURIComponent(domainQuery)}`,
      description: "World's largest domain registrar",
      price: "Starting at $11.99/year"
    },
    {
      provider: "hostinger",
      name: "Hostinger",
      url: `https://www.hostinger.com/domain-checker?domain=${encodeURIComponent(domainQuery)}`,
      description: "Affordable domains with free WHOIS privacy",
      price: "Starting at $7.99/year"
    },
    {
      provider: "bluehost",
      name: "Bluehost",
      url: `https://www.bluehost.com/domains/domain-search?domain=${encodeURIComponent(domainQuery)}`,
      description: "WordPress recommended hosting with free domain",
      price: "Free with hosting plans"
    }
  ];

  const handleDomainCheck = async () => {
    if (!domainQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // Simulate domain lookup - in production this would use a real WHOIS API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock domain data based on common patterns
      const isAvailable = Math.random() > 0.7; // 30% chance domain is available
      
      if (isAvailable) {
        setDomainInfo({
          domain: domainQuery.toLowerCase(),
          available: true
        });
      } else {
        setDomainInfo({
          domain: domainQuery.toLowerCase(),
          available: false,
          registrar: "Example Registrar Inc.",
          registrationDate: "2020-03-15",
          expirationDate: "2025-03-15",
          nameServers: ["ns1.example.com", "ns2.example.com"],
          status: ["clientTransferProhibited"],
          organization: "Example Organization",
          country: "US"
        });
      }
    } catch (error) {
      console.error("Domain lookup failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Domain Checker</h1>
        <p className="text-muted-foreground">
          Check domain availability and view WHOIS information
        </p>
      </div>

      {/* Domain Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Domain Availability Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter domain name (e.g., example.com)"
                value={domainQuery}
                onChange={(e) => setDomainQuery(e.target.value)}
                className="glow-border"
                onKeyPress={(e) => e.key === 'Enter' && handleDomainCheck()}
              />
            </div>
            <Button 
              onClick={handleDomainCheck}
              disabled={!domainQuery.trim() || isSearching}
              className="vnx-action-button"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Check Domain
                </>
              )}
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Popular extensions:</span>
            {['.com', '.net', '.org', '.io', '.ai'].map(ext => (
              <Button 
                key={ext}
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  const baseDomain = domainQuery.replace(/\.[a-z]+$/i, '');
                  setDomainQuery(baseDomain + ext);
                }}
                className="text-xs"
              >
                {ext}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Domain Results */}
      {domainInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-blue-600" />
                Domain Information: {domainInfo.domain}
              </span>
              <Badge 
                variant={domainInfo.available ? "default" : "destructive"}
                className={domainInfo.available ? "bg-green-600" : ""}
              >
                {domainInfo.available ? "Available" : "Registered"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {domainInfo.available ? (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-600 mb-2">
                    {domainInfo.domain} is available!
                  </h3>
                  <p className="text-muted-foreground">
                    This domain is ready to be registered. Choose from our trusted partners below.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-4">Register this domain:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {affiliateLinks.map((link) => (
                      <Card key={link.provider} className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold">{link.name}</h5>
                          <Badge variant="outline">{link.price}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {link.description}
                        </p>
                        <Button 
                          className="w-full" 
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Register at {link.name}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-red-600 mb-2">
                    {domainInfo.domain} is already registered
                  </h3>
                  <p className="text-muted-foreground">
                    This domain is not available for registration. View details below.
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Registration Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Registrar:</span>
                        <span>{domainInfo.registrar}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Organization:</span>
                        <span>{domainInfo.organization}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country:</span>
                        <span>{domainInfo.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Important Dates
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Registered:</span>
                        <span>{domainInfo.registrationDate && formatDate(domainInfo.registrationDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expires:</span>
                        <span>{domainInfo.expirationDate && formatDate(domainInfo.expirationDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {domainInfo.nameServers && (
                  <div>
                    <h4 className="font-semibold mb-3">Name Servers</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {domainInfo.nameServers.map((ns, index) => (
                        <div key={index} className="font-mono text-sm p-2 bg-muted rounded">
                          {ns}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {domainInfo.status && (
                  <div>
                    <h4 className="font-semibold mb-3">Domain Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {domainInfo.status.map((status, index) => (
                        <Badge key={index} variant="outline">
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <h4 className="font-semibold mb-4">Looking for alternatives?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {affiliateLinks.slice(0, 2).map((link) => (
                      <Card key={link.provider} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold">{link.name}</h5>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          Search for similar available domains
                        </p>
                        <Button 
                          variant="outline"
                          className="w-full" 
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Search at {link.name}
                        </Button>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Registration Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Choose the Right Extension</h4>
              <p className="text-sm text-muted-foreground">
                .com is most popular, but .io and .ai are great for tech companies.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Protect Your Privacy</h4>
              <p className="text-sm text-muted-foreground">
                Consider WHOIS privacy protection to keep your information secure.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Plan Ahead</h4>
              <p className="text-sm text-muted-foreground">
                Register for multiple years and set up auto-renewal to avoid losing your domain.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </AuthenticatedLayout>
  );
}