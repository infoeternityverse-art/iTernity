import { notificationService } from '../notifications/index.js';
import { loadEnv } from '../config/env.js';

const recipient = loadEnv('TEST_EMAIL_TO', loadEnv('SMTP_FROM_EMAIL'));

if (!recipient) {
  console.error('Set TEST_EMAIL_TO or SMTP_FROM_EMAIL before running the email test helper.');
  process.exit(1);
}

await notificationService.sendCriticalSystemError({
  to: recipient,
  summary: 'Development SMTP test from the iTernityverse notification system.',
});

console.info(`Email test helper completed for ${recipient}.`);
