import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Network, Activity, Github, Mail, MessageCircle, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { OAuthManager, UserProfile } from '@/lib/oauth';
import PublicLayout from '@/components/public-layout';
import EmailAuth from '@/components/email-auth';

// Direct OAuth Login Component (no modal)
interface DirectOAuthLoginProps {
  onLoginSuccess?: (user: UserProfile) => void;
  onLoginError?: (error: string) => void;
}

function DirectOAuthLogin({ onLoginSuccess, onLoginError }: DirectOAuthLoginProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);

  useEffect(() => {
    OAuthManager.loadConfiguration().then(() => {
      setConfigLoaded(true);
      const providers = OAuthManager.getAvailableProviders();
      setAvailableProviders(providers);
      console.log('OAuth configuration loaded:', providers);
    });
  }, []);

  const handleLogin = async (provider: string) => {
    try {
      setIsLoading(provider);
      OAuthManager.initiateLogin(provider);
    } catch (error) {
      setIsLoading(null);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      onLoginError?.(errorMessage);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <Mail className="w-5 h-5" />;
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'discord':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'bg-red-600 hover:bg-red-700';
      case 'github':
        return 'bg-gray-800 hover:bg-gray-900';
      case 'discord':
        return 'bg-indigo-600 hover:bg-indigo-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const getProviderName = (provider: string) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  if (!configLoaded) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8 border rounded-lg bg-slate-50">
          <div className="text-center">
            <Lock className="w-8 h-8 mx-auto mb-3 text-slate-400" />
            <h3 className="font-medium text-slate-600 mb-1">Welcome Back</h3>
            <p className="text-sm text-slate-500 mb-4">Sign in to access your premium network diagnostics dashboard</p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (availableProviders.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8 border rounded-lg bg-slate-50">
          <div className="text-center">
            <Lock className="w-8 h-8 mx-auto mb-3 text-slate-400" />
            <h3 className="font-medium text-slate-600 mb-1">Authentication is currently being configured</h3>
            <p className="text-sm text-slate-500 mb-4">Please contact support for assistance</p>
            <Button variant="outline" size="sm">
              <Mail className="w-4 h-4 mr-2" />
              Buy me a coffee
            </Button>
            <div className="mt-4">
              <Button variant="ghost" size="sm" className="text-slate-500">
                <Shield className="w-4 h-4 mr-2" />
                Continue without account
                <span className="ml-2 text-xs">(Limited features available)</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-medium text-slate-700 mb-4">Sign in with:</p>
      </div>
      {availableProviders.map((provider) => (
        <Button
          key={provider}
          onClick={() => handleLogin(provider)}
          disabled={isLoading === provider}
          className={`w-full flex items-center justify-center gap-3 text-white ${getProviderColor(provider)}`}
        >
          {isLoading === provider ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            getProviderIcon(provider)
          )}
          {isLoading === provider ? 'Redirecting...' : `Continue with ${getProviderName(provider)}`}
        </Button>
      ))}
    </div>
  );
}

export default function SignInPage() {
  const { user, isAuthenticated, loading } = useAuth();

  // Redirect authenticated users to dashboard
  if (isAuthenticated && user && user.name !== 'Guest User') {
    window.location.href = '/dashboard';
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <Shield className="w-6 h-6 text-blue-600" />
            vNetscan Pro
          </CardTitle>
          <CardDescription>
            Professional network diagnostic suite
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Features Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Network className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Unlimited Network Scans</p>
                <p className="text-sm text-muted-foreground">Advanced port scanning & discovery</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Vulnerability Analysis</p>
                <p className="text-sm text-muted-foreground">CVE database integration</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Export & Share Reports</p>
                <p className="text-sm text-muted-foreground">Professional PDF reporting</p>
              </div>
            </div>
          </div>

          {/* Direct OAuth Login */}
          <div className="space-y-4">
            <DirectOAuthLogin 
              onLoginSuccess={(user) => {
                console.log('Login successful:', user);
                window.location.href = '/dashboard';
              }}
              onLoginError={(error) => {
                console.error('Login error:', error);
                alert('Login failed: ' + error);
              }}
            />
            
            {/* Demo Access */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Or try the limited demo version
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = '/dashboard?demo=true'}
              >
                Continue as Guest (Demo Mode)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </PublicLayout>
  );
}