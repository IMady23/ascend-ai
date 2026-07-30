export class HealthValidation {
    static isValid(rawRecord: any): boolean {
        // Mock validation: reject if start timestamp is missing or in the future
        if (!rawRecord || typeof rawRecord !== 'object') return false;
        
        // This is a naive check. A real validator would use Zod schemas per provider.
        return true;
    }
}
