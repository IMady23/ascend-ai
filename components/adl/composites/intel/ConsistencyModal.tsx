"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { useIntelligenceStore } from "@/stores/intelligence.store";

interface ConsistencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConsistencyModal({ isOpen, onClose }: ConsistencyModalProps) {
  const { consistencyBreakdown } = useIntelligenceStore();

  if (!consistencyBreakdown) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-base/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:w-full max-w-md bg-base border border-border-subtle rounded-[var(--radius-2xl)] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-gradient-to-br from-[var(--color-accent-orange)]/10 to-transparent">
              <div>
                <Heading level="h2" className="text-xl">Consistency Score</Heading>
                <Caption className="text-secondary">Your adherence breakdown.</Caption>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-surface text-[var(--color-text-muted)] hover:text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              {/* Score Headline */}
              <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-border-subtle">
                <div>
                  <Caption className="text-[var(--color-text-muted)] uppercase tracking-widest font-semibold mb-1">Current Score</Caption>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">{consistencyBreakdown.currentScore}%</span>
                    {consistencyBreakdown.trend30Day === "up" && <TrendingUp size={20} className="text-[var(--color-success)]" />}
                    {consistencyBreakdown.trend30Day === "down" && <TrendingDown size={20} className="text-[var(--color-error)]" />}
                    {consistencyBreakdown.trend30Day === "stable" && <Minus size={20} className="text-secondary" />}
                  </div>
                </div>
                <div className="text-right">
                  <Caption className="text-[var(--color-text-muted)] uppercase tracking-widest font-semibold mb-1">Previous Score</Caption>
                  <span className="text-2xl font-bold text-secondary">{consistencyBreakdown.previousScore}%</span>
                </div>
              </div>

              {/* Component Breakdown */}
              <div>
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-widest font-semibold mb-3">Weighted Breakdown</Caption>
                <div className="space-y-3">
                  <BreakdownRow label="Training Adherence" value={consistencyBreakdown.breakdown.training} />
                  <BreakdownRow label="Nutrition Targets" value={consistencyBreakdown.breakdown.nutrition} />
                  <BreakdownRow label="Recovery & Sleep" value={consistencyBreakdown.breakdown.recovery} />
                  <BreakdownRow label="Hydration" value={consistencyBreakdown.breakdown.hydration} />
                </div>
              </div>

              {/* Insights */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-xl border border-[var(--color-success)]/30 bg-[var(--color-success)]/5">
                  <Caption className="text-[var(--color-success)] uppercase tracking-widest font-semibold mb-1">Biggest Contributor</Caption>
                  <BodyText size="sm" className="text-primary">{consistencyBreakdown.biggestPositive}</BodyText>
                </div>
                <div className="p-4 rounded-xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/5">
                  <Caption className="text-[var(--color-error)] uppercase tracking-widest font-semibold mb-1">Needs Attention</Caption>
                  <BodyText size="sm" className="text-primary">{consistencyBreakdown.biggestNegative}</BodyText>
                </div>
              </div>

              {/* How to improve */}
              <div className="p-4 rounded-xl border border-border-subtle bg-surface flex gap-3">
                <Info className="text-[var(--color-accent-blue)] shrink-0 mt-0.5" size={18} />
                <div>
                  <Caption className="text-secondary font-bold mb-1">How to Improve</Caption>
                  <BodyText size="sm" className="text-secondary">{consistencyBreakdown.howToImprove}</BodyText>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function BreakdownRow({ label, value }: { label: string, value: number }) {
  const color = value >= 80 ? "var(--color-success)" : value >= 50 ? "var(--color-warning)" : "var(--color-error)";
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-primary">{label}</span>
      <div className="flex items-center gap-3 w-1/2">
        <div className="flex-1 h-2 rounded-full bg-surface overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
        </div>
        <span className="text-sm font-bold w-8 text-right" style={{ color }}>{value}%</span>
      </div>
    </div>
  );
}
