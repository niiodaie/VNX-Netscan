import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Globe, 
  Clock, 
  Building, 
  Network,
  Loader2,
  RefreshCw,
  Copy
} from "lucide-react";
import { getUserLocation, detectUserLanguage, translations, UserLocation } from "@/lib/geolocation";
import { useToast } from "@/hooks/use-toast";

export default function UserLocationDetector() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language] = useState(detectUserLanguage());
  const { toast } = useToast();

  const t = translations[language];

  const detectLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userLocation = await getUserLocation();
      setLocation(userLocation);
    } catch (err) {
      setError(t.failed_detection);
      console.error('Location detection failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: "Copied to clipboard",
      duration: 2000,
    });
  };

  useEffect(() => {
    detectLocation();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            {t.location}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={detectLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            <span className="text-muted-foreground">{t.detecting}</span>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-orange-600 mb-2">Location Service Unavailable</h3>
            <p className="text-muted-foreground mb-4">
              The IP geolocation service is currently unavailable due to network restrictions.
            </p>
            <div className="text-left space-y-2 text-sm bg-muted p-4 rounded-lg">
              <p className="font-medium">To enable location detection:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Deploy the application to a public domain</li>
                <li>Use a paid geolocation API service</li>
                <li>Configure proper CORS headers on your server</li>
              </ul>
            </div>
          </div>
        )}

        {location && !isLoading && (
          <div className="space-y-4">
            {/* IP Address - Prominent Display */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 rounded-lg border">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Network className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-mono font-bold text-blue-600">
                  {location.ip}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(location.ip)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {location.demo ? "Demo IP Address" : "Your Public IP Address"}
                </Badge>
                {location.demo && (
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                    Demo Mode
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">
                      {location.city}, {location.region}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {location.country} ({location.country_code})
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.timezone}</p>
                    <p className="font-semibold">{location.timezone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.provider}</p>
                    <p className="font-semibold text-sm">{location.org}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Network className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t.network}</p>
                    <p className="font-semibold font-mono">{location.asn}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">{t.coordinates}:</span>
                </div>
                <div className="font-mono text-sm">
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Map Link */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const mapUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                window.open(mapUrl, '_blank');
              }}
            >
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}