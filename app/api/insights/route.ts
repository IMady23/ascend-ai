import { NextRequest, NextResponse } from "next/server";
import { InsightEngine } from "@/lib/intelligence/InsightEngine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ insights: [] });
    }

    const insights = await InsightEngine.generateDashboardInsights(userId);
    return NextResponse.json({ insights });
  } catch (error) {
    console.error("Failed to generate insights:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
