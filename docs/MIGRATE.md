# MIGRATE.md

Use this guide to move your existing code into this structure.

## Client
- Move your current React/Vite `src/` into `client/src/` (replace the placeholder).
- If you have a `public/`, merge into `client/public/`.

## Server
- Move Express routes, middlewares, and utilities into `server/src/`.
- Secure API routes with `requireAuth` (already scaffolded).
- If you previously served the client elsewhere, remove that logic—this server serves `client/dist` in prod.

## Shared
- Place shared TypeScript types and small utils in `shared/` and import from both client/server.