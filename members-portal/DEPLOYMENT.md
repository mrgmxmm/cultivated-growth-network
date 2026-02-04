# Members Portal Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. Completed Supabase setup (see `../SUPABASE_SETUP.md`)
2. Configured Google OAuth in Supabase
3. Created storage buckets in Supabase
4. Stripe products and pricing configured
5. All environment variables ready

## Deployment Options

### Option 1: Netlify (Recommended)

#### Why Netlify?
- Easy deployment from Git
- Automatic HTTPS
- Great build caching
- Good free tier
- Easy environment variable management

#### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Complete members portal"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Show advanced" and add environment variables

4. **Add Environment Variables**

   Go to Site settings → Environment variables and add:

   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
   VITE_STRIPE_MONTHLY_PRICE_ID=price_1ShJXWRWzdMdZsP0rXZzP5Lk
   VITE_STRIPE_ANNUAL_PRICE_ID=price_1ShJXXRWzdMdZsP0zfqmVjX0
   VITE_APP_URL=https://members.cultivatedgrowthnetwork.com
   VITE_MAIN_SITE_URL=https://cultivatedgrowthnetwork.com
   ```

5. **Deploy**
   - Click "Deploy site"
   - Wait 2-3 minutes for build to complete
   - Get your Netlify URL (e.g., `random-name-123.netlify.app`)

6. **Set Up Custom Domain (Optional)**
   - Go to Domain settings
   - Add custom domain: `members.cultivatedgrowthnetwork.com`
   - Add DNS records as shown in Netlify
   - Wait for DNS propagation (5-30 minutes)
   - Netlify automatically provisions HTTPS certificate

7. **Update Redirect URLs**
   - In Google Cloud Console OAuth settings, add:
     - `https://members.cultivatedgrowthnetwork.com/auth/callback`
   - In Supabase Authentication settings, add to "Redirect URLs":
     - `https://members.cultivatedgrowthnetwork.com/auth/callback`

### Option 2: Vercel

1. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure**
   - Follow prompts to link project
   - Set framework preset to "Vite"
   - Add environment variables via Vercel dashboard

3. **Custom Domain**
   - Add domain in Vercel dashboard
   - Update DNS records
   - Update OAuth redirect URLs

### Option 3: Manual Deployment (VPS/Server)

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder to server**

3. **Configure Web Server**

   **Nginx example:**
   ```nginx
   server {
     listen 80;
     server_name members.cultivatedgrowthnetwork.com;
     root /var/www/members-portal/dist;
     index index.html;

     location / {
       try_files $uri $uri/ /index.html;
     }

     # Enable gzip compression
     gzip on;
     gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
   }
   ```

4. **Set Up SSL**
   ```bash
   certbot --nginx -d members.cultivatedgrowthnetwork.com
   ```

## Post-Deployment Checklist

- [ ] Test Google OAuth login
- [ ] Verify protected routes work
- [ ] Check all pages load correctly
- [ ] Test on mobile devices
- [ ] Verify Supabase connection
- [ ] Test content browsing
- [ ] Check progress tracking
- [ ] Test notes and favorites
- [ ] Verify profile updates work
- [ ] Test membership page
- [ ] Check all links work
- [ ] Verify no console errors
- [ ] Test logout functionality

## Environment Configuration by Deployment Stage

### Development (`.env`)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_MONTHLY_PRICE_ID=price_test_...
VITE_STRIPE_ANNUAL_PRICE_ID=price_test_...
VITE_APP_URL=http://localhost:5173
VITE_MAIN_SITE_URL=http://localhost:8000
```

### Production (Netlify/Vercel)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_MONTHLY_PRICE_ID=price_1ShJXWRWzdMdZsP0rXZzP5Lk
VITE_STRIPE_ANNUAL_PRICE_ID=price_1ShJXXRWzdMdZsP0zfqmVjX0
VITE_APP_URL=https://members.cultivatedgrowthnetwork.com
VITE_MAIN_SITE_URL=https://cultivatedgrowthnetwork.com
```

## Continuous Deployment

Once connected to Netlify or Vercel, every push to `main` branch will trigger automatic deployment.

**Workflow:**
1. Make changes locally
2. Test with `npm run dev`
3. Commit changes: `git commit -am "Your message"`
4. Push to GitHub: `git push origin main`
5. Deployment starts automatically
6. Live in 2-3 minutes

## Rollback

### Netlify
- Go to Deploys tab
- Click on any previous successful deploy
- Click "Publish deploy"

### Vercel
- Go to Deployments
- Click on previous deployment
- Click "Promote to Production"

## Performance Optimization

The build is already optimized with:
- Code splitting
- Tree shaking
- Minification
- Asset optimization

Additional recommendations:
1. Enable caching headers on your CDN
2. Use a CDN for static assets
3. Monitor with Google PageSpeed Insights
4. Set up error tracking (Sentry, LogRocket)

## Monitoring

### Recommended Services
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry
- **Analytics**: Google Analytics, Plausible
- **Performance**: Vercel Analytics, Netlify Analytics

### Supabase Monitoring
- Check Database health in Supabase dashboard
- Monitor API usage
- Review error logs
- Check RLS policy performance

## Troubleshooting

### Build fails
- Check Node.js version (should be 18+)
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### Environment variables not working
- Ensure they start with `VITE_`
- Restart dev server after changes
- In production, redeploy after adding variables

### OAuth redirect errors
- Verify all redirect URLs are added in Google Console
- Check Supabase Authentication settings
- Ensure URLs match exactly (http vs https, trailing slash)

### Content not loading
- Check Supabase API credentials
- Verify RLS policies are correct
- Check browser console for errors
- Verify content is published in database

## Security Checklist

- [ ] Environment variables are set (not committed to Git)
- [ ] `.env` is in `.gitignore`
- [ ] HTTPS is enabled
- [ ] Supabase RLS policies are active
- [ ] Google OAuth is configured correctly
- [ ] Stripe webhooks are set up with proper validation
- [ ] Error messages don't expose sensitive data
- [ ] CORS is properly configured

## Support

For deployment issues:
1. Check build logs in Netlify/Vercel
2. Review Supabase logs
3. Check browser console
4. Review this documentation
5. Contact: charmaine@cultivatedgrowthnetwork.com
