import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function OAuthCallbackFixed() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  const handleOAuthCallback = async () => {
    try {
      console.log('OAuth callback initiated...');
      
      // Get the current URL with all parameters
      const currentUrl = window.location.href;
      console.log('Current URL:', currentUrl);
      
      // Check for error in URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      
      if (error) {
        console.error('OAuth error from URL:', error, errorDescription);
        setStatus('error');
        setMessage(`Authentication failed: ${errorDescription || error}`);
        return;
      }
      
      // Let Supabase handle the OAuth callback automatically
      console.log('Waiting for Supabase session...');
      
      // Listen for auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state change:', event, session);
          
          if (event === 'SIGNED_IN' && session) {
            console.log('User signed in successfully:', session.user);
            
            // Store user data in localStorage for app-wide access
            const userData = {
              id: session.user.id,
              email: session.user.email,
              name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
              avatar: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
              provider: 'google',
              is_pro: false // Will be updated from database
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('supabaseSession', JSON.stringify(session));
            
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            
            // Redirect to dashboard after brief delay
            setTimeout(() => {
              setLocation('/dashboard');
            }, 2000);
            
            // Clean up subscription
            subscription.unsubscribe();
          }
          
          if (event === 'SIGNED_OUT') {
            console.log('User signed out');
            setStatus('error');
            setMessage('Authentication failed - no session created');
          }
        }
      );
      
      // Also try to get the session directly
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        setStatus('error');
        setMessage(`Session error: ${sessionError.message}`);
        return;
      }
      
      if (session) {
        console.log('Session found directly:', session);
        // The auth state change handler will process this
      } else {
        console.log('No session found, waiting for auth state change...');
        
        // Set a timeout in case the auth state change doesn't fire
        setTimeout(() => {
          if (status === 'loading') {
            console.log('Timeout waiting for auth state change');
            setStatus('error');
            setMessage('Authentication timeout - please try again');
          }
        }, 10000);
      }
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Authentication failed');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">VNX-NetScan</h1>
          </div>
        </div>

        <Card className={`shadow-xl border-2 ${getStatusColor()}`}>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {getStatusIcon()}
            </div>
            <CardTitle className="text-xl">
              {status === 'loading' && 'Authenticating...'}
              {status === 'success' && 'Welcome!'}
              {status === 'error' && 'Authentication Failed'}
            </CardTitle>
            <CardDescription className="text-sm">
              Fresh Supabase OAuth • tpznrpitltpohfccceel.supabase.co
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {message}
            </p>
            
            {status === 'error' && (
              <div className="space-y-3">
                <button
                  onClick={() => setLocation('/sign-in')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setLocation('/dashboard?demo=true')}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Continue as Guest
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}