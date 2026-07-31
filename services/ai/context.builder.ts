import { useUserStore } from "@/stores/user.store";
import { useActivityStore } from "@/stores/activity.store";
import { useNutritionStore } from "@/stores/nutrition.store";
import { useChapterStore } from "@/stores/chapter.store";
import { CoachMemoryLayer } from "@/lib/ai/CoachMemoryLayer";
import { useIntelligenceStore } from "@/stores/intelligence.store";
import { useRecoveryStore } from "@/stores/recovery.store";
import { useProgressionStore } from "@/stores/progression.store";
import { useAnalyticsStore } from "@/stores/analytics.store";
import { useMissionStore } from "@/stores/mission.store";
import { useTimelineStore } from "@/stores/timeline.store";

export const ContextBuilder = {
  build(coachingMode?: string | null): any {
    const userState = useUserStore.getState();
    const activityState = useActivityStore.getState();
    const nutritionState = useNutritionStore.getState();
    const chapterState = useChapterStore.getState();
    const progressionState = useProgressionStore.getState();
    const analyticsState = useAnalyticsStore.getState();
    const missionState = useMissionStore.getState();
    const timelineState = useTimelineStore.getState();

    const profile = {
      name: userState.profile?.identity?.fullName || "Commander",
      nickname: userState.profile?.identity?.nickname,
      age: userState.profile?.identity?.dob
        ? Math.floor((Date.now() - new Date(userState.profile.identity.dob).getTime()) / 31557600000)
        : undefined,
      weight: userState.profile?.identity?.weight,
      primaryGoal: userState.profile?.goals?.primaryGoal,
      activityLevel: userState.profile?.preferences?.activity,
      goals: userState.profile?.preferences?.goals,
      preferences: userState.profile?.preferences,
    };

    const recentWorkouts = activityState.activities.slice(0, 5).map((w) => ({
      date: w.date.toDate ? w.date.toDate().toISOString() : new Date(w.date as any).toISOString(),
      type: w.type,
      duration: w.durationMinutes,
      caloriesBurned: w.caloriesBurned,
    }));

    const todayStr = new Date().toISOString().split("T")[0];
    const todaysMeals = nutritionState.meals.filter((m) => {
      const d = new Date(m.date);
      return d.toISOString().split("T")[0] === todayStr;
    });

    const expectedMeals = ["breakfast", "lunch", "dinner"];
    const recentMeals = todaysMeals.map((m) => m.mealType);
    const missingMeals = expectedMeals.filter((m) => !recentMeals.includes(m as any));

    const activeMealPlan = nutritionState.mealPlans.find((p) => p.status === "active") ?? null;

    const nutrition = {
      waterIntake: nutritionState.dailyWaterMl,
      waterGoal: userState.profile?.preferences?.goals?.waterMl || userState.profile?.targets?.water || 3000,
      caloriesConsumed: todaysMeals.reduce((acc, m) => acc + (m.calories || 0), 0),
      proteinConsumed: todaysMeals.reduce((acc, m) => acc + (m.protein || 0), 0),
      carbsConsumed: todaysMeals.reduce((acc, m) => acc + (m.carbs || 0), 0),
      fatConsumed: todaysMeals.reduce((acc, m) => acc + (m.fat || 0), 0),
      caloriesGoal: userState.profile?.preferences?.goals?.calories || userState.profile?.targets?.dailyCalories || 2000,
      proteinGoal: userState.profile?.preferences?.goals?.proteinGrams || userState.profile?.targets?.protein || 150,
      carbsGoal: userState.profile?.preferences?.goals?.carbsGrams || userState.profile?.targets?.carbs || 200,
      fatGoal: userState.profile?.preferences?.goals?.fatGrams || userState.profile?.targets?.fat || 65,
      recentMeals,
      missingMeals,
      hasActiveMealPlan: !!activeMealPlan,
      activeMealPlanTitle: activeMealPlan?.title ?? null,
    };

    const chapter = {
      currentChapterId: chapterState.currentChapter?.id,
      title: chapterState.currentChapter?.title,
      progress: chapterState.currentChapter
        ? (chapterState.currentChapter.tasksCompleted / (chapterState.currentChapter.totalTasks || 1)) * 100
        : 0,
      tasksCompleted: chapterState.currentChapter?.tasksCompleted,
      totalTasks: chapterState.currentChapter?.totalTasks,
    };

    const workoutState = activityState.workoutState;
    const isWorkoutActive = ["warm_up", "in_progress", "paused", "rest_timer", "exercise_transition"].includes(
      workoutState
    );
    const completedWorkoutToday = activityState.activities.some((w) => {
      const date = w.date.toDate ? w.date.toDate() : new Date(w.date as any);
      return date.toISOString().split("T")[0] === todayStr;
    });

    const trainingStatus =
      activityState.activities.length === 0
        ? "missing"
        : activityState.activities.length < 3
          ? "partial"
          : "available";

    const nutritionStatus =
      nutritionState.meals.length === 0 ? "missing" : todaysMeals.length < 2 ? "partial" : "available";

    const chapterStatus = !chapterState.currentChapter
      ? "missing"
      : (chapterState.currentChapter.tasksCompleted || 0) < 2
        ? "partial"
        : "available";

    let coachingScenario: string;
    if (isWorkoutActive) {
      coachingScenario = "during_workout";
    } else if (completedWorkoutToday) {
      coachingScenario = "after_workout";
    } else if (nutrition.hasActiveMealPlan) {
      coachingScenario = "meal_plan_active";
    } else if (todaysMeals.length === 0 && nutritionState.meals.length > 0) {
      coachingScenario = "no_meals_today";
    } else if (trainingStatus === "missing" && nutritionStatus === "missing") {
      coachingScenario = "first_time";
    } else {
      coachingScenario = "returning";
    }

    return {
      profile,
      coachingMode: coachingMode ?? "general",
      coachingScenario,
      training: {
        status: trainingStatus,
        recentWorkouts,
        totalWorkouts: activityState.activities.length,
        workoutState,
        isWorkoutActive,
        completedWorkoutToday,
      },
      nutrition: {
        status: nutritionStatus,
        ...nutrition,
      },
      chapter: {
        status: chapterStatus,
        ...chapter,
      },
      progression: {
        level: progressionState.profile?.xp?.currentLevel || 1,
        xp: progressionState.profile?.xp?.total || 0,
        achievements: progressionState.profile?.achievements?.filter(a => a.unlockedAt).length || 0,
        streak: analyticsState.aiSummary?.currentStreak || 0,
      },
      analytics: {
        totalWorkouts: analyticsState.aiSummary?.workoutsCompleted || 0,
        consistency: analyticsState.goalCompletion?.workouts || 0,
      },
      intelligence: {
        consistencyScore: useIntelligenceStore.getState().weeklyStats?.consistency?.overall || 0,
        activeInsights: useIntelligenceStore.getState().latestInsights.map(i => ({
          title: i.title,
          category: i.category,
          explanation: i.explanation
        }))
      },
      recovery: {
        score: useRecoveryStore.getState().currentProfile?.score || 100,
        confidence: useRecoveryStore.getState().currentProfile?.confidence || 100,
        state: useRecoveryStore.getState().currentProfile?.state || 'Good',
        readiness: useRecoveryStore.getState().currentProfile?.readiness || 100,
        trainingLoad: useRecoveryStore.getState().currentProfile?.trainingLoad || { acuteLoad: 0, chronicLoad: 0, workloadRatio: 1 },
      },
      mission: {
        activeMissionTitle: missionState.getActiveMission()?.title || "No active mission",
        activeMissionType: missionState.getActiveMission()?.type || "None",
      },
      personalTimeline: timelineState.events.slice(0, 10).map(e => ({ title: e.title, description: e.description, date: e.date })),
      coachMemory: CoachMemoryLayer.summarizeTimeline(),
      timestamp: new Date().toISOString(),
    };
  },
};
