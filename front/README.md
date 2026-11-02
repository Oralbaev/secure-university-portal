# UNINET frontend

React 19 + TypeScript + Vite + Ant Design student portal.

```sh
npm install
npm run dev     # http://localhost:5173
npm run build
npm run lint
```

Pages live in `src/pages/`, routes in `src/router/router.tsx`. The dashboard's
active section is kept in the `?section=` query parameter.

The transcript page reads the authenticated student's grades from
`GET /api/grades/me`, and the profile page reads `GET /api/users/me`. Other
pages still use local sample data or placeholders.
