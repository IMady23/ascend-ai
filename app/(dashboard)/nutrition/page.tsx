"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { 
  Flame, 
  Target, 
  Sparkles, 
  UtensilsCrossed, 
  Droplets,
  Plus,
  ShoppingBag,
  TrendingUp,
  BrainCircuit,
  Leaf
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { DashboardLayout, HeroSection, WidgetSection } from "@/components/adl/layout/Layouts";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Badge } from "@/components/adl/primitives/Badge";
import { Omnibar } from "@/components/adl/composites/ai/Omnibar";
import { ThinkingIndicator } from "@/components/adl/composites/ai/AI";
import { aiService } from "@/services/ai/ai.service";

import { MacroRing } from "@/components/adl/composites/nutrition/MacroRing";
import { MealCard, MealItem } from "@/components/adl/composites/nutrition/MealCard";
import { HydrationBeakerWidget } from "@/components/ui/widgets/HydrationBeakerWidget";
import { triggerCelebration } from "@/components/ui/CelebrationSystem";
import { FoodChip } from "@/components/adl/composites/nutrition/FoodChip";
import { EmptyState } from "@/components/adl/composites/feedback/EmptyState";
import { MealLoggerModal } from "@/components/adl/composites/nutrition/MealLoggerModal";
import { MealPlanGenerator } from "@/components/adl/composites/nutrition/MealPlanGenerator";
import { useUserStore } from "@/stores/user.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useDataReadiness } from "@/hooks/useDataReadiness";
import { MealConfirmationWidget } from "@/features/ai/components/MealConfirmationWidget";

export default function NutritionModule() {
  const { profile, isLoading: isUserLoading } = useUserStore();
  const { meals = [], dailyCalories, dailyProtein, dailyWaterMl, dailySugar, setDailyWater, currentDate } = useNutritionStore();
  
  const readiness = useDataReadiness();
  const isLoading = isUserLoading || readiness.nutrition.status === "loading";

  const [hydration, setHydration] = React.useState(dailyWaterMl);
  const [isLoggerOpen, setIsLoggerOpen] = React.useState(false);
  const [loggerType, setLoggerType] = React.useState<any>("lunch");
  const [mealToEdit, setMealToEdit] = React.useState<any>(null);
  const [isPlanGeneratorOpen, setIsPlanGeneratorOpen] = React.useState(false);
  const [isOmniProcessing, setIsOmniProcessing] = React.useState(false);
  const [omniFeedback, setOmniFeedback] = React.useState<string | null>(null);
  const [pendingToolCall, setPendingToolCall] = React.useState<any>(null);

  const handleOmniSend = async (text: string) => {
    if (!text.trim()) return;
    setIsOmniProcessing(true);
    setOmniFeedback(null);
    try {
      const response = await aiService.getCoachingResponse(
        { overridePrompt: "You are the nutrition module AI. Route intents for meal logging, meal planning, or water logging. Be brief." },
        text,
        []
      );
      if (response && response.response) {
        setOmniFeedback(response.response.summary);
        const logMealTool = response.response.tool_calls?.find((t: any) => t.tool === 'Log_Meal');
        if (logMealTool) {
            setPendingToolCall(logMealTool);
        } else {
            setPendingToolCall(null);
        }
      }
    } catch (e) {
      setOmniFeedback("Failed to process your request.");
      setPendingToolCall(null);
    } finally {
      setIsOmniProcessing(false);
    }
  };
  
  React.useEffect(() => {
    setHydration(dailyWaterMl);
  }, [dailyWaterMl]);

  // Set Page Accent
  React.useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", "var(--color-accent-green)");
    return () => document.documentElement.style.setProperty("--current-accent", "var(--color-accent-blue)");
  }, []);

  const targets = {
    dailyCalories: profile?.preferences?.goals?.calories || profile?.targets?.dailyCalories || 2000,
    protein: profile?.preferences?.goals?.proteinGrams || profile?.targets?.protein || 150,
    carbs: profile?.preferences?.goals?.carbsGrams || profile?.targets?.carbs || 200,
    fat: profile?.preferences?.goals?.fatGrams || profile?.targets?.fat || 65,
    water: profile?.preferences?.goals?.waterMl || profile?.targets?.water || 3000
  };

  const todaysMeals = meals.filter(m => m.date === currentDate);
  
  const currentCarbs = todaysMeals.reduce((acc: number, m: any) => acc + (m.carbs || 0), 0);
  const currentFat = todaysMeals.reduce((acc: number, m: any) => acc + (m.fat || 0), 0);

  const hasMeals = readiness.nutrition.status !== "empty";

  if (isLoading) {
    return (
      <PageContainer>
        <DashboardLayout>
          <div className="lg:col-span-3 space-y-6 flex items-center justify-center min-h-[50vh]">
             <div className="animate-pulse flex flex-col items-center gap-4">
               <div className="w-12 h-12 rounded-full border-4 border-border-subtle border-t-[var(--color-accent-green)] animate-spin" />
               <Caption className="text-[var(--color-text-muted)]">Syncing Repositories...</Caption>
             </div>
          </div>
        </DashboardLayout>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <DashboardLayout>
        
        {/* LEFT COLUMN: Execution & Command */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Nutrition Command Hero */}
          <HeroSection>
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-[var(--color-accent-green)]/30 text-[var(--color-accent-green)]">
                    <Target size={14} className="mr-1.5" /> Maintenance Phase
                  </Badge>
                  <Caption className="text-[var(--color-text-muted)] font-mono">Day 24/90</Caption>
                </div>
                
                <Heading level="h1" className="text-4xl md:text-5xl font-bold tracking-tight">
                  <span className="text-[var(--color-accent-green)]">{dailyCalories}</span>
                  <span className="text-[var(--color-text-muted)] text-3xl"> / {targets.dailyCalories} kcal</span>
                </Heading>
                
                <BodyText size="lg" className="text-secondary">
                  {profile?.goals?.primaryGoal ? `Fueling for ${profile.goals.primaryGoal}` : "Fueling your day."}
                </BodyText>
              </div>

              {/* Primary Macros */}
              <div className="flex items-center gap-6 shrink-0 bg-surface/50 p-6 rounded-[var(--radius-xl)] border border-border-subtle">
                <MacroRing 
                  label="Protein"
                  current={dailyProtein}
                  target={targets.protein}
                  color="var(--color-accent-blue)"
                  size={96}
                />
                <MacroRing 
                  label="Carbs"
                  current={currentCarbs}
                  target={targets.carbs}
                  color="var(--color-accent-green)"
                  size={96}
                />
              </div>
            </div>
          </HeroSection>

          {/* AI Intelligence & Coach */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Actionable Coach */}
            <GlassCard className="p-5 border-[var(--color-accent-indigo)]/20 bg-gradient-to-br from-[var(--color-accent-indigo)]/5 to-transparent relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit size={18} className="text-[var(--color-accent-indigo)]" />
                <Heading level="h4" className="text-sm">Strategy Coach</Heading>
              </div>
              
              {!hasMeals ? (
                <BodyText size="sm" className="text-primary leading-relaxed mb-4">
                  I'm still learning about your eating habits. Log your first meal and I'll begin providing personalized strategy recommendations.
                </BodyText>
              ) : (
                <>
                  <BodyText size="sm" className="text-primary leading-relaxed mb-4">
                    Based on your recent meals, prioritize fast-digesting carbs and at least 40g of protein for dinner to maximize muscle glycogen replenishment.
                  </BodyText>
                  <div 
                    onClick={() => setIsPlanGeneratorOpen(true)}
                    className="p-3 bg-base/50 rounded-[var(--radius-lg)] border border-border-subtle flex items-center justify-between hover:border-[var(--color-accent-indigo)]/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center group-hover:bg-[var(--color-accent-indigo)]/10 transition-colors">
                        <Sparkles size={14} className="text-[var(--color-accent-indigo)]" />
                      </div>
                      <div>
                        <Heading level="h5" className="text-sm">Generate AI Meal Plan</Heading>
                        <Caption className="text-[var(--color-text-muted)]">Create optimized recipes for your goals</Caption>
                      </div>
                    </div>
                    <Plus size={16} className="text-[var(--color-text-muted)]" />
                  </div>
                </>
              )}
            </GlassCard>

            {/* Holistic Food Intelligence */}
            {hasMeals && (
              <GlassCard className="p-5 border-[var(--color-accent-pink)]/20 bg-gradient-to-br from-[var(--color-accent-pink)]/5 to-transparent flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Leaf size={18} className="text-[var(--color-accent-pink)]" />
                    <Heading level="h4" className="text-sm">AI Food Intelligence</Heading>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center h-full text-center py-4">
                   <Caption className="text-[var(--color-text-muted)]">Keep logging meals for a few more days. Once enough data is available, I'll start identifying patterns and giving personalized nutrition insights.</Caption>
                </div>
              </GlassCard>
            )}
            
          </div>

          {/* Hydration Tracker */}
          <HydrationBeakerWidget 
            currentOunces={hydration}
            goalOunces={targets.water}
            onClick={() => {
              const newHydration = Math.min(hydration + 250, targets.water);
              setHydration(newHydration);
              setDailyWater(newHydration);
              
              if (newHydration >= targets.water && hydration < targets.water) {
                triggerCelebration({
                  title: 'Hydration Goal Met!',
                  message: 'You crushed your daily water target. Stay hydrated!',
                  xpBurst: 50
                });
              }
            }}
          />

          {/* Meal Timeline */}
          {!hasMeals ? (
            <EmptyState
              emoji="🥗"
              title="No Meals Logged"
              description="Start tracking your meals to unlock nutrition analysis."
              primaryAction={{
                label: "Log Meal",
                onClick: () => setIsLoggerOpen(true),
                icon: <Plus size={16} />
              }}
            />
          ) : (
            <WidgetSection title="Today's Log">
              <div className="space-y-3">
                {todaysMeals.map((meal: any, i: number) => {
                  let timeStr = "Now";
                  if (meal.timestamp) {
                     const date = new Date((meal.timestamp as any).seconds ? (meal.timestamp as any).seconds * 1000 : (meal.timestamp as unknown as string | number));
                     timeStr = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                  }
                  
                  return (
                    <MealCard 
                      key={meal.id || i}
                      type={(meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)) as any}
                      time={timeStr}
                      totalCalories={meal.calories}
                      macros={{ protein: meal.protein, carbs: meal.carbs, fat: meal.fat }}
                      items={meal.foods?.map((f: any) => ({ name: f.name, calories: f.calories, amount: f.quantity + f.servingSize })) || []}
                      isAiVerified={meal.source === "ai"}
                      onEdit={() => {
                        setMealToEdit(meal);
                        setIsLoggerOpen(true);
                      }}
                      onDelete={() => {
                        if (confirm(`Are you sure you want to delete ${meal.name || meal.mealType}?`)) {
                          useNutritionStore.getState().deleteMeal(meal.id);
                        }
                      }}
                    />
                  );
                })}
                
                <button 
                  onClick={() => {
                    setMealToEdit(null);
                    setIsLoggerOpen(true);
                  }}
                  className="w-full p-4 border border-dashed border-border-subtle rounded-[var(--radius-xl)] flex items-center justify-center gap-2 text-[var(--color-text-muted)] hover:text-primary hover:border-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-bg-glass-hover)]"
                >
                  <Plus size={18} />
                  <span className="font-medium text-sm">Log Next Meal</span>
                </button>
              </div>
            </WidgetSection>
          )}

          {/* QUICK-LOG SHORTCUTS: Recent Foods Chip Bar */}
          {(() => {
            const recentFoods = useNutritionStore.getState().recentFoods.slice(0, 6);
            if (recentFoods.length === 0) return null;
            return (
              <WidgetSection title="Quick Log">
                <div className="flex flex-wrap gap-2">
                  {recentFoods.map((food, idx) => (
                    <button
                      key={food.id || idx}
                      onClick={async () => {
                        const now = Date.now();
                        const dateStr = new Date(now).toISOString().split("T")[0];
                        await useNutritionStore.getState().addMeal({
                          date: dateStr,
                          timestamp: { seconds: Math.floor(now / 1000), nanoseconds: 0 } as any,
                          mealType: "snack",
                          calories: food.calories,
                          protein: food.protein || 0,
                          carbs: food.carbs || 0,
                          fat: food.fat || 0,
                          foods: [{ ...food, id: crypto.randomUUID(), source: "manual" as const }],
                        });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border-subtle bg-surface hover:bg-[var(--color-bg-surface-hover)] hover:border-[var(--color-accent-green)]/50 transition-all active:scale-95"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      <Plus size={10} style={{ color: "var(--color-accent-green)" }} />
                      {food.name}
                      <span style={{ color: "var(--color-text-muted)" }} className="font-normal">{food.calories}kcal</span>
                    </button>
                  ))}
                </div>
              </WidgetSection>
            );
          })()}

        </div>

        {/* RIGHT COLUMN: Telemetry & Actions */}
        <div className="lg:col-span-1 space-y-6">
          
          <WidgetSection title="Macro Telemetry">
            <GlassCard className="p-6">
              <div className="flex flex-col items-center gap-8">
                <div className="text-center">
                  <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mb-1">Daily Score</Caption>
                  <Heading level="h2" className="text-5xl font-mono text-[var(--color-accent-green)] drop-shadow-sm">{hasMeals ? "Pending" : "—"}</Heading>
                </div>

                <div className="w-full h-px bg-[var(--color-glass-border)]" />

                {/* Secondary Macros */}
                <div className="w-full flex justify-between px-2">
                  <MacroRing 
                    label="Fat"
                    current={currentFat}
                    target={targets.fat}
                    color="var(--color-accent-gold)"
                    size={64}
                  />
                  <MacroRing 
                    label="Fiber"
                    current={0}
                    target={35}
                    color="var(--color-accent-indigo)"
                    size={64}
                  />
                  <MacroRing 
                    label="Sugar"
                    current={dailySugar || 0}
                    target={40}
                    color="var(--color-danger)"
                    size={64}
                  />
                </div>
              </div>
            </GlassCard>
          </WidgetSection>

          <WidgetSection title="AI Nutrition Workspace">
            <div className="flex flex-col gap-3 p-4 bg-surface/50 rounded-[var(--radius-xl)] border border-border-subtle">
              <Caption className="text-[var(--color-text-muted)]">Describe what you ate or what you want to achieve.</Caption>
              
              <div className="bg-base border border-border-subtle rounded-[var(--radius-md)] relative overflow-hidden focus-within:border-[var(--color-accent-blue)] transition-colors">
                <Omnibar 
                  onSend={handleOmniSend}
                  placeholder="e.g. I had two eggs and a toast"
                  className="w-full text-sm py-3"
                />
              </div>

              {isOmniProcessing && (
                <div className="flex items-center gap-2 mt-2 p-3 bg-[var(--color-accent-indigo)]/5 rounded-lg border border-[var(--color-accent-indigo)]/10">
                   <ThinkingIndicator size="sm" />
                   <Caption className="text-[var(--color-accent-indigo)] font-medium">Processing your request...</Caption>
                </div>
              )}

              {omniFeedback && !isOmniProcessing && (
                <div className="flex items-center gap-2 mt-2 p-3 bg-[var(--color-accent-green)]/10 rounded-lg border border-[var(--color-accent-green)]/20">
                   <Sparkles size={14} className="text-[var(--color-accent-green)] shrink-0" />
                   <BodyText size="sm" className="text-[var(--color-accent-green)]">{omniFeedback}</BodyText>
                </div>
              )}
              
              {pendingToolCall && !isOmniProcessing && (
                  <MealConfirmationWidget 
                    toolCall={pendingToolCall}
                    onConfirm={async (params) => {
                       const now = Date.now();
                       const newMeal = {
                         id: crypto.randomUUID(),
                         date: new Date().toISOString().split("T")[0],
                         timestamp: { seconds: Math.floor(now / 1000), nanoseconds: 0 } as any,
                         mealType: params.mealType || "snack",
                         calories: params.calories,
                         protein: params.protein || 0,
                         carbs: params.carbs || 0,
                         fat: params.fat || 0,
                         foods: [{
                           id: crypto.randomUUID(),
                           name: params.description || "Quick log",
                           quantity: 1,
                           servingSize: "serving",
                           calories: params.calories,
                           protein: params.protein || 0,
                           carbs: params.carbs || 0,
                           fat: params.fat || 0,
                           source: "ai" as const
                         }]
                       };
                       useNutritionStore.getState().addMeal(newMeal);
                       setPendingToolCall(null);
                       setOmniFeedback("Meal confirmed! Updating...");
                       
                       try {
                           const followUpRes = await fetch('/api/ai', {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json' },
                               body: JSON.stringify({
                                   messageText: "I have confirmed the meal log. Please give me brief follow-up guidance on how it helps my goals.",
                                   userId: useUserStore.getState().userId,
                                   confirmedToolCall: { tool: 'Log_Meal', params }
                               })
                           });
                           if (followUpRes.ok) {
                               const followUpData = await followUpRes.json();
                               if (followUpData.data?.summary) {
                                   setOmniFeedback(followUpData.data.summary);
                               }
                           }
                       } catch(e) {
                           console.error(e);
                       }
                    }}
                    onEdit={() => {
                        setPendingToolCall(null);
                        setMealToEdit({
                          id: "temp",
                          mealType: pendingToolCall.params.mealType || "snack",
                          calories: pendingToolCall.params.calories,
                          protein: pendingToolCall.params.protein || 0,
                          carbs: pendingToolCall.params.carbs || 0,
                          fat: pendingToolCall.params.fat || 0,
                          foods: [{
                             name: pendingToolCall.params.description || "Quick log"
                          }]
                        });
                        setIsLoggerOpen(true);
                    }}
                    onCancel={() => {
                        setPendingToolCall(null);
                        setOmniFeedback("Meal log cancelled.");
                    }}
                  />
              )}

              <div className="w-full h-px bg-[var(--color-glass-border)] my-2" />

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => setIsLoggerOpen(true)} variant="secondary" size="sm" fullWidth className="justify-start">
                  <Plus size={14} className="mr-1" /> Manual Log
                </Button>
                <Button onClick={() => setIsPlanGeneratorOpen(true)} variant="secondary" size="sm" fullWidth className="justify-start">
                  <Sparkles size={14} className="mr-1" /> Meal Plan
                </Button>
              </div>
            </div>
          </WidgetSection>

          {hasMeals && (
            <WidgetSection title="Weekly Insights">
              <GlassCard className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-center py-4">
                   <Caption className="text-[var(--color-text-muted)] text-center">Insights will generate at the end of the week based on your consistency.</Caption>
                </div>
              </GlassCard>
            </WidgetSection>
          )}

        </div>
      </DashboardLayout>

      <MealLoggerModal 
        isOpen={isLoggerOpen} 
        onClose={() => {
          setIsLoggerOpen(false);
          setMealToEdit(null);
        }} 
        defaultMealType={loggerType}
        mealToEdit={mealToEdit}
      />

      <MealPlanGenerator 
        isOpen={isPlanGeneratorOpen}
        onClose={() => setIsPlanGeneratorOpen(false)}
      />
    </PageContainer>
  );
}
