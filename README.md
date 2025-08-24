# VNX‑Netscan

Network diagnostics web app (React + Vite) with Vercel serverless functions under `/api`.

## Deploy on Vercel

1. **Create Repo**
   - Push this folder to GitHub.

2. **Import to Vercel**
   - Framework preset: *Other* (Vite)
   - Build Command: `npm run build`
   - Output Directory: `dist/public`

3. **Environment Variables**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_PUBLIC_APP_URL` → `https://netlookup.io`
   - (Optional) Stripe keys

4. **Redirects**
   - `vercel.json` keeps `/api/*` on serverless, SPA routes rewrite to `/`.

## Local Dev

```bash
npm i
npm run dev
```

## Build

```bash
npm run build
```

Artifacts go to `dist/public`.

## Notes

- SPA sources in `client/` (root is configured in `vite.config.ts`)
- Serverless functions in `api/` (Node.js runtime on Vercel)
- Shared code in `shared/`
