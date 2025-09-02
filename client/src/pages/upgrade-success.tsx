import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Crown, Coffee, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/use-auth';

export default function UpgradeSuccess() {
  const { user } = useAuth();

  // In a real implementation, this would come from the payment provider
  useEffect(() => {
    // Simulate Pro upgrade (in production, this would be handled by webhook)
    const upgradeUser = () => {
      const currentUser = JSON.parse(localStorage.getItem('vnetscan_user') || '{}');
      if (currentUser.email) {
        const upgradedUser = {
          ...currentUser,
          is_pro: true,
          pro_since: new Date().toISOString()
        };
        localStorage.setItem('vnetscan_user', JSON.stringify(upgradedUser));
        
        // Trigger storage event for other tabs
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'vnetscan_user',
          newValue: JSON.stringify(upgradedUser)
        }));
      }
    };

    // Simulate a delay for upgrade processing
    const timer = setTimeout(upgradeUser, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl border-0 shadow-2xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Crown className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold text-slate-800 mb-2">
            Welcome to vNetscan Pro! 🎉
          </CardTitle>
          
          <CardDescription className="text-lg text-slate-600">
            Thank you for supporting the development of vNetscan
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Success Message */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <span className="font-semibold text-green-800">Payment Successful</span>
            </div>
            <p className="text-green-700">
              Your contribution has been processed and your account has been upgraded to Pro status.
            </p>
          </div>

          {/* Pro Features Unlocked */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-slate-800 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
              Features Unlocked
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                  <span className="text-slate-700">Unlimited Network Scans</span>
                </div>
                <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-3" />
                  <span className="text-slate-700">Advanced Vulnerability Reports</span>
                </div>
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-slate-700">Historical Scan Data</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="text-slate-700">Export & Share Reports</span>
                </div>
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-slate-700">Priority Support</span>
                </div>
                <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-indigo-600 mr-3" />
                  <span className="text-slate-700">Early Access Features</span>
                </div>
              </div>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{user.name}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro Subscriber
                </Badge>
              </div>
            </div>
          )}

          {/* Thank You Message */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center mb-3">
              <Coffee className="w-6 h-6 text-orange-600 mr-2" />
              <span className="text-lg font-medium text-slate-700">Thank you for your support!</span>
            </div>
            <p className="text-slate-600 text-sm">
              Your contribution helps fund the development and hosting of vNetscan, 
              making it possible to provide these tools to the cybersecurity community.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                Access Pro Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/support" className="flex-1">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-slate-500">
              Questions about your upgrade? Contact us at support@vnetscan.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}