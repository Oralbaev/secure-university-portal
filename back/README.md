# UNINET backend

Express + MongoDB (Mongoose) API for the UNINET student portal.

## Setup

```sh
cp .env.example .env   # then fill in MONGO_DB_URL and SECRET_KEY
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

Login is by phone number and SMS code:

1. `POST /api/users/login` `{ phoneNumber }` → `{ id }`, sends a 4-digit code
2. `POST /api/users/check-sms` `{ id, smsCode }` → `{ token }` (JWT, expires per `JWT_EXPIRES_IN`)
3. Send `Authorization: Bearer <token>`; `POST /api/users/logout` revokes the user's tokens

Codes expire after 5 minutes, allow 5 attempts, and can be resent once a minute.
Outside production the code is always `1234` and is printed to the console.

**No SMS provider is wired up yet** — implement `helpers/utils/sms.js`. Until then,
login in production fails with `503 SMS_NOT_CONFIGURED`.
