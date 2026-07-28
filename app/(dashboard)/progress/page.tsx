import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import {
  ProgressHero,
  AchievementTimeline,
  PersonalRecords,
  BodyProgress,
  JourneyCalendar,
  LifetimeStatistics,
  ProgressPhotos,
  MilestoneGallery,
  AIReportPlaceholder
} from "@/features/hall-of-progress";

export default function ProgressPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-8 pb-12 max-w-6xl mx-auto w-full">
        {/* 1. Progress Hero */}
        <ProgressHero />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* 3. Personal Records */}
            <PersonalRecords />
            
            {/* 5. Journey Calendar */}
            <JourneyCalendar />

            {/* 6. Lifetime Statistics */}
            <LifetimeStatistics />

            {/* 8. Milestone Gallery */}
            <MilestoneGallery />

            {/* 4. Body Progress */}
            <BodyProgress />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* 2. Achievement Timeline */}
            <AchievementTimeline />
          </div>
        </div>

        {/* 7. Progress Photos */}
        <ProgressPhotos />

        {/* 9. AI Report Placeholder */}
        <AIReportPlaceholder />
      </div>
    </PageContainer>
  );
}
