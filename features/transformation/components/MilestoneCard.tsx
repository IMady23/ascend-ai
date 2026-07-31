"use client";

import { Milestone } from "../types";
import { Lock, Play, Check } from "lucide-react";

interface MilestoneCardProps {
  milestone: Milestone;
}

export function MilestoneCard({ milestone }: MilestoneCardProps) {
  const isLocked = milestone.status === "locked";
  const isActive = milestone.status === "active";
  const isCompleted = milestone.status === "completed";

  return (
    <div 
      className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full ${
        isCompleted 
          ? "bg-emerald-950/20 border-emerald-900/50" 
          : isActive 
          ? "bg-surface border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]" 
          : "bg-base border-border-subtle/50 opacity-60 grayscale-[50%]"
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-lg ${
          isCompleted ? "bg-emerald-500/20 text-emerald-400" :
          isActive ? "bg-indigo-500/20 text-indigo-400" :
          "bg-surface-elevated text-secondary"
        }`}>
          {isCompleted && <Check size={18} />}
          {isActive && <Play size={18} />}
          {isLocked && <Lock size={18} />}
        </div>
        
        <span className={`text-xs font-bold uppercase tracking-wider ${
          isCompleted ? "text-emerald-500" :
          isActive ? "text-indigo-400" :
          "text-disabled"
        }`}>
          {milestone.status}
        </span>
      </div>

      <h3 className={`font-semibold text-lg mb-2 ${isLocked ? "text-secondary" : "text-primary"}`}>
        {milestone.title}
      </h3>
      
      <p className="text-sm text-secondary flex-grow mb-6">
        {milestone.description}
      </p>

      {!isLocked && (
        <div className="mt-auto">
          <div className="flex justify-between text-xs font-medium text-secondary mb-2">
            <span>Progress</span>
            <span>{milestone.progress}%</span>
          </div>
          <div className="w-full bg-surface-elevated rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full rounded-full ${isCompleted ? "bg-emerald-500" : "bg-indigo-500"}`}
              style={{ width: `${milestone.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
