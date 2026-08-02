"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Button } from "@/components/adl/primitives/Button";
import { BrainCircuit, TrendingUp, TrendingDown, Target, CheckCircle, Calendar, Download, Lock, Activity, Droplet } from "lucide-react";
import { useIntelligenceStore } from "@/stores/intelligence.store";
import { TimeFilter, TrendCategory, SufficiencyState } from "@/services/intelligence/intelligence.service";
import { ActiveInsightModal } from "@/components/adl/composites/intel/ActiveInsightModal";
import { ConsistencyModal } from "@/components/adl/composites/intel/ConsistencyModal";
import { useAnalyticsStore } from "@/stores/analytics.store";
import dynamic from "next/dynamic";
import { cn } from "@/utils/cn";

// Lazy load Recharts payload
const IntelCharts = dynamic(() => import("@/components/adl/composites/intel/IntelCharts"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full min-h-[300px]">
      <div className="w-8 h-8 border-2 border-[var(--color-accent-blue)] border-t-transparent rounded-full animate-spin opacity-50"></div>
    </div>
  )
});

const TIME_FILTERS: { label: string; value: TimeFilter }[] = [
  { label: "7 Days", value: 7 },
  { label: "14 Days", value: 14 },
  { label: "30 Days", value: 30 },
  { label: "6 Months", value: 180 },
  { label: "1 Year", value: 365 },
];

const TREND_CATEGORIES: { label: string; value: TrendCategory; icon: any }[] = [
  { label: "Workout", value: "workout", icon: TrendingUp },
  { label: "Nutrition", value: "nutrition", icon: Target },
  { label: "Recovery", value: "recovery", icon: BrainCircuit },
];

export default function IntelDashboardPage() {
  const router = useRouter();
  const { 
    fetchIntelligence, 
    isLoading,
    timeFilter,
    setTimeFilter,
    trendCategory,
    setTrendCategory,
    activeInsightData,
    consistencyBreakdown,
    historicalInsights,
    chartData,
    sufficiency
  } = useIntelligenceStore();
  const { aiSummary } = useAnalyticsStore();

  const [isInsightModalOpen, setInsightModalOpen] = useState(false);
  const [isConsistencyModalOpen, setConsistencyModalOpen] = useState(false);
  const [lifecycle, setLifecycle] = useState<"LOADING" | "SYNCING" | "LIVE">("LOADING");

  useEffect(() => {
    fetchIntelligence().then(() => {
      setLifecycle("SYNCING");
      setTimeout(() => {
        setLifecycle("LIVE");
      }, 800); // Artificial delay for visual effect
    });
  }, [fetchIntelligence]);

  if (isLoading || !sufficiency || lifecycle === "LOADING") {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 space-y-4 mt-20">
        <div className="w-8 h-8 border-4 border-[var(--color-accent-blue)] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-secondary font-medium">Initializing intelligence...</span>
      </div>
    );
  }

  if (lifecycle === "SYNCING") {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 space-y-4 mt-20">
        <div className="flex gap-2 items-center text-[var(--color-success)] animate-pulse">
          <BrainCircuit size={24} />
          <span className="font-bold text-lg tracking-wider">SYNCING DATA MODULES...</span>
        </div>
      </div>
    );
  }

  const handleExport = () => {
    window.print();
  };

  const isNoData = sufficiency.stage === "NO_DATA";
  const isLimited = sufficiency.stage === "LIMITED_DATA";
  const hasChartData = chartData && chartData.some(d => d.volume > 0 || d.protein > 0 || d.score > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 px-4 pt-4 pb-24 sm:px-6 lg:px-8 print:max-w-full print:p-0">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
        <div>
          <Heading level="h1" className="text-3xl flex items-center gap-3">
            Intelligence Center
            <span className="text-xs font-bold px-2 py-1 bg-surface border border-border-subtle rounded-full text-[var(--color-accent-blue)] uppercase tracking-wider">
              {sufficiency.level}
            </span>
          </Heading>
          <BodyText className="text-[var(--color-text-muted)] mt-1">AI-powered analytics and macro trends.</BodyText>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={cn("flex p-1 bg-surface rounded-xl border border-border-subtle", isNoData && "opacity-50 pointer-events-none")}>
            {TIME_FILTERS.map(tf => (
              <button
                key={tf.value}
                onClick={() => setTimeFilter(tf.value)}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                  timeFilter === tf.value 
                    ? "bg-base text-primary shadow-sm border border-border-subtle" 
                    : "text-[var(--color-text-muted)] hover:text-primary"
                )}
              >
                {tf.label}
              </button>
            ))}
          </div>
          <Button onClick={handleExport} variant="secondary" leftIcon={<Download size={16} />} disabled={isNoData}>
            Export
          </Button>
        </div>
      </div>

      {isNoData ? (
        <NoDataState sufficiency={sufficiency} />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* AI Summary Grid */}
            <div className="md:col-span-2 space-y-4">
              <Heading level="h4" className="text-secondary uppercase tracking-wider text-xs font-bold">
                Intelligence Dashboard
              </Heading>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Performance */}
                <GlassCard className="p-5 border-l-4 border-l-[var(--color-accent-blue)] hover:bg-[var(--color-bg-surface-hover)] transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="text-[var(--color-accent-blue)]" size={18} />
                    <Heading level="h5" className="text-primary text-sm">Today's Performance</Heading>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Calories</span>
                      <span className="font-medium text-primary">{Math.round(aiSummary?.performance?.calories || 0)} kcal</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Protein</span>
                      <span className="font-medium text-primary">{Math.round(aiSummary?.performance?.protein || 0)} g</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Water</span>
                      <span className="font-medium text-primary">{Math.round(aiSummary?.performance?.water || 0)} ml</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-secondary">Steps</span>
                      <span className="font-medium text-primary">{Math.round(aiSummary?.performance?.steps || 0)}</span>
                    </div>
                  </div>
                </GlassCard>

                {/* Trend Shifts */}
                <GlassCard className="p-5 border-l-4 border-l-[var(--color-accent-gold)] hover:bg-[var(--color-bg-surface-hover)] transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="text-[var(--color-accent-gold)]" size={18} />
                    <Heading level="h5" className="text-primary text-sm">Weekly Trend Shifts</Heading>
                  </div>
                  <div className="space-y-3">
                    {aiSummary?.weeklyTrends?.map((trend: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-secondary">{trend.label}</span>
                        <span className={cn("font-bold", trend.trend > 0 ? "text-[var(--color-success)]" : trend.trend < 0 ? "text-[var(--color-error)]" : "text-secondary")}>
                          {trend.trend > 0 ? '↑' : trend.trend < 0 ? '↓' : ''} {Math.abs(Math.round(trend.trend))}%
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Coach Recommendation */}
                <GlassCard className="p-5 border-l-4 border-l-[var(--color-accent-indigo)] sm:col-span-2 hover:bg-[var(--color-bg-surface-hover)] transition-colors cursor-pointer" onClick={() => setInsightModalOpen(true)}>
                  <div className="flex items-center gap-2 mb-3">
                    <BrainCircuit className="text-[var(--color-accent-indigo)]" size={18} />
                    <Heading level="h5" className="text-primary text-sm">Active Coach Recommendation</Heading>
                  </div>
                  <BodyText className="text-secondary">
                    {aiSummary?.recommendation || activeInsightData?.description || "Log more data to receive coaching."}
                  </BodyText>
                </GlassCard>

                {/* Achievement */}
                <GlassCard className="p-5 border-l-4 border-l-[var(--color-success)] hover:bg-[var(--color-bg-surface-hover)] transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="text-[var(--color-success)]" size={18} />
                    <Heading level="h5" className="text-primary text-sm">Recent Achievement</Heading>
                  </div>
                  <BodyText className="text-secondary text-sm">
                    {aiSummary?.achievement || "Keep training!"}
                  </BodyText>
                </GlassCard>

                {/* Risk Detection */}
                <GlassCard className="p-5 border-l-4 border-l-[var(--color-warning)] hover:bg-[var(--color-bg-surface-hover)] transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="text-[var(--color-warning)]" size={18} />
                    <Heading level="h5" className="text-primary text-sm">Risk Detection</Heading>
                  </div>
                  <BodyText className="text-secondary text-sm">
                    {aiSummary?.riskDetection || "All metrics are stable."}
                  </BodyText>
                </GlassCard>

              </div>
            </div>

            {/* Consistency Score */}
            <div className="space-y-4">
              <Heading level="h4" className="text-secondary uppercase tracking-wider text-xs font-bold">Consistency Score</Heading>
              
              {isLimited ? (
                <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[220px] bg-surface opacity-80 border-dashed">
                  <Lock size={32} className="text-[var(--color-text-muted)] mb-3" />
                  <Heading level="h4" className="text-primary mb-1">Locked</Heading>
                  <Caption className="text-center text-secondary">More tracking required to calculate consistency.</Caption>
                </GlassCard>
              ) : (
                <GlassCard className="p-6 flex flex-col items-center justify-center min-h-[220px] hover:bg-[var(--color-bg-surface-hover)] transition-colors relative cursor-pointer" onClick={() => setConsistencyModalOpen(true)}>
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="56" stroke="var(--color-bg-surface)" strokeWidth="12" fill="none" />
                      <circle
                        cx="64" cy="64" r="56"
                        stroke={consistencyBreakdown!.currentScore >= 80 ? "var(--color-success)" : consistencyBreakdown!.currentScore >= 50 ? "var(--color-accent-orange)" : "var(--color-error)"}
                        strokeWidth="12" fill="none" strokeDasharray="351.8"
                        strokeDashoffset={351.8 - (351.8 * consistencyBreakdown!.currentScore) / 100}
                        className="transition-all duration-1000 ease-out" strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-primary">{consistencyBreakdown!.currentScore}</span>
                      <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-widest">Score</span>
                    </div>
                  </div>
                  <Caption className="mt-4 text-center text-secondary underline decoration-dashed underline-offset-4 decoration-[var(--color-text-muted)]">
                    View Score Breakdown
                  </Caption>
                </GlassCard>
              )}
            </div>
          </div>

          {/* Interactive Trends Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <Heading level="h4" className="text-secondary uppercase tracking-wider text-xs font-bold">Interactive Trends</Heading>
              <div className="flex space-x-2 bg-surface p-1 rounded-xl border border-border-subtle w-fit">
                {TREND_CATEGORIES.map(tc => {
                  const Icon = tc.icon;
                  return (
                    <button
                      key={tc.value}
                      onClick={() => setTrendCategory(tc.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                        trendCategory === tc.value 
                          ? "bg-base text-primary shadow-sm border border-border-subtle" 
                          : "text-[var(--color-text-muted)] hover:text-primary"
                      )}
                    >
                      <Icon size={14} />
                      {tc.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <GlassCard className="p-6">
              {!hasChartData ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-surface flex items-center justify-center border border-border-subtle">
                    {trendCategory === "workout" ? <Activity className="text-[var(--color-text-muted)]" size={24} /> : 
                     trendCategory === "nutrition" ? <Target className="text-[var(--color-text-muted)]" size={24} /> : 
                     <BrainCircuit className="text-[var(--color-text-muted)]" size={24} />}
                  </div>
                  <div>
                    <Heading level="h4" className="text-primary mb-1">No {trendCategory} history yet.</Heading>
                    <Caption className="text-secondary max-w-sm">Complete your first log to begin tracking volume and discovering trends.</Caption>
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-[300px] w-full">
                    <IntelCharts trendCategory={trendCategory} chartData={chartData} />
                  </div>
                  <div className="mt-4 flex items-center justify-center border-t border-border-subtle pt-4">
                    <Caption className="text-secondary text-center flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-accent-blue)]"></span>
                      Click any bar or point to navigate to its daily log.
                    </Caption>
                  </div>
                </>
              )}
            </GlassCard>
          </div>

          {/* Insights Timeline */}
          <div className="space-y-6">
            <Heading level="h4" className="text-secondary uppercase tracking-wider text-xs font-bold">Recent Insights Timeline</Heading>
            
            {historicalInsights.length === 0 ? (
              <GlassCard className="p-8 text-center border-dashed">
                <Caption className="text-secondary">No AI Insights Yet. Your personalized timeline will appear once you've logged enough activity.</Caption>
              </GlassCard>
            ) : (
              <div className="space-y-3">
                {historicalInsights.map((insight) => (
                  <GlassCard key={insight.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--color-bg-surface-hover)] transition-colors cursor-pointer" onClick={() => setInsightModalOpen(true)}>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        (insight as any).priority === "danger" ? "bg-[var(--color-error)]" : 
                        (insight as any).priority === "warning" ? "bg-[var(--color-warning)]" : "bg-[var(--color-success)]"
                      )} />
                      <div>
                        <Heading level="h5" className="text-primary text-sm">{insight.title}</Heading>
                        <BodyText size="sm" className="text-secondary">{insight.description}</BodyText>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold text-[var(--color-text-muted)] bg-base px-2 py-1 rounded-md border border-border-subtle">{insight.category}</span>
                      <div className="flex items-center gap-1 text-[var(--color-text-muted)] text-xs">
                        <Calendar size={12} />
                        {new Date((insight as any).date || (insight.timestamp as any)?.toDate?.() || new Date()).toLocaleDateString()}
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <ActiveInsightModal isOpen={isInsightModalOpen} onClose={() => setInsightModalOpen(false)} />
      <ConsistencyModal isOpen={isConsistencyModalOpen} onClose={() => setConsistencyModalOpen(false)} />
    </div>
  );
}

function NoDataState({ sufficiency }: { sufficiency: SufficiencyState }) {
  const router = useRouter();
  
  const tasks = [
    { label: "Log your first workout", current: sufficiency.counts.workouts, target: sufficiency.targets.workouts, icon: Activity, href: "/training" },
    { label: "Complete 5 nutrition entries", current: sufficiency.counts.meals, target: sufficiency.targets.meals, icon: Target, href: "/nutrition" },
    { label: "Track hydration for 3 days", current: sufficiency.counts.hydration, target: sufficiency.targets.hydration, icon: Droplet, href: "/nutrition" },
    { label: "Record recovery for 3 days", current: sufficiency.counts.recovery, target: sufficiency.targets.recovery, icon: BrainCircuit, href: "/recovery" },
  ];
  
  const completedCount = tasks.filter(t => t.current >= t.target).length;

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-12">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-[var(--color-accent-indigo)]/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <BrainCircuit size={40} className="text-[var(--color-accent-indigo)]" />
        </div>
        <Heading level="h2" className="text-primary">Welcome to Ascend Intelligence</Heading>
        <BodyText className="text-secondary text-lg">Your AI coach is ready to analyze your progress. Start tracking your activities to unlock personalized insights and macro trends.</BodyText>
      </div>

      <GlassCard className="p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between mb-2">
          <Heading level="h4" className="text-primary">Unlock Intelligence</Heading>
          <span className="text-sm font-bold text-[var(--color-accent-blue)]">{completedCount} / {tasks.length} Complete</span>
        </div>
        
        <div className="w-full h-2 bg-base rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-[var(--color-accent-blue)] transition-all duration-1000" 
            style={{ width: `${(completedCount / tasks.length) * 100}%` }}
          />
        </div>

        <div className="space-y-3">
          {tasks.map((task, idx) => {
            const isCompleted = task.current >= task.target;
            const Icon = task.icon;
            return (
              <button 
                key={idx}
                onClick={() => router.push(task.href)}
                className="w-full flex items-center justify-between p-4 bg-base border border-border-subtle rounded-xl hover:bg-surface transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded flex items-center justify-center shrink-0 border",
                    isCompleted ? "bg-[var(--color-success)] border-[var(--color-success)] text-primary" : "border-[var(--color-text-muted)] text-transparent"
                  )}>
                    {isCompleted && <CheckCircle size={14} />}
                  </div>
                  <div>
                    <span className={cn("font-medium", isCompleted ? "text-secondary line-through" : "text-primary")}>{task.label}</span>
                  </div>
                </div>
                <Icon size={18} className="text-[var(--color-text-muted)]" />
              </button>
            )
          })}
        </div>
      </GlassCard>
    </div>
  )
}

