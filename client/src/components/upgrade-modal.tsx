import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Zap, Check, Coffee, Heart } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAuthenticated: boolean;
}

export function UpgradeModal({ isOpen, onOpenChange, isAuthenticated }: UpgradeModalProps) {
  const handleUpgrade = () => {
    // Open Buy Me a Coffee for premium support
    window.open('https://coff.ee/visnec', '_blank');
    onOpenChange(false);
  };

  const premiumFeatures = [
    'Unlimited network scans',
    'Advanced vulnerability reports',
    'Real-time network monitoring',
    'Priority email support',
    'Export comprehensive reports',
    'Historical scan data',
    'Advanced bandwidth analysis',
    'Custom alert notifications'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Crown className="w-5 h-5 mr-2 text-yellow-500" />
            {isAuthenticated ? 'Upgrade to Premium' : 'Sign In Required'}
          </DialogTitle>
          <DialogDescription>
            {isAuthenticated 
              ? 'Unlock advanced network diagnostic capabilities with premium features.'
              : 'Sign in to unlock premium features and advanced network monitoring tools.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Premium Benefits */}
          <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Premium Benefits
                <Badge className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600">Pro</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <Check className="w-4 h-4 mr-2 text-green-600" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border">
              <div className="flex items-center justify-center mb-2">
                <Coffee className="w-5 h-5 mr-2 text-orange-600" />
                <span className="font-semibold text-orange-900">Support Development</span>
              </div>
              <p className="text-sm text-orange-800">
                Support vNetscan development and unlock premium features by buying us a coffee!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {!isAuthenticated && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => onOpenChange(false)}
                >
                  Sign In First
                </Button>
              )}
              
              <Button 
                onClick={handleUpgrade}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              >
                <Coffee className="w-4 h-4 mr-2" />
                <Heart className="w-3 h-3 mr-1 text-red-200" />
                Support & Upgrade
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Premium access is granted after supporting the project. Features unlock immediately.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}