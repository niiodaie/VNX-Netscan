# Deployment Guide for VNX-Netscan

## Pre-deployment Checklist

- [ ] All TypeScript errors resolved (`npm run check`)
- [ ] Production build successful (`npm run build`)
- [ ] Environment variables configured
- [ ] Supabase auth settings updated
- [ ] Domain DNS configured

## Vercel Deployment Steps

### 1. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from Git repository
4. Select the VNX-Netscan repository

### 2. Configure Build Settings

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3. Environment Variables

Add these environment variables in Vercel dashboard:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_PUBLIC_APP_URL=https://netlookup.io
```

### 4. Domain Configuration

1. Add custom domain: `netlookup.io`
2. Configure DNS records:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

## Supabase Configuration

### 1. Authentication Settings

Navigate to Authentication > Settings in Supabase dashboard:

```
Site URL: https://netlookup.io
Additional Redirect URLs:
- https://netlookup.io/sign-in
- https://netlookup.io/profile
- https://netlookup.io/auth/callback
```

### 2. Email Templates

Update magic link template to use:
```
{{ .RedirectTo }}
```

### 3. RLS Policies

Ensure Row Level Security is enabled for user data tables.

## Post-Deployment Verification

### 1. Test Authentication Flow

1. Visit https://netlookup.io/sign-in
2. Enter email address
3. Check email for magic link
4. Click link and verify redirect to /profile
5. Confirm session persistence

### 2. Test Core Features

- [ ] IP lookup functionality
- [ ] WHOIS queries
- [ ] SSL certificate checks
- [ ] Demo dashboard access
- [ ] Upgrade flow

### 3. Performance Checks

- [ ] Lighthouse score > 90
- [ ] Core Web Vitals passing
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## Monitoring and Analytics

### 1. Google Analytics

Verify GA tracking is working:
- Check Real-time reports
- Confirm page views are recorded

### 2. Error Monitoring

Set up error tracking:
- Vercel Analytics
- Sentry (optional)

### 3. Uptime Monitoring

Configure uptime monitoring:
- Pingdom
- UptimeRobot
- StatusPage

## Backup and Recovery

### 1. Database Backups

Supabase automatically backs up data, but consider:
- Regular exports of critical data
- Point-in-time recovery testing

### 2. Code Backups

- Ensure Git repository is backed up
- Tag releases for easy rollback

## Security Considerations

### 1. Environment Variables

- Never commit secrets to Git
- Use Vercel's secure environment variables
- Rotate keys regularly

### 2. HTTPS

- Ensure all traffic uses HTTPS
- Configure HSTS headers

### 3. Content Security Policy

Consider adding CSP headers in `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
        }
      ]
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify all dependencies are installed
   - Check for missing environment variables

2. **Authentication Issues**
   - Verify Supabase URL and keys
   - Check redirect URLs configuration
   - Test magic link email delivery

3. **Routing Issues**
   - Ensure `vercel.json` has correct rewrites
   - Test client-side routing

### Debug Commands

```bash
# Check build locally
npm run build

# Type checking
npm run check

# Preview production build
npm run preview
```

## Rollback Procedure

If deployment issues occur:

1. **Immediate Rollback**
   ```bash
   vercel --prod --rollback
   ```

2. **Git Rollback**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

3. **Environment Rollback**
   - Restore previous environment variables
   - Revert Supabase configuration changes

## Performance Optimization

### 1. Bundle Analysis

```bash
npm run build -- --analyze
```

### 2. Image Optimization

- Use WebP format where possible
- Implement lazy loading
- Optimize icon sizes

### 3. Code Splitting

- Implement route-based code splitting
- Lazy load heavy components

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Monitor error rates
- [ ] Review performance metrics
- [ ] Update security patches
- [ ] Backup verification

### Quarterly Reviews

- [ ] Security audit
- [ ] Performance optimization
- [ ] User feedback analysis
- [ ] Feature usage analytics

