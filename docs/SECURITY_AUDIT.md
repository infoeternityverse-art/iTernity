# Security and Performance Audit

Audit date: 2026-08-10

## Scope

The review covered Express middleware and routes, Supabase/Mongo identity synchronization, access
and refresh cookies, login/reset/email-change limits, account deletion and re-registration,
customer ownership filters, admin authorization, credentials and workspaces, uploads, AI endpoints,
notification templates, frontend session/cache behavior, deployment headers, dependencies, and
animation/assets that affect main-thread or network performance.

## Corrected Findings

- Supabase customer password changes previously compared the current password with a generated local
  fallback hash. Password verification and persistence now use Supabase for linked customers.
- Password changes/resets did not revoke backend refresh sessions. JWT session generations now
  invalidate every older backend token for that user.
- An older Supabase access token could exchange for new backend cookies after a password event.
  Tokens issued before the user's Supabase validity cutoff are now rejected.
- Forgot-password used Supabase directly in the browser and bypassed backend branding and limits. It
  now uses the enumeration-resistant backend reset endpoint.
- Credential and workspace updates bypassed document encryption middleware. Services now encrypt
  secrets before query updates, and an idempotent migration checks legacy records.
- Process-local security limits weakened across replicas/restarts. Endpoint-specific auth, reset,
  email, AI, and contact limits now use TTL-backed Mongo counters.
- Admin email edits could desynchronize linked identities. Supabase-linked emails now require the
  verified dual-confirmation flow.
- Workspace links accepted arbitrary URI schemes. Only bounded HTTP/HTTPS links are accepted.
- Credential records could reference a customer or package unrelated to the selected enquiry.
  Associations are now checked before create/update.
- Production frontend responses lacked explicit hardening/cache headers. Vercel now emits HSTS,
  frame, MIME, referrer, permissions, and asset cache policies.

## Verified Controls

- Customer enquiry, credential, and workspace reads use the authenticated Mongo customer ObjectId.
- Admin and customer routers apply authentication and role guards before protected operations.
- Cookie-authenticated state changes require a trusted Origin; CORS is credentialed and allowlisted.
- Backend tokens remain in `HttpOnly` cookies and customer query caches clear across identity changes.
- Account deletion removes the Supabase identity, revokes active credentials, anonymizes the Mongo
  user, and leaves history attached to an inaccessible retired ObjectId.
- Credential secrets use AES-256-GCM with a deployment-provided encryption key and are not included
  in normal JSON or email output.
- Inputs are schema validated, Mongo operators are sanitized, Helmet is enabled, and request body
  size is bounded.
- `npm audit` reported zero known vulnerabilities for 561 installed dependencies.
- Repository-wide ESLint and the production frontend build pass after the audit.

## Residual Risks

- No review can guarantee zero future vulnerabilities. Repeat dependency and application testing
  before major releases and after authentication, infrastructure, or upload changes.
- A dynamic Content Security Policy is not yet deployed because API, Supabase, and Cloudinary origins
  are environment-specific. Add and report-only test a production CSP after final domains are fixed.
- The global fallback limiter remains process-local to avoid a Mongo write on every API request;
  security-sensitive endpoints have shared stores. Add edge/WAF rate limiting for distributed
  volumetric abuse.
- WebGL and media remain the largest performance risk. Current notable assets are approximately
  7.1 MB for the GPU hero, 3.15 MB for the About GLB, and 15.2 MB for the GPU frame sequence.
- Production build output still includes large Three.js/React Three Fiber chunks and a 314 KB CSS
  file. Continue route/scene splitting, model/texture compression, and production Lighthouse tests.
- Add automated integration tests for Supabase password change/reset, token revocation, replicated
  rate limits, and customer ownership before treating these flows as release gates.
