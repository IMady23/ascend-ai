import { MODULE_CONFIG } from "@/constants/modules.config";

export function getAccentColorForRoute(pathname: string): string {
  if (pathname === "/") {
    const appModule = MODULE_CONFIG.find((m) => m.route === "/");
    return appModule?.accentColor || "var(--color-accent-blue)";
  }

  // Handle nested routes (e.g., /training/sessions)
  const baseRoute = `/${pathname.split("/")[1]}`;
  const appModule = MODULE_CONFIG.find((m) => m.route === baseRoute);
  
  return appModule?.accentColor || "var(--color-accent-blue)";
}
