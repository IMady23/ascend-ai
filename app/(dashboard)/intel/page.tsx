import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import {
  IntelHero,
  WeeklyOverview,
  WeightTrend,
  ActivityTrend,
  NutritionTrend,
  ConsistencyScore,
  PersonalInsights,
  Recommendations,
} from "@/features/intel";

export default function IntelCenterPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-8 pb-12 max-w-6xl mx-auto w-full">
        {/* 1. Intel Hero */}
        <IntelHero />

        {/* 2. Weekly Overview */}
        <WeeklyOverview />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 3. Weight Trend */}
          <WeightTrend />
          {/* 4. Activity Trend */}
          <ActivityTrend />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 5. Nutrition Trend */}
          <div className="md:col-span-1">
            <NutritionTrend />
          </div>
          {/* 6. Consistency Score */}
          <ConsistencyScore />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 7. Personal Insights */}
          <PersonalInsights />
          {/* 8. Recommendations */}
          <Recommendations />
        </div>
      </div>
    </PageContainer>
  );
}

