# Cultivated Growth Network - Members Portal

A professional, feature-rich members portal built with React, TypeScript, Vite, Supabase, and Tailwind CSS.

## Features

### Authentication
- Google OAuth integration via Supabase Auth
- Secure session management
- Protected routes
- Automatic profile creation on first sign-in

### Content Management
- **Educational Vault**: Browse categorized content (videos, articles, PDFs, audio)
- **Content Player**: Video player with progress tracking
- **Progress Tracking**: Automatic tracking of content completion and time spent
- **Notes System**: Add personal notes to content items
- **Favorites**: Save content for quick access

### User Features
- **Dashboard**: Personalized overview with featured content and stats
- **My Progress**: Track learning journey with detailed analytics
- **Profile Management**: Update personal information
- **Membership Management**: View current plan and upgrade options

### Technical Features
- Responsive design (mobile-first)
- Real-time data synchronization
- Row-level security (RLS) for data protection
- Optimistic UI updates
- Error handling and loading states

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM 7
- **Payments**: Stripe
- **Date Utilities**: date-fns

## Project Structure

```
members-portal/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Layout.tsx     # Main layout with nav and footer
│   │   └── ProtectedRoute.tsx
│   ├── pages/             # Route pages
│   │   ├── Login.tsx
│   │   ├── AuthCallback.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Vault.tsx
│   │   ├── ContentDetail.tsx
│   │   ├── Progress.tsx
│   │   ├── Favorites.tsx
│   │   ├── Profile.tsx
│   │   └── Membership.tsx
│   ├── hooks/             # Custom React hooks
│   │   └── useAuth.ts
│   ├── store/             # Zustand stores
│   │   └── authStore.ts
│   ├── lib/               # Utilities and config
│   │   └── supabase.ts
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── .env.example           # Environment variables template
└── package.json
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd members-portal
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in your credentials:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_MONTHLY_PRICE_ID=price_...
VITE_STRIPE_ANNUAL_PRICE_ID=price_...

# App URLs
VITE_APP_URL=http://localhost:5173
VITE_MAIN_SITE_URL=https://cultivatedgrowthnetwork.com
```

### 3. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `../supabase-schema.sql` in the SQL Editor
3. Configure Google OAuth in Authentication → Providers
4. Create storage buckets: `member-videos` and `member-content`
5. Copy your Project URL and anon key to `.env`

See `../SUPABASE_SETUP.md` for detailed instructions.

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173

### 5. Build for Production

```bash
npm run build
```

The build output will be in `dist/` directory.

## Key Pages

### Dashboard (`/dashboard`)
- Welcome message with user's name
- Membership status card with upgrade CTA
- Quick stats (completed, in progress, favorites)
- Featured content carousel
- Recently added content grid

### Educational Vault (`/vault`)
- Search functionality
- Category filtering
- Content grid with thumbnails
- Content type indicators
- Access tier badges

### Content Detail (`/vault/:slug`)
- Video player with progress tracking
- Article reader
- PDF viewer
- Progress bar
- Favorite/bookmark button
- Mark complete functionality
- Personal notes section

### My Progress (`/progress`)
- Overall statistics
- Filter by status (all, in progress, completed)
- Progress bars for each item
- Time tracking

### Favorites (`/favorites`)
- Grid of saved content
- Quick remove functionality
- Direct links to content

### Profile (`/profile`)
- View/edit personal information
- Membership status overview
- Account management links

### Membership (`/membership`)
- Current plan display
- Pricing comparison
- Upgrade/downgrade options
- Stripe integration for payments

## Database Schema

The app uses the following main tables:

- `profiles` - User profiles and membership info
- `content_categories` - Content organization
- `content_items` - Educational content (videos, articles, PDFs)
- `user_progress` - Track user completion and time spent
- `user_notes` - Personal notes on content
- `user_favorites` - Bookmarked content
- `payment_history` - Transaction records

All tables have Row-Level Security (RLS) enabled for data protection.

## Security Features

- Row-level security policies on all tables
- Users can only access their own data
- Content access based on membership tier
- Secure authentication via Supabase
- API keys stored in environment variables
- HTTPS enforced in production

## Deployment

### Netlify (Recommended)

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Vercel

1. Import project from GitHub
2. Framework preset: Vite
3. Add environment variables
4. Deploy

## Environment Variables Required

### Frontend (VITE_ prefix)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_STRIPE_MONTHLY_PRICE_ID`
- `VITE_STRIPE_ANNUAL_PRICE_ID`
- `VITE_APP_URL`
- `VITE_MAIN_SITE_URL`

## Development Guidelines

### Adding New Content Types

1. Update `ContentItem` type in `src/lib/supabase.ts`
2. Add icon mapping in content display components
3. Create appropriate player/viewer component
4. Update filtering logic if needed

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx` if needed
4. Wrap in `<ProtectedRoute>` if authentication required

### Customizing Styles

- Main theme colors defined in `tailwind.config.js`
- Global styles in `src/index.css`
- Component-specific styles use Tailwind utility classes

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists and has correct variable names
- Restart dev server after adding/changing environment variables

### Authentication not working
- Check Google OAuth is configured in Supabase
- Verify redirect URLs match in Google Cloud Console
- Check browser console for errors

### Content not displaying
- Verify database schema is set up correctly
- Check RLS policies allow access
- Ensure content is marked as `is_published = true`

## Support

For questions or issues:
- Review the `/SUPABASE_SETUP.md` guide
- Check Supabase documentation
- Contact: charmaine@cultivatedgrowthnetwork.com

## License

Proprietary - Cultivated Growth Network © 2026
