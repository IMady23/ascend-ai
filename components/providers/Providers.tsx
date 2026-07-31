"use client";

import { ReactNode, useEffect } from "react";
import { useMidnightRollover } from "@/hooks/useMidnightRollover";
import { GlobalCelebrationProvider } from "./GlobalCelebrationProvider";
import { AudioEngine } from "@/lib/audio/AudioEngine";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Initialize global background processes
  useMidnightRollover();
  
  useEffect(() => {
    const unlockAudio = () => {
      AudioEngine.init();
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  return (
    <GlobalCelebrationProvider>
      {children}
    </GlobalCelebrationProvider>
  );
}
