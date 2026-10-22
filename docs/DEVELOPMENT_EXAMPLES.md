# Development and Review Examples

**Status:** verified against local Git history and GitHub pull-request review records at the time of the recorded checks. Check the live pull request before presenting its current state.

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

- **Repository evidence:** [PR #3](https://github.com/Oralbaev/secure-university-portal/pull/3), branch `security/midterm-completion`, with the documented implementation commits beginning at `854e4eb`.
- **Change:** adds the missing project documentation, CI and security workflows, dependency fixes, test coverage, and Semgrep remediations.
- **Review evidence:** GitHub's review API shows `APPROVED` by `eskendir2006` on commit `d9d5e179d44f2a509648abb711deb86638eb2abf` at 2026-10-22 02:47 UTC. PR #3 is open and marked ready for review.
- **Analysis evidence:** the first workflow pair produced inconsistent audit results for the same tree: the push run passed six jobs while the PR run failed `npm audit (front)`. Local audits reported 0 vulnerabilities. We changed workflow triggers so feature branches run through `pull_request`, while push checks run only on `main`. All six PR checks then passed on commit `4b14a330fd5d746c3c9a89cbd88e70e9308709b0` on 2026-10-22. The live results are at [PR #3 Actions checks](https://github.com/Oralbaev/secure-university-portal/pull/3/checks).
- **Assessment:** the review was approved on `d9d5e17`, then became stale after later commits because branch protection dismisses stale reviews. A new review was requested for the updated PR head. The final documentation commit also requires its own green PR checks.

## Current checks added for the next pull requests

- **Local rerun, 2026-10-22:** backend tests passed 8/8 with `npm test`; frontend `npm run lint` passed; `npm run build` passed with a Vite warning that the minified JS bundle is about 1.04 MB; `npm audit --audit-level=high` reported 0 vulnerabilities for both backend and frontend.
- Identity API runtime demonstration: 16 of 16 local checks passed against a disposable MongoDB instance; see [Identity Management Demonstration](IDENTITY_DEMO.md). This is local evidence, not proof of production deployment.
- The first GitHub run found 17 fixable frontend dependency advisories. `npm audit fix` refreshed the frontend lockfile; current local audits report 0 vulnerabilities in both lockfiles.
- The first Semgrep run found dynamic module-loading paths, a missing Dependabot cooldown, and a CSRF check that does not apply to the current explicit Bearer-token auth. Module loading is now allowlisted, Dependabot cooldowns are configured, and the auth decision is documented at the app boundary.
- The Multer upload helper now uses the 2.4.x line and enforces finite file, field, nesting, and array-index limits.
- GitHub Actions now defines these checks plus Semgrep and Gitleaks scans. Feature branch changes are checked by the PR event; push checks run only on `main` to avoid duplicate CI on each PR update. All six PR checks passed on `4b14a33`. Branch protection requires all six jobs and one approval on `main`; approvals are dismissed when new commits arrive.

## Evidence still needed

1. Confirm all six checks pass on the final PR head and obtain a fresh approval for that head.
