"use client";

import * as React from "react";
import { 
  Settings, 
  Search,
  User,
  ShieldCheck,
  BrainCircuit,
  Database,
  Smartphone,
  Paintbrush,
  Bell,
  CloudCog,
  RefreshCw,
  Lock,
  Terminal,
  Activity,
  LogOut,
  Moon,
  Sun,
  Laptop,
  Target
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { DashboardLayout, HeroSection, WidgetSection } from "@/components/adl/layout/Layouts";
import { GlassCard } from "@/components/adl/composites/cards/Cards";
import { Heading, BodyText, Caption } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Badge } from "@/components/adl/primitives/Badge";

import { WorkspaceProfileCard } from "@/components/adl/composites/settings/WorkspaceProfileCard";
import { SystemHealthPanel } from "@/components/adl/composites/settings/SystemHealthPanel";
import { AIProviderCard } from "@/components/adl/composites/settings/AIProviderCard";
import { PreferenceCard } from "@/components/adl/composites/settings/PreferenceCard";
import { UsageMeter } from "@/components/adl/composites/settings/UsageMeter";
import { useWorkspaceStore, WorkspaceProfile } from "@/stores/workspace.store";
import { useToastStore } from "@/stores/toast.store";

const SYSTEM_HEALTH = [
  { label: "Ascend AI Core", status: "Healthy" as const },
  { label: "OpenRouter Connection", status: "Healthy" as const, detail: "142ms latency" },
  { label: "Cloud Sync (Last 1hr)", status: "Warning" as const, detail: "1 pending queue item" },
  { label: "Garmin Connect", status: "Healthy" as const },
  { label: "Local Database", status: "Healthy" as const, detail: "24MB used" }
];

export default function ControlRoomModule() {
  const { activeProfile, setProfile } = useWorkspaceStore();
  const { addToast } = useToastStore();
  
  const handleProfileSelect = (profile: WorkspaceProfile) => {
    setProfile(profile);
    addToast({
      title: "Profile Updated",
      message: `Switched to ${profile} workspace.`,
      type: "success"
    });
  };
  
  // Set Page Accent
  React.useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", "var(--color-accent-gold)");
  }, []);

  return (
    <PageContainer>
      <DashboardLayout>
        
        {/* TOP HERO ZONE (Status & Global Search) */}
        <div className="lg:col-span-3 space-y-6">
          <HeroSection className="bg-gradient-to-br from-[var(--color-bg-base)] via-[var(--color-bg-surface)] to-[var(--color-accent-gold)]/5">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between w-full">
              
              <div className="flex-1 w-full space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Settings size={16} className="text-[var(--color-accent-gold)]" />
                  <Caption className="text-[var(--color-accent-gold)] uppercase tracking-widest font-bold">Control Room</Caption>
                </div>
                <Heading level="h2" className="text-3xl tracking-tight leading-tight">
                  Ascend OS Cockpit
                </Heading>
                
                {/* Global Search */}
                <div className="relative max-w-md w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-[var(--color-text-muted)]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search settings, AI models, privacy..."
                    className="block w-full pl-10 pr-3 py-2 border border-[var(--color-glass-border)] rounded-lg leading-5 bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent-gold)] focus:ring-1 focus:ring-[var(--color-accent-gold)] sm:text-sm transition-colors"
                  />
                </div>
              </div>

              {/* System Quick Stats */}
              <div className="shrink-0 flex gap-4">
                <div className="flex flex-col items-end">
                  <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Active Profile</Caption>
                  <Heading level="h3" className="text-xl">{activeProfile}</Heading>
                  <Caption className="text-[var(--color-success)] mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" /> All systems nominal
                  </Caption>
                </div>
                <div className="w-px h-12 bg-[var(--color-glass-border)] mx-2" />
                <div className="flex flex-col items-start">
                  <Caption className="text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Version</Caption>
                  <Heading level="h3" className="text-xl font-mono whitespace-nowrap">Ascend AI 1.0.0</Heading>
                  <Caption className="text-[var(--color-text-secondary)] mt-1">Pro Membership</Caption>
                </div>
              </div>

            </div>
          </HeroSection>
        </div>

        {/* LEFT COLUMN: Personalization & AI Config (60%) */}
        <div className="lg:col-span-2 space-y-6">
          
          <WidgetSection title="Workspace Profiles">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <WorkspaceProfileCard 
                name="Athlete Mode" 
                description="Aggressive planning, analytical AI, high volume." 
                icon={<Activity size={20} />}
                isActive={activeProfile === "Athlete Mode"}
                onClick={() => handleProfileSelect("Athlete Mode")}
              />
              <WorkspaceProfileCard 
                name="Fat Loss" 
                description="Nutrition-first, motivational AI, strict tracking." 
                icon={<Target size={20} />}
                isActive={activeProfile === "Fat Loss"}
                onClick={() => handleProfileSelect("Fat Loss")}
              />
              <WorkspaceProfileCard 
                name="Recovery Week" 
                description="Calm AI, zero workout push, focus on sleep." 
                icon={<Moon size={20} />}
                isActive={activeProfile === "Recovery Week"}
                onClick={() => handleProfileSelect("Recovery Week")}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]">
                Manage Profiles...
              </Button>
            </div>
          </WidgetSection>

          <WidgetSection title="AI Preferences">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PreferenceCard 
                title="Coach Personality"
                description="Analytical and direct."
                icon={<BrainCircuit size={18} />}
                action={<Badge variant="outline">Analytical</Badge>}
              />
              <PreferenceCard 
                title="Reasoning Visibility"
                description="Explain every recommendation."
                icon={<Search size={18} />}
                action={<Badge variant="outline">Deep</Badge>}
              />
              <PreferenceCard 
                title="Confidence Display"
                description="Show confidence on all AI claims."
                icon={<ShieldCheck size={18} />}
                action={<Badge variant="outline">Always</Badge>}
              />
              <PreferenceCard 
                title="AI Memory"
                description="Auto-save goals and preferences."
                icon={<Database size={18} />}
                action={<Badge variant="outline">Auto</Badge>}
              />
            </div>
          </WidgetSection>

          <WidgetSection title="Personalization Studio">
            <div className="grid grid-cols-1 gap-4">
              <PreferenceCard 
                title="Global Theme"
                description="System default."
                icon={<Paintbrush size={18} />}
                action={
                  <div className="flex bg-[var(--color-bg-base)] rounded-lg p-1 border border-[var(--color-glass-border)]">
                    <div className="p-1.5 rounded-md text-[var(--color-text-muted)] cursor-pointer hover:bg-[var(--color-bg-surface)]"><Sun size={14} /></div>
                    <div className="p-1.5 rounded-md text-[var(--color-text-muted)] cursor-pointer hover:bg-[var(--color-bg-surface)]"><Moon size={14} /></div>
                    <div className="p-1.5 rounded-md bg-[var(--color-bg-surface)] text-[var(--color-text-primary)] shadow-sm"><Laptop size={14} /></div>
                  </div>
                }
              />
            </div>
          </WidgetSection>

        </div>

        {/* RIGHT COLUMN: Infrastructure & Data (40%) */}
        <div className="lg:col-span-1 space-y-6">

          <WidgetSection title="Diagnostics">
            <SystemHealthPanel metrics={SYSTEM_HEALTH} />
          </WidgetSection>

          <WidgetSection title="AI Provider Center">
            <div className="space-y-4">
              <AIProviderCard 
                providerName="OpenRouter"
                modelName="gpt-4o"
                isActive={true}
                latency="142ms"
                successRate="99.8%"
                contextWindow="128k"
              />
              <GlassCard className="p-4">
                <UsageMeter 
                  label="Monthly Token Usage"
                  used={1245000}
                  total={5000000}
                  unit="tokens"
                  color="var(--color-accent-gold)"
                />
              </GlassCard>
            </div>
          </WidgetSection>

          <WidgetSection title="Data & Privacy">
            <div className="flex flex-col gap-3">
              <PreferenceCard 
                title="Cloud Backup"
                description="Last synced 5 mins ago."
                icon={<CloudCog size={16} />}
                action={<RefreshCw size={14} className="text-[var(--color-text-muted)]" />}
              />
              <PreferenceCard 
                title="AI Transparency"
                description="View & delete what AI knows."
                icon={<ShieldCheck size={16} />}
                action={<Button variant="ghost" size="sm" className="h-6 text-[10px]">Manage</Button>}
              />
              <PreferenceCard 
                title="Connected Devices"
                description="Garmin, Apple Health."
                icon={<Smartphone size={16} />}
                action={<span className="text-xs font-mono">2</span>}
              />
            </div>
          </WidgetSection>

        </div>
      </DashboardLayout>
    </PageContainer>
  );
}
