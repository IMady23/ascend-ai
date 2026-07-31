import { NextResponse } from "next/server";
import { AIOrchestrator } from "@/lib/ai/AIOrchestrator";
import { UserRepository, DailyLogRepository, NutritionRepository, ActivityRepository } from "@/services/repositories";

const orchestrator = new AIOrchestrator();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messageText, contextSnapshot, chatHistory, userId, confirmedToolCall } = body;

    if (!messageText) {
      return NextResponse.json({ error: "Missing message text" }, { status: 400 });
    }
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const context = {
      correlationId: `cor-${Date.now()}`,
      requestId: `req-${Date.now()}`,
      identity: { id: userId }
    };
    
    // The Context Builder Pipeline
    const dateStr = new Date().toISOString().split("T")[0];
    const userProfile = await UserRepository.getUser(userId);
    const dailyLog = await DailyLogRepository.getDailyLog(userId, dateStr);
    const recentMeals = await NutritionRepository.getNutritionLogs(userId);
    const recentWorkouts = await ActivityRepository.getActivities(userId);
    
    // Lazy load ProgressionRepository because it might not be exported from services/repositories yet
    const { ProgressionRepository } = await import("@/services/repositories/progression.repository");
    const progressionProfile = await ProgressionRepository.getProfile(userId);

    const { InsightRepository } = await import("@/services/repositories/insight.repository");
    const { InsightEngine } = await import("@/lib/intelligence/InsightEngine");
    const { format, startOfWeek } = await import("date-fns");
    const weeklyId = format(startOfWeek(new Date()), 'yyyy-MM-dd');
    const weeklyAnalytics = await InsightRepository.getStats(userId, 'weekly', weeklyId);
    
    const insightsStr = await InsightEngine.generateContextString(userId);

    const enrichedSnapshot = {
      ...contextSnapshot,
      profile: userProfile,
      dailyStats: dailyLog,
      recentMeals,
      recentWorkouts: recentWorkouts ? recentWorkouts.slice(0, 3) : [], // Only send the last 3 workouts to save tokens
      progression: progressionProfile,
      analytics: {
        weekly: weeklyAnalytics
      },
      insights: insightsStr
    };

    const currentModule = enrichedSnapshot?.coachingScenario || "general";
    const startTime = Date.now();
    
    // If we have a confirmed tool call, execute it first before generating AI response
    if (confirmedToolCall) {
        const { tool, params } = confirmedToolCall;
        if (tool === 'Log_Meal') {
            const { LogMealTool } = await import("@/lib/ai/tools/actions/LogMeal");
            const logTool = new LogMealTool();
            await logTool.execute({ ...params, userId }, true);
        }
    }
    
    const structuredResponse = await orchestrator.executeAICommand(
      context,
      messageText,
      enrichedSnapshot,
      chatHistory
    );
    
    const responseTime = Date.now() - startTime;

    // Convert AIResponse to AiStructuredResponse format for the frontend
    const uiResponse = {
      summary: structuredResponse.reasoning || structuredResponse.rawText || "",
      recommendations: [],
      warnings: [],
      encouragement: "",
      confidence: structuredResponse.confidence === 'high' ? 90 : structuredResponse.confidence === 'medium' ? 70 : 50,
      widgets: structuredResponse.widgets || [],
      tool_calls: structuredResponse.tool_calls || []
    };

    return NextResponse.json({
      success: true,
      data: uiResponse,
      meta: {
        provider: structuredResponse.provider,
        model: structuredResponse.model,
        responseTime
      }
    });

  } catch (error: any) {
    console.error("API Route /api/ai error:", error);
    
    // Return gracefully so the client doesn't crash, let client UI show fallback
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "Failed to process AI request" 
      }, 
      { status: 500 }
    );
  }
}
