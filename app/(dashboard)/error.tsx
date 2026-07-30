"use client";

import React, { useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { Heading, BodyText } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error boundary caught:", error);
  }, [error]);

  return (
    <PageContainer className="flex items-center justify-center p-4 h-full min-h-[60vh]">
      <div className="w-full max-w-md bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] rounded-[var(--radius-xl)] p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Subtle red ambient glow */}
        <div className="absolute inset-0 bg-red-500/5 mix-blend-screen pointer-events-none" />
        
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="text-red-400 w-8 h-8" />
        </div>
        
        <Heading level="h3" className="mb-2">Module Failure</Heading>
        <BodyText className="text-[var(--color-text-secondary)] mb-8">
          The intelligence subsystem encountered an unexpected fault while rendering this view.
        </BodyText>
        
        <Button 
          variant="primary" 
          fullWidth 
          onClick={() => reset()}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Initialize Retry
        </Button>
      </div>
    </PageContainer>
  );
}
