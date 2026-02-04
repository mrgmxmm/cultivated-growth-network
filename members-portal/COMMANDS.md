# Member Portal - Quick Commands

## Development

```bash
# Start local development server
npm run dev
# Opens at: http://localhost:5173

# Build for production
npm run build
# Creates: dist/ folder

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

## Deployment

```bash
# Build and check for errors
npm run build

# Deploy to Netlify (if CLI installed)
netlify deploy --prod

# Deploy manually: Drag 'dist' folder to Netlify
```

## Common Tasks

```bash
# Install dependencies (if needed)
npm install

# Clean install (if having issues)
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update
```

## Testing OAuth Locally

1. Start dev server: `npm run dev`
2. Open: http://localhost:5173
3. Click "Continue with Google"
4. Should redirect to Google, then back to dashboard

## Environment Variables

Local: `/Users/calarts/Desktop/CGN/members-portal/.env`
Production: Netlify Dashboard → Site Settings → Environment Variables

Required vars:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_STRIPE_PUBLISHABLE_KEY
- VITE_STRIPE_MONTHLY_PRICE_ID
- VITE_STRIPE_ANNUAL_PRICE_ID
- VITE_APP_URL
- VITE_MAIN_SITE_URL

## Useful Links

- Local dev: http://localhost:5173
- Production: https://members.cultivatedgrowthnetwork.com
- Supabase: https://npxdzmicubvcmfltxzkm.supabase.co
- Netlify: https://app.netlify.com
- Google Cloud: https://console.cloud.google.com
