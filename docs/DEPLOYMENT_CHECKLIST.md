# Deployment Checklist

## Environment

- Set `NODE_ENV=production`.
- Set `PORT=5000` for the Northflank backend service.
- Set `MONGO_URI` to the production MongoDB connection string.
- Set `CORS_ORIGIN=https://iternityverse.com,https://www.iternityverse.com`.
- Set `APP_FRONTEND_URL=https://iternityverse.com`.
- Set `APP_DASHBOARD_URL=https://iternityverse.com/dashboard`.
- Set `APP_ADMIN_URL=https://iternityverse.com/admin`.
- Set long, unique `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` values.
- Set a strong `CREDENTIAL_ENCRYPTION_KEY` and store it in the secret manager.
- Configure `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX` for expected traffic.
- Configure password reset limits:
  - `PASSWORD_RESET_IP_RATE_LIMIT_WINDOW_MS=900000`
  - `PASSWORD_RESET_IP_RATE_LIMIT_MAX=10`
  - `PASSWORD_RESET_EMAIL_RATE_LIMIT_WINDOW_MS=3600000`
  - `PASSWORD_RESET_EMAIL_RATE_LIMIT_MAX=3`
- Confirm frontend `VITE_API_BASE_URL=https://api.iternityverse.com/api/v1`.
- Confirm frontend `VITE_SITE_URL=https://iternityverse.com`.
- Confirm frontend `VITE_SUPPORT_EMAIL=info@iternityverse.com`.

## Domains

- Keep `iternityverse.com` as the canonical frontend domain.
- Redirect `www.iternityverse.com` to `iternityverse.com` in Vercel.
- Point `iternityverse.com` and `www.iternityverse.com` to Vercel DNS records.
- Keep Hostinger MX, SPF, DKIM, DMARC, autodiscover, and autoconfig records for email.
- Add `api.iternityverse.com` in Northflank Domains.
- Add Hostinger DNS record `CNAME api -> api.iternityverse.com.eter-9tln.dns.northflank.app` or the current target shown by Northflank.
- In Northflank, route `api.iternityverse.com` path prefix `/` to the backend service port `5000`.
- Verify HTTPS works for `https://iternityverse.com` and `https://api.iternityverse.com`.

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
- Confirm least-privilege database credentials are used.
- Seed or create the first admin account through an approved operational process.

## Security

- Enforce HTTPS at the load balancer or hosting layer.
- Verify CORS allows only trusted origins.
- Verify rate limiting is enabled.
- Verify password reset abuse protection is enabled.
- Verify logs do not include credential secrets, JWTs, or passwords.
- Rotate initial bootstrap credentials after first login.
- Confirm password reset links expire and old links stop working after password change.

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
