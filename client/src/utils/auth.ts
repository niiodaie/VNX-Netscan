// Global authentication utility for vNetScan
// Manages user sessions across page reloads and navigation

export interface UserSession {
  name: string;
  email: string;
  picture?: string;
  isGuest?: boolean;
  is_pro?: boolean;
  db_id?: number;
  updated_at?: string;
}

/**
 * Get current user from localStorage
 * Returns null if no valid user session exists
 */
export function getCurrentUser(): UserSession | null {
  try {
    const userStr = localStorage.getItem('vnetscan_user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    return user?.email ? user : null;
  } catch (error) {
    console.error('Failed to parse user session:', error);
    return null;
  }
}

/**
 * Check if user is logged in (has valid session)
 */
export function isLoggedIn(): boolean {
  return !!getCurrentUser();
}

/**
 * Check if user is authenticated (not a guest)
 */
export function isAuthenticated(): boolean {
  const user = getCurrentUser();
  return !!(user && !user.isGuest);
}

/**
 * Check if user is a guest user
 */
export function isGuestUser(): boolean {
  const user = getCurrentUser();
  return !!(user && user.isGuest);
}

/**
 * Set user session in localStorage
 */
export function setUserSession(user: UserSession): void {
  localStorage.setItem('vnetscan_user', JSON.stringify(user));
}

/**
 * Clear user session and logout
 */
export function clearUserSession(): void {
  localStorage.removeItem('vnetscan_user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_profile');
}

/**
 * Get user's first name for display
 */
export function getFirstName(user: UserSession | null): string {
  if (!user) return 'Guest';
  return user.name.split(' ')[0] || 'User';
}

/**
 * Get user initials for avatar fallback
 */
export function getUserInitials(user: UserSession | null): string {
  if (!user) return 'G';
  return user.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Check if user is a Pro subscriber (has is_pro = true from database)
 */
export function isProUser(): boolean {
  const user = getCurrentUser();
  return !!(user && user.is_pro === true);
}

/**
 * Check if user has access to a feature level
 * @param level - 'basic' (guest allowed), 'premium' (auth required), 'pro' (pro subscription required)
 */
export function hasFeatureAccess(level: 'basic' | 'premium' | 'pro'): boolean {
  const user = getCurrentUser();
  
  switch (level) {
    case 'basic':
      return !!user; // Any logged in user (including guests)
    case 'premium':
      return isAuthenticated(); // Only authenticated users
    case 'pro':
      return isProUser(); // Only Pro subscribers with is_pro = true
    default:
      return false;
  }
}

/**
 * Check Pro status directly with Supabase backend
 * Uses the new /api/check-pro endpoint
 */
export async function checkProStatus(email: string): Promise<{ is_pro: boolean; user: any }> {
  try {
    const response = await fetch('/api/check-pro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        is_pro: data.is_pro || false,
        user: data.user || null
      };
    }
    
    return { is_pro: false, user: null };
  } catch (error) {
    console.error('Failed to check Pro status:', error);
    return { is_pro: false, user: null };
  }
}

/**
 * Sync user data with Supabase to get latest is_pro status
 * Call this after login to ensure Pro status is up to date
 */
export async function syncUserWithDatabase(email: string): Promise<UserSession | null> {
  try {
    const { is_pro, user } = await checkProStatus(email);
    
    // Update localStorage with latest Pro status
    const currentUser = getCurrentUser();
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        is_pro: is_pro,
        db_id: user?.id,
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem('vnetscan_user', JSON.stringify(updatedUser));
      
      // Dispatch storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'vnetscan_user',
        newValue: JSON.stringify(updatedUser),
        storageArea: localStorage
      }));
      
      return updatedUser;
    }
    
    return null;
  } catch (error) {
    console.error('Failed to sync user with database:', error);
    return null;
  }
}

/**
 * Redirect to sign in if not authenticated (for protected routes)
 */
export function requireAuthentication(redirectPath?: string): boolean {
  if (!isLoggedIn()) {
    const currentPath = window.location.pathname;
    const signInUrl = redirectPath ? `/sign-in?redirect=${encodeURIComponent(redirectPath)}` : '/sign-in';
    
    // Don't redirect if already on sign-in page
    if (currentPath !== '/sign-in') {
      window.location.href = signInUrl;
      return false;
    }
  }
  return true;
}

/**
 * Get user tier display name
 */
export function getUserTier(user: UserSession | null): string {
  if (!user) return 'Not Signed In';
  if (user.isGuest) return 'Guest';
  return 'Premium';
}

/**
 * Get user tier badge variant
 */
export function getUserTierVariant(user: UserSession | null): 'outline' | 'secondary' | 'default' {
  if (!user) return 'outline';
  if (user.isGuest) return 'outline';
  return 'secondary';
}