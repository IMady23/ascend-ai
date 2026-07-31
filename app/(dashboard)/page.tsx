"use client";

import React, { useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { Heading, Subheading, BodyText, Statistic, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Badge } from "@/components/adl/primitives/Badge";
import { Avatar } from "@/components/adl/primitives/Avatar";
import { GlassCard, MetricCard, InteractiveCard, Card } from "@/components/adl/composites/cards/Cards";
import { ProgressRing, ProgressBar } from "@/components/adl/composites/progress/Progress";
import { ThinkingIndicator, SuggestionChip } from "@/components/adl/composites/ai/AI";
import { DashboardLayout, HeroSection, WidgetSection, AnalyticsGrid } from "@/components/adl/layout/Layouts";
import { motion } from "framer-motion";
import { HeroMotion, PageMotion } from "@/utils/motion";
import { useUserStore } from "@/stores/user.store";
import { useActivityStore } from "@/stores/activity.store";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { 
  Dumbbell, 
  Flame, 
  Droplet, 
  Moon, 
  Activity, 
  Plus,
  Sparkles,
  TrendingUp,
  Apple,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMotionValue, useTransform, animate } from "framer-motion";
import { resolvePostAuthRoute } from "@/lib/auth/post-auth-routing";
import { MealLoggerModal } from "@/components/adl/composites/nutrition/MealLoggerModal";
import { AICoachDrawer } from "@/features/ai/components/AICoachDrawer";
import { StepsLoggerModal } from "@/components/adl/composites/tracking/StepsLoggerModal";
import { WaterLoggerModal } from "@/components/adl/composites/tracking/WaterLoggerModal";
import { ReminderScheduleModal } from "@/components/adl/composites/settings/ReminderScheduleModal";
import { useNutritionStore } from "@/stores/nutrition.store";

// Animated Number Hook
const AnimatedNumber = ({ value }: { value: number }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.5 });
    return controls.stop;
  }, [count, value]);

  return <motion.span>{rounded}</motion.span>;
};

export default function MissionControl() {

  const { profile, userId } = useUserStore();
  const { dailyWaterMl, dailyCalories, dailyProtein } = useNutritionStore();
  const router = useRouter();
  
  const [isMealLoggerOpen, setIsMealLoggerOpen] = React.useState(false);
  const [isCoachOpen, setIsCoachOpen] = React.useState(false);
  const [isWaterLoggerOpen, setIsWaterLoggerOpen] = React.useState(false);
  const [isStepsLoggerOpen, setIsStepsLoggerOpen] = React.useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = React.useState(false);
  const [isActionLoading, setIsActionLoading] = React.useState<string | null>(null);
  const { dailySteps, workoutState } = useActivityStore();
  const { weeklyStats, lifetimeStats, fetchStats } = useAnalyticsStore();
  
  useEffect(() => {
    if (userId) {
      // Mocking period IDs for now. In a real scenario, we'd compute the current week/month IDs.
      fetchStats(userId, {
        dailyId: new Date().toISOString().split('T')[0],
        weeklyId: 'current-week',
        monthlyId: 'current-month',
        yearlyId: 'current-year',
        lifetimeId: 'lifetime'
      });
    }
  }, [userId, fetchStats]);

  const handleRoute = (path: string, actionId: string) => {
    setIsActionLoading(actionId);
    router.push(path);
  };

  // Redirect to onboarding only when profile is explicitly incomplete
  useEffect(() => {
    const redirect = resolvePostAuthRoute("/", profile);
    if (redirect) {
      router.replace(redirect);
    }
  }, [profile, router]);

  // Ensure the page takes the Mission Control accent globally
  useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", "var(--color-accent-blue)");
    return () => {
      document.documentElement.style.setProperty("--current-accent", "var(--color-accent-blue)");
    };
  }, []);

  if (!profile || !profile.onboardingCompleted) return null;

  const { identity, targets } = profile;
  const userName = identity?.nickname || identity?.fullName.split(" ")[0] || "Commander";
  
  const targetCalories = targets?.dailyCalories || 2000;
  const targetWater = (targets?.water || 3000) / 1000; // in L
  const targetSteps = profile.preferences?.stepGoal || 10000;
  const targetProtein = targets?.protein || 150;

  // Dynamic Score Calculation
  const waterProgress = Math.min(1, dailyWaterMl / (targetWater * 1000));
  const stepsProgress = Math.min(1, dailySteps / targetSteps);
  const proteinProgress = Math.min(1, dailyProtein / targetProtein);
  const calorieProgress = targetCalories > 0 ? Math.min(1, dailyCalories / targetCalories) : 0;
  const dailyScore = Math.round(((waterProgress + stepsProgress + proteinProgress + calorieProgress) / 4) * 100);

  return (
    <PageContainer className="pb-[calc(8rem+env(safe-area-inset-bottom))] px-4 md:px-8 max-w-7xl mx-auto">
      <DashboardLayout>
        
        {/* 1. DAILY BRIEFING HERO */}
        <motion.div variants={HeroMotion.reveal} initial="initial" animate="animate">
          <HeroSection className="mt-4 md:mt-8 mb-8 md:mb-12 rounded-[var(--radius-2xl)] border border-[var(--color-glass-border)] bg-[var(--color-bg-glass-standard)] backdrop-blur-xl p-5 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
              
              <div className="space-y-2 md:space-y-4 text-center md:text-left w-full md:w-auto">
                <Heading level="h2" className="text-3xl md:text-5xl lg:text-6xl">
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} <span className="hidden md:inline">, {userName}</span> 👋
                </Heading>
                <Subheading size="md" className="hidden md:block text-base text-[var(--color-text-secondary)]">Welcome back!</Subheading>
                
                <div className="mt-3 md:mt-6">
                  <Caption className="uppercase tracking-widest text-[var(--color-accent-blue)] mb-2 md:mb-3 font-semibold text-xs md:text-sm">Active Mission</Caption>
                  <ul className="space-y-1.5 md:space-y-2 text-[var(--color-text-primary)] text-sm md:text-base flex flex-col items-center md:items-start">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[var(--color-accent-blue)]" /> Hit your protein goal ({targets?.protein || 150}g)</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[var(--color-accent-green)]" /> Drink {targetWater}L water</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[var(--color-accent-indigo)]" /> Complete Push Workout</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col items-center shrink-0">
                <Caption className="mb-2 text-xs md:text-sm">Daily Score</Caption>
                
                {/* Mobile Ring (25% smaller) */}
                <div className="md:hidden">
                  <ProgressRing value={dailyScore} size={90} strokeWidth={6} color="var(--color-accent-blue)" icon={<Statistic className="text-3xl"><AnimatedNumber value={dailyScore} /></Statistic>} />
                </div>
                
                {/* Desktop Ring */}
                <div className="hidden md:block">
                  <ProgressRing value={dailyScore} size={120} strokeWidth={8} color="var(--color-accent-blue)" icon={<Statistic className="text-4xl"><AnimatedNumber value={dailyScore} /></Statistic>} />
                </div>
              </div>
            </div>
          </HeroSection>
        </motion.div>

        {/* 2. DAILY SNAPSHOT */}
        <motion.div variants={PageMotion.staggerItem} initial="initial" animate="animate">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            <div onClick={() => handleRoute('/nutrition', 'calories-card')} className="cursor-pointer hover:opacity-80 transition-opacity">
              <MetricCard 
                label="Calories" 
                value={`${dailyCalories} / ${targetCalories}`} 
                icon={<Flame size={18} />} 
                status="neutral"
              />
            </div>
            <div onClick={() => setIsWaterLoggerOpen(true)} className="cursor-pointer hover:opacity-80 transition-opacity">
              <MetricCard 
                label="Hydration" 
                value={`${dailyWaterMl} / ${targetWater * 1000}ml`} 
                icon={<Droplet size={18} />} 
                status="neutral"
              />
            </div>
            <div onClick={() => setIsStepsLoggerOpen(true)} className="cursor-pointer hover:opacity-80 transition-opacity">
              <MetricCard 
                label="Steps" 
                value={`${dailySteps} / ${targetSteps}`} 
                icon={<Activity size={18} />} 
                status="neutral"
              />
            </div>
            <div onClick={() => handleRoute('/training', 'workout-card')} className="cursor-pointer hover:opacity-80 transition-opacity">
              <MetricCard 
                label="Workout" 
                value={workoutState === "completed" ? "Completed" : workoutState === "in_progress" ? "In Progress" : "Not Started"} 
                icon={<Dumbbell size={18} />} 
                status={workoutState === "completed" ? "achieved" : workoutState === "in_progress" ? "warning" : "neutral"}
              />
            </div>
            <div onClick={() => handleRoute('/recovery', 'recovery-card')} className="cursor-pointer hover:opacity-80 transition-opacity">
              <MetricCard 
                label="Recovery" 
                value="Pending" 
                icon={<Moon size={18} />} 
                status="neutral"
              />
            </div>
          </div>
        </motion.div>

        {/* 3. COACH & QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className="md:col-span-2 space-y-6">
            <WidgetSection title="Today's AI Coach">
              <GlassCard className="p-4 md:p-6 border-[var(--color-accent-indigo)]/30 bg-gradient-to-br from-[var(--color-accent-indigo)]/5 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent-indigo)]/10 flex items-center justify-center">
                    <Sparkles size={20} className="text-[var(--color-accent-indigo)]" />
                  </div>
                  <Heading level="h4">Next Focus</Heading>
                </div>
                
                <BodyText size="md" className="leading-relaxed text-[var(--color-text-secondary)] mb-6">
                  You've already logged breakfast. To stay on track for your daily activity, try to reach 5,000 steps before evening.
                </BodyText>
                
                <Button variant="primary" onClick={() => setIsCoachOpen(true)}>Ask Coach a Question</Button>
              </GlassCard>
            </WidgetSection>
          </div>

          <div className="md:col-span-1 space-y-6">
            <WidgetSection title="Quick Actions">
              <div className="flex flex-col gap-3">
                <Button onClick={() => handleRoute('/training', 'qa-workout')} variant="secondary" fullWidth size="lg" leftIcon={<Dumbbell size={18} />} className="justify-start">
                  {isActionLoading === 'qa-workout' ? 'Loading...' : 'Log Workout'}
                </Button>
                <Button onClick={() => setIsMealLoggerOpen(true)} variant="secondary" fullWidth size="lg" leftIcon={<Apple size={18} />} className="justify-start">
                  Log Meal
                </Button>
                <Button onClick={() => setIsWaterLoggerOpen(true)} variant="secondary" fullWidth size="lg" leftIcon={<Droplet size={18} />} className="justify-start">
                  Log Water
                </Button>
                <Button onClick={() => setIsCoachOpen(true)} variant="primary" fullWidth size="lg" leftIcon={<Sparkles size={18} />} className="justify-start border-none">
                  Start Coach
                </Button>
                <Button onClick={() => setIsReminderModalOpen(true)} variant="secondary" fullWidth size="lg" leftIcon={<Clock size={18} />} className="justify-start">
                  ⏰ Manage Reminders
                </Button>
              </div>
            </WidgetSection>
          </div>
        </div>

        {/* 4. OVERVIEW & REPORTS */}
        <div className="mb-12">
          <WidgetSection title="Overview & Reports">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <InteractiveCard title="Current Streak" onClick={() => handleRoute('/progress', 'progress-streak')}>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-zinc-400">Days Active</span>
                  <span className="font-semibold text-orange-400">{lifetimeStats?.metrics?.streakDays || 0} Days</span>
                </div>
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((day, idx) => (
                    <div 
                      key={day} 
                      className={`h-2 flex-1 rounded-full ${idx < (lifetimeStats?.metrics?.streakDays || 0) % 7 ? 'bg-orange-500' : 'bg-zinc-800'}`} 
                    />
                  ))}
                </div>
              </InteractiveCard>

              <InteractiveCard title="Active Reminder" onClick={() => setIsReminderModalOpen(true)}>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Next Alert</span>
                    <span className="font-semibold text-[var(--color-accent-blue)]">2:00 PM</span>
                  </div>
                  <span className="text-base font-medium mt-1">Hydration Check</span>
                </div>
              </InteractiveCard>

              <InteractiveCard title="Latest Report" onClick={() => handleRoute('/progress', 'latest-report')}>
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400">Weekly Summary</span>
                    <span className="font-semibold text-emerald-400">Available</span>
                  </div>
                  <span className="text-sm mt-1 text-[var(--color-text-secondary)]">View your progress from last week.</span>
                </div>
              </InteractiveCard>

              <InteractiveCard title="Workout Consistency" onClick={() => handleRoute('/progress', 'progress-card')}>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-zinc-400">Weekly Goal</span>
                  <span className="font-semibold text-emerald-400">{weeklyStats?.consistency?.workout || 0}%</span>
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 mt-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${weeklyStats?.consistency?.workout || 0}%` }} />
                </div>
              </InteractiveCard>
            </div>
          </WidgetSection>
        </div>

      </DashboardLayout>

      <MealLoggerModal 
        isOpen={isMealLoggerOpen} 
        onClose={() => setIsMealLoggerOpen(false)} 
      />
      
      <AICoachDrawer
        isOpen={isCoachOpen}
        onClose={() => setIsCoachOpen(false)}
      />

      <StepsLoggerModal
        isOpen={isStepsLoggerOpen}
        onClose={() => setIsStepsLoggerOpen(false)}
      />

      <WaterLoggerModal
        isOpen={isWaterLoggerOpen}
        onClose={() => setIsWaterLoggerOpen(false)}
      />
      
      <ReminderScheduleModal 
        isOpen={isReminderModalOpen} 
        onClose={() => setIsReminderModalOpen(false)} 
      />
    </PageContainer>
  );
}
