# REST API Reference

Production base URL: `https://api.iternityverse.com/api/v1`

Development base URL: `http://localhost:5000/api/v1`

## Response Standard

Success:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [{ "field": "body.email", "message": "Enter a valid email address." }]
}
```

Rate-limited responses use HTTP `429`, standard rate-limit headers, and `Retry-After` where
applicable. The frontend normalizes this value into a visible cooldown for email changes.

## Authentication

Normal browser API requests use backend-issued access and refresh JWTs stored in `HttpOnly`
cookies. Requests must include credentials. Tokens are not returned to frontend application code or
stored in browser storage.

`POST /auth/session` is the controlled identity bridge used after Supabase email or Google
authentication. It accepts the fresh Supabase bearer token, validates it with Supabase, synchronizes
the immutable Supabase user identity to MongoDB, and returns backend session cookies.

Authentication endpoints:

- `POST /auth/login` - email/password backend login; IP and account limited.
- `POST /auth/admin/login` - separate admin login with stricter limits.
- `POST /auth/forgot-password` - enumeration-resistant reset request with IP/email limits.
- `POST /auth/reset-password` - complete a valid backend fallback password reset.
- `POST /auth/password-reset-complete` - secure the backend session generation after a Supabase
  recovery password update.
- `POST /auth/session` - exchange a verified Supabase identity for backend cookies.
- `POST /auth/refresh` - rotate/refresh the backend session from the refresh cookie.
- `POST /auth/logout` - clear backend authentication cookies.
- `GET /auth/me` - return the authenticated backend user.
- `PATCH /auth/me` - update allowed non-email profile fields.
- `POST /auth/email-change` - issue dual confirmation links for current and proposed addresses.
- `PATCH /auth/password` - authenticated password change with current-password verification and
  backend session rotation.

Customer email registration and Google OAuth begin through Supabase JS in the frontend rather than a
public backend `/auth/register` endpoint.

Password-change and reset completion invalidate older backend sessions through a per-user session
generation. Supabase-backed password changes are verified and persisted through Supabase; local
Mongo password hashes remain the authentication source only for non-Supabase accounts such as the
seeded admin.

## Query Standard

- Pagination: `page`, `limit`
- Sorting: `sort`, `order=asc|desc`
- Search: `search`
- Field selection: `fields`
- Population: `populate`
- Filters: endpoint-specific validated query keys

## Public Endpoints

- `GET /gpu-packages`
- `GET /gpu-packages/:id`
- `GET /blog-posts`
- `GET /blog-posts/:slug`
- `GET /site-settings`
- `POST /contact-enquiries`
- `POST /ai/gpu-recommendation`
- `POST /ai/site-assistant`

Public AI endpoints are separately rate-limited. GPU rental enquiries are not anonymous: they
require an authenticated customer so ownership can be attached to an immutable customer ID.

## Customer Endpoints

- `POST /enquiries`
- `GET /enquiries/:id`
- `GET /customer/enquiries`
- `GET /customer/credentials`
- `GET /customer/workspace`
- `GET /customer/workspace/password`

Customer record access is scoped by `customer: req.user._id`. Contact email is informational and is
never used as an ownership fallback.

## Admin Endpoints

Customers:

- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id`
- `POST /users/:id/send-password-reset`
- `DELETE /users/:id`

The generic admin update endpoint rejects email edits for Supabase-linked users. Those identities
must use the customer dual-confirmation email-change flow so MongoDB and Supabase cannot diverge.

GPU packages:

- `GET /admin/gpu-packages`
- `POST /admin/gpu-packages`
- `GET /admin/gpu-packages/:id`
- `PATCH /admin/gpu-packages/:id`
- `DELETE /admin/gpu-packages/:id`

Blog:

- `GET /admin/blog-posts`
- `POST /admin/blog-posts`
- `POST /admin/blog-posts/image-uploads`
- `GET /admin/blog-posts/:slug`
- `PATCH /admin/blog-posts/:slug`
- `DELETE /admin/blog-posts/:slug`

Enquiries and contact requests:

- `GET /admin/enquiries`
- `PATCH /admin/enquiries/:id`
- `GET /admin/contact-enquiries`
- `PATCH /admin/contact-enquiries/:id`

Credentials and workspaces:

- `GET /admin/credentials`
- `POST /admin/credentials`
- `PATCH /admin/credentials/:id`
- `GET /admin/workspaces`
- `POST /admin/workspaces`
- `GET /admin/workspaces/:id`
- `PUT /admin/workspaces/:id`
- `PATCH /admin/workspaces/:id/status`
- `DELETE /admin/workspaces/:id`

Site operations and AI:

- `GET /admin/site-settings`
- `POST /admin/site-settings/media`
- `GET /admin/audit-logs`
- `POST /admin/ai/blog-metadata`
- `POST /admin/ai/enquiry-analysis`
- `POST /admin/ai/gpu-package-copy`

## Account Deletion Semantics

`DELETE /users/:id` does not delete operational history. It blocks customers with provisioning or
running workspaces, deletes the linked Supabase user, revokes active credentials, anonymizes and
deactivates the MongoDB identity, and leaves historical records attached to the retired ObjectId.
Re-registering the same email creates a different identity and does not grant access to those records.

## HTTP Status Usage

- `200`: successful read or update
- `201`: resource created
- `400`: malformed or invalid request
- `401`: missing, invalid, or expired authentication
- `403`: authenticated but not authorized or account inactive
- `404`: route or accessible resource not found
- `409`: identity, lifecycle, or uniqueness conflict
- `429`: endpoint rate limit exceeded
- `500`: unexpected server error
- `502`: required upstream identity operation failed
- `503`: required external administration integration is not configured
