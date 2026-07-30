import { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell/AppShell";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AmbientBackground } from "@/components/layout/Background/AmbientBackground";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AmbientBackground />
      <AppShell>{children}</AppShell>
    </ThemeProvider>
  );
}
