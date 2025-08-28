import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Network, Activity, Mail, Lock } from 'lucide-react';
import { GoogleLogin } from '@/components/google-login';
import PublicLayout from '@/components/public-layout';
import EmailAuth from '@/components/email-auth';

export default function SignInPageFresh() {
  const [loginError, setLoginError] = useState('');
  
  const handleLoginError = (error: string) => {
    setLoginError(error);
    console.error('Login error:', error);
  };

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Shield className="w-10 h-10 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">VNX-NetScan</h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Fresh Supabase OAuth Test
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Testing authentication with new instance: tpznrpitltpohfccceel.supabase.co
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
              <CardDescription>
                Choose your preferred authentication method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="oauth" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="oauth" className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    OAuth
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="oauth" className="space-y-4">
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Google OAuth with Fresh Instance
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        This should resolve the state parameter issues
                      </p>
                    </div>
                    
                    <GoogleLogin 
                      className="w-full"
                      onLoginStart={() => {
                        console.log('🔍 Google OAuth initiated with fresh Supabase instance');
                        setLoginError('');
                      }}
                      onLoginError={handleLoginError}
                    />
                    
                    {loginError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Error: {loginError}
                        </p>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        Instance: tpznrpitltpohfccceel.supabase.co
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                  <EmailAuth />
                </TabsContent>
              </Tabs>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Don't want to create an account?
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.location.href = '/dashboard?demo=true'}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Continue as Guest
                    <span className="ml-2 text-xs text-gray-500">(Limited features)</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Network className="w-4 h-4" />
                <span>Network Tools</span>
              </div>
              <div className="flex items-center space-x-1">
                <Activity className="w-4 h-4" />
                <span>Live Monitoring</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4" />
                <span>Security Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}