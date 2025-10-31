# TennisMeet Deployment Guide

## Overview
This guide covers deploying TennisMeet to production on various platforms.

---

## Prerequisites

- Node.js 18+ installed
- Git repository set up
- Production environment variables configured
- Database (if applicable) set up

---

## Environment Variables

Create a `.env.local` file for local development and configure production environment variables:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# API Keys (if needed)
# NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
# NEXT_PUBLIC_ANALYTICS_ID=your_id_here

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=true
```

---

## Build Process

### 1. Install Dependencies
```bash
npm install --production
```

### 2. Run Production Build
```bash
npm run build
```

### 3. Test Production Build Locally
```bash
npm start
# Open http://localhost:3000
```

### 4. Verify Build
- Check for console errors
- Test critical user flows
- Verify all pages load correctly
- Check network requests

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the best experience for Next.js applications with:
- Zero-config deployments
- Automatic HTTPS
- Global CDN
- Continuous deployment from Git

**Steps:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
# First deployment (will ask configuration questions)
vercel

# Production deployment
vercel --prod
```

4. **Configure Project**
- Connect GitHub repository for automatic deployments
- Set environment variables in Vercel dashboard
- Configure custom domain if needed

**Automatic Deployments:**
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployments

**Vercel Dashboard:** https://vercel.com/dashboard

---

### Option 2: Netlify

Netlify offers similar features with a different workflow:

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Initialize Site**
```bash
netlify init
```

4. **Deploy**
```bash
# Deploy to production
netlify deploy --prod
```

**Configuration (netlify.toml):**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

---

### Option 3: GitHub Pages (Static Export)

For static site deployment (no server-side features):

1. **Update next.config.mjs**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/TennisMeet', // If deploying to github.io/TennisMeet
};

export default nextConfig;
```

2. **Build Static Site**
```bash
npm run build
```

3. **Deploy to GitHub Pages**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add deploy script to package.json
"scripts": {
  "deploy": "gh-pages -d out"
}

# Deploy
npm run deploy
```

4. **Configure GitHub Pages**
- Go to repository Settings → Pages
- Select `gh-pages` branch
- Save

**Access:** https://[username].github.io/TennisMeet

**Limitations:**
- No server-side rendering
- No API routes
- No dynamic features that require a server

---

### Option 4: Docker Deployment

For containerized deployments:

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Build and Run:**
```bash
# Build image
docker build -t tennismeet .

# Run container
docker run -p 3000:3000 tennismeet
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_URL=https://your-domain.com
```

---

### Option 5: AWS (Amplify, EC2, or ECS)

**AWS Amplify (Easiest):**
1. Connect GitHub repository
2. Configure build settings
3. Deploy automatically on push

**AWS EC2:**
1. Launch EC2 instance
2. Install Node.js
3. Clone repository
4. Run production build
5. Use PM2 for process management

**AWS ECS (Docker):**
1. Build Docker image
2. Push to ECR
3. Create ECS task definition
4. Deploy to ECS cluster

---

## Post-Deployment Checklist

### Verification
- [ ] Homepage loads correctly
- [ ] All routes are accessible
- [ ] Images display properly
- [ ] Forms submit successfully
- [ ] Search and filters work
- [ ] No console errors
- [ ] Performance is acceptable (Lighthouse score 90+)

### Security
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] No sensitive data in client bundle
- [ ] CORS configured correctly
- [ ] Security headers set

### Monitoring
- [ ] Error tracking set up (Sentry, Rollbar)
- [ ] Analytics configured (Google Analytics, Vercel Analytics)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Performance monitoring (Lighthouse CI)

### SEO
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Meta tags set correctly
- [ ] Open Graph tags for social sharing
- [ ] Google Search Console configured

---

## Continuous Integration/Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## Rollback Strategy

### Vercel Rollback
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Git Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard [commit-hash]
git push --force origin main
```

---

## Performance Optimization

### Pre-Deployment Checklist
- [ ] Run Lighthouse audit (target 90+ scores)
- [ ] Optimize images (WebP format, proper sizing)
- [ ] Enable compression (gzip/brotli)
- [ ] Implement caching headers
- [ ] Minimize JavaScript bundles
- [ ] Use CDN for static assets
- [ ] Enable HTTP/2

### Build Optimization
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

---

## Monitoring and Maintenance

### Error Tracking (Sentry)

1. **Install Sentry**
```bash
npm install @sentry/nextjs
```

2. **Configure**
```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Analytics (Google Analytics)

1. **Install**
```bash
npm install @next/third-parties
```

2. **Add to layout.tsx**
```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

---

## Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version (18+)
- Clear `.next` folder and rebuild
- Verify all dependencies installed
- Check for TypeScript errors

**404 Errors:**
- Verify routing configuration
- Check base path settings
- Ensure all pages exported correctly

**Performance Issues:**
- Run Lighthouse audit
- Check bundle size
- Optimize images
- Enable caching
- Use CDN

**Environment Variables Not Working:**
- Restart development server
- Verify variable names (NEXT_PUBLIC_ prefix for client)
- Check .env.local file location
- Rebuild application

---

## Backup and Recovery

### Database Backups (if applicable)
- Schedule regular automated backups
- Store backups in separate location
- Test restore process regularly

### Application Backups
- Git repository serves as code backup
- Tag releases for easy rollback
- Keep deployment history

---

## Custom Domain Setup

### Vercel
1. Go to project settings → Domains
2. Add your domain
3. Configure DNS records
4. Wait for SSL certificate provisioning

### Netlify
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS
4. Enable HTTPS

### DNS Configuration
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     [your-app].vercel.app
```

---

## Scaling Considerations

### When to Scale
- Response times > 2 seconds
- High CPU/memory usage
- Increased traffic volume
- Database slow queries

### Scaling Options
- **Vercel:** Automatic scaling included
- **AWS:** Auto-scaling groups
- **Docker:** Kubernetes orchestration
- **Database:** Read replicas, connection pooling

---

## Support and Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Vercel: https://vercel.com/docs
- React: https://react.dev

### Community
- Next.js Discord: https://discord.gg/nextjs
- Stack Overflow: Tag `next.js`
- GitHub Discussions

---

## Deployment Success Checklist

Final verification before considering deployment complete:

- [ ] Application accessible at production URL
- [ ] HTTPS working correctly
- [ ] All features functional
- [ ] Performance metrics met
- [ ] Error tracking configured
- [ ] Analytics tracking
- [ ] Custom domain configured (if applicable)
- [ ] Team notified of deployment
- [ ] Documentation updated
- [ ] Monitoring alerts set up

---

**Deployed By:** [Name]
**Deployment Date:** [Date]
**Environment:** Production
**Version:** 1.0.0
**Status:** ✅ Live
