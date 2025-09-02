import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Network, Activity, Coffee } from 'lucide-react';
import OAuthLogin from './oauth-login';

export function SignInRedirect() {
  return (
    <div className="container mx-auto p-6">
      {/* Guest Mode Banner */}
      <div className="mb-6 p-4 border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800 dark:text-orange-200">Guest Mode</span>
          </div>
          <span className="text-sm text-orange-600 dark:text-orange-400">
            Sign in to unlock full diagnostics
          </span>
        </div>
      </div>

      {/* Sign In Required Card */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Lock className="w-6 h-6" />
            Authentication Required
          </CardTitle>
          <CardDescription className="text-lg">
            Sign in to access the full vNetscan network diagnostic suite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* What you'll get */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Network className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">Unlimited Scans</h3>
              <p className="text-sm text-muted-foreground">Network discovery & port scanning</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">Advanced Reports</h3>
              <p className="text-sm text-muted-foreground">Vulnerability analysis & CVE data</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Coffee className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Export & Share</h3>
              <p className="text-sm text-muted-foreground">Download PDF reports</p>
            </div>
          </div>

          {/* OAuth Login */}
          <div className="flex justify-center">
            <OAuthLogin 
              onLoginSuccess={(user) => {
                window.location.reload(); // Refresh to update auth state
              }}
              onLoginError={(error) => {
                console.error('Login error:', error);
              }}
            />
          </div>

          {/* Limited Demo Access */}
          <div className="text-center pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Or continue with limited demo access (read-only)
            </p>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/dashboard?demo=true'}
            >
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}