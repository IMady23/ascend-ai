import { AscendEvent } from "@/types/events";
import { PreferencesRepository } from "@/services/repositories/preferences.repository";
import { UserPreferences } from "@/types/automation";

export class RulesEngine {
  static async shouldNotify(event: AscendEvent): Promise<boolean> {
    const preferences = await PreferencesRepository.getPreferences(event.userId);
    
    // 1. Check if quiet hours apply
    if (this.isInQuietHours(preferences)) {
      // In quiet hours, suppress notifications
      return false;
    }

    // 2. Check event specific preferences
    if (event.type === 'WORKOUT_COMPLETED' && !preferences.notifications.workoutReminder) return false;
    if (event.type === 'MEAL_LOGGED' && !preferences.notifications.mealReminder) return false;
    if (event.type === 'WATER_LOGGED' && !preferences.notifications.waterReminder) return false;
    if ((event.type === 'LEVEL_UP' || event.type === 'ACHIEVEMENT_UNLOCKED') && !preferences.notifications.achievementNotifications) return false;

    return true;
  }

  private static isInQuietHours(preferences: UserPreferences): boolean {
    const { quietHours } = preferences.notifications;
    const { timezone } = preferences;

    if (!quietHours || !quietHours.start || !quietHours.end) return false;

    // Get current time in user's timezone
    const now = new Date();
    
    let timeParts: string[];
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      // formatter.format(now) returns something like "22:15" or "24:15" -> wait, hour12: false gives 24-hour but might return "24" for midnight. 
      // better to use hourCycle: 'h23'
      const formatter23 = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
      });
      timeParts = formatter23.format(now).split(':');
    } catch (e) {
      // fallback if timezone is invalid
      timeParts = [now.getHours().toString(), now.getMinutes().toString()];
    }
    
    const currentHour = parseInt(timeParts[0], 10);
    const currentMinute = parseInt(timeParts[1], 10);
    const currentMinutes = currentHour * 60 + currentMinute;

    const startParts = quietHours.start.split(':');
    const startMinutes = parseInt(startParts[0], 10) * 60 + parseInt(startParts[1], 10);

    const endParts = quietHours.end.split(':');
    const endMinutes = parseInt(endParts[0], 10) * 60 + parseInt(endParts[1], 10);

    if (startMinutes < endMinutes) {
      // e.g. 10:00 to 18:00
      return currentMinutes >= startMinutes && currentMinutes < endMinutes;
    } else {
      // e.g. 22:00 to 07:00 (crosses midnight)
      return currentMinutes >= startMinutes || currentMinutes < endMinutes;
    }
  }
}
