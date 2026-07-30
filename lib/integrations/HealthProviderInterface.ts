export interface HealthMetric {
  type: 'HEART_RATE' | 'SLEEP' | 'STEPS' | 'ACTIVE_ENERGY' | 'HRV' | 'RESPIRATORY_RATE';
  value: number;
  unit: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface HealthProviderInterface {
  id: string; // e.g. 'apple_health', 'garmin', 'health_connect'
  name: string;
  isAvailable(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  getPermissionsStatus(): Promise<boolean>;
  fetchMetrics(startDate: string, endDate: string): Promise<HealthMetric[]>;
  syncData(): Promise<void>;
  disconnect(): Promise<void>;
}

export class IntegrationManager {
  private providers = new Map<string, HealthProviderInterface>();

  registerProvider(provider: HealthProviderInterface) {
    this.providers.set(provider.id, provider);
  }

  getProvider(id: string): HealthProviderInterface | undefined {
    return this.providers.get(id);
  }

  getAllProviders(): HealthProviderInterface[] {
    return Array.from(this.providers.values());
  }
}

export const integrationManager = new IntegrationManager();
