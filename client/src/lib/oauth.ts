// OAuth authentication library for vNetscan
export interface OAuthProvider {
  name: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  authUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
}

export class OAuthManager {
  private static clientIds: Record<string, string> = {};
  
  private static readonly PROVIDERS: Record<string, Omit<OAuthProvider, 'clientId'>> = {
    google: {
      name: 'Google',
      redirectUri: `${window.location.origin}/auth/callback/google`,
      scope: 'openid email profile',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo'
    },
    github: {
      name: 'GitHub',
      redirectUri: `${window.location.origin}/auth/callback/github`,
      scope: 'user:email',
      authUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      userInfoUrl: 'https://api.github.com/user'
    },
    discord: {
      name: 'Discord',
      redirectUri: `${window.location.origin}/auth/callback/discord`,
      scope: 'identify email',
      authUrl: 'https://discord.com/api/oauth2/authorize',
      tokenUrl: 'https://discord.com/api/oauth2/token',
      userInfoUrl: 'https://discord.com/api/users/@me'
    }
  };

  static async loadConfiguration(): Promise<void> {
    try {
      const response = await fetch('/api/config');
      const config = await response.json();
      
      this.clientIds = {
        google: config.oauth.googleClientId,
        github: config.oauth.githubClientId,
        discord: config.oauth.discordClientId
      };
      
      console.log('OAuth configuration loaded:', Object.keys(this.clientIds).filter(k => this.clientIds[k]));
    } catch (error) {
      console.error('Failed to load OAuth configuration:', error);
    }
  }

  private static getProvider(providerName: string): OAuthProvider | null {
    const baseProvider = this.PROVIDERS[providerName];
    if (!baseProvider) return null;

    const clientId = this.clientIds[providerName];
    
    if (!clientId) {
      console.warn(`Missing OAuth client ID for ${providerName}`);
      return null;
    }

    return {
      ...baseProvider,
      clientId
    };
  }

  static initiateLogin(providerName: string): void {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`OAuth provider ${providerName} not configured`);
    }

    const state = this.generateState();
    sessionStorage.setItem('oauth_state', state);
    sessionStorage.setItem('oauth_provider', providerName);

    const params = new URLSearchParams({
      client_id: provider.clientId,
      redirect_uri: provider.redirectUri,
      scope: provider.scope,
      response_type: 'code',
      state: state
    });

    window.location.href = `${provider.authUrl}?${params.toString()}`;
  }

  static async handleCallback(): Promise<UserProfile> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const storedState = sessionStorage.getItem('oauth_state');
    const providerName = sessionStorage.getItem('oauth_provider');

    if (!code || !state || state !== storedState || !providerName) {
      throw new Error('Invalid OAuth callback parameters');
    }

    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`OAuth provider ${providerName} not configured`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        client_id: provider.clientId,
        code: code,
        redirect_uri: provider.redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user info
    const userResponse = await fetch(provider.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user information');
    }

    const userData = await userResponse.json();

    // Clean up session storage
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_provider');

    // Normalize user data based on provider
    const userProfile = this.normalizeUserData(userData, providerName);
    
    // Store user data and token
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('user_profile', JSON.stringify(userProfile));
    
    // Store in the exact format requested by user
    const userStorageData = {
      name: userProfile.name,
      email: userProfile.email,
      picture: userProfile.avatar
    };
    localStorage.setItem('vnetscan_user', JSON.stringify(userStorageData));

    return userProfile;
  }

  private static normalizeUserData(userData: any, provider: string): UserProfile {
    switch (provider) {
      case 'google':
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatar: userData.picture,
          provider: 'google'
        };
      
      case 'github':
        return {
          id: userData.id.toString(),
          email: userData.email,
          name: userData.name || userData.login,
          avatar: userData.avatar_url,
          provider: 'github'
        };
      
      case 'discord':
        return {
          id: userData.id,
          email: userData.email,
          name: userData.username,
          avatar: userData.avatar ? 
            `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png` : 
            undefined,
          provider: 'discord'
        };
      
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  static getCurrentUser(): UserProfile | null {
    const userStr = localStorage.getItem('user_profile');
    return userStr ? JSON.parse(userStr) : null;
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token') && !!localStorage.getItem('user_profile');
  }

  static logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    window.location.href = '/';
  }

  private static generateState(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  static getAvailableProviders(): string[] {
    return Object.keys(this.PROVIDERS).filter(provider => {
      const clientIdKey = `VITE_${provider.toUpperCase()}_CLIENT_ID`;
      return !!import.meta.env[clientIdKey];
    });
  }
}