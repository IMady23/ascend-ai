export class SchemaVersion {
    static readonly WORKOUT_V1 = '1.0';
    static readonly WORKOUT_V2 = '2.0';

    static isCompatible(currentVersion: string, targetVersion: string): boolean {
        // Simple mock implementation of semver compatibility check
        return currentVersion.split('.')[0] === targetVersion.split('.')[0];
    }
}
