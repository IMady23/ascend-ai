export type HealthDataType = 'steps' | 'heartRate' | 'sleep' | 'weight' | 'workouts' | 'activeEnergy';
export type HealthProviderName = 'AppleHealth' | 'GoogleHealthConnect' | 'MockHealthProvider';

export interface HealthProvenance {
    sourceProvider: HealthProviderName;
    providerRecordId: string;
    importedAt: number;
    syncId: string;
    confidence: number;
}

export interface UnifiedHealthRecord {
    id: string; // Internal normalized ID
    userId: string;
    type: HealthDataType;
    value: any; // Standardized value (e.g. step count, HR bpm)
    unit: string;
    startTime: number;
    endTime: number;
    provenance: HealthProvenance;
}

export interface SyncCheckpoint {
    provider: HealthProviderName;
    lastSuccessfulSync: number;
    lastCursor: string | null;
    recordCount: number;
    durationMs: number;
    errors: string[];
}

export interface IHealthProvider {
    name: HealthProviderName;
    supports: HealthDataType[];
    
    // Auth
    requestPermissions(userId: string): Promise<boolean>;
    hasPermissions(userId: string): Promise<boolean>;
    
    // Fetch
    fetchData(userId: string, dataType: HealthDataType, sinceCursor: string | null): Promise<any[]>;
}
