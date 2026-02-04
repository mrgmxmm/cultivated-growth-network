# Members Portal Setup Checklist

Complete these steps in order. Check off each one as you finish.

## ✅ PART 1: Tailwind CSS
- [x] Fixed Tailwind CSS v3 configuration
- [x] Production build successful
- [x] Ready to deploy

## 🎯 PART 2: Supabase Database (IN PROGRESS)

### Project Creation
- [ ] Went to Supabase dashboard
- [ ] Clicked "New project"
- [ ] Named project: "CGN Members Portal"
- [ ] Generated and saved database password
- [ ] Selected region: US East
- [ ] Clicked "Create new project"
- [ ] Waited for project to finish creating (2-3 minutes)

### Database Schema
- [ ] Opened SQL Editor (left sidebar)
- [ ] Clicked "New query"
- [ ] Opened file: `/Users/calarts/Desktop/CGN/supabase-schema.sql`
- [ ] Copied entire file contents
- [ ] Pasted into Supabase SQL Editor
- [ ] Clicked "Run" button
- [ ] Saw success messages
- [ ] Verified 5 categories exist with test query

### Get API Keys
- [ ] Clicked Settings (gear icon) → API
- [ ] Copied Project URL: `https://xxxxx.supabase.co`
- [ ] Copied anon public key (starts with eyJ...)
- [ ] Saved both to a note

### Google OAuth Setup
- [ ] In Supabase: Authentication → Providers
- [ ] Found Google provider
- [ ] Copied Supabase callback URL
- [ ] Went to Google Cloud Console (console.cloud.google.com)
- [ ] Created/selected project: "CGN Members Portal"
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 Client ID
- [ ] Added Supabase callback URL to authorized redirects
- [ ] Copied Google Client ID
- [ ] Copied Google Client Secret
- [ ] Pasted both into Supabase Google provider settings
- [ ] Toggled Google provider ON
- [ ] Clicked Save

### Storage Buckets
- [ ] Went to Storage (left sidebar)
- [ ] Created bucket: `member-videos` (Public: ON)
- [ ] Created bucket: `member-content` (Public: ON)

### Environment Variables
- [ ] Opened Terminal
- [ ] Navigated to: `cd /Users/calarts/Desktop/CGN/members-portal`
- [ ] Created .env file: `cp .env.example .env`
- [ ] Opened .env in editor
- [ ] Added Supabase URL
- [ ] Added Supabase anon key
- [ ] Added Stripe keys (already have)
- [ ] Saved .env file

### Local Testing
- [ ] Ran: `npm run dev`
- [ ] Opened: http://localhost:5173
- [ ] Clicked "Continue with Google"
- [ ] Successfully logged in
- [ ] Saw dashboard
- [ ] Profile created in database

## 📤 PART 3: Netlify Deployment

### GitHub Push
- [ ] Committed changes: `git add . && git commit -m "Complete members portal"`
- [ ] Pushed to GitHub: `git push origin main`

### Netlify Setup
- [ ] Went to netlify.com
- [ ] Clicked "Add new site" → "Import existing project"
- [ ] Connected GitHub account
- [ ] Selected repository
- [ ] Set build command: `npm run build`
- [ ] Set publish directory: `dist`
- [ ] Added all environment variables
- [ ] Clicked "Deploy site"
- [ ] Waited for deployment (2-3 minutes)
- [ ] Got Netlify URL

### Custom Domain
- [ ] In Netlify: Domain settings
- [ ] Added custom domain: `members.cultivatedgrowthnetwork.com`
- [ ] Copied DNS records shown
- [ ] Added DNS records to domain registrar:
  - Type: CNAME
  - Name: members
  - Value: [netlify-url].netlify.app
- [ ] Waited for DNS propagation (5-30 minutes)
- [ ] Verified HTTPS is active

### Update OAuth Redirects
- [ ] In Google Cloud Console:
  - Added: `https://members.cultivatedgrowthnetwork.com/auth/callback`
- [ ] In Supabase Authentication settings:
  - Added to Redirect URLs: `https://members.cultivatedgrowthnetwork.com/auth/callback`
- [ ] Saved both

### Final Testing
- [ ] Visited: https://members.cultivatedgrowthnetwork.com
- [ ] Tested Google login
- [ ] Viewed dashboard
- [ ] Browsed Educational Vault
- [ ] Tested all navigation
- [ ] Checked mobile responsiveness

## 📝 PART 4: Content Setup

### Add First Content
- [ ] Logged into Supabase
- [ ] Went to Table Editor → content_items
- [ ] Added first video/article
- [ ] Set is_featured: true
- [ ] Set is_published: true
- [ ] Verified it appears in members portal

### Upload Media
- [ ] Uploaded video to member-videos bucket
- [ ] Got public URL
- [ ] Added URL to content_items

## 🎉 LAUNCH CHECKLIST

Before announcing:
- [ ] Test with 2-3 real users
- [ ] Verify payment flow works
- [ ] Add at least 5 pieces of content
- [ ] Test on mobile devices
- [ ] Check all links work
- [ ] Verify email capture works
- [ ] Test progress tracking
- [ ] Test notes and favorites
- [ ] Verify membership tiers work correctly

## 📊 Post-Launch

- [ ] Set up uptime monitoring
- [ ] Add Google Analytics (optional)
- [ ] Create content calendar
- [ ] Plan first live session
- [ ] Announce to email list

---

**Current Status:** Setting up Supabase database

**Next Step:** Run database schema once project is created

**Questions?** Check the guides:
- SUPABASE_SETUP_QUICK_START.md
- ADMIN_GUIDE.md
- DEPLOYMENT.md
