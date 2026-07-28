import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import {
  Header,
  ProgressRing,
  MissionList,
  QuickActions,
  AICard,
  HealthOverview,
  ChapterCard,
} from "@/features/mission-control";

export default function MissionControlPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-6 lg:gap-8 max-w-5xl mx-auto">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 flex flex-col gap-6 lg:gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <ProgressRing />
              <MissionList />
            </div>

            <QuickActions />
            <HealthOverview />
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-6 lg:gap-8">
            <AICard />
            <ChapterCard />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
