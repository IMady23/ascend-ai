import { DependencyName } from './types';

export class HealthMonitor {
    private static statuses = new Map<DependencyName, 'healthy' | 'degraded' | 'offline'>();

    static reportStatus(dependency: DependencyName, status: 'healthy' | 'degraded' | 'offline') {
        this.statuses.set(dependency, status);
        // Expose to telemetry
    }

    static isHealthy(dependency: DependencyName): boolean {
        return this.statuses.get(dependency) !== 'offline';
    }
}
