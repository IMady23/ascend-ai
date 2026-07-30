import { IHealthProvider, SyncCheckpoint } from './types';
import { HealthSyncEngine } from './HealthSyncEngine';

export class HealthManager {
    private providers: Map<string, IHealthProvider> = new Map();

    registerProvider(provider: IHealthProvider) {
        this.providers.set(provider.name, provider);
    }

    async synchronizeUser(userId: string, providerName: string, previousCheckpoint: SyncCheckpoint | null): Promise<SyncCheckpoint> {
        const provider = this.providers.get(providerName);
        if (!provider) {
            throw new Error(`Provider ${providerName} is not registered.`);
        }

        const hasPermission = await provider.hasPermissions(userId);
        if (!hasPermission) {
            throw new Error(`Missing permissions for ${providerName}`);
        }

        return await HealthSyncEngine.sync(userId, provider, previousCheckpoint);
    }
}
