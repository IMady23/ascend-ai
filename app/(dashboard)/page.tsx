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

  const { profile } = useUserStore();
  const { dailyWaterMl } = useNutritionStore();
  const router = useRouter();
  
  const [isMealLoggerOpen, setIsMealLoggerOpen] = React.useState(false);
  const [isCoachOpen, setIsCoachOpen] = React.useState(false);
  const [isWaterLoggerOpen, setIsWaterLoggerOpen] = React.useState(false);
  const [isStepsLoggerOpen, setIsStepsLoggerOpen] = React.useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = React.useState(false);
  const [isActionLoading, setIsActionLoading] = React.useState<string | null>(null);
  const [currentSteps, setCurrentSteps] = React.useState(0);

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
  
  // Real Empty State Metrics
  const targetCalories = targets?.dailyCalories || 2000;
  const targetWater = (targets?.water || 3000) / 1000; // in L
  const targetSteps = profile.preferences?.stepGoal || 10000;

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
                  <Caption className="uppercase tracking-widest text-[var(--color-accent-blue)] mb-2 md:mb-3 font-semibold text-xs md:text-sm">Today's Focus</Caption>
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
                  <ProgressRing value={85} size={90} strokeWidth={6} color="var(--color-accent-blue)" icon={<Statistic className="text-3xl"><AnimatedNumber value={85} /></Statistic>} />
                </div>
                
                {/* Desktop Ring */}
                <div className="hidden md:block">
                  <ProgressRing value={85} size={120} strokeWidth={8} color="var(--color-accent-blue)" icon={<Statistic className="text-4xl"><AnimatedNumber value={85} /></Statistic>} />
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
                value={`0 / ${targetCalories}`} 
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
                value={`${currentSteps} / ${targetSteps}`} 
                icon={<Activity size={18} />} 
                status="neutral"
              />
            </div>
            <div onClick={() => handleRoute('/training', 'workout-card')} className="cursor-pointer hover:opacity-80 transition-opacity">
              <MetricCard 
                label="Workout" 
                value="Not Started" 
                icon={<Dumbbell size={18} />} 
                status="neutral"
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
            <WidgetSection title="Coach Recommendation">
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
        currentSteps={currentSteps}
        onSave={(steps) => setCurrentSteps(steps)}
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
