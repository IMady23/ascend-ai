export type Environment = 'development' | 'staging' | 'production';

export class EnvironmentManager {
    static get current(): Environment {
        return (process.env.NODE_ENV as Environment) || 'development';
    }

    static isProduction(): boolean {
        return this.current === 'production';
    }
}

export class SecretManager {
    static get(key: string): string {
        const value = process.env[key];
        if (!value) {
            throw new Error(`CRITICAL: Missing environment secret: ${key}`);
        }
        return value;
    }
}
