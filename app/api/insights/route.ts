import { NextResponse } from "next/server";
import { InsightEngine } from "@/lib/intelligence/InsightEngine";

// Mock authentication for the API
export async function GET() {
  try {
    // In a real app, extract userId from session
    const userId = "test_user_1"; 
    const insights = await InsightEngine.generateDashboardInsights(userId);
    
    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Failed to generate insights:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
