"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BrainCircuit, MessageSquare, TrendingUp, TrendingDown, Target, Activity, CheckCircle, Search } from "lucide-react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { useIntelligenceStore } from "@/stores/intelligence.store";
import { IntelligenceService } from "@/services/intelligence/intelligence.service";
import { cn } from "@/utils/cn";
import { useRouter } from "next/navigation";

interface ActiveInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ActiveInsightModal({ isOpen, onClose }: ActiveInsightModalProps) {
  const { activeInsightData, consistencyBreakdown, trendCategory, timeFilter } = useIntelligenceStore();
  const router = useRouter();

  if (!activeInsightData) return null;

  const handleAskCoach = () => {
    // Note: We use a query parameter to open the coach in reality, or dispatch an event.
    // For V1, routing to a coach chat with context, or opening the drawer.
    const context = IntelligenceService.buildAIContext(
      trendCategory,
      timeFilter,
      activeInsightData,
      consistencyBreakdown!
    );
    
    // Dispatch a custom event to open the AI Coach Drawer with context
    window.dispatchEvent(new CustomEvent('open-ai-coach', { detail: { context } }));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:w-full max-w-2xl bg-[var(--color-bg-base)] border border-[var(--color-glass-border)] rounded-[var(--radius-2xl)] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-glass-border)] bg-gradient-to-br from-[var(--color-accent-indigo)]/10 to-transparent">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-accent-indigo)]/20 flex items-center justify-center shrink-0">
                  <BrainCircuit className="text-[var(--color-accent-indigo)]" size={24} />
                </div>
                <div>
                  <Caption className="text-[var(--color-accent-indigo)] font-bold mb-1">{activeInsightData.category}</Caption>
                  <Heading level="h2" className="text-xl">{activeInsightData.title}</Heading>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6">
              
              <div className="bg-[var(--color-bg-surface)] p-4 rounded-xl border border-[var(--color-glass-border)]">
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-widest font-semibold mb-2">Executive Summary</Caption>
                <BodyText className="text-white">{activeInsightData.description}</BodyText>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnalysisCard icon={<Activity size={18} />} title="Training Load" content={activeInsightData.trainingLoadAnalysis} color="var(--color-accent-blue)" />
                <AnalysisCard icon={<TrendingUp size={18} />} title="Recovery" content={activeInsightData.recoveryAnalysis} color="var(--color-accent-green)" />
                <AnalysisCard icon={<Target size={18} />} title="Nutrition" content={activeInsightData.nutritionAnalysis} color="var(--color-accent-orange)" />
                <AnalysisCard icon={<Search size={18} />} title="Sleep Impact" content={activeInsightData.sleepAnalysis} color="var(--color-accent-purple)" />
              </div>

              <div className="bg-[var(--color-bg-surface)] p-4 rounded-xl border border-[var(--color-glass-border)]">
                <div className="flex justify-between items-center mb-4">
                  <Caption className="text-[var(--color-text-muted)] uppercase tracking-widest font-semibold">Recommended Actions</Caption>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-text-secondary)]">Confidence</span>
                    <span className={cn("text-sm font-bold", (activeInsightData.confidenceScore || 0) < 50 ? "text-[var(--color-warning)]" : "text-[var(--color-success)]")}>
                      {(activeInsightData.confidenceScore || 0) < 50 ? "Low" : "High"} {activeInsightData.confidenceScore}%
                    </span>
                  </div>
                </div>
                <ul className="space-y-3">
                  {activeInsightData.recommendedActions?.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-[var(--color-success)] shrink-0 mt-0.5" />
                      <BodyText size="sm" className="text-[var(--color-text-secondary)]">{action}</BodyText>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Footer CTA */}
            <div className="p-4 bg-[var(--color-bg-surface)] border-t border-[var(--color-glass-border)] flex items-center justify-between">
              <Caption className="text-[var(--color-text-muted)]">Generated by Ascend Intelligence</Caption>
              <Button onClick={handleAskCoach} variant="primary" leftIcon={<MessageSquare size={16} />}>
                Ask Coach About This Insight
              </Button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function AnalysisCard({ icon, title, content, color }: any) {
  if (!content) return null;
  return (
    <div className="p-4 rounded-xl border border-[var(--color-glass-border)] bg-[var(--color-bg-base)]">
      <div className="flex items-center gap-2 mb-2" style={{ color }}>
        {icon}
        <span className="font-semibold text-sm">{title}</span>
      </div>
      <BodyText size="sm" className="text-[var(--color-text-secondary)]">{content}</BodyText>
    </div>
  );
}
