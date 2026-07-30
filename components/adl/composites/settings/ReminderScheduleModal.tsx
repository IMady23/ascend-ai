"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Bell, Mail, Smartphone } from "lucide-react";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Switch } from "@/components/adl/primitives/Switch";
import { useSettingsStore, ReminderSchedule, NotificationChannel } from "@/stores/settings.store";
import { NotificationScheduler } from "@/services/notifications/scheduler.service";
import { useToastStore } from "@/stores/toast.store";
import { cn } from "@/utils/cn";

interface ReminderScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReminderScheduleModal({ isOpen, onClose }: ReminderScheduleModalProps) {
  const { schedules, updateSchedule } = useSettingsStore();
  const { addToast } = useToastStore();
  const [activeTab, setActiveTab] = React.useState<string>(schedules[0]?.id || "morning");

  const currentSchedule = schedules.find(s => s.id === activeTab);

  const handleToggleChannel = (channel: NotificationChannel) => {
    if (!currentSchedule) return;
    const hasChannel = currentSchedule.channels.includes(channel);
    const newChannels = hasChannel 
      ? currentSchedule.channels.filter(c => c !== channel)
      : [...currentSchedule.channels, channel];
    
    updateSchedule({ ...currentSchedule, channels: newChannels });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentSchedule) return;
    updateSchedule({ ...currentSchedule, time: e.target.value });
  };

  const handleToggleEnabled = (checked: boolean) => {
    if (!currentSchedule) return;
    updateSchedule({ ...currentSchedule, enabled: checked });
  };

  const handleSave = () => {
    NotificationScheduler.scheduleAll();
    addToast({
      title: "Schedules Updated",
      message: "Your communication schedules have been saved.",
      type: "success"
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:w-full max-w-2xl bg-[var(--color-bg-base)] border border-[var(--color-glass-border)] rounded-[var(--radius-2xl)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-glass-border)] bg-gradient-to-br from-[var(--color-bg-glass-standard)] to-transparent">
              <div>
                <Heading level="h2" className="text-xl">Communication Schedule</Heading>
                <BodyText className="text-[var(--color-text-secondary)] mt-1">Configure when and how Ascend AI alerts you.</BodyText>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Sidebar Tabs */}
              <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[var(--color-glass-border)] p-4 overflow-y-auto bg-[var(--color-bg-surface)]/30">
                <div className="space-y-1 flex md:block overflow-x-auto md:overflow-visible pb-2 md:pb-0">
                  {schedules.map(schedule => (
                    <button
                      key={schedule.id}
                      onClick={() => setActiveTab(schedule.id)}
                      className={cn(
                        "flex-shrink-0 md:w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between",
                        activeTab === schedule.id 
                          ? "bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]" 
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-surface-hover)] hover:text-white"
                      )}
                    >
                      {schedule.type}
                      {schedule.enabled && <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent-blue)] ml-2" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {currentSchedule && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Heading level="h3" className="text-lg">{currentSchedule.type}</Heading>
                      <Switch checked={currentSchedule.enabled} onCheckedChange={handleToggleEnabled} />
                    </div>

                    <div className={cn("space-y-6 transition-opacity duration-200", !currentSchedule.enabled && "opacity-50 pointer-events-none")}>
                      
                      {/* Time Configuration */}
                      <div className="space-y-3">
                        <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Time Trigger</Caption>
                        <div className="flex items-center gap-3">
                          <Clock size={18} className="text-[var(--color-text-muted)]" />
                          <input 
                            type="time" 
                            value={currentSchedule.time === "every_2h" ? "00:00" : currentSchedule.time}
                            onChange={handleTimeChange}
                            className="bg-[var(--color-bg-surface)] border border-[var(--color-glass-border)] rounded-lg px-3 py-2 text-white outline-none focus:border-[var(--color-accent-blue)]"
                          />
                          {currentSchedule.time === "every_2h" && (
                            <span className="text-sm text-[var(--color-accent-blue)] font-medium bg-[var(--color-accent-blue)]/10 px-2 py-1 rounded-md">Interval Mode (Every 2h)</span>
                          )}
                        </div>
                      </div>

                      {/* Channel Selection */}
                      <div className="space-y-3">
                        <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider font-semibold">Delivery Channels</Caption>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button 
                            onClick={() => handleToggleChannel("in-app")}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                              currentSchedule.channels.includes("in-app") 
                                ? "border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)]"
                                : "border-[var(--color-glass-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-text-secondary)]"
                            )}
                          >
                            <Bell size={20} className="mb-2" />
                            <span className="text-xs font-semibold">In-App</span>
                          </button>

                          <button 
                            onClick={() => handleToggleChannel("push")}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                              currentSchedule.channels.includes("push") 
                                ? "border-[var(--color-accent-purple)] bg-[var(--color-accent-purple)]/10 text-[var(--color-accent-purple)]"
                                : "border-[var(--color-glass-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-text-secondary)]"
                            )}
                          >
                            <Smartphone size={20} className="mb-2" />
                            <span className="text-xs font-semibold">Push</span>
                          </button>

                          <button 
                            onClick={() => handleToggleChannel("email")}
                            className={cn(
                              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                              currentSchedule.channels.includes("email") 
                                ? "border-[var(--color-accent-gold)] bg-[var(--color-accent-gold)]/10 text-[var(--color-accent-gold)]"
                                : "border-[var(--color-glass-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] hover:border-[var(--color-text-secondary)]"
                            )}
                          >
                            <Mail size={20} className="mb-2" />
                            <span className="text-xs font-semibold">Email</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Daily Preview Footer */}
            <div className="p-4 bg-[var(--color-bg-surface)] border-t border-[var(--color-glass-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex-1 overflow-x-auto w-full">
                <div className="flex items-center gap-3 min-w-max pb-1">
                  <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mr-2">Today's Flow</span>
                  {schedules.filter(s => s.enabled).sort((a, b) => a.time.localeCompare(b.time)).map(s => (
                    <div key={s.id} className="flex items-center gap-1.5 text-xs bg-[var(--color-bg-base)] px-2 py-1 rounded-md border border-[var(--color-glass-border)]">
                      <span className="text-[var(--color-accent-blue)] font-medium">{s.time}</span>
                      <span className="text-[var(--color-text-secondary)]">{s.type}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Button onClick={handleSave} variant="primary" className="shrink-0 w-full sm:w-auto">
                Save Schedule
              </Button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
