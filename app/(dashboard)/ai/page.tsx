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

import { useUserStore } from "@/stores/user.store";
import { useTimelineStore } from "@/stores/timeline.store";
import { useIntelligenceStore } from "@/stores/intelligence.store";

export default function AICommandModule() {
  const [messages, setMessages] = React.useState<any[]>([]);
  const { profile } = useUserStore();
  const { events, fetchInitialEvents } = useTimelineStore();
  const { latestInsights } = useIntelligenceStore();

  React.useEffect(() => {
    fetchInitialEvents();
  }, [fetchInitialEvents]);
  
  const coachState = React.useMemo(() => buildCoachState({
    profile: profile || { nickname: "Guest", name: "Guest User" },
    workoutCount: 0,
    mealCount: 0,
    hasActiveMealPlan: false,
    completedWorkoutToday: false,
  }), [profile]);
  
  // Set Page Accent
  React.useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", "var(--color-accent-ai, #06B6D4)");
    return () => document.documentElement.style.setProperty("--current-accent", "var(--color-accent-dashboard, #3B82F6)");
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
    <PageContainer className="max-w-5xl mx-auto px-4 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-6rem)] md:pb-0 pb-16">
        
        {/* LEFT COLUMN: Memory Core Sidebar */}
        <div className="hidden lg:flex flex-col col-span-1 gap-6 overflow-y-auto pr-2 custom-scrollbar">
          
          <WidgetSection title="Coach Memory">
            <GlassCard className="p-4 space-y-4 bg-bg-base">
              
              <div>
                <Caption className="text-text-disabled uppercase tracking-wider mb-2 font-semibold">Active Goals</Caption>
                <div className="flex flex-wrap gap-2">
                  {profile?.preferences?.goals && Object.entries(profile.preferences.goals).map(([key, value]) => (
                    value ? <MemoryChip key={key} label={`${key}: ${value}`} category="goal" /> : null
                  ))}
                  {(!profile?.preferences?.goals || Object.values(profile.preferences.goals).every(v => !v)) && (
                    <MemoryChip label="No goals set" category="goal" />
                  )}
                </div>
              </div>

              <div>
                <Caption className="text-text-disabled uppercase tracking-wider mb-2 font-semibold">Preferences</Caption>
                <div className="flex flex-wrap gap-2">
                  {profile?.preferences?.diet && <MemoryChip label={profile.preferences.diet} category="preference" />}
                  {profile?.preferences?.activity && <MemoryChip label={profile.preferences.activity} category="preference" />}
                  {!profile?.preferences?.diet && !profile?.preferences?.activity && (
                    <MemoryChip label="No preferences set" category="preference" />
                  )}
                </div>
              </div>

            </GlassCard>
          </WidgetSection>

          <WidgetSection title="Personal Timeline">
            <GlassCard className="p-4 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
              {events.length > 0 ? (
                events.map((item, index) => (
                  <div key={item.id || index} className="flex items-start gap-3 relative">
                    {index < events.length - 1 && <div className="absolute left-3 top-6 bottom-[-20px] w-px bg-border" />}
                    <div className="p-1.5 rounded-full bg-accent-ai/10 text-accent-ai shrink-0 z-10 relative mt-1">
                      <BrainCircuit size={14} />
                    </div>
                    <div>
                      <BodyText size="sm" className="font-semibold text-text-primary">{item.title}</BodyText>
                      <Caption className="text-text-secondary text-xs line-clamp-1">{item.description}</Caption>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border p-3 text-sm text-text-secondary">
                  Complete your first week to start building your timeline.
                </div>
              )}
            </GlassCard>
          </WidgetSection>
          
          <WidgetSection title="Decision Log">
            <GlassCard className="p-4 border-accent-ai/20 bg-accent-ai/5">
              <Caption className="text-text-disabled uppercase tracking-wider mb-2 font-semibold">Recent Recommendation</Caption>
              <BodyText size="sm" className="font-medium text-text-primary mb-2">
                {latestInsights.length > 0 ? latestInsights[0].explanation : "Start with one workout or meal log to generate your first coach recommendation."}
              </BodyText>
            </GlassCard>
          </WidgetSection>

        </div>

        {/* RIGHT COLUMN: Chat Canvas */}
        <div className="col-span-1 lg:col-span-3 flex flex-col h-full bg-bg-base/30 rounded-2xl border border-border overflow-hidden relative shadow-lg">
          
          {/* Chat Header */}
          <div className="h-14 border-b border-border bg-bg-surface-elevated/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
            <div className="flex items-center gap-3">
              <BrainCircuit className="text-accent-ai" size={20} />
              <Heading level="h3" className="text-base font-semibold">Ascend Intelligence</Heading>
              <Badge variant="outline" className="border-success text-success text-[9px] px-1.5 py-0">Online</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary">
                <History size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-text-secondary">
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
          <div className="p-4 bg-gradient-to-t from-bg-surface to-transparent shrink-0">
            <Omnibar onSend={handleSend} placeholder={coachState.prompt} />
            <div className="flex justify-center gap-4 mt-3 flex-wrap">
              <Caption className="text-[10px] text-text-secondary hover:text-accent-ai cursor-pointer transition-colors">
                "Suggest a high-protein Indian breakfast"
              </Caption>
              <Caption className="text-[10px] text-text-secondary hover:text-accent-ai cursor-pointer transition-colors">
                "Why am I plateauing on Bench Press?"
              </Caption>
              <Caption className="text-[10px] text-text-secondary hover:text-accent-ai cursor-pointer transition-colors">
                "Log 500ml water"
              </Caption>
            </div>
          </div>

        </div>

      </div>
    </PageContainer>
  );
}
