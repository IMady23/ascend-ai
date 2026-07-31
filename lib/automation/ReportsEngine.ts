import { ReportsRepository, UserReport } from "@/services/repositories/reports.repository";
import { ActivityRepository } from "@/services/repositories/activity.repository";
import { NutritionRepository } from "@/services/repositories/nutrition.repository";
import { ProgressionRepository } from "@/services/repositories/progression.repository";
import { NotificationEngine } from "@/lib/progression/NotificationEngine";

export class ReportsEngine {
  static async generateDailyReport(userId: string, targetDateStr: string): Promise<UserReport | null> {
    try {
      // 1. Fetch data for the day
      const nutritionLogs = await NutritionRepository.getNutritionLogs(userId);
      const dailyNutrition = nutritionLogs.filter(log => log.date === targetDateStr);

      const activities = await ActivityRepository.getActivities(userId);
      const dailyActivities = activities.filter(act => {
        const d = new Date(act.createdAt?.seconds * 1000).toISOString().split("T")[0];
        return d === targetDateStr;
      });

      // Simple metrics
      const totalCalories = dailyNutrition.reduce((acc, l) => acc + (l.calories || 0), 0);
      const totalProtein = dailyNutrition.reduce((acc, l) => acc + (l.protein || 0), 0);
      const workoutsCompleted = dailyActivities.length;
      
      const progression = await ProgressionRepository.getProfile(userId);

      const report: UserReport = {
        id: `daily-${targetDateStr}`,
        userId,
        type: 'daily',
        period: targetDateStr,
        generatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        analytics: {
          totalCalories,
          totalProtein,
          workoutsCompleted,
        },
        gamification: {
          currentLevel: progression?.xp?.currentLevel || 1,
          currentXP: progression?.xp?.total || 0,
        },
        read: false
      };

      await ReportsRepository.saveReport(userId, report);

      // Notify user
      NotificationEngine.evaluateEvent({
        id: crypto.randomUUID(),
        userId,
        type: 'ACHIEVEMENT_UNLOCKED', // Just using a mapped type to trigger notification
        timestamp: report.generatedAt,
        metadata: { title: "Daily Report Ready", message: "Your daily progress report is available!" },
        processed: true
      });

      return report;
    } catch (error) {
      console.error("Failed to generate daily report", error);
      return null;
    }
  }

  static async generateWeeklyReport(userId: string, weekStr: string): Promise<UserReport | null> {
    // Basic stub for weekly report
    try {
      const report: UserReport = {
        id: `weekly-${weekStr}`,
        userId,
        type: 'weekly',
        period: weekStr,
        generatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        analytics: {},
        gamification: {},
        read: false
      };
      
      await ReportsRepository.saveReport(userId, report);
      return report;
    } catch (error) {
      console.error("Failed to generate weekly report", error);
      return null;
    }
  }

  static async generateMonthlyReport(userId: string, monthStr: string): Promise<UserReport | null> {
    // Basic stub for monthly report
    try {
      const report: UserReport = {
        id: `monthly-${monthStr}`,
        userId,
        type: 'monthly',
        period: monthStr,
        generatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
        analytics: {},
        gamification: {},
        read: false
      };
      
      await ReportsRepository.saveReport(userId, report);
      return report;
    } catch (error) {
      console.error("Failed to generate monthly report", error);
      return null;
    }
  }
}
