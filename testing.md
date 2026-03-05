# Testing Strategy & Page Audit

## Purpose

This document defines what to test in this Nuxt application and which test layer to use (`unit`, `nuxt`, `e2e`) so coverage is meaningful, fast, and maintainable.

---

## Core Testing Strategy

Use the smallest test layer that still proves the behavior:

1. **Unit (`vitest --project unit`)**
   - Pure functions and isolated logic.
   - No Nuxt runtime dependencies.
   - Fastest feedback loop.

2. **Nuxt Integration (`vitest --project nuxt`)**
   - Server API routes, middleware, and page/component behavior that depends on Nuxt runtime/composables/plugins.
   - Good for assertSee-style rendering and branch checks without a full browser journey.

3. **E2E (`vitest --project e2e`)**
   - Real browser interactions and cross-layer flows:
     - form submission
     - redirects
     - auth/session behavior
     - server error display in UI
   - Use for critical user journeys and final confidence.

---

## Decision Guide (What goes where)

- **Use Unit tests** when:
  - testing helpers/utilities (e.g. `createUniqueEmail`)
  - no router/runtime/plugin involvement

- **Use Nuxt tests** when:
  - page logic depends on `useRoute`, `useRuntimeConfig`, store/composables, middleware
  - validating page rendering states and branch behavior
  - testing middleware redirects and API handlers

- **Use E2E tests** when:
  - verifying complete user workflows and real navigation/redirects
  - validating browser form behavior and UX details
  - confirming auth + API + UI integration end to end

---

## Test Data Strategy

### Recommended default
Use factory/helper seeding to set test preconditions for login/settings/security tests.

### Why
- Faster and more stable than chaining UI setup flows repeatedly.
- Avoids coupling every test to unrelated pages (e.g. requiring sign-up UI to test login).

### Keep one full-journey smoke
Include at least one sign-up -> login (or similar) e2e smoke test for system-level confidence.

---

## Environment Strategy

- Keep `.env.test` out of source control.
- Keep `.env.example` as template documentation.
- Keep test env deterministic.
- For CI, provide required vars explicitly in workflow `env` and service containers.

---

## Existing Coverage Summary

### Already covered well
- Sign-up flows (verify required/disabled)
- Login flow (success, unverified redirect, invalid credentials, submit-only validation)
- API auth and validation examples

### Major gaps
- Middleware behavior tests (`auth`, `guest`)
- Verify email, forgot password, reset password page behavior
- Settings page flows (profile updates, password change, account deletion)
- Home/dashboard query-based alert behavior

---

## Page-by-Page Audit & Recommendations

## `app/pages/login.vue`
- Keep existing e2e coverage (already strong).
- Optional Nuxt tests for faster branch checks:
  - maps `EMAIL_NOT_VERIFIED` to verify-email redirect
  - renders server error when sign-in fails

## `app/pages/sign-up.vue`
- Keep existing e2e coverage (already strong).
- Optional Nuxt tests:
  - field error mapping from server response (`email`/`password`)
  - verify-mode branch (`mustVerifyEmail` true/false)

## `app/pages/verify-email.vue`
- **Nuxt tests (recommended):**
  - pre-fills email from query
  - submit-only validation behavior
  - server error rendering
- **E2E smoke (recommended):**
  - resend verification flow success/failure

## `app/pages/forgot-password.vue`
- **Nuxt tests:**
  - invalid email shown on submit
  - success and error branches
- **E2E smoke:**
  - valid submit shows expected success state

## `app/pages/reset-password.vue`
- **Nuxt tests:**
  - missing token shows error on mount and submit
  - password mismatch validation
- **E2E smoke:**
  - valid token + valid password redirects to `/login`

## `app/pages/dashboard.vue`
- **Nuxt tests:**
  - `success_message=welcome` alert shown
  - dismiss clears query state
  - fetch button error state display
- E2E optional unless business-critical.

## `app/pages/index.vue`
- **Nuxt tests:**
  - `account_deleted=true` alert visibility
  - dismiss updates query

## `app/pages/settings.vue`
- **Nuxt test:**
  - route shell + nested page rendering and metadata expectations

## `app/pages/settings/index.vue`
- **Nuxt tests (high priority):**
  - name/email changed branch logic
  - 422 server errors mapped to form fields
  - success toasts for each update scenario
  - refresh-session call on successful updates
- **E2E smoke:**
  - basic profile update happy path

## `app/pages/settings/security.vue`
- **Nuxt tests (high priority):**
  - password schema refinements
  - API error mapping for password updates
  - delete modal flow and error/success states
- **E2E smoke:**
  - password update or delete-request happy path

## `app/pages/settings/example.vue`
- **Nuxt tests:**
  - maps server-side validation errors into form fields
- API side already covered by existing integration tests.

---

## Middleware (High Priority Missing Coverage)

Add:
- `test/nuxt/middleware/auth.test.ts`
- `test/nuxt/middleware/guest.test.ts`

Test:
- guest is redirected by `auth` middleware
- authenticated user is redirected by `guest` middleware
- redirect targets follow runtime config (`redirectGuestTo`, `redirectUserTo`)

---

## Suggested Implementation Order

1. Middleware tests (`auth`, `guest`)
2. `verify-email`, `forgot-password`, `reset-password` Nuxt tests
3. `settings/index` and `settings/security` Nuxt tests
4. `index` + `dashboard` query-alert tests
5. Add 1-2 e2e smoke tests for settings/reset-password critical paths

---

## Test Authoring Guidelines

- Prefer deterministic assertions over snapshot-heavy tests.
- In e2e, assert:
  - URL transitions
  - visible user-facing messages
  - key network response semantics when relevant
- For forms using submit-only validation:
  - assert no validation text before submit
  - assert validation text appears after submit
- Keep tests independent:
  - seed/factory per test
  - avoid shared mutable global state
- Keep e2e focused on user behavior; avoid over-verifying internals.

---

## Commands Reference

```bash
# Unit
npm run test:unit

# Nuxt integration
npm run test:integration

# E2E
npm run test:e2e

# Full run
npm run test:run
```
