"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Activity, Flame, Book, Zap, Plus } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useAiStore } from "@/stores/ai.store";
import { ThinkingIndicator } from "@/components/adl/composites/ai/AI";
import { CoachMessage } from "@/features/ai/components/CoachMessage";
import { Message } from "@/types/conversation";
import { AiStructuredResponse } from "@/types/ai";
import { ConnectionState } from "@/stores/ai.store";

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOAL_LABELS: Record<string, string> = {
  lose_fat: "lose fat",
  gain_muscle: "build muscle",
  maintain: "maintain your fitness",
  recomp: "recompose your body",
};

function getEmptyStateCopy(
  profile: ReturnType<typeof useUserStore.getState>["profile"],
  workoutState: string,
  mealsToday: number,
  hasActiveMealPlan: boolean,
  totalWorkouts: number,
  totalMeals: number
): { greeting: string; subtitle: string } {
  const userName =
    profile?.identity?.nickname || profile?.identity?.fullName?.split(" ")[0] || "Commander";
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const goalLabel = GOAL_LABELS[profile?.goals?.primaryGoal || ""] || "reach your goals";

  const isWorkoutActive = ["warm_up", "in_progress", "paused", "rest_timer", "exercise_transition"].includes(
    workoutState
  );

  if (isWorkoutActive) {
    return {
      greeting: `Keep pushing, ${userName}`,
      subtitle: "You're in the middle of a session. Ask me about form, rest timing, or what's next.",
    };
  }

  if (totalWorkouts === 0 && totalMeals === 0) {
    return {
      greeting: `${timeGreeting}, ${userName}`,
      subtitle: `I'm your coach — here to help you ${goalLabel}. Let's start with your first workout or meal log. What would you like to tackle first?`,
    };
  }

  if (mealsToday === 0 && totalMeals > 0) {
    return {
      greeting: `${timeGreeting}, ${userName}`,
      subtitle: `You haven't logged any meals today. Your target is ${profile?.targets?.dailyCalories || 2000} kcal — want help planning what to eat?`,
    };
  }

  if (hasActiveMealPlan) {
    return {
      greeting: `${timeGreeting}, ${userName}`,
      subtitle: `You have an active meal plan. I can help you stay on track today or adjust based on how you're feeling.`,
    };
  }

  return {
    greeting: `${timeGreeting}, ${userName}`,
    subtitle: `Ready to keep moving toward your goal to ${goalLabel}. What's on your mind today?`,
  };
}

export function AICoachDrawer({ isOpen, onClose }: AICoachDrawerProps) {
  const { profile } = useUserStore();
  const { workoutState, activities } = useActivityStore();
  const { meals, mealPlans } = useNutritionStore();

  const {
    conversations,
    activeConversationId,
    sendMessage,
    createNewConversation,
    loadConversation,
    connectionState,
    connectionError,
    initializeConnection,
    lastAiMeta
  } = useAiStore();

  const activeConversation = conversations.find((c) => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeMode, setActiveMode] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const modes = [
    { id: "nutrition", icon: <Flame size={12} />, label: "Nutrition" },
    { id: "workout", icon: <Activity size={12} />, label: "Workout" },
    { id: "recovery", icon: <Zap size={12} />, label: "Recovery" },
    { id: "knowledge", icon: <Book size={12} />, label: "Knowledge" },
  ];

  const suggestedPrompts = [
    "Build today's workout",
    "What should I eat today?",
    "How am I progressing?",
  ];

  const todayStr = new Date().toISOString().split("T")[0];
  const mealsToday = meals.filter((m) => new Date(m.date).toISOString().split("T")[0] === todayStr).length;
  const hasActiveMealPlan = mealPlans.some((p) => p.status === "active");
  const emptyState = getEmptyStateCopy(
    profile,
    workoutState,
    mealsToday,
    hasActiveMealPlan,
    activities.length,
    meals.length
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && connectionState !== "ready") {
      initializeConnection();
    }
  }, [isOpen, connectionState, initializeConnection]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = text.trim();
    setInput("");
    setIsTyping(true);

    try {
      await sendMessage(userMsg, "user", activeMode);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const renderAssistantMessage = (msg: Message) => {
    const structured = msg.toolExecutions?.[0] as AiStructuredResponse | undefined;
    if (structured?.summary) {
      return <CoachMessage response={structured} fallbackContent={msg.content} />;
    }
    return <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-base/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full md:w-[400px] lg:w-[450px] bg-surface border-l border-border-subtle shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-subtle bg-gradient-to-br from-[var(--color-bg-glass-standard)] to-[var(--color-bg-base)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-[var(--color-accent-blue)]" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-primary">Ascend AI</h2>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--color-success)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]"></span>
                    </span>
                    Coach Online
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => createNewConversation()}
                  className="p-2 text-secondary hover:text-primary transition-colors hover:bg-[var(--color-bg-surface-hover)] rounded-lg text-xs font-medium flex items-center gap-1 border border-border-subtle"
                >
                  <Plus size={14} /> New
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-secondary hover:text-primary transition-colors hover:bg-[var(--color-bg-surface-hover)] rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {conversations.length > 1 && (
              <div className="px-4 py-2 border-b border-border-subtle bg-base overflow-x-auto no-scrollbar flex gap-2">
                {conversations.slice(0, 5).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => loadConversation(c.id)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border max-w-[120px] truncate ${
                      activeConversationId === c.id
                        ? "bg-[var(--color-accent-blue)]/20 border-[var(--color-accent-blue)]/50 text-primary"
                        : "bg-surface border-border-subtle text-secondary hover:text-primary"
                    }`}
                  >
                    {c.title}
                  </button>
                ))}
              </div>
            )}

            {/* Mode Selector */}
            <div className="px-4 py-2 border-b border-border-subtle bg-base overflow-x-auto no-scrollbar">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveMode(null)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    activeMode === null
                      ? "bg-[var(--color-accent-blue)]/20 border-[var(--color-accent-blue)]/50 text-primary"
                      : "bg-surface border-border-subtle text-secondary hover:text-primary"
                  }`}
                >
                  General
                </button>
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode.id)}
                    className={`flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                      activeMode === mode.id
                        ? "bg-[var(--color-accent-blue)]/20 border-[var(--color-accent-blue)]/50 text-primary"
                        : "bg-surface border-border-subtle text-secondary hover:text-primary"
                    }`}
                  >
                    {mode.icon} {mode.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area or Connection State */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {connectionState !== "ready" ? (
                 <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-6">
                    {connectionState === "connecting" && (
                       <>
                         <div className="w-12 h-12 rounded-full border-4 border-border-subtle border-t-[var(--color-accent-blue)] animate-spin" />
                         <p className="text-secondary text-sm">Connecting to AI Services...</p>
                       </>
                    )}
                    {connectionState === "authenticating" && (
                       <>
                         <div className="w-12 h-12 rounded-full border-4 border-border-subtle border-t-[var(--color-accent-blue)] animate-spin" />
                         <p className="text-secondary text-sm">Authenticating Profile...</p>
                       </>
                    )}
                    {connectionState === "loading_context" && (
                       <>
                         <div className="w-12 h-12 rounded-full border-4 border-border-subtle border-t-[var(--color-accent-blue)] animate-spin" />
                         <p className="text-secondary text-sm">Loading Coach Context...</p>
                       </>
                    )}
                    {connectionState === "offline_error" && (
                       <div className="flex flex-col items-center gap-4">
                         <div className="w-12 h-12 rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center">
                           <Activity size={24} className="text-[var(--color-danger)]" />
                         </div>
                         <h3 className="text-primary font-bold text-lg">Connection Failed</h3>
                         <p className="text-secondary text-sm leading-relaxed max-w-[250px]">{connectionError}</p>
                         <button 
                           onClick={() => initializeConnection()}
                           className="mt-4 px-6 py-2 bg-[var(--color-accent-blue)] text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                         >
                           Retry Connection
                         </button>
                       </div>
                    )}
                 </div>
              ) : (
                <>
                  {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent-blue)]/20 to-[var(--color-accent-indigo)]/20 border border-[var(--color-accent-blue)]/30 flex items-center justify-center">
                    <Sparkles size={32} className="text-[var(--color-accent-blue)]" />
                  </div>

                  <div className="space-y-2 max-w-[300px]">
                    <h3 className="text-xl font-bold text-primary">{emptyState.greeting}</h3>
                    <p className="text-sm text-secondary leading-relaxed">
                      {emptyState.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-col w-full max-w-[250px] gap-2 pt-4">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="text-sm p-3 rounded-xl border border-border-subtle bg-surface hover:bg-[var(--color-bg-surface-hover)] hover:border-[var(--color-accent-blue)]/50 transition-all text-left text-secondary hover:text-primary"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg: Message) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center mt-1">
                      <Sparkles size={14} className="text-[var(--color-accent-blue)]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-[var(--color-accent-blue)] text-white"
                        : "bg-surface border border-border-subtle text-primary"
                    }`}
                  >
                    {msg.role === "assistant" ? renderAssistantMessage(msg) : msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 flex-shrink-0 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center mt-1">
                    <Sparkles size={14} className="text-[var(--color-accent-blue)]" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl px-4 py-4 bg-surface border border-border-subtle flex items-center">
                    <ThinkingIndicator size="sm" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border-subtle bg-base">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend(input);
                  }}
                  placeholder="Ask your coach..."
                  className="w-full bg-surface border border-border-subtle rounded-xl py-3 pl-4 pr-12 text-sm text-primary placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 p-1.5 rounded-lg bg-[var(--color-accent-blue)] text-primary disabled:opacity-50 disabled:bg-[var(--color-bg-surface-hover)] transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-[10px] text-center mt-2 text-[var(--color-text-muted)]">
                Ascend AI coaches from your real data. It never invents metrics.
              </div>
              
              {process.env.NODE_ENV === 'development' && lastAiMeta && (
                <div className="mt-4 p-3 bg-black/5 border border-[var(--color-accent-blue)]/30 rounded-lg font-mono text-xs text-secondary">
                  <div className="font-bold text-primary mb-2 flex items-center justify-between">
                    <span>AI Status</span>
                    <span className="text-[10px] bg-[var(--color-success)] text-white px-2 py-0.5 rounded-full">LIVE</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between"><span>Provider:</span> <span className="text-primary">{lastAiMeta.provider || "Gemini"}</span></div>
                    <div className="flex justify-between"><span>Latency:</span> <span className="text-primary">{lastAiMeta.responseTime}ms</span></div>
                    <div className="flex justify-between"><span>Context Size:</span> <span className="text-primary">{lastAiMeta.contextSize || 11} Modules</span></div>
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)] mt-2 italic">
                    Not for normal users. Just useful for debugging.
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
