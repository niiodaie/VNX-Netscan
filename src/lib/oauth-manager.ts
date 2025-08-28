// OAuth Manager - Handles Google OAuth with proper token exchange
interface OAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string;
  responseType: 'code' | 'token';
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  verified_email: boolean;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export class OAuthManager {
  private config: OAuthConfig;

  constructor() {
    this.config = {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirectUri: this.getRedirectUri(),
      scope: 'openid email profile',
      responseType: 'code' // Use authorization code flow for better security
    };
  }

  private getRedirectUri(): string {
    const host = window.location.host;
    const protocol = window.location.protocol;
    
    if (host.includes('localhost')) {
      return `${protocol}//localhost:5000/auth/callback/google`;
    } else if (host.includes('replit.dev')) {
      return `${protocol}//${host}/auth/callback/google`;
    } else {
      return `${protocol}//netlookup.io/auth/callback/google`;
    }
  }

  // Generate a secure random string for state parameter
  private generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Generate PKCE code verifier and challenge
  private async generatePKCE() {
    const codeVerifier = this.generateState();
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(digest))))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    return { codeVerifier, codeChallenge };
  }

  // Initiate OAuth flow
  async initiateOAuth(): Promise<void> {
    try {
      const state = this.generateState();
      const { codeVerifier, codeChallenge } = await this.generatePKCE();

      // Store state and code verifier for validation
      localStorage.setItem('oauth_state', state);
      localStorage.setItem('oauth_code_verifier', codeVerifier);

      const params = new URLSearchParams({
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        response_type: this.config.responseType,
        scope: this.config.scope,
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        access_type: 'offline',
        prompt: 'consent'
      });

      const authUrl = `https://accounts.google.com/oauth/authorize?${params.toString()}`;
      console.log('Initiating OAuth with URL:', authUrl);
      
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to initiate OAuth:', error);
      throw new Error('Failed to start authentication process');
    }
  }

  // Handle OAuth callback and exchange code for token
  async handleCallback(): Promise<{ user: GoogleUserInfo; session: any }> {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');

      if (error) {
        throw new Error(`OAuth error: ${error}`);
      }

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Validate state parameter
      const storedState = localStorage.getItem('oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }

      const codeVerifier = localStorage.getItem('oauth_code_verifier');
      if (!codeVerifier) {
        throw new Error('Missing code verifier');
      }

      console.log('Exchanging code for tokens...');

      // Exchange authorization code for access token
      const tokenResponse = await this.exchangeCodeForTokens(code, codeVerifier);
      
      // Get user information
      const userInfo = await this.getUserInfo(tokenResponse.access_token);

      // Create session object
      const session = {
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token,
        expires_in: tokenResponse.expires_in,
        token_type: tokenResponse.token_type,
        user: userInfo
      };

      // Clean up stored data
      localStorage.removeItem('oauth_state');
      localStorage.removeItem('oauth_code_verifier');

      console.log('OAuth authentication successful:', userInfo.email);
      return { user: userInfo, session };

    } catch (error) {
      console.error('OAuth callback failed:', error);
      
      // Clean up on error
      localStorage.removeItem('oauth_state');
      localStorage.removeItem('oauth_code_verifier');
      
      throw error;
    }
  }

  // Exchange authorization code for access token
  private async exchangeCodeForTokens(code: string, codeVerifier: string): Promise<TokenResponse> {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: this.config.clientId,
        code: code,
        code_verifier: codeVerifier,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Token exchange failed:', errorData);
      throw new Error(`Token exchange failed: ${response.status} ${response.statusText}`);
    }

    const tokenData = await response.json();
    console.log('Token exchange successful');
    return tokenData;
  }

  // Get user information from Google
  private async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.status} ${response.statusText}`);
    }

    const userInfo = await response.json();
    return userInfo;
  }

  // Check if user is authenticated (has valid token)
  isAuthenticated(): boolean {
    const session = this.getStoredSession();
    if (!session) return false;

    // Check if token is expired
    const expiryTime = session.expires_at || (Date.now() + (session.expires_in * 1000));
    return Date.now() < expiryTime;
  }

  // Get stored session
  getStoredSession(): any {
    try {
      const sessionData = localStorage.getItem('oauth_session');
      return sessionData ? JSON.parse(sessionData) : null;
    } catch {
      return null;
    }
  }

  // Store session
  storeSession(session: any): void {
    const sessionWithExpiry = {
      ...session,
      expires_at: Date.now() + (session.expires_in * 1000)
    };
    localStorage.setItem('oauth_session', JSON.stringify(sessionWithExpiry));
    
    // Also store user profile for compatibility
    if (session.user) {
      const userProfile = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        avatar_url: session.user.picture,
        provider: 'google',
        is_pro: false
      };
      localStorage.setItem('user_session', JSON.stringify(userProfile));
    }
  }

  // Clear session (logout)
  clearSession(): void {
    localStorage.removeItem('oauth_session');
    localStorage.removeItem('user_session');
    localStorage.removeItem('oauth_state');
    localStorage.removeItem('oauth_code_verifier');
  }
}

// Export singleton instance
export const oauthManager = new OAuthManager();