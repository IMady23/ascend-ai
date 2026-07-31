"use client";

import React from "react";
import Link from "next/link";
import { PremiumBackground } from "@/components/adl/system/PremiumBackground";
import { Button } from "@/components/adl/primitives/Button";
import { EngraveText } from "@/components/adl/typography/EngraveText";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-base">
      <PremiumBackground />
      <div className="z-10 flex flex-col items-center text-center px-4 max-w-2xl">
        <h1 className="text-6xl md:text-8xl tracking-[0.2em] font-light text-text-primary uppercase mb-8">
          <EngraveText duration={1.5}>404</EngraveText>
        </h1>
        <h2 className="text-2xl md:text-4xl font-light tracking-wide text-text-primary mb-12 opacity-90">
          Looks like you've wandered off the path.
        </h2>
        <Link href="/">
          <Button 
            size="lg" 
            variant="primary" 
            className="shadow-glow-ai px-12 tracking-wider bg-surface-elevated text-text-primary border border-border-subtle hover:bg-surface transition-colors"
          >
            Return Home →
          </Button>
        </Link>
      </div>
    </div>
  );
}
