// client/src/hooks/useGoogleAuth.ts
import { useEffect, useState } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Dynamic redirect URI based on environment
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    if (hostname === 'localhost' || hostname.includes('replit.dev')) {
      return `${protocol}//${hostname}${port ? `:${port}` : ''}/auth/callback/google`;
    }
  }
  return 'https://netlookup.io/auth/callback/google';
};

const SCOPE = 'openid profile email';
const STATE_KEY = 'google_oauth_state';

export function useGoogleAuth() {
  const [user, setUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>('Google OAuth temporarily disabled');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateState = () => {
    const state = crypto.randomUUID();
    localStorage.setItem(STATE_KEY, state);
    return state;
  };

  const parseHash = (hash: string) => {
    return Object.fromEntries(new URLSearchParams(hash.replace(/^#/, '')));
  };

  const login = () => {
    const state = generateState();
    const redirectUri = getRedirectUri();
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(SCOPE)}` +
      `&state=${state}`;

    console.log('Google OAuth Login:', { redirectUri, authUrl });
    window.location.href = authUrl;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('google_user');
  };

  const exchangeCodeForToken = async (code: string): Promise<string> => {
    try {
      const response = await fetch('/api/auth/google/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: getRedirectUri(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Token exchange error:', error);
      throw new Error('Failed to exchange authorization code');
    }
  };

  const handleCallback = async () => {
    try {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      
      // Check for error in URL params
      const error = urlParams.get('error');
      if (error) {
        setAuthError(`OAuth error: ${error}`);
        return;
      }

      // Get authorization code and state from URL params
      const code = urlParams.get('code');
      const state = urlParams.get('state');

      if (!code) {
        setAuthError('Missing authorization code');
        return;
      }

      // Validate state parameter
      const storedState = localStorage.getItem(STATE_KEY);
      if (!state || state !== storedState) {
        setAuthError('Invalid state parameter - possible CSRF attack');
        return;
      }

      // Exchange code for access token
      const accessToken = await exchangeCodeForToken(code);
      
      // Fetch user profile
      await fetchGoogleProfile(accessToken);
      
      // Clean up
      localStorage.removeItem(STATE_KEY);
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      setAuthError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoogleProfile = async (accessToken: string) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profile = await res.json();
      setUser(profile);
      localStorage.setItem('google_user', JSON.stringify(profile));
    } catch (e) {
      setAuthError('Failed to fetch user profile.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('google_user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        logout();
      }
    }
  }, []);

  return { user, login, logout, handleCallback, authError, isLoading };
}