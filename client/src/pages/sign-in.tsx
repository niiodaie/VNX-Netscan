import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Network, Activity, Github, Mail, MessageCircle, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { GoogleLogin } from '@/components/google-login';
import { signInWithGoogle } from '@/lib/supabase';
import PublicLayout from '@/components/public-layout';
import EmailAuth from '@/components/email-auth';

// Direct OAuth Login Component using Supabase
interface DirectOAuthLoginProps {
  onLoginSuccess?: () => void;
  onLoginError?: (error: string) => void;
}

function DirectOAuthLogin({ onLoginSuccess, onLoginError }: DirectOAuthLoginProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Fresh Supabase OAuth Test
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Testing: tpznrpitltpohfccceel.supabase.co
        </p>
      </div>
      
      <GoogleLogin 
        className="w-full"
        onLoginStart={() => console.log('Google OAuth initiated with fresh instance')}
        onLoginError={(error) => onLoginError?.(error)}
      />
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          This should resolve state parameter issues with the fresh instance
        </p>
      </div>
    </div>
  );
}

// Use GoogleLogin component instead of broken OAuth Manager
const WorkingOAuthLogin = () => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Fresh Supabase OAuth Test
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Testing: tpznrpitltpohfccceel.supabase.co
        </p>
      </div>
      
      <GoogleLogin 
        className="w-full"
        onLoginStart={() => console.log('Google OAuth initiated with fresh instance')}
        onLoginError={(error) => console.error('OAuth Error:', error)}
      />
      
      <div className="text-center">
        <p className="text-xs text-gray-500">
          This should resolve state parameter issues with the fresh instance
        </p>
      </div>
    </div>
  );
};

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
        <div className="w-full max-w-lg space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">vNetscan</h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Professional network diagnostic suite
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 gap-3 mb-8">
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
              <Network className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Unlimited Network Scans</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Advanced port scanning & discovery</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Vulnerability Analysis</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">CVE database integration</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-sm">
              <Shield className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Export & Share Reports</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Professional PDF reporting</p>
              </div>
            </div>
          </div>

          {/* Authentication Tabs */}
          <Card className="w-full">
            <CardContent className="p-0">
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="oauth" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Quick Sign In
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="p-0">
                  <EmailAuth 
                    onSuccess={() => {
                      window.location.href = '/dashboard';
                    }}
                  />
                </TabsContent>

                <TabsContent value="oauth" className="p-6 pt-4">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-semibold mb-2">Quick Sign In</h3>
                      <p className="text-sm text-muted-foreground">
                        Use your existing account from these providers
                      </p>
                    </div>
                    <DirectOAuthLogin 
                      onLoginSuccess={() => {
                        console.log('Login successful');
                        window.location.href = '/dashboard';
                      }}
                      onLoginError={(error) => {
                        console.error('Login error:', error);
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
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Guest Access */}
          <div className="text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-slate-500"
              onClick={() => window.location.href = '/dashboard?demo=true'}
            >
              <Shield className="w-4 h-4 mr-2" />
              Continue without account
              <span className="ml-2 text-xs">(Limited features available)</span>
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}