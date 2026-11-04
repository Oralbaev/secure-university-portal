# Academic records demonstration

This page describes the course and grade feature added after checkpoint 1. It is
a local development/demo guide, not production operating documentation.

## What it demonstrates

- A course catalogue with an optional teacher assignment.
- Grade records linked to a student, course, and semester.
- Server-side record ownership: students read only their own grades.
- Read-only teacher access limited to courses assigned to that teacher.
- Administrator-only course and grade management.
- Negative authorization checks that do not reveal another student's records.

## Prerequisites

1. A local MongoDB instance and a development `.env` in `back/`.
2. The student seed account:

   ```bash
   cd back
   npm run seed:student
   npm run seed:academics
   ```

   `seed:academics` is idempotent and only runs when `NODE_ENV=development`.
   It creates `MATH101`, `PHYS101`, and `CS101` and assigns demo scores to
   `student001` for semester `2026-fall`.

3. Optional teacher assignment. Create a teacher through the admin API, then
   rerun the seed with the teacher username:

   ```bash
   SEED_TEACHER_USERNAME=teacher001 npm run seed:academics
   ```

## Endpoints

| Method | Path | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/courses` | Any authenticated user | List active courses |
| `GET` | `/api/courses/:id` | Any authenticated user | Read one course |
| `POST` | `/api/courses` | Admin | Create a course |
| `PUT` | `/api/courses/:id` | Admin | Update a course |
| `DELETE` | `/api/courses/:id` | Admin | Soft-delete a course with no active grades |
| `GET` | `/api/grades/me` | Any authenticated user | Read only the caller's grades and GPA |
| `GET` | `/api/grades/:id` | Admin, owning student, assigned teacher | Read one grade |
| `GET` | `/api/grades/teacher` | Teacher | Read grades for assigned courses only |
| `GET` | `/api/grades/admin` | Admin | Filter by student, course, or semester |
| `POST` | `/api/grades/admin` | Admin | Assign a grade |
| `PUT` | `/api/grades/admin/:id` | Admin | Update a grade |
| `DELETE` | `/api/grades/admin/:id` | Admin | Soft-delete a grade |

## Authorization matrix

| Scenario | Expected result |
|---|---|
| Student reads `/api/grades/me` | `200`; only that student's rows |
| Student reads another student's `/api/grades/:id` | `404` |
| Student calls `/api/grades/admin` | `403` |
| Student calls `POST /api/grades/admin` | `403` |
| Teacher reads `/api/grades/teacher` | `200`; only assigned-course rows |
| Teacher reads a grade for another teacher's course | `404` |
| Teacher calls `/api/grades/admin` | `403` |
| Admin reads `/api/grades/admin` | `200`; optional filters |
| Unauthenticated request to any grade route | `401` |

## Student flow

```bash
API=http://localhost:5001/api

# Log in and keep the returned token in STUDENT_TOKEN.
curl -s -X POST "$API/users/login" \
  -H 'Content-Type: application/json' \
  -d '{"username":"student001","password":"Student123!"}'

curl -s "$API/grades/me" \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

The response contains the student's rows plus a summary:

```json
{
  "status": "success",
  "grades": [
    {
      "id": "...",
      "course": {
        "id": "...",
        "code": "MATH101",
        "title": "Calculus I",
        "credits": 4
      },
      "semester": "2026-fall",
      "score": 92,
      "letterGrade": "A",
      "gradePoints": 4,
      "passed": true
    }
  ],
  "summary": {
    "totalCredits": 11,
    "earnedCredits": 11,
    "gpa": 3.48,
    "courses": 3
  }
}
```

The endpoint has no student identifier parameter. Even if one is appended, the
controller ignores it and uses the authenticated JWT identity.

## Negative checks

Use two student accounts and a grade ID that belongs to the other student:

```bash
# Another student's grade: expect 404
curl -i "$API/grades/$OTHER_GRADE_ID" \
  -H "Authorization: Bearer $STUDENT_TOKEN"

# Admin route as a student: expect 403
curl -i "$API/grades/admin" \
  -H "Authorization: Bearer $STUDENT_TOKEN"

# Missing token: expect 401
curl -i "$API/grades/me"
```

## Admin flow

```bash
# Log in as the administrator and keep ADMIN_TOKEN.
curl -s -X POST "$API/users/login" \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"YOUR_ADMIN_PASSWORD"}'

# Create a course without a teacher.
curl -s -X POST "$API/courses" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"code":"MATH201","title":"Calculus II","credits":4}'

# Assign a grade.
curl -s -X POST "$API/grades/admin" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "studentId":"STUDENT_OBJECT_ID",
    "courseId":"COURSE_OBJECT_ID",
    "semester":"2026-fall",
    "score":88
  }'

# List grades with filters.
curl -s "$API/grades/admin?semester=2026-fall" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Teacher flow

First create a teacher account and assign it to a course as the administrator:

```bash
curl -s -X POST "$API/users/admin/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "username":"teacher001",
    "password":"TEACHER_TEMP_PASSWORD",
    "role":"teacher",
    "firstName":"Demo",
    "lastName":"Teacher"
  }'

curl -s -X PUT "$API/courses/COURSE_OBJECT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"teacher":"TEACHER_OBJECT_ID"}'
```

Then log in as that teacher and read the assigned-course grades:

```bash
curl -s "$API/grades/teacher" \
  -H "Authorization: Bearer $TEACHER_TOKEN"
```

The response is limited to grades for courses where the authenticated teacher is
the assigned `teacher`. Teacher grade entry is intentionally not implemented in
this change; it needs a dedicated permission and audit design first.
