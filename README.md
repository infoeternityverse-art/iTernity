# iTernityverse GPU Infrastructure Platform

iTernityverse is a production-oriented GPU infrastructure marketplace for AI teams. Visitors can
discover suitable compute, compare GPU packages, request access, read technical content, and contact
the team. Customers receive isolated dashboards for enquiries, workspaces, and credentials, while
admins manage inventory, provisioning, content, customers, site media, notifications, and audit
history.

## Current Product State

- Premium public experience for Home, GPU Marketplace, GPU Detail, About, Blog, Contact, FAQ, and
  legal pages.
- Responsive WebGL and frame-sequence visuals with delayed startup, viewport-aware rendering,
  reduced-motion support, static fallbacks, and mobile-specific sizing.
- GPU search, availability filtering, sorting, recommendations, detail pages, and authenticated
  enquiry submission.
- Customer dashboard with protected GPU Packages and requests, identity-scoped enquiries,
  workspaces, credentials, profile management, and password changes.
- Admin console for GPU packages, blog posts, enquiries, contact requests, customers, workspaces,
  credentials, site media, AI-assisted content, and audit logs.
- Supabase email and Google authentication bridged to backend-issued `HttpOnly` session cookies.
- Branded SMTP notifications, dual-confirmation email changes, secure password reset, and persistent
  abuse protection.
- Cloudinary-backed blog and fixed-slot site media with local development fallbacks.
- SEO metadata, structured data, sitemap generation, robots controls, and canonical production URLs.

For a dated implementation summary, see [docs/RECENT_UPDATES.md](docs/RECENT_UPDATES.md).

## Cloudinary media setup

Use Cloudinary for optimized image delivery while keeping secrets on the backend.

Backend env:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_FOLDER=gpu-cloud-marketplace
CLOUDINARY_ASSET_FOLDER=gpu-cloud-marketplace
```

Frontend env:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_ASSET_FOLDER=gpu-cloud-marketplace
```

Sync existing files from `frontend/public/media`:

```bash
npm run media:sync-cloudinary
```

Use `npm run media:sync-cloudinary -- --overwrite` only when you intentionally want to replace existing Cloudinary assets with the local files.

New blog images uploaded from the admin UI go to Cloudinary automatically when backend Cloudinary env vars are present. If Cloudinary is not configured, the backend falls back to the existing local `/media/blog` storage for development.

## Search Indexing

`frontend/public/sitemap.xml` and `frontend/public/robots.txt` are served by Vercel at:

```text
https://iternityverse.com/sitemap.xml
https://iternityverse.com/robots.txt
```

Regenerate the sitemap after publishing, unpublishing, or changing public GPU packages or blog
posts:

```bash
npm run generate:sitemap
```

The generator reads public data from `https://api.iternityverse.com/api/v1`, includes public
marketing routes, GPU detail pages, GPU enquiry pages, and published blog posts, and excludes
private/auth/admin/customer-dashboard pages through `robots.txt`.

Google Search Console setup:

```text
Property: iternityverse.com domain property
Verification: DNS TXT record at Hostinger
Submitted sitemap: https://iternityverse.com/sitemap.xml
```

## Backend AI setup

AI features run only on the backend so provider API keys never ship to the browser. Admin AI tools use validated, admin-only endpoints and fall back to local rule-based suggestions when no AI key is configured.

Backend env:

```env
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
GROQ_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama-3.1-8b-instant
AI_TIMEOUT_MS=12000
AI_MAX_OUTPUT_TOKENS=900
```

Do not add `GROQ_API_KEY` or any AI secret to `frontend/.env`. Admin AI requests are authenticated, admin-only, validated, rate-limited by the API server, and audited.

Current admin AI tools:

- Blog metadata: excerpt, SEO title, SEO description, tags, alt text, and FAQ suggestions.
- Enquiry analysis: workload summary, priority, fit score, risks, clarification questions, and note drafts.
- GPU package copy: editable package description, features, and use cases from package specs.

## Tech Stack

- Frontend: Vite, React JSX, React Router DOM, Tailwind CSS, Framer Motion, React Three Fiber,
  Three.js, Axios, TanStack Query, Zustand, React Hook Form, Zod, and Lucide React.
- Backend: Node.js, Express, MongoDB, Mongoose, Supabase Auth integration, JWT, bcrypt, Nodemailer,
  Cloudinary, and Groq-compatible AI APIs.
- Language: JavaScript and JSX only.

## Requirements

- Node.js 20+
- npm 10+
- MongoDB connection string

## Production Hosting

Current production topology:

```text
Frontend: https://iternityverse.com on Vercel
Backend: https://api.iternityverse.com on Northflank
Database: MongoDB Atlas
Media: Cloudinary
Email: Hostinger SMTP through Nodemailer
```

Use `iternityverse.com` as the canonical frontend domain and redirect `www.iternityverse.com`
to it in Vercel. The backend API should stay on `api.iternityverse.com`; users normally never
need to see the platform-provided Northflank URL.

Vercel frontend production env:

```env
VITE_API_BASE_URL=https://api.iternityverse.com/api/v1
VITE_API_TIMEOUT_MS=45000
VITE_APP_NAME=iTernityverse
VITE_APP_ENV=production
VITE_SITE_URL=https://iternityverse.com
VITE_SUPPORT_EMAIL=info@iternityverse.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_ASSET_FOLDER=gpu-cloud-marketplace
```

Northflank backend production env should include:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
CORS_ORIGIN=https://iternityverse.com,https://www.iternityverse.com
AUTH_COOKIE_SECURE=true
AUTH_COOKIE_SAME_SITE=lax
APP_FRONTEND_URL=https://iternityverse.com
APP_DASHBOARD_URL=https://iternityverse.com/dashboard
APP_ADMIN_URL=https://iternityverse.com/admin
SUPPORT_EMAIL=info@iternityverse.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_server_only_service_role_key
```

Northflank networking reminders:

- Public HTTP port must target backend port `5000`.
- Custom domain `api.iternityverse.com` routes path prefix `/` to the backend service.
- Keep `app.set('trust proxy', 1)` enabled for Northflank reverse-proxy headers and rate limiting.
- Add a health check on `/` expecting HTTP `200`.

Vercel and Northflank manage HTTPS/SSL certificates automatically after DNS verification. The
domain registrar only manages DNS records and domain renewal.

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
VITE_SITE_URL=http://localhost:5173
VITE_SUPPORT_EMAIL=support@example.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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

## Authentication and Account Lifecycle

Supabase handles customer email verification and Google OAuth. After Supabase proves the external
identity, the backend synchronizes the user by immutable `supabaseUserId` and creates its own short
access and refresh session in `HttpOnly` cookies. Supabase browser sessions are not persisted in
local storage, and backend JWTs are not exposed to application JavaScript.

Google is intentionally the prominent sign-in and registration path. Email/password remains
available as a secondary path and requires confirmation before access. Google currently displays
the Supabase project callback domain on its account chooser; use a Supabase custom domain such as
`auth.iternityverse.com` and configure Google Auth Platform branding when a fully branded production
OAuth screen is required.

Email changes use a secure dual-confirmation flow:

1. The authenticated customer requests a new address from the profile page.
2. The backend generates separate Supabase links for the current and proposed addresses.
3. Both branded messages must be confirmed before Supabase changes the sign-in identity.
4. Each link ends on `/email-change-confirmed`, which shows a result and never redirects
   automatically.
5. The customer explicitly continues to login and signs in with the new address after both
   confirmations.

Email-change limits are shared through MongoDB, survive backend restarts, and return `Retry-After`.
The UI presents the remaining cooldown while still allowing non-email profile changes.

Admin account deletion is an access-revocation and anonymization operation. It blocks deletion while
the customer has a provisioning or running workspace, deletes the linked Supabase identity, revokes
active credentials, clears identity fields, disables the MongoDB user, and preserves operational
records without exposing them to a future account that reuses the same email. Customer enquiries are
authorized only through the immutable MongoDB customer ID; email-address fallback matching is not
used.

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

Hostinger SMTP production values:

```env
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@iternityverse.com
SMTP_PASSWORD=your_hostinger_mailbox_password
SMTP_FROM_NAME=iTernityverse
SMTP_FROM_EMAIL=info@iternityverse.com
```

Hostinger email plans have sending limits. Check hPanel for the exact active plan limit. Common
limits are 100/day for trial/free mailboxes, 1000/day for Business Starter, and 3000/day for
Business Premium. If transactional email volume grows, move email delivery to a dedicated provider
such as Resend, Postmark, SendGrid, or Amazon SES.

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
- Profile updated email after an actual non-email profile change. Email-only requests do not trigger
  this unrelated notification.
- Separate branded email-change verification messages to the current and proposed email addresses.
- Critical system error email template and helper are architecture-ready for future monitoring.

Use `npm run email:test` to verify SMTP configuration in development. The helper sends a non-sensitive test message to `TEST_EMAIL_TO` or `SMTP_FROM_EMAIL`.

Password reset requests have a stricter endpoint-specific limiter in addition to the global API
limiter:

```env
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_IP_MAX=20
AUTH_RATE_LIMIT_ACCOUNT_MAX=7
ADMIN_AUTH_RATE_LIMIT_IP_MAX=10
ADMIN_AUTH_RATE_LIMIT_ACCOUNT_MAX=5
AUTH_SESSION_RATE_LIMIT_MAX=60
AI_RATE_LIMIT_WINDOW_MS=600000
AI_RECOMMENDATION_RATE_LIMIT_MAX=10
AI_ASSISTANT_RATE_LIMIT_MAX=20
PASSWORD_RESET_IP_RATE_LIMIT_WINDOW_MS=900000
PASSWORD_RESET_IP_RATE_LIMIT_MAX=10
PASSWORD_RESET_EMAIL_RATE_LIMIT_WINDOW_MS=3600000
PASSWORD_RESET_EMAIL_RATE_LIMIT_MAX=3
EMAIL_CHANGE_IP_RATE_LIMIT_WINDOW_MS=900000
EMAIL_CHANGE_IP_RATE_LIMIT_MAX=10
EMAIL_CHANGE_ACCOUNT_RATE_LIMIT_WINDOW_MS=3600000
EMAIL_CHANGE_ACCOUNT_RATE_LIMIT_MAX=3
```

Supabase recovery links follow the configured Supabase expiry and one-time verification behavior.
When the backend fallback reset flow is used, links are signed, short-lived, and tied to the user's
current password hash so old links stop working after the password changes.

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
- Consolidated recent updates: [docs/RECENT_UPDATES.md](docs/RECENT_UPDATES.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)

## Security Notes

- Browser authentication uses backend-issued `HttpOnly`, `Secure`, `SameSite=Lax` cookies; tokens
  are not stored in `localStorage` or returned in normal auth response bodies.
- Bearer tokens are accepted only where required to bridge a freshly verified Supabase identity into
  a backend session.
- Password hashes are never selected or returned by default.
- Credential secrets are encrypted at rest for new writes.
- Passwords, credential passwords, API keys, tokens, and secrets are never sent in notification emails.
- Password reset links are signed and short-lived.
- Admin APIs require admin role authorization.
- Customer APIs require customer role authorization and service-level customer scoping.
- Customer query caches are identity-scoped and cleared during login/logout/session replacement to
  prevent data from a previous browser user appearing in a later session.
- Login uses IP and normalized-account limits; successful attempts are not counted. Password reset,
  email change, AI, refresh, and session creation have endpoint-specific limits.
- Email-change limits use shared MongoDB counters with TTL cleanup so multiple backend instances
  enforce the same window.
- Helmet, trusted-origin checks, strict CORS, JSON body limits, request rate limiting, validation,
  role guards, and Mongo operator sanitization are enabled.
- No application can honestly guarantee "100% secure." Keep dependencies patched, rotate secrets,
  monitor audit/error logs, test backups, and repeat security review before major releases.
