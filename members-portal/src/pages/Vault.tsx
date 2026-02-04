import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { ContentCategory, ContentItem } from '../lib/supabase'
import { Layout } from '../components/Layout'

export function Vault() {
  const [categories, setCategories] = useState<ContentCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchContent()
  }, [selectedCategory])

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from('content_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (data) setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchContent = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('content_items')
        .select('*')
        .eq('is_published', true)

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }

      const { data } = await query.order('published_date', { ascending: false })

      if (data) setContentItems(data)
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredContent = contentItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Educational Vault</h1>
          <p className="mt-2 text-gray-600">
            Access your complete library of sales and leadership resources
          </p>
        </div>

        {/* Search */}
        <div className="max-w-xl">
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Content
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-gray-600">
              {searchQuery ? 'No content matches your search.' : 'No content available in this category.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <Link
                key={item.id}
                to={`/vault/${item.slug}`}
                className="card hover:shadow-lg transition-shadow group"
              >
                {item.thumbnail_url && (
                  <div className="relative overflow-hidden">
                    <img
                      src={item.thumbnail_url}
                      alt={item.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.video_duration && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(item.video_duration)}
                      </div>
                    )}
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{getContentIcon(item.content_type)}</span>
                    <span className="text-xs font-medium text-gray-500 uppercase">
                      {item.content_type}
                    </span>
                    {item.required_tier !== 'free' && (
                      <span className="ml-auto text-xs font-medium text-primary-600 capitalize">
                        {item.required_tier}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
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

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
