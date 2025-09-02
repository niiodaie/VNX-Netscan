import { useState, useEffect } from 'react';
import { getCurrentUser, type UserSession } from '../utils/auth';

export interface AuthState {
  user: UserSession | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize user state from localStorage
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for storage changes to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'vnetscan_user') {
        const updatedUser = getCurrentUser();
        setUser(updatedUser);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    user,
    isAuthenticated: !!(user && !user.isGuest),
    isPremium: !!(user && !user.isGuest), // For now, all authenticated users are premium
    loading
  };
}