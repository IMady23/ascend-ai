import { DatabaseMetrics } from '../DatabaseMetrics';

export class UnitOfWork {
    private operations: (() => Promise<void>)[] = [];

    registerOperation(op: () => Promise<void>) {
        this.operations.push(op);
    }

    async commit(correlationId: string): Promise<void> {
        const start = performance.now();
        
        try {
            // In a real Firestore implementation, this would use a Firebase Transaction or Batch
            for (const op of this.operations) {
                await op();
            }
            DatabaseMetrics.logEvent('repository.transaction.commit', correlationId, Math.round(performance.now() - start));
        } catch (error) {
            DatabaseMetrics.logEvent('repository.transaction.rollback', correlationId, Math.round(performance.now() - start));
            throw error;
        }
    }
}
