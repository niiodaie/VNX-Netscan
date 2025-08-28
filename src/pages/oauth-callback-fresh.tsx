import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function OAuthCallbackFresh() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    console.log('🔄 Fresh OAuth callback starting, URL:', window.location.href);
    
    // Create a fresh Supabase client specifically for this callback
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseAnonKey) {
      setStatus('error');
      setMessage('Authentication service configuration missing');
      return;
    }

    // Clear any existing Supabase sessions to prevent conflicts
    const storageKey = 'sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token';
    console.log('Clearing storage key:', storageKey);
    localStorage.removeItem(storageKey);
    localStorage.removeItem('sb-session');
    localStorage.removeItem('user_session');
    
    // Create fresh client with explicit implicit flow configuration
    const freshSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'implicit',
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        debug: false
      }
    });

    console.log('🆕 Fresh Supabase client created for implicit flow');

    // Check for access token in hash (implicit flow)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const tokenType = hashParams.get('token_type');
    const expiresIn = hashParams.get('expires_in');
    
    console.log('🔍 Hash analysis:', {
      accessToken: !!accessToken,
      refreshToken: !!refreshToken,
      tokenType,
      expiresIn,
      hashLength: window.location.hash.length,
      fullHash: window.location.hash
    });

    if (accessToken) {
      console.log('✅ Access token found, creating manual session...');
      setMessage('Tokens received, creating session manually...');
      
      const createManualSession = async () => {
        try {
          // Create session manually using the received tokens
          const sessionData = {
            access_token: accessToken,
            refresh_token: refreshToken || '',
            expires_in: parseInt(expiresIn || '3600'),
            token_type: tokenType || 'bearer',
            user: null // Will be populated below
          };
          
          // Get user info using the access token
          const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
        
        if (userResponse.ok) {
          const googleUser = await userResponse.json();
          console.log('✅ Google user info retrieved:', googleUser.email);
          
          // Create user object compatible with Supabase
          const user = {
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
          };
          
          sessionData.user = user;
          
          // Store session in localStorage (compatible with Supabase format)
          const supabaseSession = {
            access_token: accessToken,
            refresh_token: refreshToken || '',
            expires_in: parseInt(expiresIn || '3600'),
            token_type: tokenType || 'bearer',
            user: user
          };
          
          localStorage.setItem('sb-session', JSON.stringify(supabaseSession));
          
          // Also store in Supabase storage format
          const storageKey = 'sb-eojnpjnlvscxtboimhln-auth-token';
          localStorage.setItem(storageKey, JSON.stringify(supabaseSession));
          
          // Store user profile for the app
          const userProfile = {
            id: user.id,
            email: user.email,
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            avatar_url: user.user_metadata?.avatar_url,
            is_pro: false
          };
          localStorage.setItem('user_session', JSON.stringify(userProfile));
          
          console.log('✅ Manual session created successfully');
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Clean hash from URL
          if (window.history && window.history.replaceState) {
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
          }
          
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
          
        } else {
          throw new Error('Failed to get user info from Google');
        }
        
        } catch (error) {
          console.error('❌ Manual session creation failed:', error);
          setStatus('error');
          setMessage('Failed to create authentication session. Please try again.');
        }
      };
      
      // Execute the async function
      createManualSession();
    } else {
      console.log('❌ No access token found in URL hash');
      setStatus('error');
      setMessage('No authentication tokens found. Please try signing in again.');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Authenticating</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">Success!</h2>
              <p className="text-green-600">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-800 mb-2">Authentication Failed</h2>
              <p className="text-red-600 mb-4">{message}</p>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = '/sign-in';
                  }}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Cache & Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Return to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}