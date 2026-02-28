"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TENANT_CONSTANTS = exports.BCRYPT_CONSTANTS = exports.DATABASE_CONSTANTS = exports.JWT_CONSTANTS = void 0;
exports.JWT_CONSTANTS = {
    ACCESS_TOKEN_EXPIRY: '15m',
    REFRESH_TOKEN_EXPIRY: '7d',
    ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET || 'arwa-park-access-secret',
    REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET || 'arwa-park-refresh-secret',
};
exports.DATABASE_CONSTANTS = {
    CONNECTION_NAME: 'default',
    CONNECTION_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/arwa-park',
};
exports.BCRYPT_CONSTANTS = {
    SALT_ROUNDS: 12,
};
exports.TENANT_CONSTANTS = {
    AGENCY_ID_HEADER: 'x-agency-id',
    TENANT_ID_KEY: 'tenantId',
};
//# sourceMappingURL=index.js.map