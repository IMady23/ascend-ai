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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Heading level="h1" className="text-3xl md:text-4xl">Notifications</Heading>
              <BodyText className="text-[var(--color-text-secondary)] mt-2">Manage how Ascend AI communicates with you.</BodyText>
            </div>
            <Button onClick={handleSave} variant="primary" leftIcon={isSaving ? undefined : <Check size={18} />}>
              {isSaving ? "Saving..." : "Save Preferences"}
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">

          <WidgetSection title="Communication Schedule">
            <GlassCard className="p-6 border-[var(--color-accent-blue)]/30 bg-gradient-to-br from-[var(--color-accent-blue)]/5 to-transparent">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-blue)]/10 flex items-center justify-center">
                  <Clock size={20} className="text-[var(--color-accent-blue)]" />
                </div>
                <div>
                  <Heading level="h4">Time & Channel Preferences</Heading>
                  <Caption className="text-[var(--color-text-secondary)]">Manage exactly when and how Ascend AI alerts you.</Caption>
                </div>
              </div>
              <Button onClick={() => setIsScheduleOpen(true)} variant="primary">Configure Schedule</Button>
            </GlassCard>
          </WidgetSection>
          
          <WidgetSection title="In-App Notifications">
            <GlassCard className="divide-y divide-[var(--color-glass-border)]">
              <ToggleRow label="Push Notifications" description="Receive alerts on your device." checked={notifications.pushNotifications} onChange={() => toggle('pushNotifications')} icon={<Bell size={18} />} />
              <ToggleRow label="Workout Reminders" description="Reminders for your scheduled sessions." checked={notifications.workoutReminders} onChange={() => toggle('workoutReminders')} />
              <ToggleRow label="Meal & Water Reminders" description="Help you hit your daily targets." checked={notifications.mealReminders} onChange={() => toggle('mealReminders')} />
              <ToggleRow label="Achievements" description="Alerts when you hit a milestone or level up." checked={notifications.achievementAlerts} onChange={() => toggle('achievementAlerts')} />
              <ToggleRow label="Quiet Hours" description="Mute all non-critical notifications from 10 PM to 7 AM." checked={notifications.quietHours} onChange={() => toggle('quietHours')} icon={<Moon size={18} />} />
            </GlassCard>
          </WidgetSection>

          <WidgetSection title="Smart Coaching Alerts">
            <GlassCard className="divide-y divide-[var(--color-glass-border)]">
              <ToggleRow label="Adaptive Workout Suggestions" description="Coach recommends changes based on fatigue." checked={notifications.smartAdaptiveWorkout} onChange={() => toggle('smartAdaptiveWorkout')} icon={<BrainCircuit size={18} />} />
              <ToggleRow label="Plateau Alerts" description="Coach detects stalling progress and suggests fixes." checked={notifications.smartPlateauAlerts} onChange={() => toggle('smartPlateauAlerts')} />
              <ToggleRow label="Recovery Alerts" description="Coach advises rest if sleep or strain metrics are poor." checked={notifications.aiRecoveryAlerts} onChange={() => toggle('aiRecoveryAlerts')} />
              <ToggleRow label="Protein Goal Alerts" description="Coach nudges you if you are tracking behind on protein." checked={notifications.smartProteinGoal} onChange={() => toggle('smartProteinGoal')} />
              <ToggleRow label="Streak Warnings" description="Coach reminds you to log data before losing a streak." checked={notifications.aiStreakWarnings} onChange={() => toggle('aiStreakWarnings')} />
            </GlassCard>
          </WidgetSection>

          <WidgetSection title="Email Communications">
            <GlassCard className="divide-y divide-[var(--color-glass-border)]">
              <ToggleRow label="Security Alerts" description="Important account security and login events." checked={notifications.emailSecurity} onChange={() => toggle('emailSecurity')} disabled icon={<Mail size={18} />} />
              <ToggleRow label="Weekly Summary" description="A rundown of your week's progress and stats." checked={notifications.emailWeeklySummary} onChange={() => toggle('emailWeeklySummary')} />
              <ToggleRow label="Coach Insights" description="Deep dive analysis from Ascend AI sent to your inbox." checked={notifications.emailCoachInsights} onChange={() => toggle('emailCoachInsights')} />
              <ToggleRow label="Product Updates & Marketing" description="News about new features in Ascend AI." checked={notifications.emailMarketing} onChange={() => toggle('emailMarketing')} />
            </GlassCard>
          </WidgetSection>

        </div>
      </DashboardLayout>
      <ReminderScheduleModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
    </PageContainer>
  );
}

function ToggleRow({ label, description, checked, onChange, disabled, icon }: any) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-[var(--color-bg-surface)]/30 transition-colors">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-1 text-[var(--color-text-muted)]">{icon}</div>}
        <div>
          <Heading level="h5" className="text-base">{label}</Heading>
          <Caption className="text-[var(--color-text-muted)]">{description}</Caption>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
