import { useState, useEffect } from 'react';

const SPLASH_SESSION_KEY = 'ascend-splash-seen';

export function useSplash() {
  const [showSplash, setShowSplash] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAppVisible, setIsAppVisible] = useState(false); // Controls when the app should fade in

  useEffect(() => {
    // Check session storage
    const hasSeenSplash = sessionStorage.getItem(SPLASH_SESSION_KEY);
    
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasSeenSplash && !prefersReducedMotion) {
      setShowSplash(true);
    } else {
      setIsAppVisible(true);
    }
    
    setIsInitializing(false);
  }, []);

  const finishSplash = () => {
    sessionStorage.setItem(SPLASH_SESSION_KEY, 'true');
    setShowSplash(false);
  };

  const revealApp = () => {
    setIsAppVisible(true);
  }

  return {
    showSplash,
    isInitializing,
    isAppVisible,
    finishSplash,
    revealApp
  };
}
