import { DependencyName, ReliabilityProfile, RecoveryStrategy, ReliabilityError } from './types';
import { CircuitBreaker } from './CircuitBreaker';
import { RetryPolicy } from './RetryPolicy';
import { FailureClassifier } from './FailureClassifier';
import { HealthMonitor } from './HealthMonitor';
import { RecoveryCoordinator } from './RecoveryCoordinator';
import { ReliabilityMetrics } from './ReliabilityMetrics';

export class ReliabilityManager {
    /**
     * The unified wrapper for all external integrations.
     */
    static async execute<T>(
        dependency: DependencyName,
        operationName: string,
        profile: ReliabilityProfile,
        correlationId: string,
        operation: () => Promise<T>,
        recoveryStrategy: RecoveryStrategy,
        fallbackData?: any
    ): Promise<T | any> {
        
        try {
            // 1. Check Circuit Breaker
            CircuitBreaker.check(dependency, profile);
            
            // 2. Check Health
            if (!HealthMonitor.isHealthy(dependency)) {
                throw new Error(`Dependency ${dependency} is marked OFFLINE`);
            }

            // 3. Execute with Retry Policy
            const result = await RetryPolicy.execute(
                operation, 
                profile, 
                correlationId, 
                (attempt, err) => {
                    ReliabilityMetrics.logEvent('retry.started', correlationId, { attempt, dependency });
                }
            );

            // 4. Success -> Close Circuit
            CircuitBreaker.recordSuccess(dependency);
            return result;

        } catch (rawError: any) {
            // 5. Failure Classification
            const error = FailureClassifier.classify(rawError, dependency, operationName, correlationId);
            
            // 6. Open Circuit if threshold met
            CircuitBreaker.recordFailure(dependency, profile);
            
            // 7. Deterministic Recovery
            return RecoveryCoordinator.execute(recoveryStrategy, error, fallbackData);
        }
    }
}
