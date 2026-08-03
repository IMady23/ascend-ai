"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/utils/cn";

interface SplashScreenProps {
  onFinish: () => void;
  onRevealApp: () => void;
}

export function SplashScreen({ onFinish, onRevealApp }: SplashScreenProps) {
  const [phase, setPhase] = useState<"playing" | "freezing" | "fading">("playing");
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 11. Scroll Lock
    // Disable scrolling and overscroll behavior while splash is active
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.body.style.overscrollBehavior = "none";

    // 4. Skip on Slow Devices (Timeout Fallback)
    fallbackTimerRef.current = setTimeout(() => {
      handleComplete();
    }, 12000); // 12 seconds max allowed for longer videos

    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.body.style.overscrollBehavior = "";
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, []);

  const handleVideoEnded = () => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    
    // 10. Premium Touch: 300ms freeze on the final frame
    setPhase("freezing");
    
    setTimeout(() => {
      // Begin fade out
      setPhase("fading");
      
      // 6. Hero Starts Slightly Earlier: We call onRevealApp slightly before the transition completes 
      // so the landing page fades in underneath the fading black overlay.
      setTimeout(() => {
        onRevealApp();
      }, 350); // Start revealing app midway through the 600ms fade
      
      setTimeout(() => {
        onFinish();
      }, 600); // Wait for full 600ms transition before unmounting
      
    }, 300); // freeze duration
  };

  const handleVideoError = () => {
    // 4. Fallback if video fails
    handleComplete();
  };

  const handleComplete = () => {
    onRevealApp();
    onFinish();
  };

  return (
    <div 
      className={cn(
        "fixed inset-0 z-[99999] flex items-center justify-center bg-[#0B0D12] pointer-events-none transition-all duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)]",
        phase === "fading" ? "opacity-0 scale-[1.02]" : "opacity-100 scale-100"
      )}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleVideoEnded}
        onError={handleVideoError}
        className={cn(
          "w-full h-full object-contain md:object-cover transition-opacity duration-300",
          phase === "fading" ? "opacity-0" : "opacity-100"
        )}
      >
        <source src="/videos/ascend-logo-reveal.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
