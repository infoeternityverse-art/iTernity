# Deployment Checklist

## Environment

- Set `NODE_ENV=production`.
- Set `PORT=5000` for the Northflank backend service.
- Set `MONGO_URI` to the production MongoDB connection string.
- Set `CORS_ORIGIN=https://iternityverse.com,https://www.iternityverse.com`.
- Set `AUTH_COOKIE_SECURE=true` and `AUTH_COOKIE_SAME_SITE=lax` for the HTTPS frontend/API subdomains.
- Confirm auth responses set `HttpOnly`, `Secure`, `SameSite=Lax` cookies and never expose tokens in JSON or browser storage.
- Set `APP_FRONTEND_URL=https://iternityverse.com`.
- Add `https://iternityverse.com/email-change-confirmed` to the Supabase Auth redirect URL allow list.
- Set `APP_DASHBOARD_URL=https://iternityverse.com/dashboard`.
- Set `APP_ADMIN_URL=https://iternityverse.com/admin`.
- Set long, unique `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values.
- Set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and the server-only `SUPABASE_SERVICE_ROLE_KEY` on the backend.
- Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` on the frontend. Never expose the service-role key to Vite.
- Set `AUTH_ACCESS_COOKIE_NAME`, `AUTH_REFRESH_COOKIE_NAME`, and max ages only when overriding the documented defaults.
- Set a strong `CREDENTIAL_ENCRYPTION_KEY` and store it in the secret manager.
- Configure `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX` for expected traffic.
- Configure login/session limits: `AUTH_RATE_LIMIT_WINDOW_MS`, `AUTH_RATE_LIMIT_IP_MAX`, `AUTH_RATE_LIMIT_ACCOUNT_MAX`, `ADMIN_AUTH_RATE_LIMIT_IP_MAX`, `ADMIN_AUTH_RATE_LIMIT_ACCOUNT_MAX`, and `AUTH_SESSION_RATE_LIMIT_MAX`.
- Configure public AI limits: `AI_RATE_LIMIT_WINDOW_MS`, `AI_RECOMMENDATION_RATE_LIMIT_MAX`, and `AI_ASSISTANT_RATE_LIMIT_MAX`.
- Configure password reset limits:
  - `PASSWORD_RESET_IP_RATE_LIMIT_WINDOW_MS=900000`
  - `PASSWORD_RESET_IP_RATE_LIMIT_MAX=10`
  - `PASSWORD_RESET_EMAIL_RATE_LIMIT_WINDOW_MS=3600000`
  - `PASSWORD_RESET_EMAIL_RATE_LIMIT_MAX=3`
  - `EMAIL_CHANGE_IP_RATE_LIMIT_WINDOW_MS=900000`
  - `EMAIL_CHANGE_IP_RATE_LIMIT_MAX=10`
  - `EMAIL_CHANGE_ACCOUNT_RATE_LIMIT_WINDOW_MS=3600000`
  - `EMAIL_CHANGE_ACCOUNT_RATE_LIMIT_MAX=3`
- Confirm frontend `VITE_API_BASE_URL=https://api.iternityverse.com/api/v1`.
- Confirm frontend `VITE_SITE_URL=https://iternityverse.com`.
- Confirm frontend `VITE_SUPPORT_EMAIL=info@iternityverse.com`.

## Supabase and Google Auth

- Set Supabase Auth Site URL to `https://iternityverse.com`.
- Allow the production login, dashboard, reset-password, and email-change confirmation destinations used by the app.
- Configure the Google provider in Supabase with the production Google OAuth client ID and secret.
- Configure Google Auth Platform branding with the iTernityverse name, logo, homepage, privacy policy, terms, and verified `iternityverse.com` domain.
- Keep only required Google scopes: OpenID, email, and profile.
- Confirm the Google authorized redirect URI exactly matches the callback shown by Supabase.
- The Google chooser displays the Supabase callback hostname by default. For full branding, provision a Supabase custom domain such as `auth.iternityverse.com`, add its `/auth/v1/callback` URI to Google, and update frontend/backend Supabase URLs.
- Use separate Google OAuth clients and Supabase projects for development/staging when those environments are externally accessible.

## Domains

- Keep `iternityverse.com` as the canonical frontend domain.
- Redirect `www.iternityverse.com` to `iternityverse.com` in Vercel.
- Point `iternityverse.com` and `www.iternityverse.com` to Vercel DNS records.
- Keep Hostinger MX, SPF, DKIM, DMARC, autodiscover, and autoconfig records for email.
- Add `api.iternityverse.com` in Northflank Domains.
- Add Hostinger DNS record `CNAME api -> api.iternityverse.com.eter-9tln.dns.northflank.app` or the current target shown by Northflank.
- In Northflank, route `api.iternityverse.com` path prefix `/` to the backend service port `5000`.
- Verify HTTPS works for `https://iternityverse.com` and `https://api.iternityverse.com`.
- If a Supabase custom auth domain is enabled, verify its DNS, TLS certificate, callback URI, and frontend/backend environment values before removing the original callback from Google.

## Platform

- Vercel project root: `frontend`.
- Vercel build command: `npm run build`.
- Vercel output directory: `dist`.
- Northflank backend build context: repository root `/`.
- Northflank start command: `npm run start --workspace backend`.
- Northflank public HTTP port: `5000`.
- Northflank service should run the latest pushed commit.
- Northflank should show `MongoDB connected` and `API server running on port 5000`.
- Keep Express `trust proxy` enabled because Northflank sends forwarded headers.

## Build

- Run `npm install`.
- Run `npm run format:check`.
- Run `npm run lint`.
- Run `npm run build`.

## Database

- Confirm MongoDB backups are enabled.
- Confirm indexes are built.
- Confirm the `RateLimitBucket` unique key and TTL indexes exist; email-change counters rely on them for shared enforcement and cleanup.
- Confirm least-privilege database credentials are used.
- Seed or create the first admin account through an approved operational process.

## Security

- Enforce HTTPS at the load balancer or hosting layer.
- Verify CORS allows only trusted origins.
- Verify CORS exposes `Retry-After`, `RateLimit`, and `RateLimit-Policy` so the cross-origin frontend
  can enforce and display server cooldowns.
- Verify rate limiting is enabled.
- Verify email-change limits remain effective after a backend restart and across multiple service replicas.
- Verify password reset abuse protection is enabled.
- Verify logs do not include credential secrets, JWTs, or passwords.
- Rotate initial bootstrap credentials after first login.
- Confirm password reset links expire and old links stop working after password change.
- Confirm customer enquiries, credentials, and workspaces are scoped by immutable customer ID and query caches clear during identity changes.
- Confirm admin deletion is blocked for running/provisioning workspaces, removes the Supabase identity, revokes active credentials, anonymizes the MongoDB account, and records an audit event.

## Email

- Configure Hostinger SMTP:
  - `SMTP_HOST=smtp.hostinger.com`
  - `SMTP_PORT=465`
  - `SMTP_SECURE=true`
  - `SMTP_USER=info@iternityverse.com`
  - `SMTP_FROM_EMAIL=info@iternityverse.com`
- Set `SUPPORT_EMAIL=info@iternityverse.com`.
- Set `ADMIN_NOTIFICATION_EMAILS=info@iternityverse.com` or the intended admin recipients.
- Run `npm run email:test --workspace backend` in Northflank shell/job.
- Test registration, enquiry, password reset, password changed, profile update, enquiry status, and credential issued emails.
- Test email-only profile changes send exactly two branded confirmation emails and do not send the unrelated profile-updated message.
- Confirm both email-change links are required, the logo mark is centered in common mail clients, and each link ends on the non-redirecting confirmation result page.
- Monitor Hostinger hPanel sending limits. Upgrade or move to a transactional email provider when volume grows.

## Operations

- Configure process monitoring.
- Configure API health checks.
- Northflank health check path: `/`, expected status `200`, port `5000`.
- Configure log collection.
- Configure error alerting.
- Document rollback steps for frontend and backend deployments.
- Redeploy Vercel with build cache disabled after production env changes.
- Run `npm run generate:sitemap` after public GPU/blog content changes and commit the updated sitemap.
- Sync public media to Cloudinary after replacing files under `frontend/public/media`.
- Use `npm run media:sync-cloudinary -- --overwrite` only when intentionally replacing existing Cloudinary public IDs.
- Submit or refresh `https://iternityverse.com/sitemap.xml` in Google Search Console after deployment.

## Visual and Performance Smoke Test

- Test Home, About, GPUs, Blog, Contact, navigation, and footer at desktop, tablet, and narrow mobile widths.
- Confirm Home WebGL/frame visuals start after initial page work and interaction instead of competing with first paint.
- Confirm About loads `/media/about_page.glb` without flashing the retired geometry fallback.
- Confirm WebGL pauses outside the viewport, respects reduced motion, and falls back cleanly when unavailable.
- Confirm GPU marketplace search/filter controls remain in normal document flow and do not stick to the viewport.
- Confirm mobile navigation opens and closes toward the hamburger side without vertical recentering.
- Confirm mobile footer social icons, legal links, FAQ, copyright, and "Developed by VUN Tech" remain visible and operable.
- Confirm blog detail header spacing and "Back to blog" behavior at all supported widths.
- Run Lighthouse on a production build and investigate regressions in LCP, TBT, speed index, unused JavaScript, long tasks, and non-composited animation warnings.
