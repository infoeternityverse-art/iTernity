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
  authRateLimit: {
    windowMs: Number(loadEnv('AUTH_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)),
    ipMax: Number(loadEnv('AUTH_RATE_LIMIT_IP_MAX', 20)),
    accountMax: Number(loadEnv('AUTH_RATE_LIMIT_ACCOUNT_MAX', 7)),
    adminIpMax: Number(loadEnv('ADMIN_AUTH_RATE_LIMIT_IP_MAX', 10)),
    adminAccountMax: Number(loadEnv('ADMIN_AUTH_RATE_LIMIT_ACCOUNT_MAX', 5)),
    sessionMax: Number(loadEnv('AUTH_SESSION_RATE_LIMIT_MAX', 60)),
  },
  aiRateLimit: {
    windowMs: Number(loadEnv('AI_RATE_LIMIT_WINDOW_MS', 10 * 60 * 1000)),
    recommendationMax: Number(loadEnv('AI_RECOMMENDATION_RATE_LIMIT_MAX', 10)),
    assistantMax: Number(loadEnv('AI_ASSISTANT_RATE_LIMIT_MAX', 20)),
  },
  contactRateLimit: {
    windowMs: Number(loadEnv('CONTACT_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)),
    max: Number(loadEnv('CONTACT_RATE_LIMIT_MAX', 5)),
  },
  passwordResetRateLimit: {
    ipWindowMs: Number(loadEnv('PASSWORD_RESET_IP_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)),
    ipMax: Number(loadEnv('PASSWORD_RESET_IP_RATE_LIMIT_MAX', 10)),
    emailWindowMs: Number(loadEnv('PASSWORD_RESET_EMAIL_RATE_LIMIT_WINDOW_MS', 60 * 60 * 1000)),
    emailMax: Number(loadEnv('PASSWORD_RESET_EMAIL_RATE_LIMIT_MAX', 3)),
  },
  emailChangeRateLimit: {
    ipWindowMs: Number(loadEnv('EMAIL_CHANGE_IP_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)),
    ipMax: Number(loadEnv('EMAIL_CHANGE_IP_RATE_LIMIT_MAX', 10)),
    accountWindowMs: Number(
      loadEnv('EMAIL_CHANGE_ACCOUNT_RATE_LIMIT_WINDOW_MS', 60 * 60 * 1000)
    ),
    accountMax: Number(loadEnv('EMAIL_CHANGE_ACCOUNT_RATE_LIMIT_MAX', 3)),
  },
  passwordChangeRateLimit: {
    windowMs: Number(loadEnv('PASSWORD_CHANGE_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000)),
    ipMax: Number(loadEnv('PASSWORD_CHANGE_RATE_LIMIT_IP_MAX', 10)),
    accountMax: Number(loadEnv('PASSWORD_CHANGE_RATE_LIMIT_ACCOUNT_MAX', 5)),
  },
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: loadEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: loadEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
    passwordResetExpiresIn: loadEnv('PASSWORD_RESET_EXPIRES_IN', '30m'),
  },
  authCookies: {
    accessName: loadEnv('AUTH_ACCESS_COOKIE_NAME', 'itv_access'),
    refreshName: loadEnv('AUTH_REFRESH_COOKIE_NAME', 'itv_refresh'),
    secure:
      loadEnv(
        'AUTH_COOKIE_SECURE',
        loadEnv('NODE_ENV', 'development') === 'production' ? 'true' : 'false'
      ) === 'true',
    sameSite: loadEnv('AUTH_COOKIE_SAME_SITE', 'lax').toLowerCase(),
    domain: loadEnv('AUTH_COOKIE_DOMAIN', ''),
    accessMaxAgeMs: Number(loadEnv('AUTH_ACCESS_COOKIE_MAX_AGE_MS', 15 * 60 * 1000)),
    refreshMaxAgeMs: Number(loadEnv('AUTH_REFRESH_COOKIE_MAX_AGE_MS', 7 * 24 * 60 * 60 * 1000)),
  },
  supabase: {
    url: loadEnv('SUPABASE_URL', ''),
    anonKey: loadEnv('SUPABASE_ANON_KEY', ''),
    serviceRoleKey: loadEnv('SUPABASE_SERVICE_ROLE_KEY', ''),
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
