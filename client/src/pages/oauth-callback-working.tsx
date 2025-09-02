import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';

export default function OAuthCallbackWorking() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('🔄 Starting OAuth callback processing...');
        
        // Get the current URL and extract the hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const expiresIn = hashParams.get('expires_in');
        const tokenType = hashParams.get('token_type');

        console.log('📍 URL hash params:', {
          accessToken: accessToken ? 'present' : 'missing',
          refreshToken: refreshToken ? 'present' : 'missing',
          expiresIn,
          tokenType
        });

        if (!accessToken) {
          throw new Error('No access token found in URL');
        }

        setMessage('Creating authentication session...');
        
        // Fetch user info directly from Google
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user information from Google');
        }

        const googleUser = await userResponse.json();
        console.log('✅ Google user info retrieved:', googleUser.email);

        // Create a manual session object
        const sessionData = {
          access_token: accessToken,
          refresh_token: refreshToken || '',
          expires_in: parseInt(expiresIn || '3600'),
          token_type: tokenType || 'bearer',
          user: {
            id: googleUser.id,
            email: googleUser.email,
            user_metadata: {
              full_name: googleUser.name,
              avatar_url: googleUser.picture,
              provider: 'google'
            },
            app_metadata: {
              provider: 'google',
              providers: ['google']
            }
          }
        };

        // Store session data in localStorage
        localStorage.setItem('supabase.auth.token', JSON.stringify(sessionData));
        localStorage.setItem('user', JSON.stringify(sessionData.user));
        
        console.log('✅ Session data stored successfully');
        setStatus('success');
        setMessage('Authentication successful! Redirecting...');

        // Clean the URL hash
        if (window.history && window.history.replaceState) {
          window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
        }

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          setLocation('/dashboard');
        }, 1500);

      } catch (error) {
        console.error('❌ OAuth callback failed:', error);
        setStatus('error');
        setMessage(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };

    handleOAuthCallback();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">Authenticating...</h2>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="rounded-full h-12 w-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-900">Success!</h2>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="rounded-full h-12 w-12 bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-900">Authentication Failed</h2>
            </>
          )}
          
          <p className="mt-2 text-sm text-gray-600">{message}</p>
          
          {status === 'error' && (
            <div className="mt-6 space-y-3">
              <button
                onClick={() => {
                  localStorage.clear();
                  setLocation('/sign-in');
                }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
              <button
                onClick={() => setLocation('/')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}