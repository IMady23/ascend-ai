"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Dumbbell, 
  Clock, 
  Flame, 
  Trophy, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ChevronRight, 
  ArrowLeft 
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { DashboardLayout, HeroSection, WidgetSection } from "@/components/adl/layout/Layouts";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Badge } from "@/components/adl/primitives/Badge";
import { ProgressRing } from "@/components/adl/composites/progress/Progress";
import { ThinkingIndicator } from "@/components/adl/composites/ai/AI";

import { ExerciseCard, ExerciseSet } from "@/components/adl/composites/training/ExerciseCard";
import { RestTimer } from "@/components/adl/composites/training/RestTimer";
import { useUserStore } from "@/stores/user.store";
import { useActivityStore } from "@/stores/activity.store";
import { useDataReadiness } from "@/hooks/useDataReadiness";

// --- Mock Data ---
const MOCK_WORKOUT = {
  name: "Upper Body Power",
  split: "Hypertrophy Phase • Week 3",
  duration: 60,
  calories: 450,
  xp: 1200,
  difficulty: "Hard",
  goal: "Focus on explosive concentrics today.",
};

const INITIAL_EXERCISES = [
  {
    id: "ex1",
    name: "Barbell Bench Press",
    targetMuscles: ["Chest", "Triceps", "Front Delts"],
    equipment: "Barbell, Bench",
    tips: ["Keep shoulders retracted", "Keep feet planted", "Control the eccentric"],
    targetSets: 4,
    targetReps: "5-8",
    sets: [
      { id: "s1", reps: 8, weight: 80, completed: false, status: "pending", rpe: 0, previousBest: "80kg x 8" },
      { id: "s2", reps: 8, weight: 80, completed: false, status: "pending", rpe: 0, previousBest: "80kg x 8" },
      { id: "s3", reps: 6, weight: 85, completed: false, status: "pending", rpe: 0, previousBest: "82.5kg x 6" },
      { id: "s4", reps: 5, weight: 85, completed: false, status: "pending", rpe: 0, previousBest: "85kg x 4" },
    ]
  },
  {
    id: "ex2",
    name: "Incline Dumbbell Press",
    targetMuscles: ["Upper Chest", "Front Delts"],
    equipment: "Dumbbells, Incline Bench",
    tips: ["Set bench to 30-45 degrees", "Press in a slight arc", "Don't flare elbows excessively"],
    targetSets: 3,
    targetReps: "8-10",
    sets: [
      { id: "s1", reps: 10, weight: 30, completed: false, status: "pending", rpe: 0, previousBest: "30kg x 10" },
      { id: "s2", reps: 10, weight: 30, completed: false, status: "pending", rpe: 0, previousBest: "30kg x 9" },
      { id: "s3", reps: 8, weight: 32.5, completed: false, status: "pending", rpe: 0, previousBest: "30kg x 8" },
    ]
  },
  {
    id: "ex3",
    name: "Weighted Pull-ups",
    targetMuscles: ["Lats", "Biceps", "Forearms"],
    equipment: "Pull-up Bar, Weight Belt",
    tips: ["Full range of motion", "Pull with your elbows", "Core engaged"],
    targetSets: 4,
    targetReps: "6-8",
    sets: [
      { id: "s1", reps: 8, weight: 15, completed: false, status: "pending", rpe: 0, previousBest: "15kg x 8" },
      { id: "s2", reps: 8, weight: 15, completed: false, status: "pending", rpe: 0, previousBest: "15kg x 7" },
      { id: "s3", reps: 6, weight: 20, completed: false, status: "pending", rpe: 0, previousBest: "15kg x 6" },
      { id: "s4", reps: 5, weight: 20, completed: false, status: "pending", rpe: 0, previousBest: "-" },
    ]
  }
];

export default function TrainingModule() {
  const { profile, isLoading: isUserLoading } = useUserStore();
  const { 
    currentActivity, 
    activeExercises, 
    workoutState,
    setActiveExercises, 
    updateExerciseSet, 
    startWarmup,
    startExercise,
    setWorkoutState,
    finishWorkout, 
    isLoading: isActivityLoading 
  } = useActivityStore() as any;
  const readiness = useDataReadiness();

  const isLoading = isUserLoading || isActivityLoading;

  const [activeExerciseIndex, setActiveExerciseIndex] = React.useState(0);

  // Initialize mock exercises if empty
  React.useEffect(() => {
    if (currentActivity && activeExercises.length === 0) {
      setActiveExercises(INITIAL_EXERCISES);
    }
  }, [currentActivity, activeExercises.length, setActiveExercises]);

  const exercises = activeExercises.length > 0 ? activeExercises : INITIAL_EXERCISES;
  
  // Rest Timer State
  const [isResting, setIsResting] = React.useState(false);
  const [restDuration, setRestDuration] = React.useState(90);

  // Stats
  const totalSets = exercises.reduce((acc: number, ex: any) => acc + ex.sets.length, 0);
  const completedSets = exercises.reduce((acc: number, ex: any) => acc + ex.sets.filter((s: any) => s.completed).length, 0);
  const progressPercent = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
  
  const hasWorkout = readiness.training.status === "ready";
  const currentXP = hasWorkout ? Math.floor((completedSets / totalSets) * 1200) : 0;

  // Set Page Accent
  React.useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", "var(--color-accent-orange)");
    return () => document.documentElement.style.setProperty("--current-accent", "var(--color-accent-blue)");
  }, []);

  if (isLoading) {
    return (
      <PageContainer>
        <DashboardLayout>
          <div className="lg:col-span-3 space-y-6 flex items-center justify-center min-h-[50vh]">
             <div className="animate-pulse flex flex-col items-center gap-4">
               <div className="w-12 h-12 rounded-full border-4 border-[var(--color-glass-border)] border-t-[var(--color-accent-orange)] animate-spin" />
               <Caption className="text-[var(--color-text-muted)]">Syncing Repositories...</Caption>
             </div>
          </div>
        </DashboardLayout>
      </PageContainer>
    );
  }

  const handleUpdateSet = (exerciseId: string, setId: string, updates: Partial<ExerciseSet>) => {
    updateExerciseSet(exerciseId, setId, updates);
    if (updates.completed === true) {
      setIsResting(true);
      setRestDuration(90); // Default 90s rest
    }
  };

  // Auto-advance active exercise if all sets are completed
  React.useEffect(() => {
    if (["in_progress", "rest_timer"].includes(workoutState)) {
      const activeEx = exercises[activeExerciseIndex];
      if (activeEx && activeEx.sets.every((s: any) => s.completed)) {
        if (activeExerciseIndex < exercises.length - 1) {
          const timer = setTimeout(() => {
            setActiveExerciseIndex(prev => prev + 1);
          }, 600);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [exercises, activeExerciseIndex, workoutState]);

  const endWorkout = () => {
    finishWorkout();
  };

  const dismissCelebration = () => {
    setWorkoutState("not_started");
  };

  // --- Render Helpers ---

  const renderPlanningMode = () => (
    <DashboardLayout>
      {/* TOP HERO ZONE */}
      <div className="lg:col-span-3 space-y-6">
        <HeroSection className="bg-gradient-to-br from-[var(--color-bg-base)] via-[var(--color-bg-surface)] to-[var(--color-accent-orange)]/5">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between w-full">
            
            <div className="flex-1 w-full max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Flame size={16} className="text-[var(--color-accent-orange)]" />
                <Caption className="text-[var(--color-accent-orange)] uppercase tracking-widest font-bold">Mission Control</Caption>
              </div>
              
              {!hasWorkout ? (
                 <>
                   <Heading level="h2" className="text-3xl tracking-tight mb-2">Recovery Day</Heading>
                   <BodyText size="lg" className="text-[var(--color-text-secondary)] mb-6">
                     No mission scheduled today. Rest and recover.
                   </BodyText>
                 </>
              ) : (
                 <>
                   <Heading level="h2" className="text-3xl tracking-tight mb-2">{currentActivity.name || "Today's Mission"}</Heading>
                   <BodyText size="lg" className="text-[var(--color-text-secondary)] mb-6">
                     {currentActivity.description || "Get ready to train."}
                   </BodyText>
                 </>
              )}
              
            </div>
          </div>
        </HeroSection>
      </div>

      {/* LEFT COLUMN: Execution Overview */}
      <div className="lg:col-span-2 space-y-6">
        {/* Workout Hero */}
        {hasWorkout && (
          <HeroSection>
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div className="space-y-4 max-w-2xl">
                <Caption className="text-[var(--color-accent-orange)] font-semibold tracking-widest uppercase">
                  {currentActivity.type || "Workout"}
                </Caption>
                <Heading level="h1" className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text-primary)]">
                  {currentActivity.name}
                </Heading>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary"><Clock size={14} className="mr-1.5" /> {currentActivity.durationMinutes || 60} Min</Badge>
                  <Badge variant="secondary"><Flame size={14} className="mr-1.5 text-[var(--color-accent-orange)]" /> {currentActivity.calories || 0} kcal</Badge>
                  <Badge variant="secondary"><Trophy size={14} className="mr-1.5 text-[var(--color-accent-gold)]" /> +{currentActivity.xp || 1200} XP</Badge>
                  <Badge variant="outline">{currentActivity.difficulty || "Medium"}</Badge>
                </div>

                <BodyText size="lg" className="text-[var(--color-text-secondary)]">
                  {currentActivity.description}
                </BodyText>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                onClick={startWarmup}
                className="w-full md:w-auto h-14 px-10 text-lg bg-[var(--color-accent-orange)] hover:bg-[var(--color-accent-orange-light)] shadow-[0_0_30px_rgba(var(--color-accent-orange-rgb),0.3)] border-none"
                rightIcon={<Play size={20} className="ml-2" />}
              >
                Start Mission
              </Button>
            </div>
          </HeroSection>
        )}

        {/* PR Opportunities */}
        {hasWorkout && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-5 border-[var(--color-accent-gold)]/20 bg-gradient-to-br from-[var(--color-accent-gold)]/5 to-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy size={64} className="text-[var(--color-accent-gold)]" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={18} className="text-[var(--color-accent-gold)]" />
                <Heading level="h4" className="text-sm">PR Opportunity</Heading>
              </div>
              <Heading level="h3" className="text-xl mb-1">Pushups</Heading>
              <div className="flex items-end gap-3 mt-4">
                <div>
                  <Caption className="text-[var(--color-text-muted)]">Current</Caption>
                  <div className="font-mono text-lg text-[var(--color-text-secondary)]">30</div>
                </div>
                <ChevronRight size={16} className="text-[var(--color-text-muted)] mb-1" />
                <div>
                  <Caption className="text-[var(--color-accent-gold)]">Predicted Today</Caption>
                  <div className="font-mono text-2xl font-bold text-[var(--color-accent-gold)] shadow-sm">35</div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Exercise Preview List */}
        <WidgetSection title="Mission Briefing">
          <div className="space-y-3">
            {exercises.map((ex: any, i: number) => (
              <GlassCard key={ex.id} className="p-4 flex items-center gap-4 hover:bg-[var(--color-bg-glass-hover)] transition-colors">
                <div className="w-8 h-8 rounded-full bg-[var(--color-bg-surface)] flex items-center justify-center text-[var(--color-text-muted)] font-mono text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <Heading level="h5" className="text-base">{ex.name}</Heading>
                  <Caption className="text-[var(--color-text-muted)]">
                    {ex.targetSets} Sets • {ex.targetReps} Reps
                  </Caption>
                </div>
              </GlassCard>
            ))}
          </div>
        </WidgetSection>
      </div>

      {/* RIGHT COLUMN: History & HUD */}
      <div className="lg:col-span-1 space-y-6">
        <WidgetSection title="History & Trends">
          <GlassCard className="p-4 mb-4 flex flex-col gap-1">
             <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider text-[10px] font-semibold">Last Session</Caption>
             <Heading level="h5" className="text-sm">Lower Body Power</Heading>
             <div className="flex items-center gap-2 mt-2">
               <Badge variant="outline" className="text-[10px]"><CheckCircle2 size={12} className="mr-1 text-[var(--color-success)]" /> Completed</Badge>
               <span className="text-xs text-[var(--color-text-muted)]">2 days ago</span>
             </div>
          </GlassCard>
          
          <GlassCard className="p-4 flex items-center justify-between bg-gradient-to-r from-[var(--color-bg-glass-standard)] to-[var(--color-bg-surface)]">
            <div>
              <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider text-[10px] font-semibold">Average Volume</Caption>
              <div className="text-xl font-mono mt-1 font-semibold">12,450 kg</div>
            </div>
            <TrendingUp size={24} className="text-[var(--color-success)] opacity-50" />
          </GlassCard>
        </WidgetSection>

        <WidgetSection title="Quick Actions">
          <div className="flex flex-col gap-2">
            <Button variant="secondary" fullWidth className="justify-start">Browse Exercises</Button>
            <Button variant="ghost" fullWidth className="justify-start">Import Workout</Button>
            <Button variant="ghost" fullWidth className="justify-start text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10">Skip Today</Button>
          </div>
        </WidgetSection>
      </div>
    </DashboardLayout>
  );

  const renderWarmupMode = () => (
    <div className="min-h-[calc(100vh-72px)] flex flex-col items-center justify-center p-6 text-center space-y-8">
      <div className="w-20 h-20 rounded-full bg-[var(--color-accent-orange)]/10 flex items-center justify-center">
        <Flame size={40} className="text-[var(--color-accent-orange)] animate-pulse" />
      </div>
      <div>
        <Heading level="h1" className="text-4xl tracking-tight mb-2">Warm-up Phase</Heading>
        <BodyText className="text-[var(--color-text-secondary)] max-w-md mx-auto">
          Prepare your central nervous system for {currentActivity?.name || "the session"}. Perform 5-10 minutes of light cardio followed by dynamic stretching of the chest and shoulders.
        </BodyText>
      </div>
      <div className="flex gap-4 pt-4">
        <Button variant="ghost" size="lg" onClick={startExercise} className="text-[var(--color-text-muted)] hover:text-white">Skip Warm-up</Button>
        <Button variant="primary" size="lg" onClick={startExercise} className="bg-[var(--color-accent-orange)] hover:bg-[var(--color-accent-orange-light)] border-none px-8">
          I'm Ready
        </Button>
      </div>
    </div>
  );

  const renderActiveMode = () => (
    <div className="min-h-[calc(100vh-72px)] flex flex-col md:flex-row relative">
      
      {/* MAIN EXECUTION COLUMN */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8 overflow-y-auto pb-32">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 -mx-4 md:-mx-8 px-4 md:px-8 py-4 bg-[var(--color-bg-base)]/80 backdrop-blur-xl border-b border-[var(--color-glass-border)] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              <Caption className="text-[var(--color-success)] uppercase tracking-widest font-bold">Active Mission</Caption>
            </div>
            <Heading level="h2" className="text-xl md:text-2xl mt-1">{currentActivity?.name || "Workout"}</Heading>
          </div>
          
          <Button 
            variant="ghost" 
            className="text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 hover:text-[var(--color-danger)] border border-[var(--color-danger)]/20"
            onClick={endWorkout}
          >
            End Workout
          </Button>
        </div>

        {/* Offline Banner */}
        <div className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] rounded-[var(--radius-lg)] p-3 flex items-center justify-center gap-2 text-xs text-[var(--color-text-secondary)]">
          <CheckCircle2 size={14} className="text-[var(--color-success)]" />
          Offline Mode active. Changes will sync automatically.
        </div>

        {/* Dynamic AI Coach (Mid-workout) */}
        <AnimatePresence mode="wait">
          {!isResting ? (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full p-4 rounded-[var(--radius-xl)] bg-[var(--color-accent-indigo)]/5 border border-[var(--color-accent-indigo)]/20 flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent-indigo)]/10 flex items-center justify-center shrink-0">
                <Sparkles size={20} className="text-[var(--color-accent-indigo)]" />
              </div>
              <div>
                <Heading level="h4" className="text-sm mb-1 text-[var(--color-accent-indigo-light)]">Technique Focus</Heading>
                <BodyText size="sm" className="text-[var(--color-text-secondary)]">
                  Maintain strict form on these compound lifts. Don't let your hips shoot up early on the eccentric phase.
                </BodyText>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="resting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <RestTimer 
                durationSeconds={restDuration}
                isActive={isResting}
                onComplete={() => setIsResting(false)}
                onSkip={() => setIsResting(false)}
                onAddTime={(secs) => setRestDuration(prev => prev + secs)}
                aiMessage="Heart rate is recovering optimally. Prepare for the next set."
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise List */}
        <div className="space-y-4 relative z-10">
          {exercises.map((ex: any, i: number) => (
            <ExerciseCard
              key={ex.id}
              name={ex.name}
              targetMuscles={ex.targetMuscles}
              equipment={ex.equipment}
              tips={ex.tips}
              targetSets={ex.targetSets}
              targetReps={ex.targetReps}
              sets={ex.sets}
              isActive={i === activeExerciseIndex}
              onClick={() => setActiveExerciseIndex(i)}
              onUpdateSet={(setId, updates) => handleUpdateSet(ex.id, setId, updates)}
            />
          ))}
        </div>

      </div>

      {/* RIGHT HUD / SIDEBAR (Floating on desktop) */}
      <div className="hidden md:block w-80 shrink-0 border-l border-[var(--color-glass-border)] bg-[var(--color-bg-base)]/50 p-6 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
        <Heading level="h4" className="text-sm text-[var(--color-text-muted)] uppercase tracking-widest mb-6">Live Status</Heading>
        
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-40 h-40">
            <ProgressRing
              value={progressPercent}
              size={160}
              strokeWidth={10}
              color="var(--color-accent-orange)"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Heading level="h2" className="text-3xl font-mono">{Math.round(progressPercent)}%</Heading>
              <Caption className="text-[var(--color-text-muted)]">Completed</Caption>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <GlassCard className="p-4 flex items-center justify-between">
            <Caption className="text-[var(--color-text-muted)]">Remaining</Caption>
            <div className="font-mono font-medium">{totalSets - completedSets} Sets</div>
          </GlassCard>
          
          <GlassCard className="p-4 flex items-center justify-between">
            <Caption className="text-[var(--color-text-muted)]">Earned XP</Caption>
            <div className="font-mono font-bold text-[var(--color-accent-gold)]">+{currentXP}</div>
          </GlassCard>
          
          <GlassCard className="p-4 flex flex-col gap-1">
            <Caption className="text-[var(--color-text-muted)]">Elapsed Time</Caption>
            <div className="font-mono text-xl">24:15</div>
            <Caption className="text-[var(--color-text-muted)] text-[10px]">Est. Finish: 9:45 AM</Caption>
          </GlassCard>
        </div>
      </div>
    </div>
  );

  const renderCelebration = () => (
    <div className="fixed inset-0 z-50 bg-[var(--color-bg-base)] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent-orange)]/10 via-[var(--color-bg-base)] to-[var(--color-accent-gold)]/10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="relative z-10 w-full max-w-lg bg-[var(--color-bg-glass-active)] backdrop-blur-3xl border border-[var(--color-glass-border)] rounded-[var(--radius-2xl)] p-8 md:p-12 text-center shadow-2xl flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--color-accent-gold)] to-[var(--color-accent-orange)] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(var(--color-accent-gold-rgb),0.4)]">
          <Trophy size={40} className="text-black" />
        </div>
        
        <Caption className="text-[var(--color-accent-orange)] tracking-widest uppercase font-bold mb-2">Mission Complete</Caption>
        <Heading level="h1" className="text-4xl md:text-5xl font-bold mb-8">{currentActivity?.name || "Workout"}</Heading>
        
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          <div className="bg-[var(--color-bg-surface)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-glass-border)]">
            <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-1">XP Earned</Caption>
            <div className="text-2xl font-mono text-[var(--color-accent-gold)] font-bold">+{currentXP}</div>
          </div>
          <div className="bg-[var(--color-bg-surface)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-glass-border)]">
            <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Volume</Caption>
            <div className="text-2xl font-mono font-bold">6,420<span className="text-sm font-normal text-[var(--color-text-muted)] ml-1">kg</span></div>
          </div>
          <div className="bg-[var(--color-bg-surface)] p-4 rounded-[var(--radius-lg)] border border-[var(--color-glass-border)]">
            <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-1">New PRs</Caption>
            <div className="text-2xl font-mono font-bold text-[var(--color-success)]">1</div>
          </div>
        </div>

        <div className="w-full bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] rounded-[var(--radius-lg)] p-5 mb-8 text-left">
          <div className="flex justify-between items-center mb-3">
            <Heading level="h4" className="text-lg">Workout Quality</Heading>
            <div className="text-[var(--color-success)] font-mono text-xl font-bold">95%</div>
          </div>
          <BodyText size="sm" className="text-[var(--color-text-secondary)] mb-5">Excellent Session. All sets completed with consistent rest periods.</BodyText>
          
          <div className="space-y-5 pt-5 border-t border-[var(--color-glass-border)]">
            <div>
              <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Personal Records</Caption>
              <div className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]">
                🏆 <span className="font-semibold text-[var(--color-accent-gold)]">Weight PR</span> • Barbell Bench Press (85kg)
              </div>
            </div>

            <div>
              <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Recovery Estimate</Caption>
              <div className="flex items-center gap-6 text-sm">
                <div><span className="text-[var(--color-text-muted)]">Time:</span> <span className="font-semibold text-[var(--color-text-primary)]">36 Hours</span></div>
                <div><span className="text-[var(--color-text-muted)]">Next:</span> <span className="font-semibold text-[var(--color-text-primary)]">Tomorrow (Legs)</span></div>
              </div>
            </div>

            <div>
              <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-2">AI Progression</Caption>
              <div className="bg-[var(--color-bg-base)] rounded-[var(--radius-md)] p-3 border border-[var(--color-accent-indigo)]/20">
                <div className="flex items-start gap-2">
                  <Sparkles size={16} className="text-[var(--color-accent-indigo)] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold">Barbell Bench Press</div>
                    <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Current: 85kg × 5 &nbsp;&rarr;&nbsp; <span className="text-[var(--color-accent-indigo-light)] font-medium">Suggested: 85kg × 6</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Button 
            variant="primary" 
            size="lg" 
            fullWidth 
            onClick={dismissCelebration}
            className="bg-[var(--color-accent-orange)] hover:bg-[var(--color-accent-orange-light)] border-none"
          >
            Return to Mission Control
          </Button>
          <Button variant="ghost" size="lg" fullWidth className="text-[var(--color-text-secondary)]">
            Review Workout
          </Button>
        </div>
      </motion.div>
    </div>
  );

  return (
    <PageContainer>
      <AnimatePresence mode="wait">
        <motion.div
          key={workoutState}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {(workoutState === "not_started" || workoutState === "saved") && renderPlanningMode()}
          {workoutState === "warm_up" && renderWarmupMode()}
          {["in_progress", "paused", "rest_timer", "exercise_transition"].includes(workoutState) && renderActiveMode()}
          {workoutState === "completed" && renderCelebration()}
        </motion.div>
      </AnimatePresence>
    </PageContainer>
  );
}
