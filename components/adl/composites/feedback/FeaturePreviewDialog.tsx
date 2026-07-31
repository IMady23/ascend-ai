"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Heading, BodyText, Caption } from "@/components/adl/typography";

export interface FeaturePreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon?: React.ReactNode;
  features: string[];
}

export function FeaturePreviewDialog({
  isOpen,
  onClose,
  title,
  description,
  icon,
  features,
}: FeaturePreviewDialogProps) {
  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent scrolling when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-base/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="relative w-full max-w-md bg-base border border-border-subtle rounded-[var(--radius-2xl)] shadow-[var(--shadow-2xl)] overflow-hidden flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-border-subtle bg-surface">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full text-secondary hover:text-primary hover:bg-[var(--color-bg-glass-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-blue)]"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 pr-8">
                {icon && (
                  <div className="flex items-center justify-center w-10 h-10 rounded-[var(--radius-lg)] bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] shrink-0">
                    {icon}
                  </div>
                )}
                <div>
                  <Heading level="h4" className="text-xl leading-none">{title}</Heading>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <BodyText size="md" className="text-secondary">
                {description}
              </BodyText>
              
              <div className="space-y-3">
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">
                  Why it matters
                </Caption>
                <ul className="space-y-2">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-primary">
                      <span className="text-[var(--color-accent-blue)] mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-surface border-t border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚧</span>
                <span className="text-sm font-medium text-secondary">Under Development</span>
              </div>
              <Caption className="text-[var(--color-text-muted)]">
                Planned for a future release.
              </Caption>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
