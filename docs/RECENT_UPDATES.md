# Recent Platform Updates

This document summarizes the current shipped state built across the recent design, performance,
authentication, and security work. Reverted experiments are intentionally excluded.

Last updated: 2026-08-10

## Public Experience

### Home

- Refined the premium hero composite and GPU visual while preserving the established site palette.
- Rebuilt the GPU compute-story/frame experience for softer scroll interpolation and fewer hard
  transitions during fast scrolling.
- Removed the obsolete 300-frame source directory after replacing the "How it works" presentation
  with optimized WebP assets.
- Delayed heavy WebGL startup until the document has loaded and the visitor has interacted, reducing
  competition with first contentful paint.
- Added eager/high-priority loading only for the homepage hero image; secondary hero images remain
  lazy.
- Paused or avoided continuous visual work when sections are inactive and retained static fallbacks.

### About

- Replaced the older box-oriented layout with an editorial, scroll-driven story about compute
  access, workload fit, operations, security, standards, and direction.
- Added semantic headings, metadata, structured content, and non-repetitive iTernityverse copy.
- Added a React Three Fiber scene using `/media/about_page.glb`, responsive model scaling, controlled
  device pixel ratio, high-performance WebGL preferences, reduced-motion handling, and an error
  boundary.
- Removed the legacy geometry from the mounted loading path so it no longer flashes before the GLB.
- Matched all About backgrounds to the global dark green site palette and removed the isolated white
  section.

### GPU Marketplace

- Added the Compute Observatory hero and a more distinctive GPU-focused visual language.
- Preserved the established inventory card design after evaluating alternatives.
- Improved entry scrolling, content spacing, large display typography, and section breathing room.
- Kept search, availability, and sort controls at the top of the inventory section without making
  them viewport-sticky.
- Retained search, filters, sorting, pagination, recommendations, details, and authenticated enquiry
  ownership.

### Contact and Blog

- Reworked Contact into a primary-page experience with richer visual treatment, better spacing, and
  a public contact-enquiry workflow.
- Preserved the stable Blog listing while correcting article top spacing and the "Back to blog"
  control.
- Added Blog as an admin-configurable hero media slot without exposing deprecated GPU/About upload
  choices.

### Navigation and Footer

- Added smooth mobile-menu enter and exit motion from the hamburger side.
- Kept the mobile menu horizontally centered near the top rather than vertically centered.
- Increased mobile navigation spacing and maintained accessible close behavior.
- Added compact mobile social icons above legal links, including per-icon padding and curved square
  borders.
- Added FAQ to legal navigation and a linked `Developed by VUN Tech` attribution below copyright.
- Preserved the desktop/tablet footer presentation after reverting an unwanted tablet-only change.
- Corrected footer visual initialization so its background effect can appear without delaying core
  content.

## Performance and Resilience

- Reduced initial hero contention by deferring WebGL until load plus first interaction.
- Added viewport-aware and activity-aware animation behavior instead of running every expensive scene
  continuously.
- Limited WebGL device pixel ratio and disabled unnecessary antialiasing in the About scene.
- Added static hero fallbacks for unsupported or delayed WebGL environments.
- Corrected React image priority handling and retained explicit eager/lazy intent.
- Reduced cursor and footer effect work on constrained devices and during non-interactive states.
- Kept route-level lazy loading for secondary public, auth, customer, and admin pages.
- Production builds still report large Three.js/React Three Fiber chunks; continued bundle splitting
  and asset compression remain an operational performance priority.

## Authentication and Session Security

- Integrated Supabase email verification and Google OAuth with MongoDB customer synchronization.
- Made Google the visually prominent login/registration choice while preserving email/password as a
  secondary option.
- Replaced browser-stored backend tokens with access and refresh JWTs delivered through `HttpOnly`,
  `Secure`, `SameSite=Lax` cookies.
- Disabled persisted Supabase browser sessions and use a short controlled bearer-token exchange only
  to create the backend session.
- Added refresh, logout, and session restore behavior that treats anonymous `401` responses as an
  expected public state rather than a public-page failure.
- Added IP and normalized-account login limits, stricter admin limits, session/refresh limits, and
  endpoint-specific AI limits.
- Added trusted-origin enforcement for state-changing authenticated requests alongside strict CORS,
  Helmet, validation, body limits, and Mongo sanitization.

## Secure Email Changes

- Removed direct email mutation from the ordinary profile endpoint.
- Added `POST /auth/email-change` with authenticated IP and account limits.
- Generate separate Supabase confirmation links for the current and proposed addresses.
- Send both links through branded backend SMTP templates rather than default Supabase mail content.
- Prevent an email-only request from sending the unrelated "Profile updated" notification.
- Added a non-redirecting confirmation result page with success/error states, a completion tick, second
  inbox guidance, and a user-initiated login action.
- Kept backward compatibility for previously issued `/login?emailChange=confirmed` links.
- Added an exact UI countdown based on the API `Retry-After` header.
- Added a MongoDB-backed shared limiter so email-change counters survive restarts and remain consistent
  across backend replicas.
- Rebuilt the email logo mark with table-based alignment for consistent centering across mail clients.

## Customer Identity Isolation

- Synchronize returning users by immutable Supabase user ID before considering email.
- Reject attempts to bind one Supabase identity to another account.
- Scope enquiry lists and details strictly by MongoDB customer ObjectId; removed contact-email
  ownership fallback.
- Include the active customer identity in private query keys for enquiries, credentials, and
  workspaces.
- Clear TanStack Query caches on login, logout, session replacement, and identity synchronization.
- Prevent a newly created account from inheriting private records belonging to a deleted account that
  previously used the same email.

## Admin Account Deletion

- Corrected Supabase Admin API user deletion and made required upstream failures explicit.
- Block deletion while a customer workspace is provisioning or running.
- Revoke active customer credentials during deletion.
- Anonymize and deactivate the MongoDB user while preserving operational/audit history under the old
  immutable ObjectId.
- Clear Supabase identity, verified-email state, last login, and usable password material.
- Record security-sensitive account and email-change actions in audit history where implemented.

## Notifications and Email Branding

- Kept notification delivery behind the notification service and SMTP provider rather than sending
  directly from controllers.
- Added branded email-change messages for both inboxes.
- Improved the reusable email logo alignment and maintained responsive, table-based email markup.
- Retained welcome, enquiry, contact, status, credential, password reset/change, profile, admin, and
  critical-error templates.
- Credential passwords, API keys, session tokens, and other secrets remain excluded from email.

## Site Media and SEO

- Admin Site Settings now exposes fixed upload slots for Home hero, Blog hero, Contact hero, and Footer
  background.
- GPU and About media are not uploadable through this screen because their final visual systems are
  controlled separately.
- Cloudinary stores uploaded media and returns versioned metadata; local files remain development
  fallbacks.
- Expanded About/GPU semantic metadata and structured data.
- Retained generated sitemap, robots directives, canonical URLs, and Search Console workflow.

## Production Follow-ups

- Add `https://iternityverse.com/email-change-confirmed` to the Supabase redirect allow list.
- Configure Google Auth Platform with iTernityverse branding and verified production domains.
- Expect Google to display the Supabase project hostname until a paid Supabase custom domain such as
  `auth.iternityverse.com` is enabled and added to Google callback URIs.
- Monitor SMTP and Supabase email quotas; move high-volume transactional delivery to a dedicated
  provider when needed.
- Monitor Lighthouse with production builds and representative devices rather than development-mode
  scores.
- Continue reducing Three.js, React Three Fiber, unused CSS, and route bundle cost.
