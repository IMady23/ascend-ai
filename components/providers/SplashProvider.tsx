"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSplash } from "@/hooks/useSplash";
import { SplashScreen } from "@/components/splash/SplashScreen";

interface SplashContextType {
  isSplashActive: boolean;
  isAppVisible: boolean;
}

const SplashContext = createContext<SplashContextType>({ 
  isSplashActive: false,
  isAppVisible: true
});

export function useSplashContext() {
  return useContext(SplashContext);
}

export function SplashProvider({ children }: { children: React.ReactNode }) {
  const { showSplash, isInitializing, isAppVisible, finishSplash, revealApp } = useSplash();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isInitializing) {
    return null; 
  }

  return (
    <SplashContext.Provider value={{ isSplashActive: showSplash, isAppVisible }}>
      {showSplash && <SplashScreen onFinish={finishSplash} onRevealApp={revealApp} />}
      <div 
        className="transition-opacity duration-700 ease-out h-full"
        style={{ opacity: isAppVisible ? 1 : 0 }}
      >
        {children}
      </div>
    </SplashContext.Provider>
  );
}
