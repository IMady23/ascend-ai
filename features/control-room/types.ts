export type SystemStatus = "operational" | "ready" | "offline" | "coming_soon" | "warning";

export interface SystemService {
  id: string;
  name: string;
  status: SystemStatus;
  description: string;
}

export interface ConnectedService {
  id: string;
  name: string;
  status: "connected" | "available" | "coming_soon" | "not_connected";
  icon: string;
}
