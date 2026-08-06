"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { DashboardLayout, HeroSection, WidgetSection } from "@/components/adl/layout/Layouts";
import { useUserStore } from "@/stores/user.store";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { TimeRange } from "@/services/analytics/AnalyticsService";
import { Heading, Subheading } from "@/components/adl/typography";

import { SummaryCards } from "@/components/analytics/SummaryCards";
import { PersonalRecordsCard } from "@/components/analytics/PersonalRecordsCard";
import { HeatmapChart } from "@/components/analytics/HeatmapChart";
import { ExportCenter } from "@/components/analytics/ExportCenter";
import { AnalyticsTimeline } from "@/components/analytics/AnalyticsTimeline";

import dynamic from "next/dynamic";
const ProgressCharts = dynamic(() => import("@/components/analytics/ProgressCharts").then((mod) => mod.ProgressCharts), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse bg-bg-surface-elevated rounded-xl" />
});
import { WeightTracker } from "@/components/analytics/WeightTracker";

export default function ProgressPage() {
  const { profile, userId, isLoading: isUserLoading } = useUserStore();
  const { 
    timeRange,
    setTimeRange,
    fetchStats, 
    isLoading: isStatsLoading, 
    error, 
    weightTrend,
    workoutSplit,
    nutritionSplit,
    goalCompletion,
    consistency,
    personalRecords,
    trendCards,
    overviewStats,
    stepTrend,
    hydrationTrend
  } = useAnalyticsStore();
  const isLoading = isUserLoading;

  React.useEffect(() => {
    if (userId) {
      fetchStats(userId, { lookbackDays: 365 });
    }
  }, [userId, fetchStats]);

  // Set Page Accent
  React.useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", "var(--color-accent-hall, #EAB308)");
    return () => document.documentElement.style.setProperty("--current-accent", "var(--color-accent-dashboard, #3B82F6)");
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <DashboardLayout>
          <div className="lg:col-span-3 space-y-6 flex items-center justify-center min-h-[50vh]">
             <div className="animate-pulse flex flex-col items-center gap-4">
               <div className="w-12 h-12 rounded-full border-4 border-border border-t-accent-hall animate-spin" />
             </div>
          </div>
        </DashboardLayout>
      </PageContainer>
    );
  }

  const status = isStatsLoading ? 'loading' : error ? 'error' : 'data';
  const timeRanges: TimeRange[] = [7, 30, 90, 365];

  return (
    <PageContainer className="pb-[calc(8rem+env(safe-area-inset-bottom))] px-4 md:px-8 max-w-7xl mx-auto">
      <DashboardLayout>
        
        {/* TOP HERO ZONE & TIME SELECTOR */}
        <div className="lg:col-span-3 space-y-6 mb-8">
          <HeroSection className="bg-gradient-to-br from-bg-base via-bg-surface to-accent-hall/5 border border-border">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-4">
                <Heading level="h2" className="text-3xl md:text-5xl">Analytics & Progress</Heading>
                <Subheading size="md" className="text-text-secondary">Track your journey and visualize your hard work.</Subheading>
              </div>
              
              <div className="flex bg-bg-surface-elevated p-1 rounded-xl border border-border-subtle self-start md:self-auto">
                {timeRanges.map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      timeRange === range 
                        ? 'bg-bg-surface text-text-primary shadow-sm border border-border-subtle' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/50'
                    }`}
                  >
                    {range}D
                  </button>
                ))}
              </div>
            </div>
          </HeroSection>
        </div>

        {/* SUMMARY CARDS */}
        <div className="lg:col-span-3 space-y-6 mb-8">
          <WidgetSection title="Overview">
            <SummaryCards 
              status={status} 
              dailyStats={overviewStats?.today}
              weeklyStats={overviewStats?.week}
              monthlyStats={overviewStats?.month}
              lifetimeStats={overviewStats?.lifetime}
            />
          </WidgetSection>
        </div>

        {/* MAIN METRICS */}
        <div className="lg:col-span-3 grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
          <div className="xl:col-span-2 space-y-6">
            <WidgetSection title="Progress Trends">
              <ProgressCharts 
                status={status} 
                data={{ 
                  steps: stepTrend,
                  hydration: hydrationTrend,
                  workoutSplit: workoutSplit, 
                  nutritionSplit: nutritionSplit,
                  goals: [
                    { name: 'Calories', value: goalCompletion?.calories || 0, fill: 'var(--color-accent-orange)' },
                    { name: 'Protein', value: goalCompletion?.protein || 0, fill: 'var(--color-accent-blue)' },
                    { name: 'Water', value: goalCompletion?.water || 0, fill: 'var(--color-accent-green)' },
                    { name: 'Workouts', value: goalCompletion?.workouts || 0, fill: 'var(--color-accent-purple)' }
                  ]
                }} 
              />
            </WidgetSection>
          </div>
          
          <div className="xl:col-span-1 space-y-6">
            <WidgetSection title="Consistency & Heatmap">
              {consistency && (
                <HeatmapChart 
                  consistency={consistency} 
                  days={timeRange > 90 ? 90 : timeRange} 
                />
              )}
            </WidgetSection>
            
            <WidgetSection title="Personal Records">
              <PersonalRecordsCard personalRecords={personalRecords} />
            </WidgetSection>
          </div>
        </div>

        {/* BOTTOM METRICS */}
        <div className="lg:col-span-3 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <WidgetSection title="Body Metrics">
              <WeightTracker status={status} history={weightTrend || undefined} />
            </WidgetSection>
          </div>
          <div className="xl:col-span-1 space-y-6">
            <WidgetSection title="Data & Exports">
              <ExportCenter />
            </WidgetSection>
          </div>
        </div>

      </DashboardLayout>
    </PageContainer>
  );
}
