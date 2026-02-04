# Admin Guide - Managing Content & Members

This guide shows you how to add content, manage members, and maintain your members portal.

---

## Adding Content to Educational Vault

You have two options: Supabase Dashboard (easy, no code) or Admin Panel (coming soon).

### Option 1: Using Supabase Dashboard (Current)

#### 1. Log into Supabase
- Go to: https://app.supabase.com
- Select your "CGN Members Portal" project

#### 2. Navigate to Table Editor
- Click **"Table Editor"** in left sidebar
- Select **"content_items"** table

#### 3. Add New Content
Click **"Insert row"** button and fill in:

**Required Fields:**
- **title**: Name of the content (e.g., "How to Ask Better Discovery Questions")
- **slug**: URL-friendly version (e.g., "how-to-ask-better-discovery-questions")
  - No spaces, lowercase, use hyphens
- **category_id**: Select from dropdown (Foundations, Conversations, etc.)
- **content_type**: Choose: video, article, pdf, audio, or resource
- **required_tier**: Who can access? (free, trial, monthly, annual)
- **is_published**: true (to make it live)

**Optional but Recommended:**
- **description**: Short summary (shows in grid view)
- **thumbnail_url**: Image URL for the content card
- **video_url**: For video content (YouTube, Vimeo, or direct link)
- **video_duration**: Length in seconds (e.g., 300 = 5 minutes)
- **content_body**: For articles (HTML or plain text)
- **pdf_url**: For downloadable PDFs
- **is_featured**: true (shows on dashboard featured section)
- **published_date**: When it goes live (defaults to now)

**Click "Save"**

#### 4. Verify Content Appears
- Log into members portal
- Go to Educational Vault
- Check that your content appears

---

## Content Organization

### Categories

Your vault is organized into 5 categories (already created):

1. **🌱 Foundations** - Core framework, confidence building
2. **💬 Conversations** - Questions, listening, objections
3. **🎯 Execution & Follow-Through** - Moving forward, consistency
4. **📈 Professional Growth** - Positioning, communication, leadership
5. **♻️ Sustainability** - Momentum, retention, avoiding burnout

### Content Types

- **video** - Training videos, demonstrations
- **article** - Written lessons and guides
- **pdf** - Downloadable worksheets, frameworks
- **audio** - Podcast-style content
- **resource** - Tools, templates, external links

---

## Uploading Video & PDF Files

### Using Supabase Storage

#### 1. Upload File
- In Supabase, go to **Storage** in sidebar
- Select bucket:
  - `member-videos` for videos
  - `member-content` for PDFs, images
- Click **"Upload file"**
- Select your file

#### 2. Get Public URL
- After upload, click the file name
- Click **"Get URL"** button
- Copy the URL
- Use this URL in the content_items table

### Supported Formats
- **Videos**: MP4, WebM (MP4 recommended)
- **PDFs**: Standard PDF files
- **Images**: JPG, PNG (for thumbnails)

### Video Recommendations
- Resolution: 1280x720 (720p) or 1920x1080 (1080p)
- Format: MP4 (H.264 codec)
- File size: Keep under 100MB for best performance
- Consider using Vimeo or YouTube for hosting

---

## Managing Members

### View All Members

1. **Go to Supabase → Table Editor**
2. **Select "profiles" table**

You'll see:
- Email
- Full name
- Membership tier
- Membership status
- Sign-up date
- Trial dates
- Last active

### Update Member Tier

To manually change a member's tier:

1. Find the member in **profiles** table
2. Click on their row
3. Update **membership_tier** field:
   - `free` - Free access only
   - `trial` - 7-day trial
   - `monthly` - Monthly membership
   - `annual` - Annual membership
4. Update **membership_status**:
   - `active` - Currently has access
   - `expired` - Trial or subscription ended
   - `cancelled` - User cancelled
   - `past_due` - Payment issue
5. Click **"Save"**

### Set Up Trial

To give someone a trial:

1. Set **membership_tier** to `trial`
2. Set **membership_status** to `active`
3. Set **trial_start_date** to today
4. Set **trial_end_date** to 7 days from today
5. Save

### View Member Activity

**Progress Tracking:**
- Table: `user_progress`
- Shows: What content each member has started/completed

**Notes:**
- Table: `user_notes`
- Shows: Personal notes members have taken

**Favorites:**
- Table: `user_favorites`
- Shows: Content members have bookmarked

**Analytics:**
- Table: `analytics_events`
- Tracks: User actions, content views, etc.

---

## Membership Tiers Configuration

The tiers are in the **membership_tiers** table.

Current setup:
- **Free**: $0 - Limited access
- **Trial**: $0 - 7-day full access
- **Monthly**: $97/month - Full access
- **Annual**: $970/year (save $194)

To update pricing:
1. Go to **membership_tiers** table
2. Click the row for the tier you want to update
3. Update **price_monthly** field
4. Update **description** if needed
5. Save

⚠️ **Also update Stripe prices** to match!

---

## Content Access Control

Control who can see what content using **required_tier**:

- `free` - Everyone can see (logged in or not)
- `trial` - Trial and paid members only
- `monthly` - Monthly and annual members only
- `annual` - Annual members only

Members with higher tiers can access all lower tier content.

---

## Featured Content

To feature content on the dashboard:

1. Go to **content_items** table
2. Find the content you want to feature
3. Set **is_featured** to `true`
4. Save

Featured content appears in the "Featured Content" section on the dashboard. Limit to 3-6 featured items for best display.

---

## Publishing & Unpublishing Content

To hide content without deleting it:

1. Go to **content_items** table
2. Find the content
3. Set **is_published** to `false`
4. Save

The content will be hidden from members but still in your database.

To publish: Set **is_published** back to `true`

---

## Viewing Member Feedback

### Check Popular Content
```sql
SELECT title, view_count, content_type
FROM content_items
WHERE is_published = true
ORDER BY view_count DESC
LIMIT 10;
```

Run this in Supabase SQL Editor to see most-viewed content.

### See What Members Are Completing
```sql
SELECT
  ci.title,
  COUNT(*) as completions
FROM user_progress up
JOIN content_items ci ON up.content_id = ci.id
WHERE up.status = 'completed'
GROUP BY ci.title
ORDER BY completions DESC;
```

---

## Common Admin Tasks

### 1. Add Weekly Live Training Recording

1. Upload video to Vimeo/YouTube or Supabase storage
2. Add new row to content_items:
   - title: "Week X: [Topic Name]"
   - category_id: Choose relevant category
   - content_type: video
   - video_url: [Your video URL]
   - required_tier: monthly
   - is_published: true
   - published_date: Today

### 2. Create Downloadable Worksheet

1. Upload PDF to `member-content` bucket
2. Get public URL
3. Add to content_items:
   - content_type: pdf
   - pdf_url: [Your PDF URL]
   - description: What it's for
   - required_tier: monthly

### 3. Write a New Article

1. Write content in Word/Google Docs
2. Add to content_items:
   - content_type: article
   - content_body: [Paste your text]
   - Or use HTML for formatting

### 4. Update Homepage Featured Content

1. Go to content_items
2. Set 3-5 items as is_featured: true
3. Unfeature older items by setting to false

---

## Monitoring & Maintenance

### Weekly Checks
- Review new member signups (profiles table)
- Check which content is most popular (view_count)
- Monitor member activity (last_active dates)

### Monthly Checks
- Review membership statuses
- Check for expired trials
- Update featured content
- Add new content

### Quarterly Checks
- Review category organization
- Archive old content if needed
- Update pricing if necessary
- Review member progression

---

## Data Export

### Export Members List

In Supabase:
1. Go to Table Editor → profiles
2. Click the export button (top right)
3. Choose CSV format
4. Download

### Export Content Library

1. Go to Table Editor → content_items
2. Export as CSV
3. Use for backup or reporting

---

## Security & Best Practices

✅ **DO:**
- Keep Supabase credentials secure
- Regularly review member access
- Test content before publishing
- Back up your database monthly
- Use descriptive titles and slugs
- Add thumbnails for better engagement

❌ **DON'T:**
- Share your service_role key
- Delete content (unpublish instead)
- Change database structure directly
- Give everyone annual access
- Leave test content published

---

## Coming Soon: Admin Panel

A visual admin panel is planned for easier content management. It will include:
- Drag-and-drop content organization
- Visual content editor
- Member management dashboard
- Analytics and reporting
- Bulk operations

For now, use the Supabase dashboard - it's powerful and secure.

---

## Need Help?

**Supabase Documentation:** https://supabase.com/docs

**Quick Reference:**
- Add content: Table Editor → content_items → Insert row
- Manage members: Table Editor → profiles
- Upload files: Storage → Select bucket → Upload
- Run reports: SQL Editor → New query

**For technical issues:**
- Check browser console (F12)
- Review Supabase logs
- Contact: charmaine@cultivatedgrowthnetwork.com
