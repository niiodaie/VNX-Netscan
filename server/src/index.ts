import express from 'express'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { requireAuth } from './middleware/requireAuth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Example protected route
app.post('/api/secure-scan', requireAuth, (req, res) => {
  res.json({ ok: true, user: (req as any).user })
})

// Serve client build from ./dist (copied by scripts/bundle.sh)
const distPath = path.resolve(__dirname, '../dist/public')
app.use(express.static(distPath))
app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')))

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on :${port}`))