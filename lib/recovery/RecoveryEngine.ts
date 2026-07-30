import { RecoveryProfile, RecoveryState, TrainingLoad, RecoveryRecommendation } from "@/types/recovery";
import { useIntelligenceStore } from "@/stores/intelligence.store";
import { InsightRepository } from "@/services/repositories/insight.repository";
import { RecoveryRepository } from "@/services/repositories/recovery.repository";

export class RecoveryEngine {

  static async computeRecovery(userId: string): Promise<RecoveryProfile> {
    const today = new Date();
    const weeklyId = today.toISOString().split('T')[0]; // simplify ID fetching
    // Get recent stats to compute load
    const stats = await InsightRepository.getStats(userId, 'weekly', weeklyId);
    
    // Fallbacks if stats not fully populated
    const totalVolume = stats?.metrics?.totalVolumeKg || 0;
    const consistency = stats?.consistency?.overall || 50;
    const hydration = stats?.metrics?.waterGoalsMet || 0;

    // Acute load = Recent volume / intensity 
    const acuteLoad = totalVolume * 0.7; // Dummy math
    const chronicLoad = 5000; // Simulated historical baseline
    const workloadRatio = chronicLoad > 0 ? (acuteLoad / chronicLoad) : 1;

    let fatigueLevel = 0;
    if (workloadRatio > 1.3) fatigueLevel = 80;
    else if (workloadRatio > 1.1) fatigueLevel = 50;
    else fatigueLevel = 20;

    // Weighted Score
    let score = 100 - (fatigueLevel * 0.5) + (hydration * 2) + (consistency * 0.2);
    score = Math.max(0, Math.min(100, score)); // clamp 0-100

    let state: RecoveryState = 'Good';
    if (score >= 85) state = 'Excellent';
    else if (score >= 60) state = 'Good';
    else if (score >= 40) state = 'Moderate';
    else if (score >= 20) state = 'Fatigued';
    else state = 'Overtrained';

    // Confidence Score Calculation (as requested)
    // Based on data availability
    let confidence = 100;
    if (!stats) confidence -= 40;
    if (hydration === 0) confidence -= 20;
    
    const recommendations: RecoveryRecommendation[] = [];
    if (state === 'Fatigued' || state === 'Overtrained') {
      recommendations.push({
        title: "High Fatigue Detected",
        description: "Your acute training load is significantly higher than your chronic load.",
        reason: ["Workload ratio > 1.3", "Incomplete hydration"],
        confidence: confidence >= 80 ? 'High' : confidence >= 50 ? 'Medium' : 'Low',
        priority: 'HIGH'
      });
    }

    const profile: RecoveryProfile = {
      id: crypto.randomUUID(),
      userId,
      score: Math.round(score),
      confidence,
      state,
      fatigueLevel,
      readiness: Math.round(score * 0.9), // Readiness is slightly buffered
      trainingLoad: { acuteLoad, chronicLoad, workloadRatio },
      trend: 'Stable', // calculate based on previous
      recommendations,
      timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any
    };

    await RecoveryRepository.saveRecoveryProfile(userId, profile);
    return profile;
  }
}
