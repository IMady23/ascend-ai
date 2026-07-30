import { SecurityPolicyEngine } from '../../lib/security/SecurityPolicyEngine';
import { MOCK_IDENTITY } from '../fixtures/mockData';

describe('SecurityPolicyEngine', () => {
    it('should allow valid operations', () => {
        const decision = SecurityPolicyEngine.evaluate(
            MOCK_IDENTITY,
            'goal.read',
            null,
            'goal.read',
            'cor_test'
        );
        expect(decision.allowed).toBe(true);
    });

    it('should block operations missing permissions', () => {
        const decision = SecurityPolicyEngine.evaluate(
            MOCK_IDENTITY,
            'admin.analytics',
            null,
            'admin.analytics',
            'cor_test'
        );
        expect(decision.allowed).toBe(false);
        expect(decision.reason).toContain('Missing required permissions');
    });
});
