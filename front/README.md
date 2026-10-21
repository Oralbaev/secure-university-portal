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

The UI currently uses hard-coded sample data and is not yet connected to the
backend in `../back`.
