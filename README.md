# VNX-Netscan (Netlookup.io)

Professional network diagnostics and security analysis platform.

## 🚀 Live Demo
- **Production**: [https://netlookup.io](https://netlookup.io)
- **Staging**: [https://netscan.visnec.ai](https://netscan.visnec.ai)

## 📋 Features

### Free Tier
- IP Address Lookup with geolocation
- Basic WHOIS queries
- Domain information lookup
- Basic SSL certificate check
- Network topology visualization
- 5 scans per day limit

### Pro Tier ($4.99/month)
- Unlimited scans and API access
- Advanced SSL/TLS analysis
- Email security (SPF, DKIM, DMARC)
- Real-time uptime monitoring
- Bulk CSV upload and processing
- Scheduled reports and alerts
- Advanced security scans
- Subdomain enumeration
- Threat intelligence integration

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **Authentication**: Supabase Auth (Magic Links)
- **Payments**: Stripe
- **Deployment**: Vercel
- **Database**: Supabase PostgreSQL

## 🏗 Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vnx-netscan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Copy `.env.sample` to `.env.local` and fill in your values:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_PUBLIC_APP_URL=http://localhost:5173
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Vercel Deployment

1. **Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Environment Variables**
   Set these in your Vercel dashboard:
   ```
   VITE_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY
   VITE_PUBLIC_APP_URL=https://netlookup.io
   ```

3. **Domain Configuration**
   - Add `netlookup.io` as a custom domain
   - Configure DNS to point to Vercel

### Supabase Configuration

1. **Auth Settings**
   - Site URL: `https://netlookup.io`
   - Redirect URLs:
     - `https://netlookup.io/sign-in`
     - `https://netlookup.io/profile`

2. **Email Templates**
   - Use `{{ .RedirectTo }}` in magic link templates

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   ├── Header.tsx      # Navigation header
│   └── Footer.tsx      # Site footer
├── hooks/              # Custom React hooks
│   └── useSession.ts   # Authentication session hook
├── lib/                # Utility libraries
│   ├── supabaseClient.ts
│   └── utils.ts
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── auth-sign-in.tsx # Authentication handler
│   ├── Profile.tsx     # User profile
│   ├── Dashboard.tsx   # Main dashboard
│   ├── DemoDashboard.tsx # Demo for non-authenticated users
│   ├── Upgrade.tsx     # Pricing page
│   ├── Support.tsx     # Support page
│   └── NotFound.tsx    # 404 page
├── index.css           # Global styles
└── main.tsx           # Application entry point
```

## 🔐 Authentication Flow

1. User enters email on sign-in page
2. Supabase sends magic link to email
3. User clicks link, redirected to `/sign-in` with auth hash
4. App exchanges hash for session using `exchangeCodeForSession`
5. User redirected to `/profile` on success

## 💳 Billing Integration

- Stripe integration for Pro plan subscriptions
- Upgrade flow at `/upgrade`
- Plan management in user profile

## 🧪 Testing

```bash
# Type checking
npm run check

# Build test
npm run build

# Preview production build
npm run preview
```

## 📊 Analytics

- Google Analytics integration
- Plausible Analytics for privacy-focused tracking
- Google AdSense for monetization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- Documentation: [Link to docs]
- Email: support@netlookup.io
- Community Forum: [Link to forum]

---

Built with ❤️ for network professionals and security experts.

