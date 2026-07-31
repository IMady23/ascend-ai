"use client";

import { Inter } from "next/font/google";
import { Button } from "@/components/adl/primitives/Button";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="h-full w-full flex items-center justify-center bg-base text-text-primary p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-error, #EF4444)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">System Failure Detected</h2>
            <p className="text-[var(--color-text-secondary, #A1A1AA)] text-sm mb-4">
              A critical fault occurred within the Ascend architecture. Our subroutines have been notified.
            </p>
            <p className="text-xs text-[var(--color-text-muted, #71717A)] font-mono bg-base/50 p-2 rounded border border-border-subtle mb-6">
              {error.message || "Unknown catastrophic error"}
            </p>
          </div>
          <button 
            onClick={() => reset()} 
            className="w-full h-12 rounded-lg bg-surface-elevated text-text-primary border border-border-subtle hover:bg-surface transition-colors"
          >
            Restart Sequence
          </button>
        </div>
      </body>
    </html>
  );
}
