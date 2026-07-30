"use client";

import * as React from "react";
import { 
  Camera, 
  Target, 
  Activity, 
  Sparkles, 
  Heart, 
  TrendingUp, 
  BrainCircuit,
  Droplets,
  Ruler,
  CalendarDays
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { DashboardLayout, HeroSection, WidgetSection } from "@/components/adl/layout/Layouts";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Badge } from "@/components/adl/primitives/Badge";
import { Button } from "@/components/adl/primitives/Button";

import { PhotoComparisonSlider } from "@/components/adl/composites/transformation/PhotoComparisonSlider";
import { HealthScoreRing } from "@/components/adl/composites/transformation/HealthScoreRing";
import { HolisticJourneyCard } from "@/components/adl/composites/transformation/HolisticJourneyCard";
import { WeightTrendCard } from "@/components/adl/composites/transformation/WeightTrendCard";
import { JourneyTimeline } from "@/components/adl/composites/progress/JourneyTimeline";

import { EmptyState } from "@/components/adl/composites/feedback/EmptyState";
import { useUserStore } from "@/stores/user.store";
import { useProgressStore } from "@/stores/progress.store";
import { useDataReadiness } from "@/hooks/useDataReadiness";

export default function TransformationModule() {
  const { profile, isLoading: isUserLoading } = useUserStore();
  const { photos, isLoading: isProgressLoading } = useProgressStore() as any;

  const readiness = useDataReadiness();
  const isLoading = isUserLoading || isProgressLoading;
  
  // Set Page Accent
  React.useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", "var(--color-accent-pink)");
    return () => document.documentElement.style.setProperty("--current-accent", "var(--color-accent-blue)");
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <DashboardLayout>
          <div className="lg:col-span-3 space-y-6 flex items-center justify-center min-h-[50vh]">
             <div className="animate-pulse flex flex-col items-center gap-4">
               <div className="w-12 h-12 rounded-full border-4 border-[var(--color-glass-border)] border-t-[var(--color-accent-pink)] animate-spin" />
               <Caption className="text-[var(--color-text-muted)]">Syncing Repositories...</Caption>
             </div>
          </div>
        </DashboardLayout>
      </PageContainer>
    );
  }

  const currentWeight = profile?.identity?.weight || 0;
  const targetWeight = (profile?.goals as any)?.targetWeight || 0;
  const startWeight = profile?.identity?.weight || 0; // TODO: Use historical tracking

  const hasData = readiness.transformation.status === "ready";

  return (
    <PageContainer>
      <DashboardLayout>
        
        {/* TOP HERO ZONE */}
        <div className="lg:col-span-3 space-y-6">
          <HeroSection className="bg-gradient-to-br from-[var(--color-bg-base)] via-[var(--color-bg-surface)] to-[var(--color-accent-pink)]/5">
            <div className="flex flex-col md:flex-row gap-8 items-center justify-between w-full">
              
              <div className="flex-1 w-full max-w-2xl space-y-6">
                
                {/* Goal Evolution */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-[var(--color-accent-pink)]" />
                    <Caption className="text-[var(--color-accent-pink)] uppercase tracking-widest font-bold">Primary Goal</Caption>
                  </div>
                  <Heading level="h2" className="text-3xl tracking-tight mb-4">{profile?.goals?.primaryGoal || "Your Journey"}</Heading>
                  
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium mt-4">
                    <Badge variant="outline" className="border-[var(--color-accent-pink)] text-[var(--color-accent-pink)]">Current Focus: {profile?.goals?.primaryGoal || "Getting Started"}</Badge>
                  </div>
                </div>

              </div>

              {/* Health Score */}
              <div className="shrink-0">
                <HealthScoreRing score={hasData ? 88 : 0} size={180} />
              </div>

            </div>
          </HeroSection>
        </div>

        {/* LEFT COLUMN: Visuals & Studio */}
        <div className="lg:col-span-2 space-y-6">
          
          <WidgetSection title="Transformation Studio">
            {!hasData ? (
              <EmptyState
                icon={<Camera size={24} />}
                title="Your journey begins today"
                description="No body measurements recorded. No progress photos uploaded."
                primaryAction={{
                  label: "Record Weight",
                  onClick: () => {}
                }}
                secondaryAction={{
                  label: "Upload Photo",
                  onClick: () => {},
                  icon: <Camera size={16} />
                }}
              />
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center p-12 border border-dashed border-[var(--color-glass-border)] bg-[var(--color-bg-surface)]/30 rounded-xl">
                  <Caption className="text-[var(--color-text-muted)]">Photo comparison will appear here once you upload progress photos.</Caption>
                </div>
              </div>
            )}
          </WidgetSection>

          {/* Holistic Journeys */}
          {hasData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <HolisticJourneyCard 
                title="Hair Journey"
                icon={<Sparkles size={20} />}
                score={0}
                status="Pending"
                insights="Not enough data yet. Keep logging your nutrition and wellness metrics."
              />
              <HolisticJourneyCard 
                title="Skin Journey"
                icon={<Droplets size={20} />}
                score={0}
                status="Pending"
                insights="Not enough data yet. Track hydration to unlock insights."
              />
            </div>
          )}

          <WidgetSection title="Journey Replay (Documentary)">
            <GlassCard className="p-6">
              {!hasData ? (
                <div className="text-center py-8">
                  <Caption className="text-[var(--color-text-muted)]">Your journey timeline will build here over time.</Caption>
                </div>
              ) : (
                <JourneyTimeline nodes={[]} />
              )}
            </GlassCard>
          </WidgetSection>

        </div>

        {/* RIGHT COLUMN: Metrics & AI */}
        <div className="lg:col-span-1 space-y-6">

          {/* AI Transformation Coach */}
          <WidgetSection title="AI Transformation Coach">
            <GlassCard className="p-5 border-[var(--color-accent-indigo)]/20 bg-gradient-to-br from-[var(--color-accent-indigo)]/5 to-transparent flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-[var(--color-accent-indigo)]/10 shrink-0 mt-1">
                  <BrainCircuit size={16} className="text-[var(--color-accent-indigo)]" />
                </div>
                <div>
                  <Caption className="text-[var(--color-accent-indigo)] font-semibold uppercase tracking-wider text-[10px] mb-1">Coach</Caption>
                  <BodyText size="sm" className="text-[var(--color-text-primary)] leading-relaxed">
                    I don't have enough information yet. Let's start by logging your first measurements and progress photos.
                  </BodyText>
                </div>
              </div>
            </GlassCard>
          </WidgetSection>

          {/* Weight & Measurements */}
          <WeightTrendCard 
            currentWeight={currentWeight}
            startWeight={startWeight}
            targetWeight={targetWeight}
            trend="stable"
            delta={0}
          />

          <WidgetSection title="AI Milestone Detection">
            <GlassCard className="p-4 flex flex-col gap-3">
              <div className="py-6 text-center">
                <Caption className="text-[var(--color-text-muted)]">No milestones detected yet.</Caption>
              </div>
            </GlassCard>
          </WidgetSection>

          {/* Monthly Check-in & Lifestyle (Placeholders) */}
          <WidgetSection title="Monthly Subjective Check-in">
            <GlassCard className="p-4 space-y-3">
              <Caption className="text-[var(--color-text-muted)] mb-2">Track non-visual health metrics to help AI correlate lifestyle to transformation.</Caption>
              <Button variant="secondary" fullWidth className="justify-start bg-[var(--color-bg-base)]">Energy Level</Button>
              <Button variant="secondary" fullWidth className="justify-start bg-[var(--color-bg-base)]">Confidence</Button>
              <Button variant="secondary" fullWidth className="justify-start bg-[var(--color-bg-base)]">Sleep Quality</Button>
            </GlassCard>
          </WidgetSection>

        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
