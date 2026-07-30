"use client";

import React from "react";
import { CheckCircle2, Loader2, XCircle, ChevronRight, Utensils, Dumbbell, Target } from "lucide-react";
import { motion } from "framer-motion";

export interface ToolExecutionCardProps {
  toolName: string;
  status: "pending" | "success" | "error";
  resultMessage?: string;
  data?: Record<string, any>;
}

export function ToolExecutionCard({ toolName, status, resultMessage, data }: ToolExecutionCardProps) {
  
  const getIcon = () => {
    switch (toolName) {
      case "LogMeal": return <Utensils size={14} className="text-[var(--color-accent-blue)]" />;
      case "UpdateWorkout": return <Dumbbell size={14} className="text-[var(--color-accent-orange)]" />;
      case "UpdateGoal": return <Target size={14} className="text-[var(--color-success)]" />;
      default: return <CheckCircle2 size={14} className="text-[var(--color-text-secondary)]" />;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "pending": return <Loader2 size={14} className="animate-spin text-[var(--color-accent-blue)]" />;
      case "success": return <CheckCircle2 size={14} className="text-[var(--color-success)]" />;
      case "error": return <XCircle size={14} className="text-[var(--color-danger)]" />;
    }
  };

  const getTitle = () => {
    if (status === "pending") return `Executing ${toolName}...`;
    if (status === "error") return `${toolName} Failed`;
    
    switch (toolName) {
      case "LogMeal": return "Meal Logged";
      case "UpdateWorkout": return "Workout Updated";
      case "UpdateGoal": return "Goal Updated";
      case "SavePreference": return "Preference Saved";
      default: return "Action Completed";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="w-full max-w-[85%] rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[var(--color-bg-base)] to-transparent border-b border-[var(--color-glass-border)]">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="text-xs font-bold text-white uppercase tracking-wider">{getTitle()}</span>
        </div>
        {getStatusIcon()}
      </div>

      {/* Body */}
      {status === "success" && data && (
        <div className="p-4 space-y-3">
          {resultMessage && (
            <p className="text-sm text-[var(--color-text-secondary)]">{resultMessage}</p>
          )}
          
          {/* Specific Data Formatting */}
          {toolName === "LogMeal" && data.calories && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--color-accent-orange)]/10 text-[var(--color-accent-orange)] border border-[var(--color-accent-orange)]/20">
                Calories +{data.calories}
              </span>
              <span className="text-xs font-medium px-2 py-1 rounded bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] border border-[var(--color-accent-blue)]/20">
                Protein +{data.protein}g
              </span>
            </div>
          )}

          <button className="text-xs font-bold text-[var(--color-accent-blue)] hover:text-white transition-colors flex items-center gap-1 mt-2">
            View Details <ChevronRight size={12} />
          </button>
        </div>
      )}
      
      {status === "error" && resultMessage && (
        <div className="p-4">
          <p className="text-sm text-[var(--color-danger)]">{resultMessage}</p>
        </div>
      )}
      
      {status === "pending" && (
        <div className="p-4">
          <div className="h-2 w-full bg-[var(--color-bg-base)] rounded-full overflow-hidden">
             <div className="h-full bg-[var(--color-accent-blue)] w-1/3 animate-pulse rounded-full" />
          </div>
        </div>
      )}
    </motion.div>
  );
}
