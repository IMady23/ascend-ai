import { HealthDataType, HealthProviderName, UnifiedHealthRecord } from './types';

export class HealthDataNormalizer {
    static normalize(provider: HealthProviderName, rawRecord: any, userId: string, dataType: HealthDataType, syncId: string): UnifiedHealthRecord {
        // Mock Normalization logic
        // E.g., translating `raw_step_count` to `value`
        
        let standardizedValue = rawRecord;
        if (provider === 'MockHealthProvider' && dataType === 'steps') {
            standardizedValue = rawRecord.raw_step_count;
        }

        return {
            id: `${provider}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            type: dataType,
            value: standardizedValue,
            unit: dataType === 'steps' ? 'count' : 'unknown',
            startTime: rawRecord.start_timestamp || Date.now(),
            endTime: rawRecord.end_timestamp || Date.now(),
            provenance: {
                sourceProvider: provider,
                providerRecordId: `raw_${Math.random().toString(36).substr(2, 9)}`,
                importedAt: Date.now(),
                syncId,
                confidence: 1.0 // Device measured
            }
        };
    }
}
