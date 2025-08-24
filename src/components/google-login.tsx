import { Button } from '@/components/ui/button';
import { Mail, Loader2 } from 'lucide-react';
import { signInWithGoogle, isAuthenticated, getSession } from '@/lib/supabase';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface GoogleLoginProps {
  className?: string;
  onLoginStart?: () => void;
  onLoginError?: (error: string) => void;
}

export function GoogleLogin({ className, onLoginStart, onLoginError }: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  const handleLogin = async () => {
    try {
      setIsLoading(true);
      onLoginStart?.();
      
      // Use the new Supabase OAuth system
      await signInWithGoogle();
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('Google login error:', errorMessage);
      onLoginError?.(errorMessage);
    }
  };

  // Check if user is already authenticated
  if (isAuthenticated() && user) {
    return (
      <Button disabled className={className}>
        <Mail className="w-4 h-4 mr-2" />
        Signed in as {user.name}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      className={className}
      variant="outline"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Mail className="w-4 h-4 mr-2" />
      )}
      {isLoading ? 'Connecting...' : 'Continue with Google'}
    </Button>
  );
}