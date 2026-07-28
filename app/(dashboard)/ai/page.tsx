import { 
  AIHero,
  DailyInsight,
  ChatWindow,
  SuggestedActions,
  QuickPrompts,
  WeeklySummary,
  ConversationHistory
} from "@/features/ai-command";

export const metadata = {
  title: "AI Command | Ascend AI",
  description: "Central intelligence system for your transformation.",
};

export default function AiCommandPage() {
  return (
    <div className="flex flex-col gap-8 pb-24 md:pb-8">
      {/* 1. AI Hero */}
      <AIHero />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* 3. Chat Window */}
          <ChatWindow />
          
          {/* 5. Quick Prompts */}
          <QuickPrompts />
        </div>

        <div className="xl:col-span-1 flex flex-col gap-8">
          {/* 2. Daily Insight */}
          <DailyInsight />
          
          {/* 4. Suggested Actions */}
          <SuggestedActions />
          
          {/* 6. Weekly Summary */}
          <WeeklySummary />
          
          {/* 7. Conversation History */}
          <ConversationHistory />
        </div>
      </div>
    </div>
  );
}
