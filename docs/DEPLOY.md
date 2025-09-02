# DEPLOY.md

## Option A — Replit (Single Service)
- Upload repo to a Node.js Repl.
- Set environment variables in Replit Secrets (see `.env.example`).
- In the Shell:
  ```bash
  cd client && npm i && npm run build && cd ..
  cd server && npm i && npm run start
  ```
- Open the webview; set your domain (CNAME) to the Replit URL.

## Option B — Cloudflare Pages (Frontend) + Replit (API)
- Frontend: Upload `client/dist/` to Cloudflare Pages.
- Backend: Run `server` on Replit and set `VITE_API_BASE=https://api.netlookup.io`.
- CORS in server is already configured to allow the frontend origin via `ALLOWED_ORIGINS` env.