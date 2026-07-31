"use client";

import { CheckSquare, Utensils, Calendar, Target, Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import { useAiStore } from "@/stores/ai.store";
import { aiService } from "@/services/ai/ai.service";
import { useState } from "react";
import { useActivityStore } from "@/stores/activity.store";

export function SuggestedActions() {
  const { userId, profile } = useUserStore();
  const { sendMessage } = useAiStore();
  const { activities } = useActivityStore();
  const [processingIndex, setProcessingIndex] = useState<number | null>(null);

  // Dynamic actions based on context
  const todayStr = new Date().toISOString().split("T")[0];
  const workoutToday = activities.some(w => {
    const d = w.date.toDate ? w.date.toDate() : new Date(w.date as any);
    return d.toISOString().split("T")[0] === todayStr;
  });

  const actions = [
    { 
      label: "Review Progress", 
      icon: CheckSquare, 
      desc: "Analyze today's output",
      prompt: "Analyze my progress for today and summarize my performance."
    },
    { 
      label: "Nutrition Check", 
      icon: Utensils, 
      desc: "Evaluate macro balance",
      prompt: "Am I eating enough protein based on today's logged meals?"
    },
    { 
      label: workoutToday ? "Recovery Plan" : "Workout Coach", 
      icon: Calendar, 
      desc: workoutToday ? "Optimize your recovery" : "Recommend a workout",
      prompt: workoutToday 
        ? "I already worked out today. What should my recovery protocol be?" 
        : "What workout should I do today based on my recent training history?"
    },
    { 
      label: "Weekly Debrief", 
      icon: Target, 
      desc: "Summarize performance",
      prompt: "Give me a weekly debrief on my consistency and progress."
    },
  ];

  const handleActionClick = async (prompt: string, index: number) => {
    if (!userId || processingIndex !== null) return;
    
    setProcessingIndex(index);
    try {
      await sendMessage(prompt, "user");
    } catch (error) {
      console.error("Failed to send suggested action:", error);
    } finally {
      setProcessingIndex(null);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-bold text-primary mb-6 px-1">Suggested Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, i) => {
          const Icon = action.icon;
          const isProcessing = processingIndex === i;
          
          return (
            <button 
              key={i} 
              onClick={() => handleActionClick(action.prompt, i)}
              disabled={processingIndex !== null}
              className="bg-surface border border-border-subtle rounded-2xl p-5 flex flex-col items-start gap-4 transition-transform hover:-translate-y-1 hover:border-violet-500/50 hover:bg-surface-elevated/80 duration-300 group text-left disabled:opacity-50 disabled:hover:translate-y-0"
            >
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Icon size={20} />}
              </div>
              <div>
                <p className="text-sm font-bold text-primary group-hover:text-violet-400 transition-colors">{action.label}</p>
                <p className="text-secondary text-xs mt-1 leading-tight">{action.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
