import { AggregatedStats, Insight, InsightCategory } from "@/types/intelligence";

export class InsightGenerator {
  
  static async generateTrendInterpretation(stats: AggregatedStats): Promise<string> {
    // In production, this would call the LLM to interpret the `stats`
    // For V1 stability, we simulate a fast template response based on the data.
    
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency

    if (stats.metrics.totalVolumeKg > 5000) {
      return "Your training volume has steadily increased while recovery has remained stable. Excellent progression.";
    } else if (stats.metrics.workoutsCompleted === 0) {
      return "No workout data recorded for this period.";
    } else {
      return "Consistent effort shown. Focus on progressive overload in the coming weeks.";
    }
  }

  static async generateExplainableInsight(
    userId: string, 
    category: InsightCategory, 
    title: string, 
    recommendation: string, 
    statsContext: AggregatedStats
  ): Promise<Insight> {
    
    // Again, simulated LLM generation for V1
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let explanation: string[] = [];
    
    if (category === 'RISK' && title.includes("Hydration")) {
      explanation = [
        "Missed hydration target yesterday.",
        "Heavy workout scheduled today.",
        "Proper hydration is critical for muscle recovery."
      ];
    } else if (category === 'MILESTONE') {
      explanation = [
        "Consistent training builds compounding results.",
        "You've shown top 10% dedication.",
        "Your volume capacity has increased 15%."
      ];
    } else {
      explanation = [
        "Data indicates a slight dip in consistency.",
        "Addressing this now prevents a long-term plateau."
      ];
    }

    return {
      id: crypto.randomUUID(),
      userId,
      category,
      title,
      description: recommendation,
      explanation,
      isRead: false,
      timestamp: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any
    };
  }
}
