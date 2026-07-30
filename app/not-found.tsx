"use client";

import React from "react";
import Link from "next/link";
import { PremiumBackground } from "@/components/adl/system/PremiumBackground";
import { Button } from "@/components/adl/primitives/Button";
import { EngraveText } from "@/components/adl/typography/EngraveText";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0D14]">
      <PremiumBackground />
      <div className="z-10 flex flex-col items-center text-center px-4 max-w-2xl">
        <h1 className="text-6xl md:text-8xl tracking-[0.2em] font-light text-white uppercase mb-8">
          <EngraveText duration={1.5}>404</EngraveText>
        </h1>
        <h2 className="text-2xl md:text-4xl font-light tracking-wide text-white mb-12 opacity-90">
          Looks like you've wandered off the path.
        </h2>
        <Link href="/">
          <Button 
            size="lg" 
            variant="primary" 
            className="shadow-[0_0_20px_rgba(255,255,255,0.1)] px-12 tracking-wider bg-white text-black hover:bg-gray-100"
          >
            Return Home →
          </Button>
        </Link>
      </div>
    </div>
  );
}
