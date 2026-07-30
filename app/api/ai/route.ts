import { NextResponse } from "next/server";
import { AIOrchestrator } from "@/lib/ai/AIOrchestrator";

const orchestrator = new AIOrchestrator();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messageText, contextSnapshot, chatHistory, userId } = body;

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
    
    const currentModule = contextSnapshot?.coachingScenario || "general";
    const startTime = Date.now();
    
    const structuredResponse = await orchestrator.executeAICommand(
      context,
      messageText,
      currentModule,
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
