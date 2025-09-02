import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Mail, Lock } from 'lucide-react';
import { WorkingGoogleOAuth } from '@/components/working-google-oauth';
import PublicLayout from '@/components/public-layout';
import EmailAuth from '@/components/email-auth';

export default function SignInPage() {
  const [loginError, setLoginError] = useState('');
  
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
              Testing: tpznrpitltpohfccceel.supabase.co
            </p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
              <CardDescription>
                Test Google OAuth with fresh Supabase instance
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
                        Google OAuth - Fresh Instance
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Should resolve state parameter issues
                      </p>
                    </div>
                    
                    <WorkingGoogleOAuth 
                      className="w-full"
                      onSuccess={(user) => {
                        console.log('Google OAuth successful:', user);
                        setLoginError('');
                      }}
                      onError={(error) => {
                        setLoginError(error);
                        console.error('OAuth Error:', error);
                      }}
                    />
                    
                    {loginError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {loginError}
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
                    Continue without authentication
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.location.href = '/dashboard?demo=true'}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Continue as Guest
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}