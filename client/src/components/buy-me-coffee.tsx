import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Coffee, 
  Heart, 
  Star, 
  ExternalLink,
  CreditCard,
  DollarSign,
  Gift
} from "lucide-react";

interface DonationTier {
  amount: number;
  emoji: string;
  title: string;
  description: string;
  perks: string[];
}

const donationTiers: DonationTier[] = [
  {
    amount: 3,
    emoji: "☕",
    title: "Coffee Supporter",
    description: "Buy me a coffee to fuel late-night coding sessions",
    perks: ["Support development", "My eternal gratitude"]
  },
  {
    amount: 10,
    emoji: "🍕",
    title: "Pizza Patron",
    description: "Help fund a proper meal during intense dev work",
    perks: ["Priority feature requests", "Early access to updates", "Special thanks"]
  },
  {
    amount: 25,
    emoji: "🚀",
    title: "Launch Booster",
    description: "Accelerate development with premium infrastructure",
    perks: ["Custom feature consideration", "Direct developer contact", "Exclusive beta access"]
  }
];

export default function BuyMeCoffee() {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const handleDonation = (amount: number) => {
    // Replace with your actual Buy Me a Coffee username
    const buyMeCoffeeUrl = `https://www.buymeacoffee.com/vnetscan`;
    
    // Store the intended donation amount for the success page
    sessionStorage.setItem('pendingUpgrade', JSON.stringify({ amount, timestamp: Date.now() }));
    
    // Open Buy Me a Coffee in new tab, then redirect after a delay
    window.open(buyMeCoffeeUrl, '_blank');
    
    // Simulate successful purchase after 3 seconds (in production, use webhooks)
    setTimeout(() => {
      window.location.href = '/upgrade-success';
    }, 3000);
  };

  const handleCustomDonation = () => {
    const buyMeCoffeeUrl = `https://www.buymeacoffee.com/vnetscan`;
    
    // Store custom donation attempt
    sessionStorage.setItem('pendingUpgrade', JSON.stringify({ amount: 'custom', timestamp: Date.now() }));
    
    window.open(buyMeCoffeeUrl, '_blank');
    
    // Redirect to upgrade success after delay
    setTimeout(() => {
      window.location.href = '/upgrade-success';
    }, 3000);
  };

  return (
    <Card className="vnx-glass-card border-yellow-200 dark:border-yellow-800">
      <CardHeader>
        <CardTitle className="flex items-center text-center justify-center">
          <Coffee className="w-6 h-6 mr-2 text-yellow-600" />
          <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Support vNetscan Development
          </span>
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Help keep this powerful network tool free and continuously improving
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Donation Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {donationTiers.map((tier, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedTier === index 
                  ? 'ring-2 ring-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => setSelectedTier(selectedTier === index ? null : index)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{tier.emoji}</div>
                <h4 className="font-semibold mb-1">{tier.title}</h4>
                <div className="flex items-center justify-center mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{tier.amount}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">{tier.description}</p>
                
                <div className="space-y-1">
                  {tier.perks.map((perk, perkIndex) => (
                    <div key={perkIndex} className="flex items-center text-xs">
                      <Star className="w-3 h-3 text-yellow-500 mr-1 flex-shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDonation(tier.amount);
                  }}
                  className="w-full mt-3 bg-yellow-600 hover:bg-yellow-700 text-white"
                  size="sm"
                >
                  <Coffee className="w-3 h-3 mr-1" />
                  Donate ${tier.amount}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-px bg-border flex-1"></div>
            <span className="text-sm text-muted-foreground">or</span>
            <div className="h-px bg-border flex-1"></div>
          </div>
          
          <Button 
            onClick={handleCustomDonation}
            variant="outline"
            className="border-yellow-500 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
          >
            <Gift className="w-4 h-4 mr-2" />
            Choose Your Own Amount
            <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </div>

        {/* Why Support */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Heart className="w-4 h-4 mr-2 text-red-500" />
              Why Support vNetscan?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="text-xs">Free</Badge>
                <span>Keep vNetscan completely free for everyone</span>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="text-xs">Features</Badge>
                <span>Fund new advanced networking features</span>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="text-xs">Server</Badge>
                <span>Maintain reliable API services</span>
              </div>
              <div className="flex items-start space-x-2">
                <Badge variant="outline" className="text-xs">Updates</Badge>
                <span>Regular security and performance updates</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">15k+</div>
            <div className="text-xs text-muted-foreground">Monthly Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-xs text-muted-foreground">Available</div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            "vNetscan has revolutionized our network management workflow!"
          </p>
          <div className="flex justify-center space-x-1">
            {[1,2,3,4,5].map((star) => (
              <Star key={star} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">- Network Administrator, TechCorp</p>
        </div>
      </CardContent>
    </Card>
  );
}