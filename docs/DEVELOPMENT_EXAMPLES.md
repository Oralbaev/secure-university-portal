# Development and Review Examples

**Status:** local evidence summary; remote review screens were not available from this environment.

## Example 1 - PR #1: Initial Backend Structure

- **Repository evidence:** merge commit `49568fbe1cb2d6a81253db5b2367a6c199198748`, titled `Merge pull request #1 from Oralbaev/Yeskendir`; merged to `main` on 2026-10-21.
- **Change:** introduced the backend module structure and the initial React/Vite client. The merge contains 62 files.
- **Review evidence:** the merge commit confirms that a pull request was merged. Local Git history does not record a reviewer approval or review discussion.
- **Security analysis:** the initial backend had reusable validation, authentication middleware, MongoDB models, and API modules. The current review found that its README described an SMS login flow that the code did not implement; that documentation has now been corrected. At the time of this change, automated tests and security scanning were absent.
- **Assessment:** useful feature-delivery example, but the review-approval evidence still needs a GitHub screenshot or an equivalent record.

## Example 2 - PR #2: Authentication and role-based access control

- **Repository evidence:** merge commit `75e7c185611e9c85b022591520597cbec37bc3a2`, titled `Merge pull request #2: Add authentication and role-based access control`; merged to `main` on 2026-10-21.
- **Change:** added salted scrypt password hashing, JWT login, Student/Admin role checks, admin user-management endpoints, seed scripts, and protected frontend routes.
- **Review evidence:** the merge commit body states `Changes reviewed and approved by eskendir2006`.
- **Security analysis:** the implementation verifies password hashes with a timing-safe comparison and invalidates prior JWTs using a token version. Remaining gaps include no login throttling, no teacher-specific routes or permissions, and no courses/grades API; grade ownership cannot be demonstrated while grades are static frontend data.
- **Assessment:** the local history contains explicit approval evidence. It does not show automated CI/security checks at merge time.

## Current checks added for the next pull requests

- Backend unit tests: 8 passing locally with `npm test`.
- Frontend lint: passing locally with `npm run lint`.
- Frontend production build: passing locally with `npm run build`.
- `npm audit --audit-level=high`: 0 vulnerabilities reported for both backend and frontend lockfiles.
- The Multer upload helper now uses the 2.4.x line and enforces finite file, field, nesting, and array-index limits.
- GitHub Actions now defines these checks plus Semgrep and Gitleaks scans. These workflows have not yet run on GitHub because the changes are only in the local working tree.

## Evidence still needed

1. Save the review page or approval screenshot for PR #1, if it exists. The linked GitHub page could not be opened from the current unauthenticated web view.
2. After the new workflows are pushed through a pull request, save the Actions run showing passing jobs and a teammate approval.
3. If PR #1 had no review, create one additional small change and have another team member review and approve its pull request.
