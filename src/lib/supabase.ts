import { createClient } from '@supabase/supabase-js'

// NEW SUPABASE INSTANCE - Direct configuration (fallback for missing env vars)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tpznrpitltpohfccceel.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwem5ycGl0bHRwb2hmY2NjZWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1OTI2ODEsImV4cCI6MjA2NzE2ODY4MX0.aV9J3fXAIHZwgK8RI0w188HOj480XTRGMfmHjUoPqKc'

console.log('✅ Fresh Supabase Config:', { 
  url: supabaseUrl, 
  keyLength: supabaseAnonKey?.length || 0,
  instance: supabaseUrl?.includes('tpznrpitltpohfccceel') ? 'NEW INSTANCE' : 'OLD INSTANCE',
  timestamp: new Date().toISOString()
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. OAuth authentication will be disabled until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided.')
}

// Dynamic redirect URL detection for our app's callback handler
const isLocalhost = typeof window !== 'undefined' &&
                    (window.location.hostname === 'localhost' ||
                     window.location.hostname.endsWith('.repl.co') ||
                     window.location.hostname.endsWith('.replit.dev'))

const redirectTo = isLocalhost
  ? `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000'}/auth/callback/google`
  : 'https://netscan.visnec.ai/auth/callback/google'

console.log('OAuth redirect configured for:', redirectTo)

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        detectSessionInUrl: true, // Required for OAuth
        autoRefreshToken: true,
        debug: true,
        flowType: 'pkce', // Ensure PKCE flow for new instance
        storage: {
          // Clear any cached auth state from old instance
          getItem: (key: string) => {
            // Force clear old instance storage keys
            if (key.includes('sb-eojnpjnlvscxtboimhln')) {
              console.log('🗑️ Clearing old instance auth key:', key);
              localStorage.removeItem(key);
              return null;
            }
            return localStorage.getItem(key);
          },
          setItem: (key: string, value: string) => {
            localStorage.setItem(key, value);
          },
          removeItem: (key: string) => {
            localStorage.removeItem(key);
          }
        }
      }
    })
  : null

// Log the configuration to verify it's set correctly
if (supabase) {
  console.log('Supabase client initialized with implicit flow configuration');
}

// Session resume function - only runs on non-callback pages
async function tryResumeSession() {
  if (!supabase) return;
  
  // Skip session resume on OAuth callback pages - let the callback handle it
  if (window.location.pathname.includes('/auth/callback')) {
    return;
  }
  
  const { data: { session }, error } = await supabase.auth.getSession()
  if (session) {
    console.log('Session resumed:', session)
    localStorage.setItem('sb-session', JSON.stringify(session))
    
    // Store user profile for compatibility with existing code
    const user = {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
      avatar_url: session.user.user_metadata?.avatar_url,
      is_pro: false // Will be updated from database
    }
    localStorage.setItem('user_session', JSON.stringify(user))
  } else {
    console.warn('No session found:', error)
  }
}

// Clear ALL Supabase-related cache to ensure fresh start
function clearAllSupabaseCache() {
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.startsWith('sb-') || 
    key.includes('supabase') || 
    key.includes('auth-token') ||
    key.includes('user_session') ||
    key.includes('sb-session')
  );
  
  console.log('🧹 Clearing ALL Supabase cache for fresh start:', keysToRemove);
  keysToRemove.forEach(key => {
    console.log('🗑️ Removing:', key);
    localStorage.removeItem(key);
  });
  
  // Also clear any session storage
  sessionStorage.clear();
}

// Force fresh start on every load
clearAllSupabaseCache();

// Initialize auth state handling only if supabase is available
if (supabase) {
  // Listen for auth state changes - but don't interfere with OAuth callbacks
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Global auth event:', event)
    
    // Skip processing if we're on an OAuth callback page - let the callback handle it
    if (window.location.pathname.includes('/auth/callback')) {
      console.log('Skipping global auth handling - on OAuth callback page');
      return;
    }
    
    if (event === 'SIGNED_IN' && session) {
      localStorage.setItem('sb-session', JSON.stringify(session))
      
      // Store user profile for compatibility with existing code
      const user = {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        avatar_url: session.user.user_metadata?.avatar_url,
        is_pro: false // Will be updated from database
      }
      localStorage.setItem('user_session', JSON.stringify(user))
      
      // Only redirect from sign-in page, not OAuth callback
      if (window.location.pathname === '/sign-in') {
        window.location.href = '/dashboard'
      }
    } else if (event === 'SIGNED_OUT') {
      localStorage.removeItem('sb-session')
      localStorage.removeItem('user_session')
      // Only redirect to home if not on OAuth callback
      if (!window.location.pathname.includes('/auth/callback')) {
        window.location.href = '/'
      }
    }
  })

  // Attempt resume on load
  tryResumeSession()
}

// OAuth helper functions
export const signInWithGoogle = async () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
  }
  
  console.log('Initiating Google OAuth with Supabase PKCE flow');
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTo, // This should be our app's callback URL
    },
  })
  
  if (error) {
    console.error('Google OAuth error:', error)
    throw error
  }
  
  return data
}

export const signInWithGitHub = async () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback/github`,
    },
  })
  
  if (error) {
    console.error('GitHub OAuth error:', error)
    throw error
  }
  
  return data
}

export const signInWithDiscord = async () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
    options: {
      redirectTo: `${window.location.origin}/auth/callback/discord`,
    },
  })
  
  if (error) {
    console.error('Discord OAuth error:', error)
    throw error
  }
  
  return data
}

export const signOut = async () => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
  }
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error)
    throw error
  }
}

// Email authentication functions
export const signUpWithEmail = async (email: string, password: string, fullName: string) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  })
  
  if (error) {
    console.error('Email signup error:', error)
    throw error
  }
  
  return data
}

export const signInWithEmail = async (email: string, password: string) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    console.error('Email signin error:', error)
    throw error
  }
  
  return data
}

export const resetPassword = async (email: string) => {
  if (!supabase) {
    throw new Error('Supabase client not initialized. Please provide VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
  }
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  
  if (error) {
    console.error('Password reset error:', error)
    throw error
  }
  
  return data
}

// Session utility functions
export const getSession = () => {
  const sessionData = localStorage.getItem('sb-session')
  return sessionData ? JSON.parse(sessionData) : null
}

export const isAuthenticated = () => {
  return !!getSession()
}

export const requireAuth = () => {
  if (!isAuthenticated()) {
    window.location.href = '/sign-in'
    return false
  }
  return true
}