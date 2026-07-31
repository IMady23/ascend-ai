import { useEffect } from 'react';
import { useReminderStore } from '@/stores/reminder.store';
import { AudioEngine } from '@/lib/audio/AudioEngine';

export function useReminderEngine() {
  useEffect(() => {
    // Check for reminders every 10 seconds
    const interval = setInterval(() => {
      const { reminders, updateReminder, logEvent } = useReminderStore.getState();
      const now = new Date();
      const currentTimeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const todayStr = now.toDateString();

      reminders.forEach(reminder => {
        if (!reminder.enabled) return;
        
        // Simple HH:mm check
        if (reminder.scheduledTime === currentTimeStr) {
          // Prevent firing multiple times in the same minute/day
          if (reminder.lastTriggeredAt === todayStr) return;

          // 1. Mark as triggered today to prevent duplicate firing
          updateReminder(reminder.id, { lastTriggeredAt: todayStr, status: 'triggered' });

          // 2. Play the specific sound profile for this reminder type
          // ReminderType matches our AudioEngine profile keys (water, meal, workout, sleep)
          try {
            switch (reminder.type) {
              case 'water':
                AudioEngine.playWaterDrop();
                break;
              case 'meal':
                AudioEngine.playSoftNotification();
                break;
              case 'workout':
                AudioEngine.playEnergeticPulse();
                break;
              case 'sleep':
                AudioEngine.playSunriseChime();
                break;
              default:
                AudioEngine.playAttentionTone();
            }
          } catch (e) {
            console.error("Failed to play reminder audio", e);
          }

          // 3. Log event to Notification Center (the bell icon)
          logEvent({
            id: crypto.randomUUID(),
            userId: reminder.userId || 'local',
            type: 'reminder_triggered',
            title: reminder.title,
            message: reminder.description || `It's time for your ${reminder.type} reminder!`,
            createdAt: now.toISOString(),
            isRead: false
          });
        }
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);
}
