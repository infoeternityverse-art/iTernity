# MVP Release Checklist

## Visitor Flow

- Browse home page.
- Verify the premium hero and compute-story animation remain smooth during fast scrolling.
- Verify visual fallbacks and reduced-motion behavior.
- Browse About and confirm the GLB scene loads without legacy geometry flashing.
- Browse GPU marketplace.
- Search, filter, sort, and paginate GPU packages.
- Confirm marketplace controls remain at the top of their section but do not stick to the viewport.
- Open GPU details.
- Register or sign in before submitting a GPU enquiry.
- Browse Blog, open an article, and use "Back to blog".
- Submit the public contact form.
- Open FAQ and all legal pages from the footer.
- Confirm redirect to thank-you page.
- Verify responsive mobile navigation, social icons, legal links, and VUN Tech attribution.

## Admin Flow

- Log in through `/admin/login`.
- Review pending enquiries.
- Move enquiry to in review, approved, or rejected.
- Add admin notes and customer-visible notes.
- Create and update GPU packages.
- Publish or unpublish packages.
- Set availability.
- Issue credentials.
- Revoke credentials.
- Create, update, stop, and delete workspaces through valid lifecycle states.
- Upload Home, Blog, Contact, and Footer images through fixed Site Settings media slots.
- Manage blog posts and Cloudinary-backed article images.
- Review contact enquiries.
- Use AI assistance for GPU copy, blog metadata, and enquiry analysis when configured.
- Attempt customer deletion with an active workspace and confirm it is blocked.
- Delete an eligible customer and confirm Supabase removal, credential revocation, anonymization, and audit history.
- Review audit logs.

## Customer Flow

- Register with email and confirm the registration message.
- Continue with Google and confirm backend session creation.
- Log in and log out with backend `HttpOnly` cookies.
- Open dashboard home.
- Review recent enquiries and active credentials.
- Search and filter enquiries.
- Open enquiry details.
- Reveal, copy, and download credentials.
- Update profile.
- Request an email change and confirm separate links in the current and proposed inboxes.
- Confirm each link shows a result page without automatic navigation.
- Confirm email-change cooldown and `Retry-After` guidance appear after rate limiting.
- Change password.
- Confirm a newly registered identity cannot see enquiries, credentials, or workspaces from a previously deleted account that used the same email.

## Access Control

- Anonymous users cannot access `/dashboard`.
- Anonymous users cannot access `/admin`.
- Customers cannot access `/admin`.
- Admins cannot access `/dashboard`.
- Customer APIs only return the current customer records.
- Enquiry ownership uses customer ObjectId only and never falls back to contact email.
- Query keys include the active identity and all private query caches clear on session replacement/logout.
- Admin APIs reject customer tokens.
- Auth tokens are absent from normal JSON responses and browser storage.
- Supabase service-role credentials are absent from frontend bundles and environment variables.

## Final Gates

- Formatting passes.
- Lint passes.
- Production build passes.
- Backend route import check passes.
- `git diff --check` passes.
- Environment variables are configured.
- Backup and rollback procedures are documented.

## Production Smoke Test

- `https://iternityverse.com` loads and redirects from `www.iternityverse.com`.
- `https://api.iternityverse.com/` returns the backend health JSON.
- `https://api.iternityverse.com/api/v1/gpu-packages` returns marketplace data.
- Browser console has no CORS errors from the production frontend.
- Vercel `VITE_API_BASE_URL` points to `https://api.iternityverse.com/api/v1`.
- Northflank backend `CORS_ORIGIN` includes `https://iternityverse.com` and `https://www.iternityverse.com`.
- Contact/enquiry form sends customer and admin emails.
- Forgot password sends one reset email and rejects repeated abuse with HTTP `429`.
- Email change sends only the two intended branded confirmations, requires both approvals, and uses a shared persistent limiter.
- Google OAuth shows the configured iTernityverse branding; document the expected Supabase callback domain unless a custom auth domain is enabled.
- Admin dashboard can create/update GPU packages and upload blog images to Cloudinary.
- Admin Site Settings updates Home, Blog, Contact, and Footer media without exposing Cloudinary secrets.
- Customer dashboard can view enquiries and credentials after login.
- Logging out and signing into a different browser identity does not show private cached data from the previous user.
