# Supabase Quick Start Guide
## Members Portal Database Setup

Follow these steps exactly to set up your members portal database.

---

## PART 1: Create Supabase Project (5 minutes)

### 1. Go to Supabase
Visit: https://supabase.com

### 2. Sign Up / Log In
- Click "Start your project"
- Sign in with GitHub (recommended) or email

### 3. Create New Project
Click "New Project" and fill in:
- **Organization**: Create new or select existing
- **Project Name**: `CGN Members Portal`
- **Database Password**: Click "Generate a password" button
  - ⚠️ **CRITICAL**: Copy this password and save it somewhere safe!
  - You'll need it later if you ever need direct database access
- **Region**: Choose `US East (North Virginia)` or closest to you
- **Pricing Plan**: Start with "Free" (you can upgrade later)

### 4. Wait for Project Creation
Takes 2-3 minutes. You'll see a loading screen.

---

## PART 2: Run Database Schema (2 minutes)

Once your project is ready:

### 1. Open SQL Editor
- In left sidebar, click **SQL Editor** icon (looks like a console `>_`)

### 2. Create New Query
- Click **"New query"** button (top right)

### 3. Copy the Schema
- Open the file: `/Users/calarts/Desktop/CGN/supabase-schema.sql`
- Select ALL content (Cmd+A)
- Copy it (Cmd+C)

### 4. Paste and Run
- Paste into Supabase SQL Editor (Cmd+V)
- Click **"Run"** button (or press Cmd+Enter)
- You should see green success messages

### 5. Verify Success
Run this test query in a new query tab:
```sql
SELECT * FROM content_categories ORDER BY sort_order;
```

You should see 5 categories:
1. Foundations
2. Conversations
3. Execution & Follow-Through
4. Professional Growth
5. Sustainability & Long-Term Success

✅ If you see these, your database is set up correctly!

---

## PART 3: Get Your API Keys (1 minute)

### 1. Go to Project Settings
- Click the **gear icon** (⚙️) in left sidebar
- Select **"API"** from the left menu

### 2. Copy These Values

You'll see two important sections:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```
Copy this entire URL.

**Project API keys:**
- Find **"anon public"** key - Copy the long string starting with `eyJ...`
- This is safe to use in your frontend

⚠️ **DO NOT** use the `service_role` key in your frontend. It's for backend only.

### 3. Save These Values
You'll need these in the next step for your `.env` file.

---

## PART 4: Configure Google OAuth (10 minutes)

### A. Get Supabase Callback URL

1. In Supabase, go to **Authentication** (left sidebar)
2. Click **"Providers"**
3. Find **"Google"** in the list
4. You'll see: **Callback URL (for Google Developer Console)**
5. Copy this URL - it looks like:
   ```
   https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback
   ```

### B. Set Up Google Cloud Console

1. **Go to Google Cloud Console**
   Visit: https://console.cloud.google.com

2. **Create or Select Project**
   - If new: Click "Select a project" → "New Project"
   - Name it: "CGN Members Portal"
   - Click "Create"

3. **Enable Google+ API**
   - In search bar at top, search: "Google+ API"
   - Click on it
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to: APIs & Services → OAuth consent screen
   - Choose **"External"** (unless you have Google Workspace)
   - Click "Create"

   Fill in:
   - **App name**: Cultivated Growth Network Members
   - **User support email**: Your email
   - **Developer contact**: Your email
   - Click "Save and Continue"
   - Skip "Scopes" (click "Save and Continue")
   - Skip "Test users" (click "Save and Continue")
   - Click "Back to Dashboard"

5. **Create OAuth Client ID**
   - Go to: APIs & Services → Credentials
   - Click **"+ CREATE CREDENTIALS"**
   - Select **"OAuth 2.0 Client ID"**

   Fill in:
   - **Application type**: Web application
   - **Name**: CGN Members Portal
   - **Authorized JavaScript origins**: Leave empty
   - **Authorized redirect URIs**: Click "+ Add URI"
     - Paste the Supabase callback URL you copied earlier
     - Example: `https://xxxxx.supabase.co/auth/v1/callback`
   - Click **"Create"**

6. **Copy Your Credentials**
   A popup will show:
   - **Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-abc123...`)

   Copy both of these!

### C. Connect Google to Supabase

1. Go back to **Supabase** → **Authentication** → **Providers**
2. Find **"Google"** and toggle it **ON**
3. Paste your Google credentials:
   - **Client ID**: Paste the Client ID from Google
   - **Client Secret**: Paste the Client Secret from Google
4. Click **"Save"**

✅ Google OAuth is now configured!

---

## PART 5: Create Storage Buckets (2 minutes)

These will store videos, PDFs, and other content files.

### 1. Go to Storage
- Click **Storage** icon in left sidebar (looks like a folder)

### 2. Create Video Bucket
- Click **"New bucket"** button
- **Name**: `member-videos`
- **Public bucket**: Toggle **ON**
- Click **"Create bucket"**

### 3. Create Content Bucket
- Click **"New bucket"** again
- **Name**: `member-content`
- **Public bucket**: Toggle **ON**
- Click **"Create bucket"**

✅ Storage buckets created!

---

## PART 6: Set Up Environment Variables (3 minutes)

### 1. Create .env File
In your terminal, navigate to the members-portal folder:
```bash
cd /Users/calarts/Desktop/CGN/members-portal
```

Create a `.env` file:
```bash
cp .env.example .env
```

### 2. Edit .env File
Open `.env` in your code editor and fill in these values:

```env
# Supabase (from PART 3)
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (you already have these)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51Sg9KCRWzdMdZsP0...
VITE_STRIPE_MONTHLY_PRICE_ID=price_1ShJXWRWzdMdZsP0rXZzP5Lk
VITE_STRIPE_ANNUAL_PRICE_ID=price_1ShJXXRWzdMdZsP0zfqmVjX0

# App URLs
VITE_APP_URL=http://localhost:5173
VITE_MAIN_SITE_URL=https://cultivatedgrowthnetwork.com
```

Save the file.

---

## PART 7: Test Locally (2 minutes)

### 1. Start Development Server
```bash
npm run dev
```

### 2. Open Browser
Visit: http://localhost:5173

### 3. Test Login
- Click "Continue with Google"
- Sign in with your Google account
- You should be redirected to the dashboard

✅ If login works, everything is set up correctly!

---

## ✅ SETUP COMPLETE!

Your Supabase database is now:
- ✅ Created with all necessary tables
- ✅ Secured with Row Level Security
- ✅ Connected to Google OAuth
- ✅ Ready for content uploads
- ✅ Configured for storage

---

## Next Steps

1. **Deploy to Netlify** (see `DEPLOYMENT.md`)
2. **Add initial content** through Supabase dashboard
3. **Test with real users**

---

## Troubleshooting

**Login doesn't work?**
- Check that redirect URL in Google Console matches exactly
- Verify Google Client ID and Secret in Supabase
- Check browser console for errors

**Database error?**
- Verify schema ran successfully
- Check that RLS policies are enabled

**Can't connect?**
- Verify Supabase URL and anon key are correct in `.env`
- Make sure you restarted dev server after changing `.env`

---

## Need Help?

Your setup is in:
- **Supabase Dashboard**: https://app.supabase.com
- **Google Cloud Console**: https://console.cloud.google.com
- **Project Files**: `/Users/calarts/Desktop/CGN/members-portal/`

For issues, check the browser console (F12) for error messages.
