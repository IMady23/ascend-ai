import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import {
  CommandCenterHero,
  SystemOverview,
  PersonalProfile,
  MissionConfiguration,
  ChapterManagement,
  AIConfiguration,
  NotificationCenter,
  ConnectedServices,
  BackupData,
  Security,
  Appearance,
  AboutAscend
} from "@/features/control-room";

export default function SettingsPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-8 pb-12 max-w-6xl mx-auto w-full">
        {/* 1. Command Center Hero */}
        <CommandCenterHero />

        {/* 2. System Overview */}
        <SystemOverview />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            {/* 3. Personal Profile */}
            <PersonalProfile />
            {/* 4. Mission Configuration */}
            <MissionConfiguration />
            {/* 5. Chapter Management */}
            <ChapterManagement />
          </div>
          <div className="flex flex-col gap-8">
            {/* 6. AI Configuration */}
            <AIConfiguration />
            {/* 7. Notification Center */}
            <NotificationCenter />
          </div>
        </div>

        {/* 8. Connected Services */}
        <ConnectedServices />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 9. Backup & Data */}
          <BackupData />
          {/* 10. Security */}
          <Security />
        </div>

        {/* 11. Appearance */}
        <Appearance />

        {/* 12. About Ascend AI */}
        <AboutAscend />
      </div>
    </PageContainer>
  );
}
