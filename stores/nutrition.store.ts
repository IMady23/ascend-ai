import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NutritionLog, HydrationLog, MealPlan, FoodItem } from "@/types/nutrition";
import { NutritionRepository } from "@/services/repositories/nutrition.repository";
import { useUserStore } from "@/stores/user.store";
import { ReliabilityManager } from "@/lib/reliability/ReliabilityManager";
import { RELIABILITY_PROFILES } from "@/lib/reliability/types";
import { eventBus } from "@/lib/events/EventBus";

interface NutritionState {
  currentDate: string; // YYYY-MM-DD
  dailyCalories: number;
  dailyProtein: number;
  dailyWaterMl: number;
  dailySugar: number;

  meals: NutritionLog[];
  hydrationLogs: HydrationLog[];
  mealPlans: MealPlan[];
  favoriteFoods: FoodItem[];
  recentFoods: FoodItem[];
  customFoods: FoodItem[];

  // Setters for Sync
  setMeals: (meals: NutritionLog[]) => void;
  replaceMeals: (meals: NutritionLog[]) => void; // Full replace from Firestore (used by sync)
  setHydrationLogs: (logs: HydrationLog[]) => void;
  replaceHydrationLogs: (logs: HydrationLog[]) => void; // Full replace from Firestore (used by sync)
  setMealPlans: (plans: MealPlan[]) => void;
  setCustomFoods: (foods: FoodItem[]) => void;
  setCurrentDate: (date: string) => void;
  setDailyWater: (waterMl: number) => void; // Legacy support

  // Actions
  addMeal: (meal: Omit<NutritionLog, "id" | "userId" | "createdAt">) => Promise<void>;
  updateMeal: (id: string, updates: Partial<NutritionLog>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  
  addWater: (amountMl: number) => Promise<void>;
  
  addMealPlan: (plan: Omit<MealPlan, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<void>;
  updateMealPlanStatus: (id: string, status: MealPlan["status"]) => Promise<void>;
  
  addCustomFood: (food: Omit<FoodItem, "id" | "source">) => Promise<FoodItem>;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      currentDate: new Date().toISOString().split("T")[0],
      dailyCalories: 0,
      dailyProtein: 0,
      dailyWaterMl: 0,
      dailySugar: 0,
      
      meals: [],
      hydrationLogs: [],
      mealPlans: [],
      favoriteFoods: [],
      recentFoods: [],
      customFoods: [],

      setMeals: (newMeals) => {
        set((state) => {
          // Merge meals by ID to prevent wiping local optimistic updates or other dates
          const mealMap = new Map<string, NutritionLog>();
          state.meals.forEach(m => mealMap.set(m.id, m));
          newMeals.forEach(m => mealMap.set(m.id, m));
          const mergedMeals = Array.from(mealMap.values());
          mergedMeals.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          const todaysMeals = mergedMeals.filter(m => m.date === state.currentDate);
          return {
            meals: mergedMeals,
            dailyCalories: todaysMeals.reduce((acc, m) => acc + (m.calories || 0), 0),
            dailyProtein: todaysMeals.reduce((acc, m) => acc + (m.protein || 0), 0),
            dailySugar: todaysMeals.reduce((acc, m) => acc + (m.sugar || 0), 0),
          };
        });
      },

      // Full replace — used by NutritionSync so Firestore is authoritative source.
      // Does NOT merge with stale localStorage data.
      replaceMeals: (newMeals) => {
        set((state) => {
          const sorted = [...newMeals].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
          const todaysMeals = sorted.filter(m => m.date === state.currentDate);
          return {
            meals: sorted,
            dailyCalories: todaysMeals.reduce((acc, m) => acc + (m.calories || 0), 0),
            dailyProtein: todaysMeals.reduce((acc, m) => acc + (m.protein || 0), 0),
            dailySugar: todaysMeals.reduce((acc, m) => acc + (m.sugar || 0), 0),
          };
        });
      },
      setHydrationLogs: (logs) => {
        set((state) => {
          const logMap = new Map<string, HydrationLog>();
          state.hydrationLogs.forEach(l => logMap.set(l.id, l));
          logs.forEach(l => logMap.set(l.id, l));
          const mergedLogs = Array.from(logMap.values());
          mergedLogs.sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
          const todaysLogs = mergedLogs.filter(l => l.date === state.currentDate);
          return { hydrationLogs: mergedLogs, dailyWaterMl: todaysLogs.reduce((acc, l) => acc + (l.amountMl || 0), 0) };
        });
      },

      // Full replace — used by NutritionSync on login. Firestore is authoritative.
      replaceHydrationLogs: (logs) => {
        set((state) => {
          const sorted = [...logs].sort((a, b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0));
          const todaysLogs = sorted.filter(l => l.date === state.currentDate);
          return { hydrationLogs: sorted, dailyWaterMl: todaysLogs.reduce((acc, l) => acc + (l.amountMl || 0), 0) };
        });
      },
      setMealPlans: (plans) => {
        set((state) => {
          const planMap = new Map<string, MealPlan>();
          state.mealPlans.forEach(p => planMap.set(p.id, p));
          plans.forEach(p => planMap.set(p.id, p));
          const mergedPlans = Array.from(planMap.values());
          mergedPlans.sort((a, b) => {
            const aTime = a.updatedAt?.seconds || 0;
            const bTime = b.updatedAt?.seconds || 0;
            return bTime - aTime;
          });
          return { mealPlans: mergedPlans };
        });
      },
      setCustomFoods: (foods) => {
        set((state) => {
          const foodMap = new Map<string, FoodItem>();
          state.customFoods.forEach(f => foodMap.set(f.id, f));
          foods.forEach(f => foodMap.set(f.id, f));
          return { customFoods: Array.from(foodMap.values()) };
        });
      },
      setCurrentDate: (date) => set((state) => {
        const todaysMeals = state.meals.filter(m => m.date === date);
        const todaysWater = state.hydrationLogs.filter(l => l.date === date);
        
        return { 
          currentDate: date,
          dailyCalories: todaysMeals.reduce((acc, m) => acc + (m.calories || 0), 0),
          dailyProtein: todaysMeals.reduce((acc, m) => acc + (m.protein || 0), 0),
          dailySugar: todaysMeals.reduce((acc, m) => acc + (m.sugar || 0), 0),
          dailyWaterMl: todaysWater.reduce((acc, l) => acc + (l.amountMl || 0), 0)
        };
      }),
      setDailyWater: (waterMl) => set({ dailyWaterMl: waterMl }), // Legacy support

      addMeal: async (mealData) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        const newMeal: NutritionLog = {
          ...mealData,
          id: crypto.randomUUID(),
          userId,
          createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        };

        // Optimistic UI update
        set((state) => {
          // Keep recent foods updated locally
          const newRecentFoods = [...state.recentFoods];
          mealData.foods.forEach(f => {
            if (!newRecentFoods.find(rf => rf.name === f.name)) {
              newRecentFoods.unshift(f);
            }
          });
          const updatedMeals = [newMeal, ...state.meals];
          return { 
            meals: updatedMeals,
            dailyCalories: updatedMeals.filter(m => m.date === get().currentDate).reduce((acc, m) => acc + (m.calories || 0), 0),
            dailyProtein: updatedMeals.filter(m => m.date === get().currentDate).reduce((acc, m) => acc + (m.protein || 0), 0),
            dailySugar: updatedMeals.filter(m => m.date === get().currentDate).reduce((acc, m) => acc + (m.sugar || 0), 0),
            recentFoods: newRecentFoods.slice(0, 20) // Keep last 20
          };
        });

        // Fire & Forget to Reliability Manager
        ReliabilityManager.execute(
          'Firestore',
          'createNutritionLog',
          RELIABILITY_PROFILES.DATABASE_WRITE,
          newMeal.id,
          () => NutritionRepository.createNutritionLog(userId, newMeal),
          'retry'
        ).catch(console.error);

        // Dispatch Event to Progression Engine
        const profile = useUserStore.getState().profile;
        const progress = (await import("@/lib/ai/NutritionCoach")).NutritionCoach.generateGoalProgress(
          get().dailyCalories,
          get().dailyProtein,
          get().dailyWaterMl,
          get().meals,
          profile
        );
        const aiAnalysis = (await import("@/lib/ai/NutritionCoach")).NutritionCoach.generateMealAnalysis(newMeal, progress);
        
        eventBus.dispatch({
          id: crypto.randomUUID(),
          userId,
          type: 'MEAL_LOGGED',
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          metadata: { 
            mealId: newMeal.id, 
            calories: newMeal.calories, 
            protein: newMeal.protein, 
            isGoalMet: progress.protein.percentage >= 100,
            aiAnalysis,
            log: newMeal
          },
          processed: false
        });
      },

      updateMeal: async (id, updates) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        set((state) => {
          const newMeals = state.meals.map(m => m.id === id ? { ...m, ...updates } : m);
          return {
            meals: newMeals,
            dailyCalories: newMeals.filter(m => m.date === get().currentDate).reduce((acc, m) => acc + (m.calories || 0), 0),
            dailyProtein: newMeals.filter(m => m.date === get().currentDate).reduce((acc, m) => acc + (m.protein || 0), 0),
            dailySugar: newMeals.filter(m => m.date === get().currentDate).reduce((acc, m) => acc + (m.sugar || 0), 0),
          };
        });

        ReliabilityManager.execute(
          'Firestore',
          'updateNutritionLog',
          RELIABILITY_PROFILES.DATABASE_WRITE,
          id,
          () => NutritionRepository.updateNutritionLog(userId, id, updates),
          'retry'
        ).catch(console.error);
      },

      deleteMeal: async (id) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        set((state) => {
          const newMeals = state.meals.filter(m => m.id !== id);
          return {
            meals: newMeals,
            dailyCalories: newMeals.filter(m => m.date === get().currentDate).reduce((acc, m) => acc + (m.calories || 0), 0),
            dailyProtein: newMeals.filter(m => m.date === get().currentDate).reduce((acc, m) => acc + (m.protein || 0), 0),
            dailySugar: newMeals.filter(m => m.date === get().currentDate).reduce((acc, m) => acc + (m.sugar || 0), 0),
          };
        });

        ReliabilityManager.execute(
          'Firestore',
          'deleteNutritionLog',
          RELIABILITY_PROFILES.DATABASE_WRITE,
          id,
          () => NutritionRepository.deleteNutritionLog(userId, id),
          'retry'
        ).catch(console.error);
      },

      addWater: async (amountMl) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        const newLog: HydrationLog = {
          id: crypto.randomUUID(),
          userId,
          amountMl,
          date: get().currentDate,
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        };

        set((state) => {
          const newLogs = [newLog, ...state.hydrationLogs];
          return {
            hydrationLogs: newLogs,
            dailyWaterMl: newLogs.reduce((acc, l) => acc + (l.amountMl || 0), 0)
          };
        });

        ReliabilityManager.execute(
          'Firestore',
          'createHydrationLog',
          RELIABILITY_PROFILES.DATABASE_WRITE,
          newLog.id,
          () => NutritionRepository.logWater(userId, newLog),
          'retry'
        ).catch(console.error);

        const waterGoal = useUserStore.getState().profile?.targets?.water || 3000;
        const currentDailyWater = get().dailyWaterMl;
        const isGoalMet = currentDailyWater >= waterGoal;

        eventBus.dispatch({
          id: crypto.randomUUID(),
          userId,
          type: 'WATER_LOGGED',
          timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          metadata: { amountMl, totalDailyMl: currentDailyWater, isGoalMet, log: newLog },
          processed: false
        });
      },

      addMealPlan: async (planData) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        const newPlan: MealPlan = {
          ...planData,
          id: crypto.randomUUID(),
          userId,
          createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        };

        set((state) => ({
          mealPlans: [newPlan, ...state.mealPlans]
        }));

        ReliabilityManager.execute(
          'Firestore',
          'createMealPlan',
          RELIABILITY_PROFILES.DATABASE_WRITE,
          newPlan.id,
          () => NutritionRepository.saveMealPlan(userId, newPlan),
          'retry'
        ).catch(console.error);
      },

      updateMealPlanStatus: async (id, status) => {
        const userId = useUserStore.getState().userId;
        if (!userId) return;

        set((state) => ({
          mealPlans: state.mealPlans.map(p => p.id === id ? { ...p, status } : p)
        }));

        ReliabilityManager.execute(
          'Firestore',
          'updateMealPlan',
          RELIABILITY_PROFILES.DATABASE_WRITE,
          id,
          () => NutritionRepository.updateMealPlan(userId, id, { status }),
          'retry'
        ).catch(console.error);
      },

      addCustomFood: async (foodData) => {
        const userId = useUserStore.getState().userId;
        if (!userId) throw new Error("No user ID");

        // The repository will handle adding `id`, `normalizedName`, etc.
        // But for optimistic UI, we mock it first.
        const tempId = `custom-${Date.now()}`;
        const newFood: FoodItem = {
          ...foodData,
          id: tempId,
          source: "manual"
        };

        set((state) => ({
          customFoods: [newFood, ...state.customFoods]
        }));

        // Fire and forget, but wait for the actual created custom food to return its true ID 
        // if we wanted to replace it. We'll just rely on the sync to overwrite eventually.
        // For now, returning the optimistic newFood.
        import("@/services/repositories/food.repository").then(({ FoodRepository }) => {
          ReliabilityManager.execute(
            'Firestore',
            'createCustomFood',
            RELIABILITY_PROFILES.DATABASE_WRITE,
            tempId,
            () => FoodRepository.createCustomFood(userId, foodData as any),
            'retry'
          ).catch(console.error);
        });
        
        return newFood;
      }
    }),
    {
      name: "ascend-nutrition-storage",
      partialize: (state) => ({
        favoriteFoods: state.favoriteFoods,
        recentFoods: state.recentFoods,
        customFoods: state.customFoods,
        meals: state.meals,
        hydrationLogs: state.hydrationLogs,
        dailyCalories: state.dailyCalories,
        dailyProtein: state.dailyProtein,
        dailyWaterMl: state.dailyWaterMl,
        dailySugar: state.dailySugar,
        currentDate: state.currentDate
      })
    }
  )
);
