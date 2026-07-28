import { 
  ChapterHero, 
  ProgressSummary, 
  ChapterTimeline, 
  MilestoneCard, 
  AchievementPanel, 
  NextObjective,
  MOCK_MILESTONES
} from "@/features/transformation";

export const metadata = {
  title: "Transformation | Ascend AI",
  description: "Track your long-term transformation journey.",
};

export default function TransformationPage() {
  return (
    <div className="flex flex-col gap-8 pb-24 md:pb-8">
      {/* 1. Chapter Hero */}
      <ChapterHero />

      {/* 2. Overall Progress Summary */}
      <ProgressSummary />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* 5. Next Objective */}
          <NextObjective />

          {/* 4. Milestones */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 px-1">Phase Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_MILESTONES.map((milestone) => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
            </div>
          </section>

          {/* 6. Achievements */}
          <AchievementPanel />
        </div>

        <div className="xl:col-span-1">
          {/* 3. Chapter Timeline */}
          <ChapterTimeline />
        </div>
      </div>
    </div>
  );
}
