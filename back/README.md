# UNINET backend

Express and MongoDB (Mongoose) API for the secure university portal.

## Local setup

Requirements: Node.js 22.x and a local MongoDB instance.

From `back/` in PowerShell:

```powershell
Copy-Item .env.example .env
npm ci
npm run dev
```

Edit `.env` for local development if MongoDB or the frontend URL differs. Keep `NODE_ENV=development`. The API listens on port 5001 by default. Never use the example signing key or demo credentials in a deployed environment.

## Identity and access

- `POST /api/users/login` accepts `{ "username": "...", "password": "..." }` and returns a JWT on successful authentication.
- `GET /api/users/me` returns the authenticated user's public account fields.
- `POST /api/users/change-password` verifies the current password, stores a new scrypt hash, and revokes prior tokens.
- `POST /api/users/logout` revokes issued tokens by incrementing the user's token version.
- `/api/users/admin/*` routes require the Admin role.
- The user model accepts Admin, Student, Teacher, Staff, and User roles. Only administrator-specific routes currently have a dedicated role gate; teacher-specific endpoints are not implemented.
- There is no self-registration. Create accounts through the admin API or seed scripts.

Passwords are hashed with a unique random salt using Node.js `crypto.scrypt`. JWTs use `SECRET_KEY`, which must be at least 32 bytes in production.

The optional upload helper uses Multer 2.4.x with limits for file size/count, field size/count, nesting depth, and array indexes. No file-upload API route is currently implemented.

## Development accounts

- `npm run seed:student` creates a local Student account only when `NODE_ENV=development`. It uses `Student123!` unless `SEED_STUDENT_PASSWORD` is set. This password is for local demo use only.
- `npm run seed:admin` creates the first Admin. If `ADMIN_PASSWORD` is not configured, it generates and prints a temporary password once; change that password after first login.

Do not run seed scripts against production data.

## Validation

Run the backend unit tests with:

```powershell
npm test
```

The current test suite covers password hashing, verification, and password policy. It does not replace integration tests for the HTTP API or MongoDB behavior.

## Module structure

- `modules/<name>/` contains module models, routes, controllers, services, and validators.
- `helpers/base-service/BaseService.js` provides shared data access behavior.
- `helpers/auth/` contains authentication and role middleware.
- API routes are mounted at `/api/<module>`.

## Known scope

The current backend has user and generic product modules. Course, grades, attendance, inbox, and student-file APIs are not implemented. The frontend transcript uses static sample rows; it is not connected to private student records.
