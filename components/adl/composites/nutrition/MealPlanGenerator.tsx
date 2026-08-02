"use client";

import * as React from "react";
import { X, Sparkles, ShoppingBag, Check, RotateCcw, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Badge } from "@/components/adl/primitives/Badge";
import { useNutritionStore } from "@/stores/nutrition.store";
import type { MealPlan, MealPlanMeal } from "@/types/nutrition";
import { motion, AnimatePresence } from "framer-motion";
import { useUserStore } from "@/stores/user.store";
import { aiService } from "@/services/ai/ai.service";
import { Omnibar } from "@/components/adl/composites/ai/Omnibar";
import { ThinkingIndicator } from "@/components/adl/composites/ai/AI";

interface MealPlanGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MealPlanGenerator({ isOpen, onClose }: MealPlanGeneratorProps) {
  const { addMealPlan, mealPlans, updateMealPlanStatus } = useNutritionStore();
  const { userId } = useUserStore();
  
  const [messages, setMessages] = React.useState<{role: string, content: string}[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [showGroceryList, setShowGroceryList] = React.useState(false);
  const [currentPlan, setCurrentPlan] = React.useState<MealPlan | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  
  const [isRegeneratingMeal, setIsRegeneratingMeal] = React.useState<string | null>(null);
  
  const chatEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setMessages([]);
      setCurrentPlan(null);
      setShowGroceryList(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    
    try {
      const prevPlansCount = useNutritionStore.getState().mealPlans.length;
      
      const response = await aiService.getCoachingResponse(
        { overridePrompt: "You are a meal planning assistant. Ask questions to understand the user's dietary needs, allergies, and calorie goals. Once clear, invoke Generate_Meal_Plan tool. Explain your reasoning." },
        text,
        messages
      );
      
      const currentPlans = useNutritionStore.getState().mealPlans;
      if (currentPlans.length > prevPlansCount) {
        // A new plan was generated!
        setCurrentPlan(currentPlans[0]); // assuming prepended or we can sort by date
      } else if (response?.response?.tool_calls?.some(t => t.tool === 'Generate_Meal_Plan')) {
        // Fallback in case store update was delayed but tool was called
        setTimeout(() => {
           const latestPlans = useNutritionStore.getState().mealPlans;
           if (latestPlans.length > 0) setCurrentPlan(latestPlans[0]);
        }, 500);
      }
      
      if (response && response.response) {
        setMessages(prev => [...prev, { role: "assistant", content: response.response.summary }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: "assistant", content: "I encountered an error trying to process that." }]);
    } finally {
      setIsTyping(false);
    }
  };
  // Legacy mock generation block removed to fix syntax and scope issues

  const regenerateMeal = async (mealType: string) => {
    setIsRegeneratingMeal(mealType);
    
    try {
      const prompt = `Regenerate the ${mealType} for my current meal plan. My goal is to maintain the same macros but swap the ingredients. Output ONLY a tool call to Generate_Meal_Plan with the updated meal replacing the old one. Keep other meals identical.`;
      
      await aiService.getCoachingResponse(
        { overridePrompt: "You are regenerating a single meal. Keep the rest of the plan identical. Invoke Generate_Meal_Plan tool with the updated plan." },
        prompt,
        []
      );
      
      setTimeout(() => {
         const latestPlans = useNutritionStore.getState().mealPlans;
         if (latestPlans.length > 0) setCurrentPlan(latestPlans[0]);
         setIsRegeneratingMeal(null);
      }, 1000);
      
    } catch (e) {
      setIsRegeneratingMeal(null);
    }
  };

  const handleSavePlan = async () => {
    if (!currentPlan) return;
    updateMealPlanStatus(currentPlan.id, "active");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        <GlassCard className="flex flex-col flex-1 overflow-hidden border border-[var(--color-accent-indigo)]/30 bg-base/95 shadow-2xl relative">
          
          {/* Header */}
          <div className="p-5 border-b border-border-subtle flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-accent-indigo)] to-[var(--color-accent-blue)] flex items-center justify-center">
                <Sparkles size={18} className="text-primary" />
              </div>
              <div>
                <Heading level="h3">AI Meal Plan Generator</Heading>
                <Caption className="text-[var(--color-text-muted)]">Customized to your macros & preferences</Caption>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-[var(--color-text-muted)] hover:text-primary rounded-full hover:bg-surface transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {!currentPlan ? (
              <div className="flex flex-col h-full max-w-2xl mx-auto space-y-6">
                <div className="text-center space-y-2 mb-4">
                  <Heading level="h2">Meal Planning Workspace</Heading>
                  <BodyText className="text-[var(--color-text-muted)]">
                    Describe your goals, allergies, and preferences. I'll create a customized plan.
                  </BodyText>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 px-2">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === "user" ? "bg-[var(--color-accent-indigo)] text-primary" : "bg-surface border border-border-subtle text-primary"}`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl px-4 py-4 bg-surface border border-border-subtle flex items-center">
                        <ThinkingIndicator size="sm" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="mt-auto pt-4 border-t border-border-subtle relative">
                  <Omnibar 
                    onSend={handleSend} 
                    placeholder="E.g. I need vegetarian meals under 2000 calories..."
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Plan Overview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <Heading level="h2">{currentPlan.title}</Heading>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className="border-[var(--color-accent-green)]/30 text-[var(--color-accent-green)]">
                        {currentPlan.totalCalories} kcal
                      </Badge>
                      <Caption className="text-[var(--color-text-muted)]">P: {currentPlan.totalProtein}g • C: {currentPlan.totalCarbs}g • F: {currentPlan.totalFat}g</Caption>
                    </div>
                  </div>
                  <Button 
                    variant={showGroceryList ? "primary" : "secondary"} 
                    size="sm" 
                    onClick={() => setShowGroceryList(!showGroceryList)}
                    leftIcon={<ShoppingBag size={14} />}
                  >
                    {showGroceryList ? "View Meals" : "View Grocery List"}
                  </Button>
                </div>

                {showGroceryList ? (
                  <div className="space-y-6">
                    <Heading level="h3">Categorized Grocery List</Heading>
                    {['Produce', 'Protein', 'Grains', 'Dairy', 'Pantry'].map(category => {
                      const categoryItems = currentPlan.groceryList.filter(item => {
                         // Very basic mock categorization for display logic
                         const n = item.name.toLowerCase();
                         if (category === 'Protein' && (n.includes('chicken') || n.includes('steak') || n.includes('protein'))) return true;
                         if (category === 'Grains' && (n.includes('rice') || n.includes('oat') || n.includes('bread'))) return true;
                         if (category === 'Dairy' && (n.includes('milk') || n.includes('cheese') || n.includes('yogurt'))) return true;
                         if (category === 'Produce' && (n.includes('potato') || n.includes('apple') || n.includes('spinach'))) return true;
                         if (category === 'Pantry') return true; // fallback
                         return false;
                      });
                      
                      // Remove duplicates across categories caused by naive fallback
                      if (categoryItems.length === 0) return null;
                      
                      return (
                        <div key={category} className="space-y-2">
                           <Heading level="h5" className="text-secondary border-b border-border-subtle pb-1">{category}</Heading>
                           <ul className="space-y-1">
                             {categoryItems.map((item, i) => (
                               <li key={i} className="flex justify-between text-sm">
                                  <span>{item.name}</span>
                                  <span className="text-[var(--color-text-muted)]">{item.quantity} {item.unit}</span>
                               </li>
                             ))}
                           </ul>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentPlan.meals.map((meal, idx) => (
                    <GlassCard key={idx} className="p-4 border border-border-subtle relative overflow-hidden group">
                      {isRegeneratingMeal === meal.mealType && (
                        <div className="absolute inset-0 z-10 bg-base/80 backdrop-blur-sm flex items-center justify-center flex-col gap-2">
                          <div className="w-8 h-8 rounded-full border-2 border-[var(--color-accent-indigo)] border-t-transparent animate-spin" />
                          <Caption className="text-[var(--color-accent-indigo)] font-medium">Re-calculating...</Caption>
                        </div>
                      )}
                      
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="default" className="bg-surface text-secondary">
                              {meal.mealType.toUpperCase()}
                            </Badge>
                            <Heading level="h4" className="text-lg">{meal.name}</Heading>
                          </div>
                          <Caption className="text-[var(--color-text-muted)]">
                            {meal.calories} kcal • P:{meal.protein}g C:{meal.carbs}g F:{meal.fat}g
                          </Caption>
                        </div>
                        <button 
                          onClick={() => regenerateMeal(meal.mealType)}
                          disabled={isRegeneratingMeal !== null}
                          className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent-indigo)] hover:bg-[var(--color-accent-indigo)]/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                          title="Regenerate this meal"
                        >
                          <RotateCcw size={16} />
                        </button>
                      </div>

                      <div className="bg-[var(--color-accent-indigo)]/5 rounded-[var(--radius-md)] p-3 mb-4 flex items-start gap-2 border border-[var(--color-accent-indigo)]/10">
                        <Sparkles size={14} className="text-[var(--color-accent-indigo)] shrink-0 mt-0.5" />
                        <BodyText size="sm" className="text-[var(--color-accent-indigo)] leading-relaxed">
                          {meal.explanation}
                        </BodyText>
                      </div>

                      <div className="space-y-2">
                        {meal.foods.map((food, fIdx) => (
                          <div key={fIdx} className="flex items-center justify-between py-1 border-b border-border-subtle last:border-0">
                            <BodyText size="sm">{food.name}</BodyText>
                            <Caption className="text-[var(--color-text-muted)]">{food.quantity}{food.servingSize}</Caption>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  ))}
                </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {currentPlan && (
            <div className="p-5 border-t border-border-subtle bg-surface/50 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setCurrentPlan(null)}>Start Over</Button>
              <Button 
                variant="primary" 
                onClick={handleSavePlan}
                className="bg-[var(--color-accent-indigo)] hover:bg-[var(--color-accent-indigo)]/90 text-primary border-none"
                leftIcon={<Check size={16} />}
              >
                Save to My Plans
              </Button>
            </div>
          )}
          
        </GlassCard>
      </motion.div>
    </div>
  );
}
