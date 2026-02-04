import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { UserFavorite, ContentItem } from '../lib/supabase'
import { Layout } from '../components/Layout'

type FavoriteWithContent = UserFavorite & { content_items: ContentItem }

export function Favorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteWithContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      const { data } = await supabase
        .from('user_favorites')
        .select(`
          *,
          content_items (*)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (data) setFavorites(data as FavoriteWithContent[])
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: string) => {
    try {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId)

      setFavorites(favorites.filter((f) => f.id !== favoriteId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="mt-2 text-gray-600">
            Your saved content for quick access
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          </div>
        ) : favorites.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-4">⭐</p>
            <p className="text-gray-600 mb-4">
              You haven't saved any favorites yet.
            </p>
            <Link to="/vault" className="btn btn-primary">
              Browse Educational Vault
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="card hover:shadow-lg transition-shadow group relative">
                <button
                  onClick={() => removeFavorite(favorite.id)}
                  className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
                  title="Remove from favorites"
                >
                  <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                <Link to={`/vault/${favorite.content_items.slug}`}>
                  {favorite.content_items.thumbnail_url && (
                    <div className="relative overflow-hidden">
                      <img
                        src={favorite.content_items.thumbnail_url}
                        alt={favorite.content_items.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getContentIcon(favorite.content_items.content_type)}</span>
                      <span className="text-xs font-medium text-gray-500 uppercase">
                        {favorite.content_items.content_type}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {favorite.content_items.title}
                    </h3>
                    {favorite.content_items.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {favorite.content_items.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Saved {new Date(favorite.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
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
