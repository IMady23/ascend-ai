import { UnifiedHealthRecord } from './types';

export class HealthConflictResolver {
    static resolve(existingRecords: UnifiedHealthRecord[], newRecord: UnifiedHealthRecord): UnifiedHealthRecord {
        // If there's a conflict for the same time period and data type, we prefer Apple Health 
        // over Google Health, and we prefer higher confidence records over lower ones.
        // For Phase 10 skeleton, we assume the new record wins if it has equal or higher confidence.
        
        let winner = newRecord;
        for (const existing of existingRecords) {
            if (existing.provenance.confidence > winner.provenance.confidence) {
                winner = existing;
            }
        }
        return winner;
    }
}
