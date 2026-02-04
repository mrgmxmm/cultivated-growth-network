import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database types based on schema
export interface Profile {
  id: string
  email: string
  full_name: string | null
  google_id: string | null
  avatar_url: string | null
  signup_date: string
  trial_start_date: string | null
  trial_end_date: string | null
  membership_tier: 'free' | 'trial' | 'monthly' | 'annual'
  membership_status: 'active' | 'expired' | 'cancelled' | 'past_due'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  last_active: string | null
  onboarding_completed: boolean
  created_at: string
  updated_at: string
}

export interface ContentCategory {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  color: string | null
  sort_order: number | null
  is_active: boolean
  created_at: string
}

export interface ContentItem {
  id: string
  category_id: string
  title: string
  slug: string
  description: string | null
  content_type: 'article' | 'video' | 'pdf' | 'audio' | 'resource'
  content_body: string | null
  video_url: string | null
  video_duration: number | null
  thumbnail_url: string | null
  pdf_url: string | null
  required_tier: 'free' | 'trial' | 'monthly' | 'annual'
  is_featured: boolean
  is_published: boolean
  view_count: number
  sort_order: number | null
  author_id: string | null
  published_date: string | null
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  content_id: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress_percentage: number
  time_spent_seconds: number
  last_position_seconds: number
  completed_at: string | null
  first_accessed_at: string
  last_accessed_at: string
}

export interface UserNote {
  id: string
  user_id: string
  content_id: string
  note_text: string
  timestamp_seconds: number | null
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface UserFavorite {
  id: string
  user_id: string
  content_id: string
  created_at: string
}
