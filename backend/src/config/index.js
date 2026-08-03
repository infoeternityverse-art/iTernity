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
  corsOrigins: loadEnv('CORS_ORIGIN', 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  supportEmail: loadEnv('SUPPORT_EMAIL', loadEnv('SMTP_FROM_EMAIL', 'support@example.com')),
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
  ai: {
    provider: loadEnv('AI_PROVIDER', 'groq'),
    apiKey: loadEnv('GROQ_API_KEY', ''),
    baseUrl: loadEnv('GROQ_BASE_URL', 'https://api.groq.com/openai/v1'),
    model: loadEnv('GROQ_MODEL', 'llama-3.1-8b-instant'),
    timeoutMs: Number(loadEnv('AI_TIMEOUT_MS', 12000)),
    maxOutputTokens: Number(loadEnv('AI_MAX_OUTPUT_TOKENS', 900)),
  },
  credentialEncryptionKey: loadEnv(
    'CREDENTIAL_ENCRYPTION_KEY',
    loadEnv('NODE_ENV', 'development') === 'production'
      ? undefined
      : 'development-only-credential-encryption-key'
  ),
};
