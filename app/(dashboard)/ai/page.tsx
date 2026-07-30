"use client";

import * as React from "react";
import { 
  MessageSquare, 
  Settings, 
  History, 
  BrainCircuit, 
  Target,
  Trophy,
  Dumbbell
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { DashboardLayout, WidgetSection } from "@/components/adl/layout/Layouts";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Badge } from "@/components/adl/primitives/Badge";

import { AIChatBubble } from "@/components/adl/composites/ai/AIChatBubble";
import { UserChatBubble } from "@/components/adl/composites/ai/UserChatBubble";
import { Omnibar } from "@/components/adl/composites/ai/Omnibar";
import { MemoryChip } from "@/components/adl/composites/ai/MemoryChip";
import { InteractiveWidgetWrapper } from "@/components/adl/composites/ai/InteractiveWidgetWrapper";

import { WorkoutSessionCard } from "@/components/adl/composites/training/WorkoutSessionCard";
import { buildCoachState } from "@/lib/ai/coach-state";
import { aiService } from "@/services/ai/ai.service";
import { formatCoachMessage } from "@/services/ai/format-coach-response";

export default function AICommandModule() {
  const [messages, setMessages] = React.useState<any[]>([]);
  const coachState = React.useMemo(() => buildCoachState({
    profile: { nickname: "Madhav", name: "Madhav Patel" },
    workoutCount: 0,
    mealCount: 0,
    hasActiveMealPlan: false,
    completedWorkoutToday: false,
  }), []);
  
  // Set Page Accent
  React.useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", "var(--color-accent-indigo)");
  }, []);

  const handleSend = async (msg: string) => {
    setMessages(prev => [...prev, { type: "user", content: msg }]);
    
    // Generate contextual response based on user message using the real AiService
    const response = await aiService.getCoachingResponse(coachState, msg, messages);
    
    const aiResponse = response 
      ? formatCoachMessage(response) 
      : "I'm having trouble connecting to my database right now. Give me a second.";
    
    setMessages(prev => [...prev, { 
      type: "ai", 
      content: aiResponse,
      confidence: response?.confidence || coachState.confidence,
      widget: response?.widgets?.[0]?.component || undefined,
      insight: response?.widgets?.[0]?.data || undefined,
    }]);
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-6rem)]">
        
        {/* LEFT COLUMN: Memory Core Sidebar */}
        <div className="hidden lg:flex flex-col col-span-1 gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          <WidgetSection title="Coach Memory">
            <GlassCard className="p-4 space-y-4 bg-[var(--color-bg-base)]">
              
              <div>
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-semibold">Active Goals</Caption>
                <div className="flex flex-wrap gap-2">
                  <MemoryChip label="Body Recomposition" category="goal" />
                  <MemoryChip label="100kg Bench Press" category="goal" />
                </div>
              </div>

              <div>
                <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-semibold">Preferences</Caption>
                <div className="flex flex-wrap gap-2">
                  <MemoryChip label="Indian Breakfasts" category="preference" />
                  <MemoryChip label="No Split Squats" category="preference" />
                  <MemoryChip label="Morning Workouts" category="preference" />
                </div>
              </div>

            </GlassCard>
          </WidgetSection>

          <WidgetSection title="Personal Timeline">
            <GlassCard className="p-4 space-y-4">
              {coachState.timelineItems.length > 0 ? (
                coachState.timelineItems.map((item, index) => (
                  <div key={item.title} className="flex items-start gap-3 relative">
                    {index < coachState.timelineItems.length - 1 && <div className="absolute left-3 top-6 bottom-[-20px] w-px bg-[var(--color-glass-border)]" />}
                    <div className="p-1.5 rounded-full bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] shrink-0 z-10 relative mt-1">
                      <BrainCircuit size={14} />
                    </div>
                    <div>
                      <BodyText size="sm" className="font-semibold text-[var(--color-text-primary)]">{item.title}</BodyText>
                      <Caption className="text-[var(--color-text-secondary)] text-xs line-clamp-1">{item.detail}</Caption>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-[var(--color-glass-border)] p-3 text-sm text-[var(--color-text-secondary)]">
                  Complete your first week to start building your timeline.
                </div>
              )}
            </GlassCard>
          </WidgetSection>
          
          <WidgetSection title="Decision Log">
            <GlassCard className="p-4 border-[var(--color-accent-indigo)]/10 bg-[var(--color-accent-indigo)]/5">
              <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-2 font-semibold">Recent Recommendation</Caption>
              <BodyText size="sm" className="font-medium text-[var(--color-text-primary)] mb-2">
                {coachState.timelineItems.length > 0 ? "The coach will surface real recommendations here as you log more data." : "Start with one workout or meal log to generate your first coach recommendation."}
              </BodyText>
            </GlassCard>
          </WidgetSection>

        </div>

        {/* RIGHT COLUMN: Chat Canvas */}
        <div className="col-span-1 lg:col-span-3 flex flex-col h-full bg-[var(--color-bg-base)]/30 rounded-2xl border border-[var(--color-glass-border)] overflow-hidden relative shadow-lg">
          
          {/* Chat Header */}
          <div className="h-14 border-b border-[var(--color-glass-border)] bg-[var(--color-bg-surface)]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-[var(--color-accent-indigo)]" size={20} />
              <Heading level="h3" className="text-base font-semibold">Ascend Intelligence</Heading>
              <Badge variant="outline" className="border-[var(--color-success)] text-[var(--color-success)] text-[9px] px-1.5 py-0">Online</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--color-text-muted)]">
                <History size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-[var(--color-text-muted)]">
                <Settings size={16} />
              </Button>
            </div>
          </div>

          {/* Chat Stream Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
            
            <AIChatBubble 
              content={`${coachState.greeting}\n\n${coachState.subtitle}\n\n${coachState.prompt}`}
              confidence={coachState.confidence}
            />

            {messages.map((msg, i) => (
              <React.Fragment key={i}>
                {msg.type === "user" ? (
                  <UserChatBubble content={msg.content} />
                ) : (
                  <>
                    <AIChatBubble 
                      content={msg.content}
                      confidence={msg.confidence}
                    />
                    {msg.widget === "workout" && msg.insight?.actions && msg.insight.actions.length > 0 && (
                      <InteractiveWidgetWrapper>
                        <div className="flex flex-wrap gap-2">
                          {msg.insight.actions.map((action: { label: string; hint: string }) => (
                            <Button key={action.label} size="sm" variant="secondary" className="text-xs">
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </InteractiveWidgetWrapper>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Omnibar Input Area */}
          <div className="p-4 bg-gradient-to-t from-[var(--color-bg-surface)] to-transparent shrink-0">
            <Omnibar onSend={handleSend} placeholder={coachState.prompt} />
            <div className="flex justify-center gap-4 mt-3">
              <Caption className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-accent-indigo)] cursor-pointer transition-colors">
                "Suggest a high-protein Indian breakfast"
              </Caption>
              <Caption className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-accent-indigo)] cursor-pointer transition-colors">
                "Why am I plateauing on Bench Press?"
              </Caption>
              <Caption className="text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-accent-indigo)] cursor-pointer transition-colors">
                "Log 500ml water"
              </Caption>
            </div>
          </div>

        </div>

      </div>
    </PageContainer>
  );
}
