import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Github, Mail, MessageCircle, Shield, User, LogIn } from 'lucide-react';
import { signInWithGoogle, signInWithGitHub, signInWithDiscord, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  avatar?: string;
  is_pro?: boolean;
}

interface OAuthLoginProps {
  onLoginSuccess?: (user: UserProfile) => void;
  onLoginError?: (error: string) => void;
}

export default function OAuthLogin({ onLoginSuccess, onLoginError }: OAuthLoginProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Available OAuth providers based on environment variables
  // Note: Google OAuth temporarily disabled for troubleshooting
  const availableProviders = React.useMemo(() => {
    const providers = [];
    // Temporarily disable Google OAuth
    // if (import.meta.env.VITE_GOOGLE_CLIENT_ID) providers.push('google');
    if (import.meta.env.VITE_GITHUB_CLIENT_ID) providers.push('github');
    if (import.meta.env.VITE_DISCORD_CLIENT_ID) providers.push('discord');
    return providers;
  }, []);

  const handleLogin = async (provider: string) => {
    if (!supabase) {
      toast({
        title: "Configuration Error",
        description: "Authentication system not properly initialized",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(provider);
      
      console.log(`🔍 Starting ${provider} OAuth authentication`);
      
      // Determine the correct redirect URL
      const isLocalhost = window.location.hostname === 'localhost' ||
                         window.location.hostname.endsWith('.repl.co') ||
                         window.location.hostname.endsWith('.replit.dev');
      
      const redirectTo = isLocalhost
        ? `${window.location.origin}/auth/callback/${provider}`
        : `https://netlookup.io/auth/callback/${provider}`;
      
      console.log(`🔍 Using redirect URL: ${redirectTo}`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: redirectTo
        }
      });

      if (error) {
        console.error(`❌ ${provider} OAuth error:`, error);
        throw error;
      }
      
      console.log(`✅ ${provider} OAuth sign-in initiated successfully`);
      
      // Close modal since we're redirecting
      setIsOpen(false);
      
    } catch (error) {
      setIsLoading(null);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error(`❌ ${provider} OAuth login error:`, errorMessage);
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      onLoginError?.(errorMessage);
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <Mail className="w-5 h-5" />;
      case 'github':
        return <Github className="w-5 h-5" />;
      case 'discord':
        return <MessageCircle className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'bg-red-600 hover:bg-red-700';
      case 'github':
        return 'bg-gray-800 hover:bg-gray-900';
      case 'discord':
        return 'bg-indigo-600 hover:bg-indigo-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const getProviderName = (provider: string) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };

  if (availableProviders.length === 0) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2">
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <LogIn className="w-4 h-4" />
          Sign In
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Sign in to vNetscan
          </DialogTitle>
          <DialogDescription>
            Choose your preferred authentication method to access advanced features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Premium Features Badge */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
            <div className="flex items-center mb-2">
              <Shield className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium text-blue-900">Premium Benefits</span>
              <Badge variant="secondary" className="ml-2">Pro</Badge>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Unlimited network scans</li>
              <li>• Advanced vulnerability reports</li>
              <li>• Historical scan data</li>
              <li>• Priority support</li>
            </ul>
          </div>

          {/* OAuth Providers */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-center">Sign in with:</p>
            {availableProviders.map((provider) => (
              <Button
                key={provider}
                onClick={() => handleLogin(provider)}
                disabled={isLoading === provider}
                className={`w-full flex items-center justify-center gap-3 text-white ${getProviderColor(provider)}`}
              >
                {isLoading === provider ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  getProviderIcon(provider)
                )}
                {isLoading === provider ? 'Redirecting...' : `Continue with ${getProviderName(provider)}`}
              </Button>
            ))}
          </div>

          {/* Security Notice */}
          <div className="text-xs text-muted-foreground text-center p-3 bg-muted rounded-lg">
            <Shield className="w-4 h-4 mx-auto mb-1" />
            Secure OAuth authentication. Your credentials are never stored on our servers.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// User Profile Display Component
interface UserProfileDisplayProps {
  user: UserProfile;
  onLogout: () => void;
}

export function UserProfileDisplay({ user, onLogout }: UserProfileDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      {(user.avatar_url || user.avatar) && (
        <img 
          src={user.avatar_url || user.avatar} 
          alt={user.name}
          className="w-8 h-8 rounded-full border-2 border-background"
        />
      )}
      <div className="flex flex-col">
        <span className="font-medium text-sm">{user.name}</span>
        <span className="text-xs text-muted-foreground">{user.email}</span>
      </div>
      <Button variant="ghost" size="sm" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}

