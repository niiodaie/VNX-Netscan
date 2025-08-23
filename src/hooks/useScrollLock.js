import { useEffect, useCallback } from 'react';

// Custom hook to lock/unlock body scroll (useful for modals, mobile menus, etc.)
export function useScrollLock() {
  const lockScroll = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Get current scroll position
    const scrollY = window.scrollY;
    
    // Apply styles to prevent scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    // Store scroll position for restoration
    document.body.setAttribute('data-scroll-y', scrollY.toString());
  }, []);

  const unlockScroll = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    // Get stored scroll position
    const scrollY = document.body.getAttribute('data-scroll-y');
    
    // Remove styles
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    
    // Restore scroll position
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY, 10));
      document.body.removeAttribute('data-scroll-y');
    }
  }, []);

  return { lockScroll, unlockScroll };
}

// Hook that automatically locks scroll when mounted and unlocks when unmounted
export function useScrollLockEffect(isLocked = true) {
  const { lockScroll, unlockScroll } = useScrollLock();

  useEffect(() => {
    if (isLocked) {
      lockScroll();
      return unlockScroll; // Cleanup function
    }
  }, [isLocked, lockScroll, unlockScroll]);

  return { lockScroll, unlockScroll };
}

// Hook for managing scroll lock state
export function useScrollLockState(initialLocked = false) {
  const { lockScroll, unlockScroll } = useScrollLock();
  
  const setScrollLocked = useCallback((locked) => {
    if (locked) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [lockScroll, unlockScroll]);

  // Initialize with the desired state
  useEffect(() => {
    if (initialLocked) {
      lockScroll();
    }
    
    // Cleanup on unmount
    return () => {
      unlockScroll();
    };
  }, [initialLocked, lockScroll, unlockScroll]);

  return setScrollLocked;
}

