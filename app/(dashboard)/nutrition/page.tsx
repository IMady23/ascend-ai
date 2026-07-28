import { 
  NutritionHero,
  DailySummary,
  MacroProgress,
  WaterTracker,
  MealTimeline,
  NutritionInsights,
  QuickLog
} from "@/features/nutrition";

export const metadata = {
  title: "Nutrition Lab | Ascend AI",
  description: "Track your macros, hydration, and nutrition.",
};

export default function NutritionPage() {
  return (
    <div className="flex flex-col gap-8 pb-24 md:pb-8">
      {/* 1. Nutrition Hero */}
      <NutritionHero />

      {/* 2. Daily Summary */}
      <DailySummary />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* 7. Quick Log */}
          <QuickLog />

          {/* 5. Meal Timeline */}
          <MealTimeline />
        </div>

        <div className="xl:col-span-1 flex flex-col gap-8">
          {/* 3. Macro Progress */}
          <MacroProgress />
          
          {/* 4. Water Tracker */}
          <WaterTracker />
          
          {/* 6. Nutrition Insights */}
          <NutritionInsights />
        </div>
      </div>
    </div>
  );
}
