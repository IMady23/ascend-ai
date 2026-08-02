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
import { InsightCards } from "@/components/analytics/InsightCards";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { 
  LivingHydrationWidget, 
  LivingFlameWidget, 
  LivingTrailWidget, 
  LivingHeartbeat,
  LivingEnergyCore
} from "@/components/dashboard/LivingWidgets";
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
  const { aiSummary, goalCompletion, fetchStats, inspectionMode, hoveredDate, selectedDate } = useAnalyticsStore();
  
  const [displayMetrics, setDisplayMetrics] = React.useState({
    calories: 0,
    waterMl: 0,
    steps: 0,
    protein: 0,
    workoutStatus: "neutral" as "neutral" | "warning" | "achieved",
    workoutText: "Not Started"
  });

  useEffect(() => {
    if (userId) {
      fetchStats(userId);
    }
  }, [userId, fetchStats]);

  // Sync metrics with interaction state
  useEffect(() => {
    if (inspectionMode === 'live') {
      setDisplayMetrics({
        calories: dailyCalories,
        waterMl: dailyWaterMl,
        steps: dailySteps,
        protein: dailyProtein,
        workoutStatus: workoutState === "completed" ? "achieved" : workoutState === "in_progress" ? "warning" : "neutral",
        workoutText: workoutState === "completed" ? "Completed" : workoutState === "in_progress" ? "In Progress" : "Not Started"
      });
    } else {
      const dateToInspect = hoveredDate || selectedDate;
      if (dateToInspect) {
        import('@/services/analytics/AnalyticsService').then(({ AnalyticsService }) => {
          const cache = AnalyticsService.getCache();
          const dailyLog = cache.dailyLogs.find(d => d.date === dateToInspect);
          const hydrationLogs = cache.hydrationLogs.filter(h => h.date === dateToInspect);
          const nutritionLogs = cache.nutritionLogs.filter(n => n.date === dateToInspect);
          const activities = cache.activities.filter(a => a.date.toDate().toISOString().split("T")[0] === dateToInspect);
          
          let totalWater = 0; hydrationLogs.forEach(h => totalWater += (h.amountMl || 0));
          let totalCalories = 0; nutritionLogs.forEach(n => totalCalories += (n.calories || 0));
          let totalProtein = 0; nutritionLogs.forEach(n => totalProtein += (n.protein || 0));
          
          setDisplayMetrics({
            calories: totalCalories,
            waterMl: totalWater,
            steps: dailyLog?.steps || 0,
            protein: totalProtein,
            workoutStatus: activities.length > 0 ? "achieved" : "neutral",
            workoutText: activities.length > 0 ? "Completed" : "No Workout"
          });
        });
      }
    }
  }, [inspectionMode, hoveredDate, selectedDate, dailyCalories, dailyWaterMl, dailySteps, dailyProtein, workoutState]);

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
  
  const targetCalories = profile.preferences?.goals?.calories || profile.targets?.dailyCalories || 2000;
  const targetWater = ((profile.preferences?.goals?.waterMl || profile.targets?.water || 3000)) / 1000; // in L
  const targetSteps = profile.preferences?.goals?.steps || 10000;
  const targetProtein = profile.preferences?.goals?.proteinGrams || profile.targets?.protein || 150;

  // Dynamic Score Calculation (using displayMetrics so it syncs with hover)
  const waterProgress = targetWater > 0 ? Math.min(1, displayMetrics.waterMl / (targetWater * 1000)) : 0;
  const stepsProgress = targetSteps > 0 ? Math.min(1, displayMetrics.steps / targetSteps) : 0;
  const proteinProgress = targetProtein > 0 ? Math.min(1, displayMetrics.protein / targetProtein) : 0;
  const calorieProgress = (targetCalories ?? 0) > 0 ? Math.min(1, displayMetrics.calories / (targetCalories ?? 1)) : 0;
  const dailyScore = Math.round(((waterProgress + stepsProgress + proteinProgress + calorieProgress) / 4) * 100);

  return (
    <PageContainer className="pb-[calc(8rem+env(safe-area-inset-bottom))] px-3 md:px-8 max-w-7xl mx-auto">
      <DashboardLayout>
        
        {/* 1. DAILY BRIEFING HERO */}
        <motion.div variants={HeroMotion.reveal} initial="initial" animate="animate">
          <HeroSection className="mt-2 md:mt-8 mb-6 md:mb-12 glass-premium p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
              
              <div className="space-y-2 md:space-y-4 text-center md:text-left w-full md:w-auto">
                <Heading level="h2" className="text-3xl md:text-5xl lg:text-6xl">
                  Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} <span className="hidden md:inline">, {userName}</span> 👋
                </Heading>
                <Subheading size="md" className="hidden md:block text-base text-text-secondary">Welcome back!</Subheading>
                
                <div className="mt-3 md:mt-6">
                  <Caption className="uppercase tracking-widest text-accent-dashboard mb-2 md:mb-3 font-semibold text-xs md:text-sm">Active Mission</Caption>
                  <ul className="space-y-1.5 md:space-y-2 text-text-primary text-sm md:text-base flex flex-col items-center md:items-start">
                    <li className="flex items-center gap-2"><div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent-dashboard" /> Hit your protein goal ({targetProtein}g)</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent-nutrition" /> Drink {targetWater}L water</li>
                    <li className="flex items-center gap-2"><div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-accent-mission" /> Complete Push Workout</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex flex-col items-center shrink-0">
                <Caption className="mb-2 text-xs md:text-sm">Daily Score</Caption>
                
                {/* Mobile Ring (25% smaller) */}
                <div className="md:hidden">
                  <ProgressRing value={dailyScore} size={90} strokeWidth={6} color="var(--color-accent-dashboard, #3B82F6)" icon={<Statistic className="text-3xl"><AnimatedNumber value={dailyScore} /></Statistic>} />
                </div>
                
                {/* Desktop Ring */}
                <div className="hidden md:block">
                  <ProgressRing value={dailyScore} size={120} strokeWidth={8} color="var(--color-accent-dashboard, #3B82F6)" icon={<Statistic className="text-4xl"><AnimatedNumber value={dailyScore} /></Statistic>} />
                </div>
              </div>
            </div>
          </HeroSection>
        </motion.div>

        {/* 2. INSIGHTS */}
        <motion.div variants={PageMotion.staggerItem} initial="initial" animate="animate">
          <InsightCards userId={userId || ""} />
        </motion.div>

        {/* 3. DAILY SNAPSHOT */}
        <motion.div variants={PageMotion.staggerItem} initial="initial" animate="animate">
          {inspectionMode !== 'live' && (
             <div className="mb-2 flex items-center justify-center bg-accent-blue/10 text-accent-blue py-1 px-3 rounded-full text-xs font-bold animate-pulse w-max mx-auto">
                <Clock size={12} className="mr-1" /> Inspecting: {hoveredDate || selectedDate}
             </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-6 md:mb-12">
            <div onClick={() => handleRoute('/nutrition', 'calories-card')} className="cursor-pointer">
              <InteractiveCard className="flex flex-col items-center justify-center p-3 md:p-6 h-full text-center min-h-[110px]">
                <LivingFlameWidget progress={calorieProgress} size={40} />
                <h4 className="mt-2 md:mt-4 font-semibold text-text-primary text-xs md:text-sm">Calories</h4>
                <p className="text-[10px] md:text-xs text-text-secondary">{displayMetrics.calories} / {targetCalories}</p>
              </InteractiveCard>
            </div>
            <div onClick={() => setIsWaterLoggerOpen(true)} className="cursor-pointer">
              <InteractiveCard className="flex flex-col items-center justify-center p-3 md:p-6 h-full text-center min-h-[110px]">
                <LivingHydrationWidget progress={waterProgress} width={40} height={48} />
                <h4 className="mt-2 md:mt-4 font-semibold text-text-primary text-xs md:text-sm">Hydration</h4>
                <p className="text-[10px] md:text-xs text-text-secondary">{displayMetrics.waterMl} / {targetWater * 1000}ml</p>
              </InteractiveCard>
            </div>
            <div onClick={() => setIsStepsLoggerOpen(true)} className="cursor-pointer">
              <InteractiveCard className="flex flex-col items-center justify-center p-3 md:p-6 h-full text-center min-h-[110px] col-span-2 md:col-span-1">
                <LivingTrailWidget progress={stepsProgress} width={60} />
                <h4 className="mt-2 md:mt-4 font-semibold text-text-primary text-xs md:text-sm">Steps</h4>
                <p className="text-[10px] md:text-xs text-text-secondary">{displayMetrics.steps} / {targetSteps}</p>
              </InteractiveCard>
            </div>
            <div onClick={() => handleRoute('/training', 'workout-card')} className="cursor-pointer">
              <InteractiveCard className="flex flex-col items-center justify-center p-3 md:p-6 h-full text-center min-h-[110px]">
                <LivingEnergyCore progress={workoutState === 'completed' ? 1 : 0} size={40} />
                <h4 className="mt-2 md:mt-4 font-semibold text-text-primary text-xs md:text-sm">Workout</h4>
                <p className="text-[10px] md:text-xs text-text-secondary">{displayMetrics.workoutText}</p>
              </InteractiveCard>
            </div>
            <div onClick={() => handleRoute('/recovery', 'recovery-card')} className="cursor-pointer">
              <InteractiveCard className="flex flex-col items-center justify-center p-3 md:p-6 h-full text-center min-h-[110px]">
                <LivingHeartbeat progress={0.5} size={40} />
                <h4 className="mt-2 md:mt-4 font-semibold text-text-primary text-xs md:text-sm">Recovery</h4>
                <p className="text-[10px] md:text-xs text-text-secondary">Pending</p>
              </InteractiveCard>
            </div>
          </div>
        </motion.div>

        {/* 3. COACH & QUICK ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-12">
          
          <div className="md:col-span-2 space-y-6">
            <WidgetSection title="Today's AI Coach">
              <GlassCard className="p-4 md:p-6 border-accent-mission/30 bg-gradient-to-br from-accent-mission/5 to-transparent">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-accent-mission/10 flex items-center justify-center">
                    <Sparkles size={20} className="text-accent-mission" />
                  </div>
                  <Heading level="h4">Next Focus</Heading>
                </div>
                
                <BodyText size="md" className="leading-relaxed text-text-secondary mb-6">
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
        <div className="mb-6 md:mb-12">
          <WidgetSection title="Overview & Reports">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <InteractiveCard onClick={() => handleRoute('/progress', 'progress-streak')} className="flex flex-col justify-between min-h-[120px] md:min-h-[140px] p-4 md:p-5">
                <span className="text-sm md:text-base font-semibold text-text-primary">Current Streak</span>
                <div className="flex justify-between items-center mt-1 md:mt-2">
                  <span className="text-xs md:text-sm text-text-secondary">Days Active</span>
                  <span className="text-sm md:text-base font-semibold text-accent-dashboard">{aiSummary?.currentStreak || 0} Days</span>
                </div>
                <div className="flex gap-1 mt-2 md:mt-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((day, idx) => (
                    <div 
                      key={day} 
                      className={`h-1.5 md:h-2 flex-1 rounded-full ${idx < (aiSummary?.currentStreak || 0) % 7 ? 'bg-accent-dashboard' : 'bg-border'}`} 
                    />
                  ))}
                </div>
              </InteractiveCard>

              <InteractiveCard onClick={() => setIsReminderModalOpen(true)} className="flex flex-col justify-between min-h-[120px] md:min-h-[140px] p-4 md:p-5">
                <span className="text-sm md:text-base font-semibold text-text-primary">Active Reminder</span>
                <div className="flex flex-col gap-1 mt-1 md:mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-text-secondary">Next Alert</span>
                    <span className="text-sm md:text-base font-semibold text-accent-dashboard">2:00 PM</span>
                  </div>
                  <span className="text-sm md:text-base font-medium mt-1 text-text-primary">Hydration Check</span>
                </div>
              </InteractiveCard>

              <InteractiveCard onClick={() => handleRoute('/progress', 'latest-report')} className="flex flex-col justify-between min-h-[120px] md:min-h-[140px] p-4 md:p-5">
                <span className="text-sm md:text-base font-semibold text-text-primary">Latest Report</span>
                <div className="flex flex-col gap-1 mt-1 md:mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm text-text-secondary">Weekly Summary</span>
                    <span className="text-sm md:text-base font-semibold text-success">Available</span>
                  </div>
                  <span className="text-xs md:text-sm mt-1 text-text-secondary">View your progress from last week.</span>
                </div>
              </InteractiveCard>

              <InteractiveCard onClick={() => handleRoute('/progress', 'progress-card')} className="flex flex-col justify-between min-h-[120px] md:min-h-[140px] p-4 md:p-5">
                <span className="text-sm md:text-base font-semibold text-text-primary">Workout Consistency</span>
                <div className="flex justify-between items-center mt-1 md:mt-2">
                  <span className="text-xs md:text-sm text-text-secondary">Weekly Goal</span>
                  <span className="text-sm md:text-base font-semibold text-success">{goalCompletion?.workouts || 0}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-1.5 md:h-2 mt-2">
                  <div className="bg-success h-1.5 md:h-2 rounded-full" style={{ width: `${goalCompletion?.workouts || 0}%` }} />
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
