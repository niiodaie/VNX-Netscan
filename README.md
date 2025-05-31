# VNX-Netscan (Visnec Nexus - Netscan)

A comprehensive network diagnostic web tool with IP lookup, port scanning, WHOIS, and traceroute features, built with modern web technologies.

## Features

- **IP Lookup**: Get detailed information about any IP address
- **Geo Location**: Retrieve geographic and ISP information
- **Port Scanner**: Check for open ports on target systems
- **WHOIS Lookup**: Domain registration information
- **Traceroute**: Network path analysis
- **Bulk Scan**: Run all diagnostic tools at once

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Express.js backend
- Real-time network diagnostics
- PWA-ready with offline support
- Google Analytics integration
- Responsive design

## File Structure

```
VNX-Netscan/
├── client/                 # React frontend
│   ├── src/
│   ├── index.html
│   └── env.d.ts
├── server/                 # Express backend
├── public/                 # Static assets
│   ├── assets/
│   ├── manifest.json       # PWA manifest
│   ├── robots.txt
│   └── sitemap.xml
├── api/                    # API modules
│   ├── ip-lookup.js
│   ├── port-scan.js
│   ├── traceroute.js
│   └── whois.js
├── css/
│   └── style.css          # Custom styles
├── js/
│   └── main.js            # Main JavaScript
├── locales/
│   └── en.json            # Internationalization
└── README.md
```

## Setup and Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   - Add your Google Analytics Measurement ID to the Secrets tab:
     - Key: `VITE_GA_MEASUREMENT_ID`
     - Value: Your GA4 Measurement ID (e.g., "G-XXXXXXXXXX")

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   ```

## Deployment

### Vercel Deployment
1. Connect your Git repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure your web server to serve the files

## Configuration

### Google Analytics
- Sign up at [analytics.google.com](https://analytics.google.com)
- Create a new property for your domain
- Copy the Measurement ID (starts with "G-")
- Add it to your environment variables

### Plausible Analytics
- The app also supports Plausible Analytics
- Update the domain in `client/index.html` if needed

## Features Overview

### Network Diagnostic Tools
- **Auto IP Detection**: Automatically detects user's public IP
- **Real-time Scanning**: Progressive scan results with live updates
- **Export Functionality**: Export results as JSON
- **Social Sharing**: Share the tool on social media platforms

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Blue Glow Effects**: Modern visual feedback on interactions
- **Terminal-style Output**: Professional diagnostic result display
- **Dark Mode Support**: Automatic dark mode detection

### Technical Features
- **PWA Ready**: Installable web app with offline support
- **SEO Optimized**: Complete meta tags, sitemap, robots.txt
- **Analytics Integration**: Google Analytics and Plausible support
- **Internationalization**: Ready for multiple languages

## API Endpoints

The application uses client-side APIs for security and performance:

- `ipapi.co` for IP lookup and geolocation
- Simulated port scanning (browser security limitations)
- Simulated WHOIS lookups
- Simulated traceroute functionality

## Browser Compatibility

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Social Media Integration

Connect with VNX Platform:
- [Facebook](https://www.facebook.com/profile.php?id=61576882583780)
- [Instagram](https://www.instagram.com/vnxplatform/)
- [TikTok](https://www.tiktok.com/@vnxplatform)
- [YouTube](https://www.youtube.com/@VNXPlatform)
- [LinkedIn](https://www.linkedin.com/company/107405663/admin/dashboard/)

## License

Powered by **Visnec Nexus** - Professional network diagnostic tools.

## Support

For technical support or feature requests, please contact the VNX Platform team through the social media channels listed above.