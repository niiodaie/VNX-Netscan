import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Crown, 
  Shield, 
  Activity, 
  Network,
  Coffee,
  Globe
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { OAuthManager } from '@/lib/oauth';
import { PremiumFeature } from '@/components/premium-feature';
import { ProStatusTest } from '@/components/pro-status-test';
import { SignInRedirect } from '@/components/signin-redirect';
import { getUserInitials, getFirstName, getUserTier, getUserTierVariant, type UserSession } from '@/utils/auth';
import AuthenticatedLayout from '@/components/authenticated-layout';

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  
  // Check for demo mode URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const isDemoMode = urlParams.get('demo') === 'true';

  // Redirect unauthenticated users to sign-in (unless in demo mode)
  if (!loading && !isAuthenticated && !isDemoMode) {
    return <SignInRedirect />;
  }

  const handleLogout = () => {
    localStorage.removeItem('vnetscan_user');
    OAuthManager.logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getFirstName = (name: string) => {
    return name.split(' ')[0];
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need to sign in to access the dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.href = '/sign-in'}>
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use global auth user data
  const displayData = user || {
    name: 'Guest User',
    email: 'guest@vnetscan.com',
    picture: undefined,
    isGuest: true
  };

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
      {/* Demo Mode Banner for Unauthenticated Users */}
      {(!isAuthenticated || isDemoMode) && (
        <div className="p-4 border border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800 dark:text-orange-200">
                Demo Mode (Read-Only)
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-orange-600 dark:text-orange-400">
                Sign in to unlock full diagnostics
              </span>
              <Button 
                size="sm" 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome {displayData.isGuest ? 'to vNetScan' : `back, ${displayData.name.split(' ')[0]}`}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            {displayData.isGuest 
              ? "Exploring in guest mode. Sign in to unlock all premium features."
              : user?.is_pro 
                ? "Welcome back, Pro subscriber! All premium tools are unlocked."
                : "Ready to explore your network? Upgrade to Pro for advanced tools."
            }
          </p>
          {/* Pro Status Badge */}
          {!displayData.isGuest && (
            <div className="mt-3">
              <Badge className={`inline-flex items-center gap-1 ${
                user?.is_pro 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {user?.is_pro ? (
                  <>
                    <Crown className="w-3 h-3" />
                    Pro Subscriber
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3" />
                    Free Tier
                  </>
                )}
              </Badge>
            </div>
          )}
        </div>
        
        {/* User Profile Card */}
        <Card className="w-80">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={displayData.picture} />
                <AvatarFallback>
                  {getUserInitials(displayData)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{displayData.name}</h3>
                <p className="text-sm text-muted-foreground">{displayData.email}</p>
                <Badge variant={getUserTierVariant(displayData)} className="mt-1">
                  {displayData.isGuest ? (
                    <>
                      <Globe className="w-3 h-3 mr-1" />
                      {getUserTier(displayData)}
                    </>
                  ) : (
                    <>
                      <Crown className="w-3 h-3 mr-1" />
                      {getUserTier(displayData)}
                    </>
                  )}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Network className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scans Today</p>
                <p className="text-2xl font-bold">
                  {displayData.isGuest ? '5 Limit' : 'Unlimited'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Security Level</p>
                <p className="text-2xl font-bold">
                  {displayData.isGuest ? 'Basic' : 'Premium'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Live Monitoring</p>
                <p className="text-2xl font-bold">
                  {displayData.isGuest ? 'Limited' : 'Active'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="text-2xl font-bold">
                  {displayData.isGuest ? 'Guest' : 'Pro'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Features Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {displayData.isGuest ? (
              <>
                <Shield className="w-5 h-5 text-blue-500" />
                Available Features (Guest Mode)
              </>
            ) : (
              <>
                <Crown className="w-5 h-5 text-yellow-500" />
                Premium Features Unlocked
              </>
            )}
          </CardTitle>
          <CardDescription>
            {displayData.isGuest 
              ? "Limited access available. Sign in to unlock all premium features."
              : "You now have access to all advanced network diagnostic tools"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayData.isGuest ? (
              <>
                {/* Guest Mode - Limited Features */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✓ Basic IP Lookup</h4>
                  <p className="text-sm text-muted-foreground mt-1">Check IP address information</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✓ Simple Ping Test</h4>
                  <p className="text-sm text-muted-foreground mt-1">Test network connectivity</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✓ Basic Geolocation</h4>
                  <p className="text-sm text-muted-foreground mt-1">View general location data</p>
                </div>
                <div className="p-4 border rounded-lg opacity-50">
                  <h4 className="font-semibold text-orange-600 dark:text-orange-400">🔒 Limited Network Scans</h4>
                  <p className="text-sm text-muted-foreground mt-1">Only 5 scans per day</p>
                </div>
                <div className="p-4 border rounded-lg opacity-50">
                  <h4 className="font-semibold text-orange-600 dark:text-orange-400">🔒 Basic Reports Only</h4>
                  <p className="text-sm text-muted-foreground mt-1">Sign in for detailed analysis</p>
                </div>
                <div className="p-4 border rounded-lg opacity-50">
                  <h4 className="font-semibold text-orange-600 dark:text-orange-400">🔒 No Export Options</h4>
                  <p className="text-sm text-muted-foreground mt-1">Upgrade to save results</p>
                </div>
              </>
            ) : (
              <>
                {/* Premium Features */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✓ Unlimited Network Scans</h4>
                  <p className="text-sm text-muted-foreground mt-1">Scan as many networks as you need</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✓ Advanced Vulnerability Reports</h4>
                  <p className="text-sm text-muted-foreground mt-1">Detailed security analysis with CVE data</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✓ Export & Share Reports</h4>
                  <p className="text-sm text-muted-foreground mt-1">Download comprehensive PDF reports</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✓ Real-time Monitoring</h4>
                  <p className="text-sm text-muted-foreground mt-1">Live network status and alerts</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✓ Priority Support</h4>
                  <p className="text-sm text-muted-foreground mt-1">Direct access to technical assistance</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-green-600 dark:text-green-400">✓ API Access</h4>
                  <p className="text-sm text-muted-foreground mt-1">Integrate with your existing tools</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Prompt for Guest Users */}
      {displayData.isGuest && (
        <Card className="border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-blue-600" />
              Unlock Full vNetscan Experience
            </CardTitle>
            <CardDescription>
              Sign in to access unlimited scans, advanced reports, and premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Get unlimited network scans, vulnerability reports, export options, and priority support
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>🚀 Unlimited daily scans</li>
                  <li>📊 Detailed vulnerability analysis</li>
                  <li>💾 Export and save reports</li>
                  <li>🔄 Real-time monitoring</li>
                </ul>
              </div>
              <Button 
                onClick={() => window.location.href = '/sign-in'}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign In Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Premium Tools Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PremiumFeature 
          feature="Deep Network Scan" 
          description="Advanced diagnostics across subnets"
          level="premium"
        >
          <Card className="p-4 bg-white/10 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">Deep Network Scan</h3>
            <p className="text-sm text-muted-foreground mb-4">Advanced diagnostics across subnets with detailed port analysis</p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!isAuthenticated || isDemoMode}
              onClick={() => isAuthenticated && !isDemoMode ? window.location.href = '/ports' : null}
            >
              {!isAuthenticated || isDemoMode ? '🔒 Sign In Required' : 'Launch Scan'}
            </Button>
          </Card>
        </PremiumFeature>

        <PremiumFeature 
          feature="Vulnerability Analysis" 
          description="AI-powered security assessment with CVE data"
          level="premium"
        >
          <Card className="p-4 bg-white/10 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">Vulnerability Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">AI-powered security assessment with CVE database integration</p>
            <Button 
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!isAuthenticated || isDemoMode}
              onClick={() => isAuthenticated && !isDemoMode ? window.location.href = '/vuln-scan' : null}
            >
              {!isAuthenticated || isDemoMode ? '🔒 Sign In Required' : 'Analyze Security'}
            </Button>
          </Card>
        </PremiumFeature>

        <PremiumFeature 
          feature="Export Reports" 
          description="Download comprehensive PDF reports"
          level="basic"
        >
          <Card className="p-4 bg-white/10 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold mb-2">Export Reports</h3>
            <p className="text-sm text-muted-foreground mb-4">Download comprehensive PDF reports with detailed analysis</p>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!isAuthenticated || isDemoMode}
              onClick={() => isAuthenticated && !isDemoMode ? window.location.href = '/support' : null}
            >
              {!isAuthenticated || isDemoMode ? '🔒 Sign In Required' : 'Export Report'}
              Download PDF
            </Button>
          </Card>
        </PremiumFeature>
      </div>

      {/* Support the Project */}
      <Card className="border-2 border-yellow-200 dark:border-yellow-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-yellow-600" />
            Thank you for supporting vNetScan!
          </CardTitle>
          <CardDescription>
            Your premium access helps us continue developing advanced network tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Enjoying the premium features? Consider supporting our development
              </p>
            </div>
            <Button asChild>
              <a 
                href="https://coff.ee/visnec" 
                target="_blank" 
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Coffee className="w-4 h-4" />
                Buy us a coffee
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pro Status Validation */}
      {isAuthenticated && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Database Integration Status
            </CardTitle>
            <CardDescription>
              Real-time Pro user validation from Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProStatusTest />
          </CardContent>
        </Card>
      )}
    </div>
    </AuthenticatedLayout>
  );
}