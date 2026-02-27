export const JWT_CONSTANTS = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET || 'arwa-park-access-secret',
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET || 'arwa-park-refresh-secret',
};

export const DATABASE_CONSTANTS = {
  CONNECTION_NAME: 'default',
  CONNECTION_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/arwa-park',
};

export const BCRYPT_CONSTANTS = {
  SALT_ROUNDS: 12,
};

export const TENANT_CONSTANTS = {
  AGENCY_ID_HEADER: 'x-agency-id',
  TENANT_ID_KEY: 'tenantId',
};