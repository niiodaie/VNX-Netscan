import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Coffee, 
  Heart, 
  X,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";

interface DonationNotificationProps {
  trigger: 'scan-complete' | 'vulnerability-found' | 'time-based' | 'feature-usage';
  context?: string;
}

export default function DonationNotification({ trigger, context }: DonationNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if user has already seen notifications recently
    const lastShown = localStorage.getItem('lastDonationNotification');
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (!lastShown || now - parseInt(lastShown) > oneHour) {
      const timer = setTimeout(() => {
        setShouldShow(true);
        setIsVisible(true);
      }, 2000); // Show after 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  const handleDonate = () => {
    window.open('https://www.buymeacoffee.com/vnetscan', '_blank');
    handleClose();
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('lastDonationNotification', Date.now().toString());
  };

  const getNotificationContent = () => {
    switch (trigger) {
      case 'scan-complete':
        return {
          title: "Scan Complete!",
          message: "vNetscan helped you discover network insights. Support our free tool?",
          icon: TrendingUp,
          color: "text-green-600"
        };
      case 'vulnerability-found':
        return {
          title: "Vulnerabilities Detected",
          message: "Our advanced scanner found security issues. Help us maintain this service?",
          icon: Heart,
          color: "text-red-600"
        };
      case 'feature-usage':
        return {
          title: "Enjoying vNetscan?",
          message: "You've used multiple features today. Consider supporting development?",
          icon: Users,
          color: "text-blue-600"
        };
      default:
        return {
          title: "Support vNetscan",
          message: "Keep this powerful network tool free for everyone!",
          icon: Clock,
          color: "text-purple-600"
        };
    }
  };

  if (!shouldShow || !isVisible) return null;

  const content = getNotificationContent();
  const Icon = content.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="border-yellow-200 dark:border-yellow-800 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Icon className={`w-5 h-5 ${content.color}`} />
              <h4 className="font-semibold text-sm">{content.title}</h4>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {content.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">Free Tool</Badge>
              <Badge variant="outline" className="text-xs">$225/month costs</Badge>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClose}
                className="text-xs"
              >
                Later
              </Button>
              <Button 
                onClick={handleDonate}
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-xs"
              >
                <Coffee className="w-3 h-3 mr-1" />
                Support
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}