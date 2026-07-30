import { DependencyName, ReliabilityProfile } from './types';

type BreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export class CircuitBreaker {
    private static states = new Map<DependencyName, { state: BreakerState; failures: number; openedAt: number }>();

    static check(dependency: DependencyName, profile: ReliabilityProfile): void {
        const record = this.states.get(dependency) || { state: 'CLOSED', failures: 0, openedAt: 0 };

        if (record.state === 'OPEN') {
            if (Date.now() - record.openedAt > profile.circuitBreakerCooldownMs) {
                // Transition to Half-Open
                this.states.set(dependency, { state: 'HALF_OPEN', failures: 0, openedAt: record.openedAt });
            } else {
                throw new Error(`CircuitBreaker is OPEN for ${dependency}`);
            }
        }
    }

    static recordFailure(dependency: DependencyName, profile: ReliabilityProfile): void {
        const record = this.states.get(dependency) || { state: 'CLOSED', failures: 0, openedAt: 0 };
        record.failures++;

        if (record.failures >= profile.circuitBreakerThreshold) {
            record.state = 'OPEN';
            record.openedAt = Date.now();
        }
        this.states.set(dependency, record);
    }

    static recordSuccess(dependency: DependencyName): void {
        this.states.set(dependency, { state: 'CLOSED', failures: 0, openedAt: 0 });
    }
}
