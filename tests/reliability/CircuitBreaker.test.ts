import { CircuitBreaker } from '../../lib/reliability/CircuitBreaker';
import { RELIABILITY_PROFILES } from '../../lib/reliability/types';

describe('Reliability - Circuit Breaker', () => {
    it('should open circuit after threshold failures', () => {
        const profile = RELIABILITY_PROFILES['FAST_READ']; // Threshold 10
        
        for (let i = 0; i < 10; i++) {
            CircuitBreaker.recordFailure('Firestore', profile);
        }

        expect(() => {
            CircuitBreaker.check('Firestore', profile);
        }).toThrow('CircuitBreaker is OPEN for Firestore');
    });
});
