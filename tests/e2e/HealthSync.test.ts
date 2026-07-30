import { HealthManager } from '../../lib/health/HealthManager';
import { MockHealthProvider } from '../../lib/health/providers/MockHealthProvider';

describe('Health Integrations [E2E]', () => {
    it('should normalize and resolve conflicts without crashing', async () => {
        const manager = new HealthManager();
        manager.registerProvider(new MockHealthProvider());

        const checkpoint = await manager.synchronizeUser('user_123', 'MockHealthProvider', null);
        
        expect(checkpoint.recordCount).toBeGreaterThan(0);
        expect(checkpoint.errors.length).toBe(0);
    });
});
