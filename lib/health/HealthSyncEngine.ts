import { IHealthProvider, SyncCheckpoint } from './types';
import { HealthValidation } from './HealthValidation';
import { HealthDataNormalizer } from './HealthDataNormalizer';
import { HealthConflictResolver } from './HealthConflictResolver';

export class HealthSyncEngine {
    /**
     * Executes the secure, resumable, partial-recovery sync pipeline.
     */
    static async sync(userId: string, provider: IHealthProvider, checkpoint: SyncCheckpoint | null): Promise<SyncCheckpoint> {
        const start = performance.now();
        const syncId = `sync_${Math.random().toString(36).substr(2, 9)}`;
        let validRecordCount = 0;
        let errors: string[] = [];

        for (const dataType of provider.supports) {
            try {
                // 1. Fetch Raw Data
                const rawRecords = await provider.fetchData(userId, dataType, checkpoint?.lastCursor || null);
                
                for (const raw of rawRecords) {
                    // 2. Validate (Partial Recovery: drop bad records, keep good ones)
                    if (!HealthValidation.isValid(raw)) {
                        errors.push(`Invalid record dropped for ${dataType}`);
                        continue; 
                    }

                    // 3. Normalize
                    const normalized = HealthDataNormalizer.normalize(provider.name, raw, userId, dataType, syncId);

                    // 4. Resolve Conflicts (against existing DB records)
                    // Mock existing records
                    const existingRecords: any[] = []; 
                    const finalRecord = HealthConflictResolver.resolve(existingRecords, normalized);

                    // 5. Save to Repository (Mocked here, but would use UnitOfWork in prod)
                    validRecordCount++;
                }

            } catch (err: any) {
                errors.push(`Failed to sync ${dataType}: ${err.message}`);
            }
        }

        // Return updated checkpoint
        return {
            provider: provider.name,
            lastSuccessfulSync: Date.now(),
            lastCursor: 'mock_cursor_end',
            recordCount: (checkpoint?.recordCount || 0) + validRecordCount,
            durationMs: Math.round(performance.now() - start),
            errors
        };
    }
}
