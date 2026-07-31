"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";
import { useSettingsStore } from "@/stores/settings.store";
import { UserSync } from "@/services/sync/user.sync";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2, Play } from "lucide-react";
import type { UserProfile, UserIdentity, UserPreferences, PrimaryGoal, ActivityLevel, DietType } from "@/types/user";

export default function Onboarding() {
  const router = useRouter();
  const { profile, userId, setProfile } = useUserStore();
  const settingsStore = useSettingsStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Form State
  const [identity, setIdentity] = useState<UserIdentity>({
    fullName: "",
    nickname: "",
    dob: "2000-01-01",
    height: 175,
    weight: 75
  });

  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>('lose_fat');
  
  const [preferences, setPreferences] = useState<UserPreferences>({
    activity: 'moderate',
    fitnessExperience: 'intermediate',
    wakeTime: '06:30',
    sleepTime: '22:30',
    dietType: 'non_vegetarian',
    allergies: [],
    goals: {
      steps: 10000,
      waterMl: 3000,
      calories: 0,
      proteinGrams: 0,
      carbsGrams: 0,
      fatGrams: 0,
      sleepHours: 8,
      workoutDurationMin: 60,
      workoutDaysPerWeek: 4
    }
  });

  // Settings State for Step 4
  const [appConfig, setAppConfig] = useState({
    theme: "system",
    units: "metric",
    timeFormat: "24h"
  });

  // Redirect users who already completed onboarding
  useEffect(() => {
    if (profile?.onboardingCompleted) {
      router.replace("/");
    }
  }, [profile, router]);

  // Load from Draft or Profile
  useEffect(() => {
    if (loaded) return;

    const draft = localStorage.getItem("ascend-onboarding-draft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        if (parsed.identity) setIdentity(parsed.identity);
        if (parsed.primaryGoal) setPrimaryGoal(parsed.primaryGoal);
        if (parsed.preferences) setPreferences(parsed.preferences);
        if (parsed.appConfig) setAppConfig(parsed.appConfig);
        if (parsed.step && parsed.step > 1 && parsed.step < 5) setStep(parsed.step);
      } catch (e) {
        console.error("Failed to parse onboarding draft", e);
      }
    } else if (profile) {
      // Pre-fill from existing profile if no draft
      if (profile.identity) {
        setIdentity({
          ...identity,
          fullName: profile.identity.fullName || "",
          nickname: profile.identity.nickname || "",
          dob: profile.identity.dob || "2000-01-01",
          height: profile.identity.height || 175,
          weight: profile.identity.weight || 75
        });
      }
      if (profile.goals?.primaryGoal) setPrimaryGoal(profile.goals.primaryGoal);
      if (profile.preferences) {
         // handle migration if fitnessExperience is missing
         const pref = profile.preferences as any;
         setPreferences({
           ...preferences,
           ...profile.preferences,
           fitnessExperience: pref.fitnessExperience || 'intermediate'
         });
      }
    }
    
    // Default app settings from store
    setAppConfig({
      theme: settingsStore.appearance.theme,
      units: settingsStore.localization.units,
      timeFormat: settingsStore.localization.timeFormat
    });

    setLoaded(true);
   
  }, [profile, loaded]);

  // Save to Draft
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("ascend-onboarding-draft", JSON.stringify({
      step,
      identity,
      primaryGoal,
      preferences,
      appConfig
    }));
  }, [step, identity, primaryGoal, preferences, appConfig, loaded]);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const calculateTargets = (id: UserIdentity, goal: PrimaryGoal, pref: UserPreferences) => {
    // 1. Calculate Age
    const age = Math.abs(new Date(Date.now() - new Date(id.dob).getTime()).getUTCFullYear() - 1970);
    
    // 2. BMI
    const bmi = id.weight / Math.pow(id.height / 100, 2);

    // 3. BMR (Mifflin-St Jeor)
    const bmr = (10 * id.weight) + (6.25 * id.height) - (5 * age) + 5;

    // 4. TDEE
    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      athlete: 1.9
    };
    const tdee = bmr * activityMultipliers[pref.activity];

    // 5. Daily Calories based on goal
    let dailyCalories = tdee;
    if (goal === 'lose_fat') dailyCalories -= 500;
    if (goal === 'gain_muscle') dailyCalories += 300;
    if (goal === 'recomp') dailyCalories -= 100;

    // 6. Macros
    const protein = id.weight * 2;
    const fat = id.weight * 1;
    const proteinCals = protein * 4;
    const fatCals = fat * 9;
    const carbCals = dailyCalories - proteinCals - fatCals;
    const carbs = Math.max(0, carbCals / 4);

    return {
      tdee: Math.round(tdee),
      bmr: Math.round(bmr),
      bmi: Math.round(bmi * 10) / 10,
      dailyCalories: Math.round(dailyCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      water: pref.goals?.waterMl || 3000
    };
  };

  const handleComplete = async () => {
    if (!userId) return;
    setIsSubmitting(true);
    setStep(5); // Show Welcome Interstitial

    try {
      // Save App Settings
      await settingsStore.updateAppearance({ theme: appConfig.theme });
      await settingsStore.updateLocalization({ units: appConfig.units as any, timeFormat: appConfig.timeFormat as any });

      const targets = calculateTargets(identity, primaryGoal, preferences);
      
      const newProfile: UserProfile = {
        version: 1,
        onboardingCompleted: true,
        identity,
        goals: { primaryGoal },
        preferences: {
          ...preferences,
          goals: {
            ...(preferences.goals as any),
            calories: targets.dailyCalories,
            proteinGrams: targets.protein,
            carbsGrams: targets.carbs,
            fatGrams: targets.fat
          }
        },
        targets,
        createdAt: profile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setProfile(newProfile);
      await UserSync.syncLocalChanges(userId);

      // Clean up draft
      localStorage.removeItem("ascend-onboarding-draft");

      setTimeout(() => {
        router.push("/");
      }, 3000);

    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setIsSubmitting(false);
      setStep(4);
    }
  };

  if (!loaded) return <div className="min-h-screen bg-base flex items-center justify-center"><Loader2 className="animate-spin text-purple-500" /></div>;

  return (
    <div className="min-h-screen bg-base flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        
        {step > 1 && step < 5 && (
          <div className="mb-8">
            <h1 className="text-2xl font-black text-primary text-center tracking-tight mb-2">Build Your Protocol</h1>
            <div className="flex gap-2 justify-center">
              {[2, 3, 4].map(i => (
                <div key={i} className={`h-1.5 w-12 rounded-full ${i <= step ? 'bg-purple-500' : 'bg-surface-elevated'}`} />
              ))}
            </div>
          </div>
        )}

        <div className="bg-surface border border-border-subtle rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-6">
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Play className="w-8 h-8 text-purple-500 ml-1" />
              </div>
              <h1 className="text-3xl font-black text-primary mb-4">Welcome to Ascend AI</h1>
              <p className="text-secondary mb-8">
                Your personal AI-driven fitness and nutrition ecosystem. We'll set up your profile, define your mission, and calibrate your daily targets so your AI Coach can guide you to success.
              </p>
              <button onClick={handleNext} className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-primary/90">
                Begin Calibration <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: IDENTITY */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-primary mb-6">Personal Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">Full Name</label>
                  <input type="text" value={identity.fullName} onChange={e => setIdentity({...identity, fullName: e.target.value})} className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">Date of Birth</label>
                  <input type="date" value={identity.dob} onChange={e => setIdentity({...identity, dob: e.target.value})} className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:border-purple-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">Height (cm)</label>
                    <input type="number" value={identity.height} onChange={e => setIdentity({...identity, height: Number(e.target.value)})} className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:border-purple-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-1">Weight (kg)</label>
                    <input type="number" value={identity.weight} onChange={e => setIdentity({...identity, weight: Number(e.target.value)})} className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:border-purple-500 transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                 <button onClick={handleBack} className="p-3 border border-border-subtle rounded-lg hover:bg-surface-elevated text-primary"><ChevronLeft size={16} /></button>
                 <button onClick={handleNext} disabled={!identity.fullName || !identity.height || !identity.weight} className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-primary/90 disabled:opacity-50">
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: GOAL & EXPERIENCE */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-primary mb-4">Mission & Experience</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Primary Goal</label>
                  <select value={primaryGoal} onChange={e => setPrimaryGoal(e.target.value as PrimaryGoal)} className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:border-purple-500 transition-colors">
                    <option value="lose_fat">Lose Fat</option>
                    <option value="gain_muscle">Gain Muscle</option>
                    <option value="maintain">Maintain & Improve Fitness</option>
                    <option value="recomp">Body Recomposition</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Current Fitness Experience</label>
                  <select value={preferences.fitnessExperience} onChange={e => setPreferences({...preferences, fitnessExperience: e.target.value as any})} className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:border-purple-500 transition-colors">
                    <option value="beginner">Beginner (New to working out)</option>
                    <option value="intermediate">Intermediate (Consistent for 6+ months)</option>
                    <option value="advanced">Advanced (Years of experience)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Activity Level</label>
                  <select value={preferences.activity} onChange={e => setPreferences({...preferences, activity: e.target.value as ActivityLevel})} className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:border-purple-500 transition-colors">
                    <option value="sedentary">Sedentary (Office job, little exercise)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="active">Very Active (6-7 days/week)</option>
                    <option value="athlete">Athlete (Physical job / 2x training)</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="p-3 border border-border-subtle rounded-lg hover:bg-surface-elevated text-primary"><ChevronLeft size={16} /></button>
                <button onClick={handleNext} className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-primary/90">Continue <ChevronRight size={16} /></button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PREFERENCES & WRAP UP */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-primary mb-6">Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Dietary Preference</label>
                  <select value={preferences.dietType} onChange={e => setPreferences({...preferences, dietType: e.target.value as DietType})} className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:border-purple-500 transition-colors">
                    <option value="non_vegetarian">No Restrictions</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="eggetarian">Eggetarian</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border-subtle">
                  <div>
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Units</label>
                    <select value={appConfig.units} onChange={e => setAppConfig({...appConfig, units: e.target.value})} className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:border-purple-500 transition-colors">
                      <option value="metric">Metric (kg, cm)</option>
                      <option value="imperial">Imperial (lbs, in)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block mb-2">Theme</label>
                    <select value={appConfig.theme} onChange={e => setAppConfig({...appConfig, theme: e.target.value})} className="w-full bg-base border border-border-subtle rounded-lg p-3 text-primary focus:border-purple-500 transition-colors">
                      <option value="system">System Default</option>
                      <option value="dark">Dark Mode</option>
                      <option value="light">Light Mode</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="p-3 border border-border-subtle rounded-lg hover:bg-surface-elevated text-primary"><ChevronLeft size={16} /></button>
                <button onClick={handleComplete} disabled={isSubmitting} className="flex-1 bg-purple-600 text-primary font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-purple-700 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Complete Setup"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: WELCOME INTERSTITIAL */}
          {step === 5 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-base border border-border-subtle flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                 <CheckCircle2 size={32} className="text-purple-400 relative z-10" />
              </div>
              <h2 className="text-2xl font-black text-primary mb-2">Welcome to Ascend AI</h2>
              <p className="text-sm text-secondary mb-8">Your personal coach is ready.</p>

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-primary bg-base p-3 rounded-lg border border-border-subtle">
                  <CheckCircle2 size={16} className="text-emerald-500" /> AI Coach initialized
                </div>
                <div className="flex items-center gap-3 text-sm text-primary bg-base p-3 rounded-lg border border-border-subtle">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Macros & targets configured
                </div>
                <div className="flex items-center gap-3 text-sm text-primary bg-base p-3 rounded-lg border border-border-subtle">
                  <CheckCircle2 size={16} className="text-emerald-500" /> App preferences saved
                </div>
              </div>
              <div className="mt-8 text-xs text-secondary font-bold uppercase tracking-widest animate-pulse">
                Entering Mission Control...
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
