import { loadEnv, requireEnv } from './env.js';

export const config = {
  nodeEnv: loadEnv('NODE_ENV', 'development'),
  port: Number(loadEnv('PORT', 5000)),
  mongoUri: requireEnv('MONGO_URI'),
  mongoDnsServers: loadEnv('MONGO_DNS_SERVERS', '')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean),
  corsOrigin: loadEnv('CORS_ORIGIN', 'http://localhost:5173'),
  logLevel: loadEnv('LOG_LEVEL', 'info'),
  rateLimit: {
    windowMs: Number(loadEnv('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)),
    max: Number(loadEnv('RATE_LIMIT_MAX', 300)),
  },
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: loadEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: loadEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
    passwordResetExpiresIn: loadEnv('PASSWORD_RESET_EXPIRES_IN', '30m'),
  },
  bcryptSaltRounds: Number(loadEnv('BCRYPT_SALT_ROUNDS', 12)),
  cloudinary: {
    cloudName: loadEnv('CLOUDINARY_CLOUD_NAME', ''),
    apiKey: loadEnv('CLOUDINARY_API_KEY', ''),
    apiSecret: loadEnv('CLOUDINARY_API_SECRET', ''),
    uploadFolder: loadEnv('CLOUDINARY_UPLOAD_FOLDER', 'gpu-cloud-marketplace'),
    assetFolder: loadEnv('CLOUDINARY_ASSET_FOLDER', loadEnv('CLOUDINARY_UPLOAD_FOLDER', 'gpu-cloud-marketplace')),
  },
  credentialEncryptionKey: loadEnv(
    'CREDENTIAL_ENCRYPTION_KEY',
    loadEnv('NODE_ENV', 'development') === 'production'
      ? undefined
      : 'development-only-credential-encryption-key'
  ),
};
