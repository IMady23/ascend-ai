import { RecoveryStrategy, ReliabilityError } from './types';
import { ReliabilityMetrics } from './ReliabilityMetrics';

export class RecoveryCoordinator {
    static execute(strategy: RecoveryStrategy, error: ReliabilityError, fallbackData?: any): any {
        ReliabilityMetrics.logEvent('recovery.started', error.correlationId, { strategy, dependency: error.dependency });

        switch (strategy) {
            case 'retry':
                return { status: 'retry_queued' };
            case 'resume':
                return { status: 'resume_checkpoint' };
            case 'fallback':
                ReliabilityMetrics.logEvent('fallback.used', error.correlationId, { dependency: error.dependency });
                return fallbackData || { status: 'fallback_active' };
            case 'compensate':
                return { status: 'rolled_back' };
            case 'abort':
                throw new Error(`ABORTED: ${error.message}`);
        }
    }
}
