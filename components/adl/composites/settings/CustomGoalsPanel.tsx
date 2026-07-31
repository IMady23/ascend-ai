"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { useUserStore } from "@/stores/user.store";
import { useToastStore } from "@/stores/toast.store";
import { Target, Save, Loader2, Flame, Droplet, Activity, Moon, Dumbbell, Calendar, Info } from "lucide-react";

export function CustomGoalsPanel() {
  const { profile, updateGoals } = useUserStore();
  const { addToast } = useToastStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local state for edits
  const goals: any = profile?.preferences?.goals || {};
  const [formData, setFormData] = useState({
    calories: goals.calories || 2000,
    proteinGrams: goals.proteinGrams || 150,
    waterMl: goals.waterMl || 3000,
    steps: goals.steps || 10000,
    sleepHours: goals.sleepHours || 8,
    workoutDurationMin: goals.workoutDurationMin || 60,
    workoutDaysPerWeek: goals.workoutDaysPerWeek || 4
  });

  const hasChanges = JSON.stringify(formData) !== JSON.stringify({
    calories: goals.calories || 2000,
    proteinGrams: goals.proteinGrams || 150,
    waterMl: goals.waterMl || 3000,
    steps: goals.steps || 10000,
    sleepHours: goals.sleepHours || 8,
    workoutDurationMin: goals.workoutDurationMin || 60,
    workoutDaysPerWeek: goals.workoutDaysPerWeek || 4
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: Number(value) }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateGoals(formData);
      addToast({
        title: "Goals Updated",
        message: "Your custom goals have been saved successfully.",
        type: "success"
      });
    } catch (error) {
      addToast({
        title: "Update Failed",
        message: "Failed to update goals. Please try again.",
        type: "warning"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="p-5 flex flex-col gap-6 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-[var(--color-accent-gold)]" />
          <Heading level="h4" className="text-sm">Personal Targets</Heading>
        </div>
        {hasChanges && (
          <Button 
            size="sm" 
            variant="primary" 
            onClick={handleSave} 
            disabled={isSubmitting}
            leftIcon={isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          >
            Save Changes
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calories */}
        <div className="bg-base border border-border-subtle rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-orange-500" />
            <Caption className="uppercase tracking-wider font-bold">Daily Calories</Caption>
          </div>
          <input 
            type="number" 
            value={formData.calories} 
            onChange={(e) => handleChange('calories', e.target.value)}
            className="w-full bg-transparent border-b border-border-subtle focus:border-[var(--color-accent-gold)] focus:outline-none py-1 text-lg font-mono text-primary"
          />
        </div>

        {/* Protein */}
        <div className="bg-base border border-border-subtle rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} className="text-blue-400" />
            <Caption className="uppercase tracking-wider font-bold">Protein (g)</Caption>
          </div>
          <input 
            type="number" 
            value={formData.proteinGrams} 
            onChange={(e) => handleChange('proteinGrams', e.target.value)}
            className="w-full bg-transparent border-b border-border-subtle focus:border-[var(--color-accent-gold)] focus:outline-none py-1 text-lg font-mono text-primary"
          />
        </div>

        {/* Water */}
        <div className="bg-base border border-border-subtle rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Droplet size={14} className="text-blue-500" />
            <Caption className="uppercase tracking-wider font-bold">Water (ml)</Caption>
          </div>
          <input 
            type="number" 
            value={formData.waterMl} 
            onChange={(e) => handleChange('waterMl', e.target.value)}
            className="w-full bg-transparent border-b border-border-subtle focus:border-[var(--color-accent-gold)] focus:outline-none py-1 text-lg font-mono text-primary"
          />
        </div>

        {/* Steps */}
        <div className="bg-base border border-border-subtle rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-green-500" />
            <Caption className="uppercase tracking-wider font-bold">Daily Steps</Caption>
          </div>
          <input 
            type="number" 
            value={formData.steps} 
            onChange={(e) => handleChange('steps', e.target.value)}
            className="w-full bg-transparent border-b border-border-subtle focus:border-[var(--color-accent-gold)] focus:outline-none py-1 text-lg font-mono text-primary"
          />
        </div>

        {/* Sleep */}
        <div className="bg-base border border-border-subtle rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Moon size={14} className="text-indigo-400" />
            <Caption className="uppercase tracking-wider font-bold">Sleep (Hours)</Caption>
          </div>
          <input 
            type="number" 
            value={formData.sleepHours} 
            onChange={(e) => handleChange('sleepHours', e.target.value)}
            className="w-full bg-transparent border-b border-border-subtle focus:border-[var(--color-accent-gold)] focus:outline-none py-1 text-lg font-mono text-primary"
          />
        </div>

        {/* Workout Days */}
        <div className="bg-base border border-border-subtle rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-pink-500" />
            <Caption className="uppercase tracking-wider font-bold">Workout Days/Week</Caption>
          </div>
          <input 
            type="number" 
            value={formData.workoutDaysPerWeek} 
            onChange={(e) => handleChange('workoutDaysPerWeek', e.target.value)}
            className="w-full bg-transparent border-b border-border-subtle focus:border-[var(--color-accent-gold)] focus:outline-none py-1 text-lg font-mono text-primary"
          />
        </div>
      </div>
    </GlassCard>
  );
}
