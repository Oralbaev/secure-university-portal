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
- The user model accepts Admin, Student, Teacher, Staff, and User roles. Administrator routes manage users, courses, and grades. Teacher access is read-only and limited to grades for assigned courses.
- There is no self-registration. Create accounts through the admin API or seed scripts.

## Academic records

- `GET /api/courses` lists active courses for authenticated users. Course creation and changes require the Admin role.
- `GET /api/grades/me` returns only the authenticated user's grades and GPA. The API ignores any client-supplied student identifier on this route.
- `GET /api/grades/:id` permits an admin, the owning student, or the assigned teacher. Other callers receive `404`.
- `GET /api/grades/teacher` returns grades for courses assigned to the authenticated teacher.
- `/api/grades/admin/*` routes require the Admin role. See [Academic records demonstration](../docs/ACADEMIC_RECORDS_DEMO.md) for request examples and the authorization matrix.

Passwords are hashed with a unique random salt using Node.js `crypto.scrypt`. JWTs use `SECRET_KEY`, which must be at least 32 bytes in production.

The optional upload helper uses Multer 2.4.x with limits for file size/count, field size/count, nesting depth, and array indexes. No file-upload API route is currently implemented.

## Development accounts

- `npm run seed:student` creates a local Student account only when `NODE_ENV=development`. It uses `Student123!` unless `SEED_STUDENT_PASSWORD` is set. This password is for local demo use only.
- `npm run seed:academics` creates demo courses and grades for the development student. It is idempotent, development-only, and can attach an existing teacher with `SEED_TEACHER_USERNAME`.
- `npm run seed:admin` creates the first Admin. If `ADMIN_PASSWORD` is not configured, it generates and prints a temporary password once; change that password after first login.

Do not run seed scripts against production data.

## Validation

Run the backend unit tests with:

```powershell
npm test
```

The current test suite covers password hashing, verification, password policy, grade-scale calculations, and grade-access authorization. It does not replace integration tests for the HTTP API or MongoDB behavior.

## Module structure

- `modules/<name>/` contains module models, routes, controllers, services, and validators.
- `helpers/base-service/BaseService.js` provides shared data access behavior.
- `helpers/auth/` contains authentication and role middleware.
- API routes are mounted at `/api/<module>`.

## Known scope

The backend has user, product, course, and grade modules. Attendance, requests, inbox, and student-file APIs are not implemented. The transcript page reads `/api/grades/me`; other academic pages remain placeholders or use local sample data.
