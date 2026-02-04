import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { UserProgress, ContentItem } from '../lib/supabase'
import { Layout } from '../components/Layout'

type ProgressWithContent = UserProgress & { content_items: ContentItem }

export function Progress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<ProgressWithContent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all')

  useEffect(() => {
    if (user) {
      fetchProgress()
    }
  }, [user])

  const fetchProgress = async () => {
    try {
      const { data } = await supabase
        .from('user_progress')
        .select(`
          *,
          content_items (*)
        `)
        .eq('user_id', user!.id)
        .order('last_accessed_at', { ascending: false })

      if (data) setProgress(data as ProgressWithContent[])
    } catch (error) {
      console.error('Error fetching progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProgress = progress.filter((item) => {
    if (filter === 'all') return true
    return item.status === filter
  })

  const stats = {
    total: progress.length,
    completed: progress.filter((p) => p.status === 'completed').length,
    inProgress: progress.filter((p) => p.status === 'in_progress').length,
    totalTime: progress.reduce((sum, p) => sum + p.time_spent_seconds, 0),
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
          <p className="mt-2 text-gray-600">
            Track your learning journey and achievements
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600">Total Started</div>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600">Completed</div>
            <div className="mt-2 text-3xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600">In Progress</div>
            <div className="mt-2 text-3xl font-bold text-blue-600">{stats.inProgress}</div>
          </div>
          <div className="card p-6">
            <div className="text-sm font-medium text-gray-600">Time Spent</div>
            <div className="mt-2 text-3xl font-bold text-purple-600">{formatTime(stats.totalTime)}</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'in_progress'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            In Progress ({stats.inProgress})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>

        {/* Progress List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          </div>
        ) : filteredProgress.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600 mb-4">
              {filter === 'all'
                ? "You haven't started any content yet."
                : `No ${filter.replace('_', ' ')} content.`}
            </p>
            <Link to="/vault" className="btn btn-primary">
              Browse Educational Vault
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProgress.map((item) => (
              <Link
                key={item.id}
                to={`/vault/${item.content_items.slug}`}
                className="card p-6 hover:shadow-lg transition-shadow block"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {item.content_items.title}
                      </h3>
                      {item.status === 'completed' && (
                        <span className="text-green-600">✓</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{formatTime(item.time_spent_seconds)} spent</span>
                      <span>{item.progress_percentage}% complete</span>
                      {item.completed_at && (
                        <span>Completed {new Date(item.completed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          item.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${item.progress_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
