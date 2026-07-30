export class VersionManager {
    static getNextVersion(current: string, type: 'major' | 'minor' | 'patch'): string {
        const [major, minor, patch] = current.replace('v', '').split('.').map(Number);
        if (type === 'major') return `v${major + 1}.0.0`;
        if (type === 'minor') return `v${major}.${minor + 1}.0`;
        return `v${major}.${minor}.${patch + 1}`;
    }
}

export class RollbackManager {
    static async rollback(previousVersion: string): Promise<void> {
        console.warn(`[DevOps] INITIATING ONE-CLICK ROLLBACK to ${previousVersion}...`);
        // Trigger hosting rollback
    }
}
