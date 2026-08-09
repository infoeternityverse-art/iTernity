# Changelog

## 0.2.0 - Experience, Identity, and Production Hardening

- Added protected customer GPU Packages and package-detail routes so authenticated users can compare
  GPUs and submit enquiries without leaving the dashboard layout.
- Added an in-dashboard enquiry confirmation state with explicit follow-up actions and preserved
  shared enquiry-cache invalidation when page-level success callbacks are used.
- Redesigned the Home compute story, About experience, GPU Observatory, Contact page, mobile
  navigation, footer, and blog article spacing around the iTernityverse visual system.
- Added the About GLB/WebGL scene with responsive sizing, reduced-motion support, viewport-aware
  rendering, and removal of the visible legacy-geometry fallback.
- Improved hero and frame-animation startup behavior to reduce initial main-thread contention and
  fast-scroll stutter.
- Added admin-managed Home, Blog, Contact, and Footer Cloudinary media slots.
- Integrated Supabase email/Google identity with backend `HttpOnly` cookie sessions and made Google
  the prominent customer authentication path.
- Added dual-confirmation branded email changes, a non-redirecting result page, `Retry-After`
  countdowns, and shared MongoDB-backed rate limits.
- Hardened admin deletion with Supabase removal, active-workspace protection, credential revocation,
  MongoDB anonymization, and identity-preserving historical records.
- Removed enquiry email fallback authorization, identity-scoped private query keys, and cleared
  private caches on session changes.
- Corrected public anonymous session handling, password-eye layout, React image-priority warning, and
  responsive navigation/footer behavior.
- Updated README, API reference, deployment checks, release QA, and consolidated recent-update
  documentation.

## 0.1.0 - Phase 1 MVP QA Hardening

- Added route-level lazy loading for public, auth, customer, and admin pages.
- Added backend rate limiting and Mongo operator sanitization middleware.
- Added credential secret encryption for new credential writes.
- Added immediate frontend session clearing on API `401` responses.
- Tightened customer route guard role isolation.
- Improved query retry behavior for authorization and not-found failures.
- Added Escape-key and focus restoration support to Modal and Drawer.
- Added audit log recording for admin package, enquiry, and credential write actions.
- Added API documentation, deployment checklist, and MVP release checklist.
