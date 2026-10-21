# Development and Review Examples

**Status:** verified against local Git history and GitHub pull-request review records.

## Example 1 - PR #1: Initial Backend Structure

- **Repository evidence:** merge commit `49568fbe1cb2d6a81253db5b2367a6c199198748`, titled `Merge pull request #1 from Oralbaev/Yeskendir`; merged to `main` on 2026-10-21.
- **Change:** introduced the backend module structure and the initial React/Vite client. The merge contains 62 files.
- **Review evidence:** GitHub's review API reports no submitted reviews for PR #1.
- **Security analysis:** the initial backend had reusable validation, authentication middleware, MongoDB models, and API modules. The current review found that its README described an SMS login flow that the code did not implement; that documentation has now been corrected. At the time of this change, automated tests and security scanning were absent.
- **Assessment:** useful feature-delivery example, but the review-approval evidence still needs a GitHub screenshot or an equivalent record.

## Example 2 - PR #2: Authentication and role-based access control

- **Repository evidence:** merge commit `75e7c185611e9c85b022591520597cbec37bc3a2`, titled `Merge pull request #2: Add authentication and role-based access control`; merged to `main` on 2026-10-21.
- **Change:** added salted scrypt password hashing, JWT login, Student/Admin role checks, admin user-management endpoints, seed scripts, and protected frontend routes.
- **Review evidence:** [GitHub review record](https://github.com/Oralbaev/secure-university-portal/pull/2#pullrequestreview-5604496004) shows `APPROVED` by `eskendir2006`.
- **Security analysis:** the implementation verifies password hashes with a timing-safe comparison and invalidates prior JWTs using a token version. Remaining gaps include no login throttling, no teacher-specific routes or permissions, and no courses/grades API; grade ownership cannot be demonstrated while grades are static frontend data.
- **Assessment:** the local history contains explicit approval evidence. It does not show automated CI/security checks at merge time.

## Example 3 - PR #3: Checkpoint 1 CI and security baseline

- **Repository evidence:** [draft PR #3](https://github.com/Oralbaev/secure-university-portal/pull/3), branch `security/midterm-completion`, commit `854e4eb`.
- **Change:** adds the missing project documentation, CI and security workflows, dependency fixes, test coverage, and Semgrep remediations.
- **Review evidence:** the PR is ready for review but has no teammate approval yet.
- **Analysis evidence:** all six required GitHub Actions jobs passed: backend tests, frontend lint/build, backend and frontend npm audit, Semgrep, and Gitleaks. The run is available at [PR #3 Actions checks](https://github.com/Oralbaev/secure-university-portal/pull/3/checks).
- **Assessment:** automated build and security gates are verified remotely; a teammate review is still required before treating this as a complete reviewed development example.

## Current checks added for the next pull requests

- Backend unit tests: 8 passing locally with `npm test`.
- Frontend lint: passing locally with `npm run lint`.
- Frontend production build: passing locally with `npm run build`.
- Identity API runtime demonstration: 16 of 16 local checks passed against a disposable MongoDB instance; see [Identity Management Demonstration](IDENTITY_DEMO.md). This is local evidence, not proof of production deployment.
- The first GitHub run found 17 fixable frontend dependency advisories. `npm audit fix` refreshed the frontend lockfile; current local audits report 0 vulnerabilities in both lockfiles.
- The first Semgrep run found dynamic module-loading paths, a missing Dependabot cooldown, and a CSRF check that does not apply to the current explicit Bearer-token auth. Module loading is now allowlisted, Dependabot cooldowns are configured, and the auth decision is documented at the app boundary.
- The Multer upload helper now uses the 2.4.x line and enforces finite file, field, nesting, and array-index limits.
- GitHub Actions now defines these checks plus Semgrep and Gitleaks scans. After fixes for the first run, all six required jobs passed on draft PR #3. Branch protection now requires all six jobs and one approval on `main`.

## Evidence still needed

1. Obtain a teammate approval on draft PR #3 and save the review evidence alongside its passing Actions run.
