import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const [, setLocation] = useLocation();
  const { handleCallback, user, authError } = useGoogleAuth();

  useEffect(() => {
    handleCallback();
  }, []);

  useEffect(() => {
    if (user) {
      // Redirect to dashboard after successful authentication
      setTimeout(() => {
        setLocation('/dashboard');
      }, 1000);
    }
  }, [user, setLocation]);

  if (authError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full bg-card border rounded-lg p-6 text-center">
          <div className="text-destructive text-xl font-semibold mb-4">
            Authentication Error
          </div>
          <p className="text-muted-foreground mb-6">{authError}</p>
          <button
            onClick={() => setLocation('/')}
            className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full bg-card border rounded-lg p-6 text-center">
          <div className="text-green-600 text-xl font-semibold mb-4">
            Authentication Successful!
          </div>
          <div className="flex items-center justify-center mb-4">
            <img
              src={user.picture}
              alt={user.name}
              className="w-16 h-16 rounded-full border-2 border-border"
            />
          </div>
          <p className="text-foreground font-medium mb-2">Welcome, {user.name}!</p>
          <p className="text-muted-foreground text-sm mb-6">{user.email}</p>
          <p className="text-muted-foreground text-sm">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full bg-card border rounded-lg p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-foreground font-medium mb-2">Completing Authentication</p>
        <p className="text-muted-foreground text-sm">
          Please wait while we verify your Google account...
        </p>
      </div>
    </div>
  );
}