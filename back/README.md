# UNINET backend

Express + MongoDB (Mongoose) API for the UNINET student portal.

## Setup

```sh
cp .env.example .env   # fill in MONGO_DB_URL and generate SECRET_KEY with openssl rand -hex 32
npm install
npm run dev            # or: npm start
```

## Structure

- `modules/<name>/` — each module has `*.model.js`, `*.routes.js`, `*.controller.js`,
  `*.service.js` and `*.validator.js`. Models and routes are registered automatically;
  routes are mounted at `/api/<name>`.
- `helpers/base-service/BaseService.js` — shared CRUD with soft delete and pagination.
- `helpers/errors/HttpError.js` — throw this for 4xx responses; anything else becomes a 500.

## Auth

Accounts are provisioned; there is no public registration. Login uses
`POST /api/users/login` with `{ username, password }`. Passwords are stored as
salted scrypt hashes, and successful login returns a JWT. Send it as
`Authorization: Bearer <token>`. `POST /api/users/logout` revokes prior tokens.

For local development, run `npm run seed:student` after starting MongoDB. It
creates `student001` / `Student123!` once. Override these with
`SEED_STUDENT_USERNAME` and `SEED_STUDENT_PASSWORD`; the seed refuses to run
outside development or overwrite an existing account. Set `VITE_API_URL` in the
frontend to change the API base URL (defaults to `http://localhost:5001/api`).

Create the first administrator with `ADMIN_USERNAME` and `ADMIN_PASSWORD` set,
then run `npm run seed:admin`. Authenticated admins can provision and manage
accounts under `/api/users/admin/users`. Existing phone/SMS records can be
converted with `npm run migrate:users`; each converted account needs an admin
password reset before its owner can sign in.
