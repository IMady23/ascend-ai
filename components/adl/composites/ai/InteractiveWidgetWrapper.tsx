"use client";

import * as React from "react";
import { cn } from "@/utils/cn";
import { Sparkles } from "lucide-react";

export interface InteractiveWidgetWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function InteractiveWidgetWrapper({ children, className }: InteractiveWidgetWrapperProps) {
  return (
    <div className={cn("flex w-full justify-start mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500", className)}>
      <div className="flex gap-4 w-full max-w-[85%]">
        
        {/* AI Avatar Column */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-accent-indigo)] to-[var(--color-accent-blue)] flex items-center justify-center shrink-0 shadow-lg shadow-[var(--color-accent-indigo)]/20 mt-1">
          <Sparkles size={14} className="text-primary" />
        </div>
        
        {/* Widget Container */}
        <div className="flex-1 min-w-0">
          <div className="bg-transparent rounded-2xl rounded-tl-sm w-full">
            {children}
          </div>
        </div>
        
      </div>
    </div>
  );
}
