import { DependencyName, ReliabilityError } from './types';

export class FailureClassifier {
    static classify(error: any, dependency: DependencyName, operation: string, correlationId: string): ReliabilityError {
        // Mock classification logic
        const isNetworkError = error.message?.includes('network') || error.code === 'ECONNRESET';
        const isAuthError = error.message?.includes('auth') || error.status === 401 || error.status === 403;
        
        return {
            status: 'error',
            code: isAuthError ? 'UNAUTHORIZED' : isNetworkError ? 'NETWORK_ERROR' : 'INTERNAL_ERROR',
            severity: isAuthError ? 'high' : 'medium',
            retryable: isNetworkError || error.status === 429 || error.status >= 500,
            dependency,
            operation,
            correlationId,
            occurredAt: Date.now(),
            message: error.message || 'Unknown error'
        };
    }
}
