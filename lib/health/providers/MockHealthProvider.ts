import { HealthDataType, HealthProviderName, IHealthProvider } from '../types';

export class MockHealthProvider implements IHealthProvider {
    name: HealthProviderName = 'MockHealthProvider';
    supports: HealthDataType[] = ['steps', 'sleep', 'workouts'];

    async requestPermissions(userId: string): Promise<boolean> {
        return true;
    }

    async hasPermissions(userId: string): Promise<boolean> {
        return true;
    }

    async fetchData(userId: string, dataType: HealthDataType, sinceCursor: string | null): Promise<any[]> {
        // Return raw mock data in a "provider-specific" format
        if (dataType === 'steps') {
            return [{ raw_step_count: 5000, start_timestamp: Date.now() - 86400000, end_timestamp: Date.now() }];
        }
        return [];
    }
}
