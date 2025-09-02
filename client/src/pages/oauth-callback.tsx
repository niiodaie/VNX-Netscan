import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function OAuthCallback() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔍 OAuth callback page loaded, URL:', window.location.href);
    
    // Debug: Check what parameters we have
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const hashParams = new URLSearchParams(url.hash.substring(1));
    console.log('🔍 URL search params:', Object.fromEntries(urlParams));
    console.log('🔍 URL hash params:', Object.fromEntries(hashParams));
    console.log('🔍 OAuth code in URL:', urlParams.get('code') || hashParams.get('code'));
    console.log('🔍 Access token in URL:', urlParams.get('access_token') || hashParams.get('access_token'));

    // Check for immediate OAuth errors in URL
    const authError = urlParams.get('error') || hashParams.get('error') || urlParams.get('error_description');

    if (authError) {
      console.error('❌ OAuth provider error:', authError);
      setError(`OAuth provider error: ${authError}`);
      setStatus('error');
      return;
    }

    // Set up auth state change listener - let Supabase handle OAuth automatically
    if (!supabase) {
      setError('Supabase client not initialized');
      setStatus('error');
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event);
      console.log('🔄 Session details:', session);
      console.log('🔄 User email:', session?.user?.email);
      console.log('🔄 Access token present:', !!session?.access_token);

      if (event === 'SIGNED_IN' && session) {
        console.log('✅ SIGNED_IN event detected, processing...');
        try {
          await handleSuccessfulAuth(session);
        } catch (err) {
          console.error('❌ Failed to handle successful auth:', err);
          setError(err instanceof Error ? err.message : 'Authentication processing failed');
          setStatus('error');
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🔄 User signed out');
        setLocation('/sign-in');
      } else {
        console.log(`🔍 Unhandled auth event: ${event}, session present: ${!!session}`);
      }
    });

    // Check for existing session immediately and try manual code exchange if needed
    const checkExistingSession = async () => {
      try {
        const { data: { session }, error } = await supabase!.auth.getSession();
        
        if (error) {
          console.error('❌ Session check error:', error);
          throw error;
        }

        if (session) {
          console.log('✅ Existing session found');
          await handleSuccessfulAuth(session);
        } else {
          console.log('⏳ No existing session, waiting for implicit flow to complete automatically...');
        }
      } catch (err) {
        console.error('❌ Session check failed:', err);
        setError(err instanceof Error ? err.message : 'Session verification failed');
        setStatus('error');
      }
    };

    checkExistingSession();

    // Fallback timeout - if no SIGNED_IN event after 10 seconds, show error instead of forcing redirect
    const fallbackTimeout = setTimeout(async () => {
      console.log('⚠️ OAuth callback timeout - checking final session status');
      
      // Final session check before giving up
      try {
        const { data: { session }, error } = await supabase!.auth.getSession();
        
        if (session) {
          console.log('✅ Session found on timeout check, proceeding with auth');
          await handleSuccessfulAuth(session);
          return;
        }
      } catch (err) {
        console.error('❌ Final session check failed:', err);
      }
      
      // Check URL parameters to provide better error info
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const code = urlParams.get('code') || hashParams.get('code');
      
      if (code) {
        console.log('❌ OAuth code found but session creation failed');
        setError('OAuth authentication failed: Unable to create session with provided authorization code. Please try again.');
      } else {
        console.log('❌ No OAuth code found in callback URL');
        setError('OAuth callback timeout: No authorization code received from provider.');
      }
      setStatus('error');
    }, 10000);

    // Cleanup subscription and timeout on unmount
    return () => {
      subscription.unsubscribe();
      clearTimeout(fallbackTimeout);
    };
  }, [setLocation]);

  const handleSuccessfulAuth = async (session: any) => {
    try {
      const user = session.user;
      const userProfile = {
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || 
              user.user_metadata?.name || 
              user.email?.split('@')[0] || 'User',
        avatar_url: user.user_metadata?.avatar_url || 
                    user.user_metadata?.picture ||
                    user.user_metadata?.photo,
        is_pro: false,
        provider: user.app_metadata?.provider || 'email'
      };

      console.log('👤 User profile created:', userProfile);

      // Store in localStorage and trigger events
      localStorage.setItem('user', JSON.stringify(userProfile));
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('auth-state-change', { 
        detail: { user: userProfile, event: 'SIGNED_IN' } 
      }));

      setStatus('success');
      
      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${userProfile.name}`,
      });

      // Redirect based on user type
      const redirectPath = userProfile.email?.includes('@visnec.com') 
        ? '/admin-console' 
        : '/dashboard';

      console.log(`🔄 Redirecting to: ${redirectPath}`);
      
      setTimeout(() => {
        setLocation(redirectPath);
      }, 1500);

    } catch (err) {
      console.error('❌ Profile creation error:', err);
      throw err;
    }
  };

  const handleRetry = () => {
    // Clear any stored auth data and retry
    localStorage.removeItem('sb-eojnpjnlvscxtboimhln-auth-token');
    localStorage.removeItem('user');
    setLocation('/sign-in');
  };

  const handleGoHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl">
            {status === 'loading' && <Loader2 className="h-6 w-6 animate-spin text-blue-600" />}
            {status === 'success' && <CheckCircle className="h-6 w-6 text-green-600" />}
            {status === 'error' && <XCircle className="h-6 w-6 text-red-600" />}
            
            {status === 'loading' && 'Completing Authentication...'}
            {status === 'success' && 'Welcome Back!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
          <CardDescription className="text-base">
            {status === 'loading' && 'Processing your authentication with multiple verification methods...'}
            {status === 'success' && 'Authentication successful! Redirecting you now...'}
            {status === 'error' && 'We encountered an issue during authentication'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === 'error' && (
            <>
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full">
                  Clear Cache & Try Again
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="w-full">
                  Return to Home
                </Button>
              </div>
            </>
          )}
          
          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  Authentication completed successfully!
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  You'll be redirected automatically in a moment.
                </p>
              </div>
              <Button onClick={() => setLocation('/dashboard')} className="w-full">
                Continue to Dashboard
              </Button>
            </div>
          )}
          
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <div className="space-y-1">
                  <div className="h-1 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Verifying your authentication...</p>
                <p>This may take a few moments</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}