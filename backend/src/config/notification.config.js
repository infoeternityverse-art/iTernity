import { config } from './index.js';
import { loadEnv } from './env.js';

const parseEmailList = (value) =>
  String(value || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const configuredAdminNotificationEmails = parseEmailList(loadEnv('ADMIN_NOTIFICATION_EMAILS'));
const adminNotificationEmails = configuredAdminNotificationEmails.length
  ? configuredAdminNotificationEmails
  : parseEmailList(loadEnv('ADMIN_EMAIL'));

const smtpPort = Number(loadEnv('SMTP_PORT', 587));
const smtpSecureEnv = loadEnv('SMTP_SECURE');
const smtpSecure =
  smtpSecureEnv === undefined
    ? smtpPort === 465
    : String(smtpSecureEnv).trim().toLowerCase() === 'true';

export const notificationConfig = {
  enabled: loadEnv('NOTIFICATIONS_ENABLED', 'true') === 'true',
  brandName: loadEnv('NOTIFICATION_BRAND_NAME', 'iTernityverse'),
  supportEmail: loadEnv('SUPPORT_EMAIL', loadEnv('SMTP_FROM_EMAIL', 'support@example.com')),
  dashboardUrl: loadEnv('APP_DASHBOARD_URL', `${config.corsOrigin}/dashboard`),
  adminDashboardUrl: loadEnv('APP_ADMIN_URL', `${config.corsOrigin}/admin`),
  frontendUrl: loadEnv('APP_FRONTEND_URL', config.corsOrigin),
  adminNotificationEmails: [...new Set(adminNotificationEmails)],
  smtp: {
    host: loadEnv('SMTP_HOST'),
    port: smtpPort,
    user: loadEnv('SMTP_USER'),
    password: loadEnv('SMTP_PASSWORD'),
    fromName: loadEnv('SMTP_FROM_NAME', loadEnv('NOTIFICATION_BRAND_NAME', 'iTernityverse')),
    fromEmail: loadEnv('SMTP_FROM_EMAIL'),
    secure: smtpSecure,
    connectionTimeoutMs: Number(loadEnv('SMTP_CONNECTION_TIMEOUT_MS', 30000)),
    greetingTimeoutMs: Number(loadEnv('SMTP_GREETING_TIMEOUT_MS', 30000)),
    socketTimeoutMs: Number(loadEnv('SMTP_SOCKET_TIMEOUT_MS', 45000)),
  },
};

export const isSmtpConfigured = () =>
  Boolean(
    notificationConfig.smtp.host &&
    notificationConfig.smtp.port &&
    notificationConfig.smtp.user &&
    notificationConfig.smtp.password &&
    notificationConfig.smtp.fromEmail
  );
