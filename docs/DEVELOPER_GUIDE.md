# Developer Guide (checkpoint draft)

This guide describes the current local development setup and the review process the team will use for the secure university portal. Keep this document aligned with the scripts and checks that exist in the repository.

## 1. Tooling

- Git and GitHub for version control and pull requests.
- Node.js 22.12 or later in the 22.x line. The frontend uses Vite 7, whose supported minimums are Node.js 20.19+ or 22.12+.
- npm, using the committed `package-lock.json` files and `npm ci`.
- MongoDB reachable from the backend. The example configuration uses a local MongoDB database at `mongodb://127.0.0.1:27017/uninet`.
- An editor with TypeScript/JavaScript support. Do not put credentials or production data in editor settings, prompts, or checked-in files.

## 2. Local setup

### Backend

1. Open a terminal in `back/`.
2. Copy `.env.example` to `.env`.
3. Keep `NODE_ENV=development` for local work. Set `MONGO_DB_URL` to the local MongoDB instance.
4. Install dependencies and start the API:

   ```powershell
   npm ci
   npm run dev
   ```

The API listens on port 5001 by default. The frontend's default API URL is `http://localhost:5001/api`.

To create a development student, run `npm run seed:student` from `back/`. This seed is limited to development and uses a known demo password unless overridden with `SEED_STUDENT_PASSWORD`. Never use the demo account or its default password outside a local development database.

The admin bootstrap script is `npm run seed:admin`. It generates a temporary password if `ADMIN_PASSWORD` is not set and prints that password once. Store it in an approved password manager and change it at first login. Do not paste it into chat, an issue, a pull request, or source code.

### Frontend

1. Open a second terminal in `front/`.
2. Install dependencies and start Vite:

   ```powershell
   npm ci
   npm run dev
   ```

Vite normally serves the application at `http://localhost:5173`. Set `VITE_API_URL` only when the API is at a different URL. Every `VITE_*` value is bundled into browser-visible code, so it must never contain a secret.

### Local checks

The current frontend scripts include:

- `npm run lint`
- `npm run build`

Run them from `front/` before opening a pull request. The backend uses Node's built-in test runner; run `npm test` from `back/`. Tests cover password hashing, verification, generated temporary passwords, the password length policy, and Admin route authorization. API and database integration tests remain future work.

## 3. Secrets and local data

- Never commit `.env`, passwords, JWT signing keys, cloud credentials, database credentials, or real student records.
- Keep secrets in ignored local `.env` files or an approved secret manager. `.env.example` may contain variable names and safe local-only values, never working credentials.
- The sample `SECRET_KEY=change-me` is for local development only. Production configuration requires a signing secret of at least 32 bytes. Generate a unique value; do not reuse the sample.
- Use synthetic student data in development and demonstrations.
- If a secret is committed, treat it as exposed: revoke or rotate it, then remove it from repository history according to the team's incident process. Deleting the visible line alone is not enough.

## 4. Branch and pull-request process

1. Start from the latest `main` and create a branch named `feature/<short-description>`, `fix/<short-description>`, or `docs/<short-description>`.
2. Keep a pull request focused on one change. Explain the user or security impact and list the checks run.
3. Do not commit directly to `main`. Require at least one teammate to review each pull request; authors do not approve their own changes.
4. Resolve review comments and make sure the final commit includes the fixes. Keep generated lockfile changes only when dependencies change.
5. Merge only after required automated checks pass and an authorized teammate approves.
6. Configure GitHub branch protection for `main` to require pull requests, at least one approval, and passing CI checks. This setting must be enabled in repository settings; a workflow file alone does not enforce it.

## 5. Review checklist

Reviewers should check:

- The change matches its description and does not expose another student's data.
- New routes authenticate users and enforce the correct role and record ownership on the server.
- Inputs are validated on the server; frontend validation is not treated as a security control.
- Passwords and tokens are never logged or returned unnecessarily.
- Errors do not reveal stack traces, database details, or secrets to clients.
- No credentials or real student information were added to source, fixtures, screenshots, or logs.
- Relevant build, lint, and automated security checks pass. Any ignored finding has a written reason and an owner.
- Documentation and `.env.example` are updated when setup or configuration changes.

## 6. Current automation status

The repository now contains GitHub Actions workflows for backend tests, frontend lint/build, npm dependency audits, Semgrep SAST, and Gitleaks secret scanning. The workflow files are in `.github/workflows/`. The first GitHub run exposed fixable frontend advisories and Semgrep findings. After updating the lockfile, allowlisting module loading, adding Dependabot cooldowns, and documenting why cookie-based CSRF protection does not apply to the Bearer-token auth flow, all six required jobs passed on draft PR #3. Branch protection on `main` now requires a pull request, one approval, up-to-date branch, and all six jobs.

## 7. Ownership

- Student 1 leads backend, identity management, and application security.
- Student 2 leads DevSecOps, repository workflow, automation, and this guide.
- Student 3 leads frontend, architecture diagram, and threat model.

All team members review changes that affect their area and help maintain the shared project documentation.
