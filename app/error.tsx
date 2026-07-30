"use client";

import React, { useEffect } from "react";
import { PremiumBackground } from "@/components/adl/system/PremiumBackground";
import { Button } from "@/components/adl/primitives/Button";
import { EngraveText } from "@/components/adl/typography/EngraveText";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0D14]">
      <PremiumBackground />
      <div className="z-10 flex flex-col items-center text-center px-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl tracking-[0.2em] font-light text-white uppercase mb-8 text-red-400/80">
          <EngraveText duration={1.5}>System Error</EngraveText>
        </h1>
        <h2 className="text-2xl md:text-4xl font-light tracking-wide text-white mb-12 opacity-90">
          Something interrupted your journey.
        </h2>
        <Button 
          size="lg" 
          variant="primary" 
          onClick={() => reset()}
          className="shadow-[0_0_20px_rgba(255,255,255,0.1)] px-12 tracking-wider bg-white text-black hover:bg-gray-100"
        >
          Try Again →
        </Button>
      </div>
    </div>
  );
}
