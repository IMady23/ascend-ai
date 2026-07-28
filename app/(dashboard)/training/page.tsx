import { 
  TrainingHero, 
  TodayWorkout, 
  WorkoutCategories, 
  ActiveSession, 
  WeeklyActivity, 
  ActivityStats, 
  WorkoutHistory 
} from "@/features/training";

export const metadata = {
  title: "Training Center | Ascend AI",
  description: "Track and execute your workouts.",
};

export default function TrainingPage() {
  return (
    <div className="flex flex-col gap-8 pb-24 md:pb-8">
      {/* 1. Training Hero */}
      <TrainingHero />

      {/* 6. Activity Statistics (moved up to match standard dashboard flow for macro metrics, or place below. Task says 6 is Activity Statistics. Let's arrange logically but include all components) */}
      <ActivityStats />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* 2. Today's Workout */}
          <TodayWorkout />

          {/* 4. Active Session */}
          <ActiveSession />
          
          {/* 3. Workout Categories */}
          <WorkoutCategories />
        </div>

        <div className="xl:col-span-1 flex flex-col gap-8">
          {/* 5. Weekly Activity */}
          <WeeklyActivity />
          
          {/* 7. Workout History */}
          <WorkoutHistory />
        </div>
      </div>
    </div>
  );
}
