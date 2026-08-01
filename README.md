# GPU Cloud Marketplace

Phase 1 MVP for a professional GPU cloud marketplace. Customers can browse GPU rental packages, submit enquiries, and view manually issued credentials from a protected dashboard. Admins can manage packages, review enquiries, issue credentials, manage customers, and inspect audit logs.

## Tech Stack

- Frontend: Vite, React JSX, React Router DOM, Tailwind CSS, Axios, TanStack Query, Zustand, React Hook Form, Zod, Lucide React.
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt.
- Language: JavaScript and JSX only.

## Requirements

- Node.js 20+
- npm 10+
- MongoDB connection string

## Setup

```bash
npm install
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Set strong production values for JWT secrets and `CREDENTIAL_ENCRYPTION_KEY` before deploying.

Frontend environment variables:

```bash
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_API_TIMEOUT_MS=45000
VITE_APP_NAME=iTernityverse
VITE_APP_ENV=development
VITE_SUPPORT_EMAIL=support@example.com
```

## Scripts

```bash
npm run dev
npm run dev:frontend
npm run dev:backend
npm run email:test
npm run build
npm run start
npm run lint
npm run format
npm run format:check
```

## Email Notifications

Phase 1 includes a reusable notification layer:

```text
Controller -> Business Service -> Notification Service -> Email Provider -> SMTP
```

Controllers do not send email directly. Business services trigger `notificationService` after successful persistence, and notification delivery runs as best-effort background work so SMTP latency does not block API responses. Every notification failure is logged without failing the original business operation. The provider currently uses Nodemailer over SMTP and can later be replaced or expanded with queue-backed Email, SMS, WhatsApp, Slack, Discord, or push providers.

Required SMTP variables live in `backend/.env`:

```bash
NOTIFICATIONS_ENABLED=true
NOTIFICATION_BRAND_NAME=iTernityverse
SUPPORT_EMAIL=support@example.com
APP_FRONTEND_URL=http://localhost:5173
APP_DASHBOARD_URL=http://localhost:5173/dashboard
APP_ADMIN_URL=http://localhost:5173/admin
ADMIN_NOTIFICATION_EMAILS=admin@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=smtp-user
SMTP_PASSWORD=smtp-password
SMTP_FROM_NAME=iTernityverse
SMTP_FROM_EMAIL=no-reply@example.com
SMTP_SECURE=false
SMTP_CONNECTION_TIMEOUT_MS=10000
SMTP_GREETING_TIMEOUT_MS=10000
SMTP_SOCKET_TIMEOUT_MS=15000
PASSWORD_RESET_EXPIRES_IN=30m
```

In production, set the SMTP values in the hosting provider environment variables. `smtp.example.com`,
`smtp-user`, and `smtp-password` are placeholders and will not deliver email. Admin enquiry
notifications are sent to active admin users in MongoDB plus any comma-separated emails configured in
`ADMIN_NOTIFICATION_EMAILS`.

Notification triggers:

- Welcome email after customer registration.
- Enquiry received email after customer enquiry submission.
- Admin new enquiry notification after enquiry submission.
- Enquiry status updated email after admin status change.
- Credentials issued email after admin creates credentials. Passwords are not sent by email.
- Password reset email after forgot-password request.
- Password changed email after authenticated password change or reset completion.
- Profile updated email after customer profile update.
- Critical system error email template and helper are architecture-ready for future monitoring.

Use `npm run email:test` to verify SMTP configuration in development. The helper sends a non-sensitive test message to `TEST_EMAIL_TO` or `SMTP_FROM_EMAIL`.

## Quality Gates

Run these before release:

```bash
npm run format:check
npm run lint
npm run build
```

## Documentation

- API reference: [docs/API.md](docs/API.md)
- Deployment checklist: [docs/DEPLOYMENT_CHECKLIST.md](docs/DEPLOYMENT_CHECKLIST.md)
- MVP release checklist: [docs/MVP_RELEASE_CHECKLIST.md](docs/MVP_RELEASE_CHECKLIST.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)

## Security Notes

- Access tokens are sent with `Authorization: Bearer <token>`.
- Password hashes are never selected or returned by default.
- Credential secrets are encrypted at rest for new writes.
- Passwords, credential passwords, API keys, tokens, and secrets are never sent in notification emails.
- Password reset links are signed and short-lived.
- Admin APIs require admin role authorization.
- Customer APIs require customer role authorization and service-level customer scoping.
- Helmet, CORS, JSON body limits, request rate limiting, and Mongo operator sanitization are enabled.
