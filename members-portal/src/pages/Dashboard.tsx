import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { ContentItem } from '../lib/supabase'
import { Layout } from '../components/Layout'
import { formatDistanceToNow } from 'date-fns'

export function Dashboard() {
  const { profile } = useAuth()
  const [featuredContent, setFeaturedContent] = useState<ContentItem[]>([])
  const [recentContent, setRecentContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch featured content
        const { data: featured } = await supabase
          .from('content_items')
          .select('*')
          .eq('is_featured', true)
          .eq('is_published', true)
          .order('published_date', { ascending: false })
          .limit(3)

        if (featured) setFeaturedContent(featured)

        // Fetch recent content
        const { data: recent } = await supabase
          .from('content_items')
          .select('*')
          .eq('is_published', true)
          .order('published_date', { ascending: false })
          .limit(6)

        if (recent) setRecentContent(recent)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getMembershipStatusClasses = () => {
    if (!profile) return 'bg-gray-50 border-gray-200 text-gray-800'
    if (profile.membership_status !== 'active') return 'bg-red-50 border-red-200 text-red-800'
    if (profile.membership_tier === 'annual') return 'bg-purple-50 border-purple-200 text-purple-800'
    if (profile.membership_tier === 'monthly') return 'bg-blue-50 border-blue-200 text-blue-800'
    if (profile.membership_tier === 'trial') return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    return 'bg-green-50 border-green-200 text-green-800'
  }

  const getTrialDaysRemaining = () => {
    if (!profile?.trial_end_date) return 0
    const endDate = new Date(profile.trial_end_date)
    const now = new Date()
    const diff = endDate.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Member'}!
          </h1>
          <p className="mt-2 text-gray-600">
            Continue your journey to sales and leadership excellence
          </p>
        </div>

        {/* Membership Status Card */}
        <div className={`border-2 rounded-lg p-6 ${getMembershipStatusClasses()}`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {profile?.membership_tier} Membership
              </h2>
              <p className="mt-1 text-sm">
                Status: {profile?.membership_status}
              </p>
              {profile?.membership_tier === 'trial' && (
                <p className="mt-2 text-sm font-medium text-yellow-800">
                  {getTrialDaysRemaining()} days remaining in your trial
                </p>
              )}
            </div>
            {profile?.membership_tier === 'free' || profile?.membership_tier === 'trial' ? (
              <Link
                to="/membership"
                className="btn btn-primary"
              >
                Upgrade Membership
              </Link>
            ) : (
              <Link
                to="/membership"
                className="btn btn-secondary"
              >
                Manage Membership
              </Link>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600">Completed</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">0</div>
            <div className="mt-1 text-sm text-gray-500">lessons completed</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600">In Progress</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">0</div>
            <div className="mt-1 text-sm text-gray-500">lessons started</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600">Favorites</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">0</div>
            <div className="mt-1 text-sm text-gray-500">saved items</div>
          </div>
        </div>

        {/* Featured Content */}
        {featuredContent.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Featured Content</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredContent.map((item) => (
                <Link
                  key={item.id}
                  to={`/vault/${item.slug}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  {item.thumbnail_url && (
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getContentIcon(item.content_type)}</span>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {item.content_type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Content */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recently Added</h2>
            <Link to="/vault" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
            </div>
          ) : recentContent.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-600">No content available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentContent.map((item) => (
                <Link
                  key={item.id}
                  to={`/vault/${item.slug}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getContentIcon(item.content_type)}</span>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {item.content_type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.published_date && (
                      <p className="mt-2 text-xs text-gray-500">
                        Added {formatDistanceToNow(new Date(item.published_date), { addSuffix: true })}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

function getContentIcon(type: string) {
  switch (type) {
    case 'video': return '🎥'
    case 'article': return '📄'
    case 'pdf': return '📋'
    case 'audio': return '🎧'
    default: return '📚'
  }
}
