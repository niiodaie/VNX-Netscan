import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function OAuthCallbackNew() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (!supabase) {
      setStatus('error');
      setMessage('Supabase client not initialized. Please check configuration.');
      return;
    }

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('OAuth callback - auth event:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        // Authentication successful
        const user = session.user;
        
        // Create a vnetscan user session for compatibility
        const vnetscanUser = {
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          avatar_url: user.user_metadata?.avatar_url,
          provider: 'google',
          is_pro: false,
          isGuest: false
        };

        localStorage.setItem('vnetscan_user', JSON.stringify(vnetscanUser));
        localStorage.setItem('sb-session', JSON.stringify(session));

        setUserInfo(vnetscanUser);
        setStatus('success');
        setMessage('Authentication successful! Redirecting to dashboard...');

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          setLocation('/dashboard');
        }, 2000);
        
      } else if (event === 'SIGNED_OUT') {
        setStatus('error');
        setMessage('Authentication was cancelled or failed.');
      }
    });

    // Cleanup subscription
    return () => {
      data.subscription.unsubscribe();
    };
  }, [setLocation]);

  const handleRetry = () => {
    setLocation('/sign-in');
  };

  const handleGoToDashboard = () => {
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {status === 'loading' && 'Signing You In'}
              {status === 'success' && 'Welcome to VNX-Netscan!'}
              {status === 'error' && 'Authentication Failed'}
            </CardTitle>
            <CardDescription>
              {status === 'loading' && 'Please wait while we complete your authentication'}
              {status === 'success' && 'Your account has been successfully authenticated'}
              {status === 'error' && 'There was a problem with your authentication'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Loading State */}
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-slate-600 text-center">{message}</p>
              </div>
            )}

            {/* Success State */}
            {status === 'success' && userInfo && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-slate-900">Welcome, {userInfo.name}!</h3>
                  <p className="text-sm text-slate-600">{userInfo.email}</p>
                </div>

                <Alert className="w-full border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {message}
                  </AlertDescription>
                </Alert>

                <Button 
                  onClick={handleGoToDashboard}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Error State */}
            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>

                <Alert className="w-full border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {message}
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <Button 
                    variant="outline" 
                    onClick={handleRetry}
                    className="flex-1"
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => setLocation('/demo')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Continue as Demo
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Debug Information (development only) */}
        {import.meta.env.DEV && (
          <Card className="mt-4 border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-yellow-800">Debug Information</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-yellow-700 space-y-1">
              <div>URL: {window.location.href}</div>
              <div>Status: {status}</div>
              <div>Message: {message}</div>
              {userInfo && <div>User: {JSON.stringify(userInfo, null, 2)}</div>}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}