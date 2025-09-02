import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function OAuthCallbackSimple() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')

  useEffect(() => {
    console.log('🔍 OAuth callback loaded, URL:', window.location.href);
    
    if (!supabase) {
      setStatus('error');
      setMessage('Authentication service not available');
      return;
    }

    // Check for access token in hash (implicit flow)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    
    console.log('🔍 Access token found:', !!accessToken);
    console.log('🔍 Refresh token found:', !!refreshToken);

    if (accessToken) {
      console.log('✅ Implicit flow tokens detected');
      setMessage('Authentication tokens received, creating session...');
      
      // Listen for auth state changes to catch when Supabase processes the session
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔄 Auth state change in callback:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ Session created successfully:', session.user.email);
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Store session data
          localStorage.setItem('sb-session', JSON.stringify(session));
          const userProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.user_metadata?.avatar_url,
            is_pro: false
          };
          localStorage.setItem('user_session', JSON.stringify(userProfile));
          
          // Clean up listener and redirect
          authListener.subscription?.unsubscribe();
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } else if (event === 'SIGNED_OUT') {
          console.log('❌ Received SIGNED_OUT event during OAuth callback');
          setStatus('error');
          setMessage('Authentication failed - session was not created properly');
        }
      });
      
      // Fallback check after some time if auth state change doesn't fire
      setTimeout(async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (session && status === 'loading') {
          console.log('✅ Session found via fallback check:', session.user.email);
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          
          // Store session data
          localStorage.setItem('sb-session', JSON.stringify(session));
          const userProfile = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.user_metadata?.avatar_url,
            is_pro: false
          };
          localStorage.setItem('user_session', JSON.stringify(userProfile));
          
          authListener.subscription?.unsubscribe();
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
        } else if (!session && status === 'loading') {
          console.error('❌ No session after fallback check:', error);
          setStatus('error');
          setMessage('Session creation failed. Please try again.');
        }
      }, 3000);
      
      // Final timeout
      setTimeout(() => {
        if (status === 'loading') {
          authListener.subscription?.unsubscribe();
          setStatus('error');
          setMessage('Authentication timed out. Please try again.');
        }
      }, 10000);
      
      // Clean up listener on unmount
      return () => {
        authListener.subscription?.unsubscribe();
      };
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
              <button
                onClick={() => window.location.href = '/sign-in'}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}