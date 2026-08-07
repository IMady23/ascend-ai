"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import { useOnboardingStore, canProceedFromStep } from "@/stores/onboarding.store";
import { useSettingsStore } from "@/stores/settings.store";
import { UserSync } from "@/services/sync/user.sync";
import { calculateAllTargets } from "@/lib/calculations/targets";
import { migrateUserProfileToV2 } from "@/types/user";
import { useCoach } from "@/lib/coach";
import type { UserProfileV2 } from "@/types/user";

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN IMPORTS — Phase 2B (Screens 0–3 are live)
// ─────────────────────────────────────────────────────────────────────────────
import { Step0Welcome } from "./screens/Step0Welcome";
import { Step1Name } from "./screens/Step1Name";
import { Step2AboutYou } from "./screens/Step2AboutYou";
import { Step3YourBody } from "./screens/Step3YourBody";
import { Step4Analyzing } from "./screens/Step4Analyzing";
import { Step5Goal } from "./screens/Step5Goal";
import { Step6Motivation } from "./screens/Step6Motivation";
import { Step7Activity } from "./screens/Step7Activity";
import { Step8Training } from "./screens/Step8Training";
import { Step9Nutrition } from "./screens/Step9Nutrition";
import { Step10Schedule } from "./screens/Step10Schedule";
import { Step11Preferences } from "./screens/Step11Preferences";
import { Step11_5BaselineActivity } from "./screens/Step11_5BaselineActivity";
import { Step12Review } from "./screens/Step12Review";
import { Step13Welcome } from "./screens/Step13Welcome";

// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER — used only for steps 4–11 until Phase 2C/2D
// ─────────────────────────────────────────────────────────────────────────────

function StepPlaceholder({ step, label }: { step: number; label: string }) {
  const { goNext, goBack, data, isSubmitting } = useOnboardingStore();
  const canProceed = canProceedFromStep(step, data);
  return (
    <div className="flex flex-col min-h-[100svh]">
      <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-bg-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center">
          <span className="text-lg font-black font-mono text-[var(--color-text-secondary)]">{step}</span>
        </div>
        <p className="text-sm font-semibold text-[var(--color-text-secondary)] uppercase tracking-widest">{label}</p>
        <p className="text-xs text-[var(--color-text-disabled)] max-w-xs">Screen coming in Phase 2C/2D.</p>
      </div>
      <div className="px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-3 max-w-lg mx-auto w-full flex gap-3">
        {step > 0 && (
          <button type="button" onClick={goBack}
            className="h-14 px-5 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm font-medium hover:bg-[var(--color-bg-surface-elevated)] transition-colors">
            Back
          </button>
        )}
        <button type="button" onClick={goNext} disabled={!canProceed || isSubmitting}
          className="flex-1 h-14 rounded-2xl bg-[var(--color-accent-blue)] text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all active:scale-[0.98]">
          {isSubmitting ? "Saving..." : step === 12 ? "Looks Good, Let's Go" : "Continue"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP ROUTER
// ─────────────────────────────────────────────────────────────────────────────

function StepRouter() {
  const {
    currentStep,
    data,
    goNext,
    goBack,
    updateName,
    updateAboutYou,
    updateBody,
    updateGoal,
    updateMotivation,
    updateActivity,
    updateTraining,
    updateNutrition,
    updateSchedule,
    updateAppConfig,
    updateBaselineActivity,
  } = useOnboardingStore();

  const handleUpdateName = useCallback(
    (fullName: string, nickname: string) => updateName(fullName, nickname),
    [updateName]
  );
  const handleUpdateAboutYou = useCallback(
    (dob: string, gender: Parameters<typeof updateAboutYou>[1]) =>
      updateAboutYou(dob, gender),
    [updateAboutYou]
  );
  const handleUpdateBody = useCallback(
    (height: number, weight: number) => updateBody(height, weight),
    [updateBody]
  );
  const handleUpdateGoal = useCallback(
    (goal: Parameters<typeof updateGoal>[0], targetWeight: Parameters<typeof updateGoal>[1]) =>
      updateGoal(goal, targetWeight),
    [updateGoal]
  );
  const handleUpdateMotivation = useCallback(
    (whyStarted: string) => updateMotivation(whyStarted),
    [updateMotivation]
  );
  const handleUpdateActivity = useCallback(
    (activityLevel: Parameters<typeof updateActivity>[0], fitnessExperience: Parameters<typeof updateActivity>[1]) =>
      updateActivity(activityLevel, fitnessExperience),
    [updateActivity]
  );
  const handleUpdateTraining = useCallback(
    (days: number, duration: number) => updateTraining(days, duration),
    [updateTraining]
  );
  const handleUpdateNutrition = useCallback(
    (dietType: Parameters<typeof updateNutrition>[0], allergies: Parameters<typeof updateNutrition>[1]) =>
      updateNutrition(dietType, allergies),
    [updateNutrition]
  );
  const handleUpdateSchedule = useCallback(
    (wakeTime: string, sleepTime: string, sleepHours: number) =>
      updateSchedule(wakeTime, sleepTime, sleepHours),
    [updateSchedule]
  );
  const handleUpdateAppConfig = useCallback(
    (theme: Parameters<typeof updateAppConfig>[0], units: Parameters<typeof updateAppConfig>[1], timeFormat: Parameters<typeof updateAppConfig>[2]) =>
      updateAppConfig(theme, units, timeFormat),
    [updateAppConfig]
  );
  const handleUpdateBaselineActivity = useCallback(
    (steps: number, waterMl: number, calorieIntake: number, calorieBurn: number) =>
      updateBaselineActivity(steps, waterMl, calorieIntake, calorieBurn),
    [updateBaselineActivity]
  );  switch (currentStep) {
    case 0:
      return <Step0Welcome onStart={goNext} />;
    case 1:
      return (
        <Step1Name
          fullName={data.fullName}
          nickname={data.nickname}
          onUpdate={handleUpdateName}
          onNext={goNext}
          onBack={goBack}
        />
      );
    case 2:
      return (
        <Step2AboutYou
          fullName={data.fullName}
          dob={data.dob}
          gender={data.gender}
          onUpdate={handleUpdateAboutYou}
          onNext={goNext}
          onBack={goBack}
        />
      );
    case 3:
      return (
        <Step3YourBody
          fullName={data.fullName}
          height={data.height}
          weight={data.weight}
          units={data.units}
          onUpdate={handleUpdateBody}
          onNext={goNext}
          onBack={goBack}
        />
      );
    case 4:  return <Step4Analyzing
              fullName={data.fullName}
              dob={data.dob}
              height={data.height}
              weight={data.weight}
              gender={data.gender}
              activityLevel={data.activityLevel}
              onComplete={goNext}
            />;
    case 5:  return (
              <Step5Goal
                fullName={data.fullName}
                primaryGoal={data.primaryGoal}
                targetWeightKg={data.targetWeightKg}
                currentWeightKg={data.weight}
                units={data.units}
                onUpdate={handleUpdateGoal}
                onNext={goNext}
                onBack={goBack}
              />
            );
    case 6:  return (
              <Step6Motivation
                whyStarted={data.whyStarted}
                fullName={data.fullName}
                goalLabel={data.primaryGoal.replace(/_/g, " ")}
                onUpdate={handleUpdateMotivation}
                onNext={goNext}
                onBack={goBack}
              />
            );
    case 7:  return (
              <Step7Activity
                activityLevel={data.activityLevel}
                fitnessExperience={data.fitnessExperience}
                onUpdate={handleUpdateActivity}
                onNext={goNext}
                onBack={goBack}
              />
            );
    case 8:  return (
              <Step8Training
                workoutDaysPerWeek={data.workoutDaysPerWeek}
                workoutDurationMin={data.workoutDurationMin}
                onUpdate={handleUpdateTraining}
                onNext={goNext}
                onBack={goBack}
              />
            );
    case 9:  return (
              <Step9Nutrition
                dietType={data.dietType}
                allergies={data.allergies}
                onUpdate={handleUpdateNutrition}
                onNext={goNext}
                onBack={goBack}
              />
            );
    case 10: return (
              <Step10Schedule
                wakeTime={data.wakeTime}
                sleepTime={data.sleepTime}
                sleepHours={data.sleepHours}
                timeFormat={data.timeFormat}
                onUpdate={handleUpdateSchedule}
                onNext={goNext}
                onBack={goBack}
              />
            );
    case 11: return (
              <Step11Preferences
                theme={data.theme}
                units={data.units}
                timeFormat={data.timeFormat}
                onUpdate={handleUpdateAppConfig}
                onNext={goNext}
                onBack={goBack}
              />
            );
    case 12: return (
              <Step11_5BaselineActivity
                fullName={data.fullName}
                baselineSteps={data.baselineSteps}
                baselineWaterMl={data.baselineWaterMl}
                baselineCalorieIntake={data.baselineCalorieIntake}
                baselineCalorieBurn={data.baselineCalorieBurn}
                onUpdate={handleUpdateBaselineActivity}
                onNext={goNext}
                onBack={goBack}
              />
            );
    case 13: return <Step12Review data={data} onComplete={goNext} />;
    case 14: return <Step13Welcome fullName={data.fullName} whyStarted={data.whyStarted} />;
    default: return <Step0Welcome onStart={goNext} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLETION HANDLER
// ─────────────────────────────────────────────────────────────────────────────

async function completeOnboarding(
  userId: string,
  data: ReturnType<typeof useOnboardingStore.getState>["data"],
  existingProfile: ReturnType<typeof useUserStore.getState>["profile"],
  settingsStore: ReturnType<typeof useSettingsStore.getState>,
  setSubmitting: (v: boolean) => void,
  clearDraft: () => void,
  setProfile: (p: any) => void,
  router: ReturnType<typeof useRouter>
) {
  setSubmitting(true);

  try {
    // 1. Save app preferences to SettingsStore (localStorage only — no Firestore)
    await settingsStore.updateAppearance({ theme: data.theme });
    await settingsStore.updateLocalization({
      units: data.units,
      timeFormat: data.timeFormat,
    });

    // 2. Calculate targets from collected data
    const targets = calculateAllTargets(
      {
        dob: data.dob,
        height: data.height,
        weight: data.weight,
      },
      data.primaryGoal,
      {
        activity: data.activityLevel,
        goals: { waterMl: 3000 },
      }
    );

    // 3. Build the V2 profile
    // Start from existing profile (migrated to V2) to preserve any existing data
    const baseProfile = existingProfile
      ? migrateUserProfileToV2(existingProfile)
      : null;

    const now = new Date().toISOString();

    // Build profile with conditional fields (omit undefined values)
    const newProfile: UserProfileV2 = {
      version: 2,
      onboardingCompleted: true,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,

      identity: {
        fullName: data.fullName.trim(),
        nickname: data.nickname.trim(),
        dob: data.dob,
        height: data.height,
        weight: data.weight,
        gender: data.gender || undefined,
      },

      goals: {
        primaryGoal: data.primaryGoal,
        ...(data.targetWeightKg != null && { targetWeightKg: data.targetWeightKg }),
      },

      preferences: {
        activity: data.activityLevel,
        fitnessExperience: data.fitnessExperience,
        wakeTime: data.wakeTime,
        sleepTime: data.sleepTime,
        dietType: data.dietType,
        allergies: data.allergies,
        goals: {
          steps: data.baselineSteps,
          waterMl: data.baselineWaterMl,
          calories: targets.dailyCalories,
          proteinGrams: targets.protein,
          carbsGrams: targets.carbs,
          fatGrams: targets.fat,
          sleepHours: data.sleepHours,
          workoutDurationMin: data.workoutDurationMin,
          workoutDaysPerWeek: data.workoutDaysPerWeek,
          weightKg: data.targetWeightKg ?? undefined,
        },
      },

      targets,

      createdAt: baseProfile?.createdAt ?? now,
      updatedAt: now,
    };

    // Only add optional fields if they exist (Firestore doesn't accept undefined)
    if (data.whyStarted && data.whyStarted.trim()) {
      newProfile.motivation = { whyStarted: data.whyStarted.trim() };
    }
    if (baseProfile?.communication) {
      newProfile.communication = baseProfile.communication;
    }
    if (baseProfile?.health) {
      newProfile.health = baseProfile.health;
    }
    if (baseProfile?.lifestyle) {
      newProfile.lifestyle = baseProfile.lifestyle;
    }

    // 4. Write to store and sync to Firestore
    setProfile(newProfile);
    await UserSync.syncLocalChanges(userId);

    // 5. Clear onboarding draft
    clearDraft();

  } catch (error) {
    console.error("[Onboarding] Completion failed:", error);
    setSubmitting(false);
    throw error; // Let caller handle
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();

  const { profile, userId, setProfile } = useUserStore();
  const settingsStore = useSettingsStore();

  const {
    currentStep,
    data,
    isSubmitting,
    isInitialized,
    loadDraft,
    clearDraft,
    goToStep,
    setSubmitting,
  } = useOnboardingStore();

  // ── Guard: redirect if already onboarded ──────────────────────────────────
  // Reuses existing routing logic — no duplication.
  useEffect(() => {
    if (profile?.onboardingCompleted === true) {
      router.replace("/");
    }
  }, [profile, router]);

  // ── Initialize: load draft or detect locale defaults ─────────────────────
  useEffect(() => {
    if (!isInitialized && userId) {
      // Load draft for this specific user (or start fresh if no draft)
      loadDraft(userId);
    }
  }, [isInitialized, userId, loadDraft]);

  // ── Handle step 14 transition (completion) ──────────────────────────────
  // When user reaches Step13Welcome (now step 14), save profile and let the welcome screen handle redirect
  useEffect(() => {
    if (currentStep === 14 && !isSubmitting && userId) {
      completeOnboarding(
        userId,
        data,
        profile,
        settingsStore,
        setSubmitting,
        clearDraft,
        setProfile,
        router
      ).catch(() => {
        // Roll back to review step on failure
        goToStep(13);
      });
    }
  }, [currentStep]); // intentionally depends only on step change

  // ── Loading state (before draft is loaded) ───────────────────────────────
  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 min-h-[100svh]">
        <Loader2
          size={24}
          className="animate-spin text-[var(--color-text-disabled)]"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <main className="flex-1 flex flex-col">
        <StepRouter />
      </main>
    </div>
  );
}
