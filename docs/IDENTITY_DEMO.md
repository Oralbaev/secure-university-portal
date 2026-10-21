# Identity Management Demonstration

Use this procedure only with a local development database containing synthetic accounts. Do not use real student data or production credentials.

## Start the local application

1. Start a local MongoDB instance on `127.0.0.1:27017`.
2. In `back/`, copy `.env.example` to `.env`; keep `NODE_ENV=development` and set `MONGO_DB_URL=mongodb://127.0.0.1:27017/uninet`.
3. In `back/`, run `npm ci`, then `npm run seed:admin` and `npm run seed:student`. The admin seed prints a generated temporary password once. Keep it private and change it after first login. The student seed defaults to `student001` / `Student123!` for local demonstration only.
4. Run `npm run dev` in `back/` and `npm run dev` in `front/` in separate terminals.
5. Open the frontend at `http://localhost:5173` and verify login and the forced password-change flow for the generated admin.

## API authorization checks

Run the following from PowerShell after the API is up. The variables keep tokens in the current terminal session instead of printing them.

```powershell
$api = 'http://localhost:5001/api'
$studentLogin = Invoke-RestMethod -Method Post -Uri "$api/users/login" -ContentType 'application/json' -Body (@{ username = 'student001'; password = 'Student123!' } | ConvertTo-Json)
$studentToken = $studentLogin.token
$student = Invoke-RestMethod -Uri "$api/users/me" -Headers @{ Authorization = "Bearer $studentToken" }
$student.user.role  # expected: student
```

Expected results:

1. `GET /users/me` without a token returns **401 Unauthorized**.
2. The Student token can call `GET /users/me` and sees the Student role.
3. The Student token calling `GET /users/admin/users` receives **403 Forbidden**.
4. An Admin token calling `GET /users/admin/users` receives **200 OK**.
5. A wrong username/password pair returns **401** with the generic `Invalid username or password` message.

## Teacher role check

Use the Admin token to create a synthetic Teacher account with `POST /users/admin/users`, passing `role: "teacher"` and a development-only password. Log in as that account and call `GET /users/me`; the response should report `role: "teacher"`. Calling `GET /users/admin/users` with the Teacher token should return **403**. The role is accepted by identity management, but there are no teacher-specific academic endpoints yet.

## Password change and revocation

1. Log in as a seeded Student and keep the returned token in a variable.
2. Call `POST /users/change-password` with that token and a valid `currentPassword` plus a new password of at least 10 characters.
3. The response returns a replacement token. The old token should now fail `GET /users/me` with **401** because the user's token version changed.
4. Log in with the new password, call `POST /users/logout`, then retry `GET /users/me` with the logged-out token; it should return **401**.

Record the date, commit hash, expected status, actual status, and a redacted screenshot of each result. Never include a password or token in the screenshot or report.
