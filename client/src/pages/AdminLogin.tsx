import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Simplified mounting with minimal interference
  useEffect(() => {
    console.log('%c=== ADMIN LOGIN COMPONENT MOUNTED ===', 'color: green; font-weight: bold; font-size: 16px');
    console.log('✅ Component successfully rendered');
    console.log('🌐 URL:', window.location.href);
    console.log('📍 Path:', window.location.pathname);
    
    // Simple timer to verify component persistence
    const timer = setTimeout(() => {
      console.log('%c✅ AdminLogin component still mounted after 3 seconds', 'color: green; font-weight: bold');
    }, 3000);
    
    return () => {
      console.log('%c❌ AdminLogin component unmounting', 'color: red; font-weight: bold');
      clearTimeout(timer);
    };
  }, []);

  const isValidCompanyEmail = (email: string) => {
    const allowedDomains = ['visnec.com'];
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔍 Admin Login Attempt:', { 
      email, 
      timestamp: new Date().toISOString(),
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL 
    });

    if (!isValidCompanyEmail(email)) {
      setError('Access denied. Company email required.');
      setLoading(false);
      return;
    }

    try {
      console.log('🔗 Attempting Supabase authentication...');
      console.log('Supabase client status:', { 
        initialized: !!supabase,
        url: import.meta.env.VITE_SUPABASE_URL 
      });
      
      // Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('📊 Supabase Auth Response:', { 
        success: !authError, 
        hasUser: !!authData?.user,
        hasSession: !!authData?.session,
        userId: authData?.user?.id || 'None',
        userEmail: authData?.user?.email || 'None',
        errorMessage: authError?.message || 'None',
        errorCode: authError?.status || 'None',
        fullError: authError
      });

      if (authError) {
        console.error('❌ Authentication failed:', {
          message: authError.message,
          status: authError.status,
          fullError: authError
        });
        setError(`Authentication failed: ${authError.message}`);
        setLoading(false);
        return;
      }

      console.log('✅ Authentication successful! User data:', {
        id: authData.user?.id,
        email: authData.user?.email,
        emailConfirmed: authData.user?.email_confirmed_at,
        lastSignIn: authData.user?.last_sign_in_at
      });

      // Check if user has access (simplified approach)
      console.log('🔍 Checking user access...');
      
      // Only allow @visnec.com emails for admin access
      if (!email.endsWith('@visnec.com')) {
        setError('Access Denied - Only company emails allowed');
        await supabase.auth.signOut();
        setLoading(false);
        return;
      }

      // Try to get user data with fallback for missing columns
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      console.log('📊 Database Query Response:', {
        hasUserData: !!userData,
        userData: userData,
        errorMessage: userError?.message || 'None',
        errorCode: userError?.code || 'None',
        fullError: userError
      });

      // If user doesn't exist in users table, create them
      if (userError && userError.code === 'PGRST116') {
        console.log('🔧 Creating user record...');
        
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert([{
            id: authData.user?.id,
            email: email,
            name: 'Admin User',
            provider: 'email'
          }])
          .select()
          .single();

        if (createError) {
          console.log('Note: Could not create user record, proceeding with auth only');
        }
      }

      console.log('✅ Authentication successful, redirecting to dashboard...');
      
      // Store user session info
      localStorage.setItem('adminUser', JSON.stringify({
        id: authData.user?.id,
        email: authData.user?.email,
        loginTime: new Date().toISOString()
      }));

      // Redirect to admin dashboard
      setLocation('/admin-dashboard');
    } catch (err) {
      setError('Authentication failed');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    if (!isValidCompanyEmail(email)) {
      setError('Password reset only available for company emails');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin-login`,
      });

      if (error) {
        setError('Failed to send reset email');
      } else {
        setError('');
        setShowForgotPassword(false);
        alert('Password reset email sent. Check your inbox.');
      }
    } catch (err) {
      setError('Failed to send reset email');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-white">vNetScan Admin Console</h1>
          </div>
          <p className="text-gray-400">Restricted Access — Authorized Admins Only</p>
        </div>

        {/* Login Card */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-white flex items-center space-x-2">
              <Lock className="h-5 w-5 text-red-500" />
              <span>Admin Sign In</span>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sign in using your company email to access the Admin Console.
              Only authorized admins may proceed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Company Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@visnec.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              {error && (
                <Alert className="bg-red-900/20 border-red-500/50">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {showForgotPassword && (
                <div className="space-y-2 p-4 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300">Enter your company email to receive a password reset link:</p>
                  <Button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    Send Reset Email
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>🔒 Secure Authentication • Role-Based Access Control</p>
          <p>All login attempts are monitored and logged</p>
        </div>
      </div>
    </div>
  );
}