"use client";

import * as React from "react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { DashboardLayout, HeroSection, WidgetSection } from "@/components/adl/layout/Layouts";
import { useUserStore } from "@/stores/user.store";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { Heading, Subheading } from "@/components/adl/typography";

import { SummaryCards } from "@/components/analytics/SummaryCards";
import dynamic from "next/dynamic";
const ProgressCharts = dynamic(() => import("@/components/analytics/ProgressCharts").then((mod) => mod.ProgressCharts), {
  ssr: false,
  loading: () => <div className="h-72 w-full animate-pulse bg-zinc-900/50 rounded-xl" />
});
import { WeightTracker } from "@/components/analytics/WeightTracker";

export default function ProgressPage() {
  const { profile, userId, isLoading: isUserLoading } = useUserStore();
  const { fetchStats } = useAnalyticsStore();
  const isLoading = isUserLoading;

  React.useEffect(() => {
    if (userId) {
      fetchStats(userId, {
        dailyId: new Date().toISOString().split('T')[0],
        weeklyId: 'current-week',
        monthlyId: 'current-month',
        yearlyId: 'current-year',
        lifetimeId: 'lifetime'
      });
    }
  }, [userId, fetchStats]);

  // Set Page Accent
  React.useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", "var(--color-accent-gold)");
    return () => document.documentElement.style.setProperty("--current-accent", "var(--color-accent-blue)");
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <DashboardLayout>
          <div className="lg:col-span-3 space-y-6 flex items-center justify-center min-h-[50vh]">
             <div className="animate-pulse flex flex-col items-center gap-4">
               <div className="w-12 h-12 rounded-full border-4 border-[var(--color-glass-border)] border-t-[var(--color-accent-gold)] animate-spin" />
             </div>
          </div>
        </DashboardLayout>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DashboardLayout>
        
        {/* TOP HERO ZONE */}
        <div className="lg:col-span-3 space-y-6 mb-8">
          <HeroSection className="bg-gradient-to-br from-[var(--color-bg-base)] via-[var(--color-bg-surface)] to-[var(--color-accent-gold)]/5">
            <div className="flex flex-col gap-4">
              <Heading level="h2" className="text-3xl md:text-5xl">Analytics & Progress</Heading>
              <Subheading size="md" className="text-zinc-400">Track your journey and visualize your hard work.</Subheading>
            </div>
          </HeroSection>
        </div>

        {/* SUMMARY CARDS */}
        <div className="lg:col-span-3 space-y-6 mb-8">
          <WidgetSection title="Overview">
            <SummaryCards />
          </WidgetSection>
        </div>

        {/* MAIN METRICS & WEIGHT */}
        <div className="lg:col-span-3 grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-6">
            <WidgetSection title="Progress Trends">
              <ProgressCharts />
            </WidgetSection>
          </div>
          
          <div className="xl:col-span-1 space-y-6">
            <WidgetSection title="Body Metrics">
              <WeightTracker />
            </WidgetSection>
          </div>
        </div>

      </DashboardLayout>
    </PageContainer>
  );
}
