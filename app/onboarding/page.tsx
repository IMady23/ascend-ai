"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user.store";
import { UserSync } from "@/services/sync/user.sync";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";
import { resolvePostAuthRoute } from "@/lib/auth/post-auth-routing";
import type { UserProfile, UserIdentity, UserPreferences, PrimaryGoal, ActivityLevel, DietType } from "@/types/user";

export default function Onboarding() {
  const router = useRouter();
  const { profile, userId, setProfile } = useUserStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect users who already completed onboarding
  useEffect(() => {
    const redirect = resolvePostAuthRoute("/onboarding", profile);
    if (redirect) {
      router.replace(redirect);
    }
  }, [profile, router]);

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
    wakeTime: '06:30',
    sleepTime: '22:30',
    stepGoal: 10000,
    waterGoal: 3000,
    workoutDays: 4,
    dietType: 'non_vegetarian',
    allergies: []
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const calculateTargets = (id: UserIdentity, goal: PrimaryGoal, pref: UserPreferences) => {
    // 1. Calculate Age
    const age = Math.abs(new Date(Date.now() - new Date(id.dob).getTime()).getUTCFullYear() - 1970);
    
    // 2. BMI
    const bmi = id.weight / Math.pow(id.height / 100, 2);

    // 3. BMR (Mifflin-St Jeor, generalized)
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

    // 6. Macros (Protein: 2g/kg, Fat: 1g/kg, Carbs: remainder)
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
      water: pref.waterGoal
    };
  };

  const handleComplete = async () => {
    if (!userId) return;
    setIsSubmitting(true);
    setStep(5); // Show Welcome Interstitial

    try {
      const targets = calculateTargets(identity, primaryGoal, preferences);
      
      const newProfile: UserProfile = {
        version: 1,
        onboardingCompleted: true,
        identity,
        goals: { primaryGoal },
        preferences,
        targets,
        createdAt: profile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Set local state
      setProfile(newProfile);

      // Sync to Firebase
      await UserSync.syncLocalChanges(userId);

      // Simulate AI Initialization delay
      setTimeout(() => {
        router.push("/");
      }, 3000);

    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      setIsSubmitting(false);
      setStep(4);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        
        {step < 5 && (
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white text-center tracking-tight mb-2">Build Your Protocol</h1>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`h-1.5 w-12 rounded-full ${i <= step ? 'bg-purple-500' : 'bg-zinc-800'}`} />
              ))}
            </div>
          </div>
        )}

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-white mb-6">Personal Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Full Name</label>
                  <input type="text" value={identity.fullName} onChange={e => setIdentity({...identity, fullName: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Nickname</label>
                  <input type="text" value={identity.nickname} onChange={e => setIdentity({...identity, nickname: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Date of Birth</label>
                  <input type="date" value={identity.dob} onChange={e => setIdentity({...identity, dob: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Height (cm)</label>
                    <input type="number" value={identity.height} onChange={e => setIdentity({...identity, height: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Weight (kg)</label>
                    <input type="number" value={identity.weight} onChange={e => setIdentity({...identity, weight: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 transition-colors" />
                  </div>
                </div>
              </div>
              <button onClick={handleNext} disabled={!identity.fullName || !identity.height || !identity.weight} className="w-full mt-6 bg-white text-black font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-zinc-200 disabled:opacity-50">
                Continue <ChevronRight size={16} />
              </button>
            </motion.div>
          )}

          {/* STEP 2: GOAL */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-white mb-6">Primary Mission</h2>
              <div className="space-y-3">
                {[
                  { id: 'lose_fat', title: 'Lose Fat', desc: 'Shed body fat and tone up.' },
                  { id: 'gain_muscle', title: 'Gain Muscle', desc: 'Build size and strength.' },
                  { id: 'maintain', title: 'Maintain', desc: 'Keep current weight, improve fitness.' },
                  { id: 'recomp', title: 'Body Recomposition', desc: 'Lose fat and build muscle simultaneously.' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setPrimaryGoal(g.id as PrimaryGoal)}
                    className={`w-full text-left p-4 rounded-xl border transition-colors ${primaryGoal === g.id ? 'bg-purple-500/10 border-purple-500' : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'}`}
                  >
                    <div className="font-bold text-white">{g.title}</div>
                    <div className="text-xs text-zinc-500 mt-1">{g.desc}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="p-3 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-white"><ChevronLeft size={16} /></button>
                <button onClick={handleNext} className="flex-1 bg-white text-black font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-zinc-200">Continue <ChevronRight size={16} /></button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: LIFESTYLE */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-white mb-6">Daily Lifestyle</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Activity Level</label>
                  <select value={preferences.activity} onChange={e => setPreferences({...preferences, activity: e.target.value as ActivityLevel})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 transition-colors">
                    <option value="sedentary">Sedentary (Office job, little exercise)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="active">Very Active (6-7 days/week)</option>
                    <option value="athlete">Athlete (Physical job / 2x training)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Wake Time</label>
                    <input type="time" value={preferences.wakeTime} onChange={e => setPreferences({...preferences, wakeTime: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Sleep Time</label>
                    <input type="time" value={preferences.sleepTime} onChange={e => setPreferences({...preferences, sleepTime: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="p-3 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-white"><ChevronLeft size={16} /></button>
                <button onClick={handleNext} className="flex-1 bg-white text-black font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-zinc-200">Continue <ChevronRight size={16} /></button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: NUTRITION & WRAP UP */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-lg font-bold text-white mb-6">Nutrition Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-2">Dietary Preference</label>
                  <select value={preferences.dietType} onChange={e => setPreferences({...preferences, dietType: e.target.value as DietType})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 transition-colors">
                    <option value="non_vegetarian">No Restrictions</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="eggetarian">Eggetarian</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Target Workouts per Week</label>
                  <input type="number" min="1" max="7" value={preferences.workoutDays} onChange={e => setPreferences({...preferences, workoutDays: Number(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:border-purple-500 transition-colors" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={handleBack} className="p-3 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-white"><ChevronLeft size={16} /></button>
                <button onClick={handleComplete} disabled={isSubmitting} className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-purple-700 disabled:opacity-50">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Initialize Profile"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: WELCOME INTERSTITIAL */}
          {step === 5 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                 <CheckCircle2 size={32} className="text-purple-400 relative z-10" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Welcome to Ascend AI</h2>
              <p className="text-sm text-zinc-400 mb-8">Your personal coach is ready.</p>

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-white bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <CheckCircle2 size={16} className="text-emerald-500" /> AI Coach initialized
                </div>
                <div className="flex items-center gap-3 text-sm text-white bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Macros & calories calculated
                </div>
                <div className="flex items-center gap-3 text-sm text-white bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Workout parameters set
                </div>
              </div>
              <div className="mt-8 text-xs text-zinc-500 font-bold uppercase tracking-widest animate-pulse">
                Entering Mission Control...
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
