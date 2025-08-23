# VisPrint – Full Mock Site (Vite + React)

A visual mock for the VisPrint storefront (home, catalog, product with logo preview, quote builder, pricing, about, contact, dashboard). TailwindCSS for styling. No backend.

## Local Dev
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
npm run preview
```

## Deploy to Vercel (Recommended)
1. Initialize Git and push:
```bash
git init
git add .
git commit -m "init: visprint mock site"
git branch -M main
git remote add origin https://github.com/<you>/visprint-mock-site.git
git push -u origin main
```
2. In Vercel: **New Project → Import Git Repository** → pick the repo.
   - Framework: auto-detected (Vite)
   - Build Command: `npm run build` (already set in `vercel.json`)
   - Output Directory: `dist`

> Alternatively, drag the **folder** (not the zip) into Vercel for a one-off deploy.

## Environment Variables
Copy `.env.example` to `.env` and fill in values. In Vercel, set the same keys under **Project → Settings → Environment Variables**.

## Notes
- Pure front-end mock: no real APIs.
- Replace placeholder products with SAGE/ASI feeds later.
- `public/logo.svg` is a starter logo; replace with your brand asset.
