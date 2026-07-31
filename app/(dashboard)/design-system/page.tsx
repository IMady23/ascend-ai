"use client";

import React, { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer/PageContainer";
import { Heading, Subheading, BodyText, Caption, Label, Statistic, MonoData } from "@/components/adl/typography";
import { Button } from "@/components/adl/primitives/Button";
import { Badge } from "@/components/adl/primitives/Badge";
import { Avatar } from "@/components/adl/primitives/Avatar";
import { Spinner } from "@/components/adl/primitives/Spinner";
import { Divider } from "@/components/adl/primitives/Divider";
import { Surface, GlassSurface } from "@/components/adl/system/Surface";
import { Card, GlassCard, InteractiveCard, MetricCard } from "@/components/adl/composites/cards/Cards";
import { TextInput, Switch } from "@/components/adl/composites/inputs/Inputs";
import { Tooltip, EmptyState } from "@/components/adl/composites/feedback/Feedback";
import { ProgressBar, ProgressRing } from "@/components/adl/composites/progress/Progress";
import { ThinkingIndicator, SuggestionChip } from "@/components/adl/composites/ai/AI";
import { AnalyticsGrid, WidgetSection, FormSection } from "@/components/adl/layout/Layouts";
import { Activity, Dumbbell, Sparkles, BrainCircuit, Search, ChevronRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

export default function DesignSystemPlayground() {
  const [accent, setAccent] = useState("var(--color-accent-blue)");
  const [toggleState, setToggleState] = useState(false);
  const [simulateSlowNetwork, setSimulateSlowNetwork] = useState(false);

  // Override root accent for the playground
  React.useEffect(() => {
    document.documentElement.style.setProperty("--current-accent", accent);
  }, [accent]);

  return (
    <PageContainer className="pb-32">
      <div className="mb-12">
        <Heading level="h1">ADL UI Laboratory</Heading>
        <Subheading size="lg" className="mt-2">
          Phase 3.5 Quality Assurance & Component Stress Testing Environment.
        </Subheading>
      </div>

      {/* Laboratory Control Panel */}
      <GlassCard padding="lg" intensity="standard" className="sticky top-24 z-50 mb-16 border-[var(--color-accent-blue)]/30">
        <Heading level="h4" className="mb-6 flex items-center gap-2">
          <BrainCircuit size={20} className="text-[var(--current-accent)]" />
          Lab Controls
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <Label>Inject Module Accent</Label>
            <div className="flex gap-3">
              <button onClick={() => setAccent("var(--color-accent-blue)")} className="w-8 h-8 rounded-full bg-[var(--color-accent-blue)] ring-2 ring-transparent focus:ring-white transition-all hover:scale-110" title="Control Room" />
              <button onClick={() => setAccent("var(--color-accent-orange)")} className="w-8 h-8 rounded-full bg-[var(--color-accent-orange)] ring-2 ring-transparent focus:ring-white transition-all hover:scale-110" title="Training" />
              <button onClick={() => setAccent("var(--color-accent-green)")} className="w-8 h-8 rounded-full bg-[var(--color-accent-green)] ring-2 ring-transparent focus:ring-white transition-all hover:scale-110" title="Nutrition" />
              <button onClick={() => setAccent("var(--color-accent-indigo)")} className="w-8 h-8 rounded-full bg-[var(--color-accent-indigo)] ring-2 ring-transparent focus:ring-white transition-all hover:scale-110" title="AI Command" />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label>Simulate Network Delay</Label>
            <div className="flex items-center gap-3">
              <Switch checked={simulateSlowNetwork} onCheckedChange={setSimulateSlowNetwork} />
              <Caption>Forces all buttons to loading state</Caption>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Accessibility Modes</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" dot>Dark Theme (Active)</Badge>
              <Badge variant="outline">Reduced Motion (Off)</Badge>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="space-y-32">
        
        {/* Foundation: Typography Hierarchy */}
        <section>
          <Heading level="h2" className="mb-8 border-b border-border-subtle pb-4">1. Typography Hierarchy</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div><Heading level="h1">Heading 1</Heading><Caption>4xl / Bold / Tight</Caption></div>
              <div><Heading level="h2">Heading 2</Heading><Caption>3xl / Bold / Tight</Caption></div>
              <div><Heading level="h3">Heading 3</Heading><Caption>2xl / Semibold / Tight</Caption></div>
              <div><Heading level="h4">Heading 4</Heading><Caption>xl / Semibold / Tight</Caption></div>
            </div>
            <div className="space-y-6">
              <div><Subheading size="lg">Large Subheading supporting text</Subheading><Caption>text-lg / text-secondary</Caption></div>
              <div><BodyText size="md">Standard body text used for long form paragraphs. It has excellent readability and relaxed line height.</BodyText><Caption>text-base / leading-relaxed</Caption></div>
              <div><Statistic>1,240</Statistic><Caption>font-mono / 4xl / bold</Caption></div>
              <div><MonoData>0x4F2A9</MonoData><Caption>font-mono / text-sm</Caption></div>
            </div>
          </div>
        </section>

        {/* Standardized Interaction Patterns */}
        <section>
          <Heading level="h2" className="mb-8 border-b border-border-subtle pb-4">2. Interaction Patterns & Stress Tests</Heading>
          
          <WidgetSection title="Button Stress Test">
            <div className="flex flex-wrap items-end gap-6 p-6 rounded-xl border border-border-subtle border-dashed">
              <Button variant="primary" loading={simulateSlowNetwork}>Standard Action</Button>
              <Button variant="danger" loading={simulateSlowNetwork} leftIcon={<AlertCircle size={16}/>}>Delete Pattern</Button>
              <Button variant="success" loading={simulateSlowNetwork} leftIcon={<CheckCircle2 size={16}/>}>Success Pattern</Button>
              <Button variant="ghost" disabled>Disabled State</Button>
              {/* Extreme length stress test */}
              <Button variant="secondary" className="max-w-[200px]">
                <span className="truncate">Extremely long button label that should truncate</span>
              </Button>
              <Button variant="primary" fullWidth loading={simulateSlowNetwork}>
                Full Width Upload Pattern
              </Button>
            </div>
          </WidgetSection>

          <WidgetSection title="Input Stress Test" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-xl border border-border-subtle border-dashed">
              <TextInput 
                placeholder="Overflow test..." 
                defaultValue="Super long user input that should scroll horizontally inside the input field without breaking the layout"
              />
              <TextInput 
                placeholder="Error pattern..." 
                error="Invalid format. Please use standard email." 
                defaultValue="invalid-email@"
              />
            </div>
          </WidgetSection>
        </section>

        {/* Semantic Layout Primitives */}
        <section>
          <Heading level="h2" className="mb-8 border-b border-border-subtle pb-4">3. Semantic Layouts (Composites)</Heading>
          
          <WidgetSection title="AnalyticsGrid & MetricCard Pattern">
            <AnalyticsGrid>
              {/* Dense Data Stress Test */}
              <MetricCard label="Active Calories" value="1,240" icon={<Activity size={18} />} trend={{ value: 12, label: "vs yesterday", isPositive: true }} />
              <MetricCard label="Sleep Score" value="94" icon={<Sparkles size={18} />} trend={{ value: 4, label: "vs last week", isPositive: true }} />
              <MetricCard label="Strain" value="18.2" icon={<Dumbbell size={18} />} trend={{ value: 2, label: "vs average", isPositive: false }} />
              <MetricCard label="Missing Data" value="--" icon={<AlertCircle size={18} />} />
            </AnalyticsGrid>
          </WidgetSection>

          <WidgetSection title="FormSection Pattern" className="mt-8">
            <div className="bg-surface p-6 rounded-xl border border-border-subtle">
              <FormSection title="Profile Settings" description="Update your personal details and public profile.">
                <TextInput placeholder="Full Name" defaultValue="Alex Rivera" />
                <TextInput placeholder="Email Address" defaultValue="alex@ascend.ai" />
              </FormSection>
              <FormSection title="Notifications" description="Configure how we alert you.">
                <div className="flex items-center justify-between">
                  <Label>Weekly Reports</Label>
                  <Switch checked={true} onCheckedChange={() => {}} />
                </div>
              </FormSection>
            </div>
          </WidgetSection>
        </section>

        {/* Empty States & Error Experiences */}
        <section>
          <Heading level="h2" className="mb-8 border-b border-border-subtle pb-4">4. Standardized Empty & Error States</Heading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-dashed border-2">
              <EmptyState 
                icon={<Activity size={24} />} 
                title="No Workouts Found" 
                description="You haven't logged any sessions this week. Start training to see insights here."
                action={<Button size="sm" variant="primary">Start Workout</Button>}
              />
            </Card>
            <Card className="border-dashed border-2 bg-[var(--color-danger)]/5 border-[var(--color-danger)]/20">
              <EmptyState 
                icon={<XCircle size={24} className="text-[var(--color-danger)]" />} 
                title="Failed to Load Data" 
                description="We couldn't connect to the server. Please check your network and try again."
                action={<Button size="sm" variant="danger">Retry Connection</Button>}
              />
            </Card>
          </div>
        </section>

        {/* AI & Innovation */}
        <section>
          <Heading level="h2" className="mb-8 border-b border-border-subtle pb-4">5. AI Conversation Patterns</Heading>
          <GlassCard intensity="high" className="border-[var(--color-accent-indigo)]/50 max-w-2xl mx-auto">
            <div className="flex items-start gap-4 mb-8">
              <Avatar size="md" className="bg-[var(--color-accent-indigo)]" fallback="AI" />
              <div className="space-y-4 flex-1">
                <BodyText size="md">I've analyzed your recent strain levels. Your cardiovascular recovery is peaking today.</BodyText>
                <div className="flex items-center gap-2">
                  <ThinkingIndicator size="sm" />
                  <Caption>Generating workout plan...</Caption>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-border-subtle">
              <SuggestionChip icon={<Sparkles size={14} />}>Accept Plan</SuggestionChip>
              <SuggestionChip>Make it harder</SuggestionChip>
            </div>
          </GlassCard>
        </section>

      </div>
    </PageContainer>
  );
}
