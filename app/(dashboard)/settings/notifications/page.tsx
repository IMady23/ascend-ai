"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { DashboardLayout, WidgetSection } from "@/components/adl/layout/Layouts";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Switch } from "@/components/adl/primitives/Switch";
import { Button } from "@/components/adl/primitives/Button";
import { Bell, Mail, BrainCircuit, Moon, Check, Clock } from "lucide-react";
import { useSettingsStore, NotificationSettings } from "@/stores/settings.store";
import { useToastStore } from "@/stores/toast.store";
import { ReminderScheduleModal } from "@/components/adl/composites/settings/ReminderScheduleModal";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function NotificationsSettings() {
  const { notifications, updateNotificationSetting } = useSettingsStore();
  const { addToast } = useToastStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const toggle = (key: keyof NotificationSettings) => {
    updateNotificationSetting(key, !notifications[key]);
    addToast({
      title: "Settings Updated",
      message: `Preference saved successfully.`,
      type: "success"
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    addToast({
      title: "All Settings Saved",
      message: "Your notification preferences have been synced.",
      type: "success"
    });
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <PageContainer className="pb-32 px-4 md:px-8 max-w-4xl mx-auto">
      <DashboardLayout>
        
        <div className="lg:col-span-3 mb-8 mt-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <Heading level="h1" className="text-3xl md:text-4xl text-[var(--color-text-primary)]">Notifications</Heading>
              <BodyText className="text-[var(--color-text-secondary)] mt-2">Manage how Ascend AI communicates with you.</BodyText>
            </div>
            <Button onClick={handleSave} variant="primary" leftIcon={isSaving ? undefined : <Check size={18} />} className="shadow-lg shadow-[var(--color-accent-primary)]/20 hover:shadow-[var(--color-accent-primary)]/40 transition-shadow">
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:col-span-3 space-y-8"
        >

          <motion.div variants={item}>
            <WidgetSection title="Communication Schedule">
              <GlassCard className="p-6 border-[var(--color-accent-blue)]/30 bg-gradient-to-br from-[var(--color-accent-blue)]/5 to-transparent relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="flex items-center gap-4 mb-5 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-accent-blue)]/20 flex items-center justify-center shadow-[0_0_15px_var(--color-accent-blue)]/20">
                    <Clock size={24} className="text-[var(--color-accent-blue)]" />
                  </div>
                  <div>
                    <Heading level="h4" className="text-[var(--color-text-primary)]">Time & Channel Preferences</Heading>
                    <Caption className="text-[var(--color-text-secondary)]">Manage exactly when and how Ascend AI alerts you.</Caption>
                  </div>
                </div>
                <Button onClick={() => setIsScheduleOpen(true)} variant="secondary" className="relative z-10 w-full md:w-auto">Configure Schedule</Button>
              </GlassCard>
            </WidgetSection>
          </motion.div>
          
          <motion.div variants={item}>
            <WidgetSection title="In-App Notifications">
              <GlassCard className="divide-y divide-[var(--color-glass-border)]">
                <ToggleRow label="Push Notifications" description="Receive alerts on your device." checked={notifications.pushNotifications} onChange={() => toggle('pushNotifications')} icon={<Bell size={18} />} />
                <ToggleRow label="Workout Reminders" description="Reminders for your scheduled sessions." checked={notifications.workoutReminders} onChange={() => toggle('workoutReminders')} />
                <ToggleRow label="Meal & Water Reminders" description="Help you hit your daily targets." checked={notifications.mealReminders} onChange={() => toggle('mealReminders')} />
                <ToggleRow label="Achievements" description="Alerts when you hit a milestone or level up." checked={notifications.achievementAlerts} onChange={() => toggle('achievementAlerts')} />
                <ToggleRow label="Quiet Hours" description="Mute all non-critical notifications from 10 PM to 7 AM." checked={notifications.quietHours} onChange={() => toggle('quietHours')} icon={<Moon size={18} />} />
              </GlassCard>
            </WidgetSection>
          </motion.div>

          <motion.div variants={item}>
            <WidgetSection title="Smart Coaching Alerts">
              <GlassCard className="divide-y divide-[var(--color-glass-border)]">
                <ToggleRow label="Adaptive Workout Suggestions" description="Coach recommends changes based on fatigue." checked={notifications.smartAdaptiveWorkout} onChange={() => toggle('smartAdaptiveWorkout')} icon={<BrainCircuit size={18} />} />
                <ToggleRow label="Plateau Alerts" description="Coach detects stalling progress and suggests fixes." checked={notifications.smartPlateauAlerts} onChange={() => toggle('smartPlateauAlerts')} />
                <ToggleRow label="Recovery Alerts" description="Coach advises rest if sleep or strain metrics are poor." checked={notifications.aiRecoveryAlerts} onChange={() => toggle('aiRecoveryAlerts')} />
                <ToggleRow label="Protein Goal Alerts" description="Coach nudges you if you are tracking behind on protein." checked={notifications.smartProteinGoal} onChange={() => toggle('smartProteinGoal')} />
                <ToggleRow label="Streak Warnings" description="Coach reminds you to log data before losing a streak." checked={notifications.aiStreakWarnings} onChange={() => toggle('aiStreakWarnings')} />
              </GlassCard>
            </WidgetSection>
          </motion.div>

          <motion.div variants={item}>
            <WidgetSection title="Email Communications">
              <GlassCard className="divide-y divide-[var(--color-glass-border)]">
                <ToggleRow label="Security Alerts" description="Important account security and login events." checked={notifications.emailSecurity} onChange={() => toggle('emailSecurity')} disabled icon={<Mail size={18} />} />
                <ToggleRow label="Weekly Summary" description="A rundown of your week's progress and stats." checked={notifications.emailWeeklySummary} onChange={() => toggle('emailWeeklySummary')} />
                <ToggleRow label="Coach Insights" description="Deep dive analysis from Ascend AI sent to your inbox." checked={notifications.emailCoachInsights} onChange={() => toggle('emailCoachInsights')} />
                <ToggleRow label="Product Updates & Marketing" description="News about new features in Ascend AI." checked={notifications.emailMarketing} onChange={() => toggle('emailMarketing')} />
              </GlassCard>
            </WidgetSection>
          </motion.div>

        </motion.div>
      </DashboardLayout>
      <ReminderScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </PageContainer>
  );
}

function ToggleRow({ label, description, checked, onChange, disabled, icon }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-1 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent-blue)] transition-colors">{icon}</div>}
        <div>
          <Heading level="h5" className="text-base text-[var(--color-text-primary)]">{label}</Heading>
          <Caption className="text-[var(--color-text-secondary)]">{description}</Caption>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
