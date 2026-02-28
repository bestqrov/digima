export declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test",
    Staging = "staging"
}
export declare class EnvironmentVariables {
    NODE_ENV: Environment;
    PORT: number;
    MONGODB_URI: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRY: string;
    JWT_REFRESH_EXPIRY: string;
    BCRYPT_ROUNDS: number;
    CORS_ORIGINS: string;
    THROTTLE_TTL: number;
    THROTTLE_LIMIT: number;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
