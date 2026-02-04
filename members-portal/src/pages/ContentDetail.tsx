import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { ContentItem, UserProgress, UserNote } from '../lib/supabase'
import { Layout } from '../components/Layout'

export function ContentDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { user, canAccessContent } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState<ContentItem | null>(null)
  const [progress, setProgress] = useState<UserProgress | null>(null)
  const [notes, setNotes] = useState<UserNote[]>([])
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    if (slug) {
      fetchContent()
    }
  }, [slug])

  const fetchContent = async () => {
    try {
      // Fetch content
      const { data: contentData } = await supabase
        .from('content_items')
        .select('*')
        .eq('slug', slug)
        .single()

      if (!contentData) {
        navigate('/vault')
        return
      }

      // Check access
      if (!canAccessContent(contentData.required_tier)) {
        alert('This content requires a higher membership tier. Please upgrade to access.')
        navigate('/membership')
        return
      }

      setContent(contentData)

      // Fetch user progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user!.id)
        .eq('content_id', contentData.id)
        .single()

      setProgress(progressData)

      // If no progress exists, create it
      if (!progressData) {
        const { data: newProgress } = await supabase
          .from('user_progress')
          .insert({
            user_id: user!.id,
            content_id: contentData.id,
            status: 'in_progress',
          })
          .select()
          .single()

        setProgress(newProgress)
      }

      // Fetch notes
      const { data: notesData } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user!.id)
        .eq('content_id', contentData.id)
        .order('created_at', { ascending: false })

      if (notesData) setNotes(notesData)

      // Check if favorited
      const { data: favoriteData } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user!.id)
        .eq('content_id', contentData.id)
        .single()

      setIsFavorite(!!favoriteData)

      // Update view count
      await supabase
        .from('content_items')
        .update({ view_count: (contentData.view_count || 0) + 1 })
        .eq('id', contentData.id)
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user!.id)
          .eq('content_id', content!.id)
        setIsFavorite(false)
      } else {
        await supabase
          .from('user_favorites')
          .insert({
            user_id: user!.id,
            content_id: content!.id,
          })
        setIsFavorite(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    }
  }

  const markComplete = async () => {
    try {
      const { data } = await supabase
        .from('user_progress')
        .update({
          status: 'completed',
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
        })
        .eq('id', progress!.id)
        .select()
        .single()

      setProgress(data)
    } catch (error) {
      console.error('Error marking complete:', error)
    }
  }

  const addNote = async () => {
    if (!newNote.trim()) return

    try {
      const { data } = await supabase
        .from('user_notes')
        .insert({
          user_id: user!.id,
          content_id: content!.id,
          note_text: newNote,
        })
        .select()
        .single()

      if (data) {
        setNotes([data, ...notes])
        setNewNote('')
      }
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId)

      setNotes(notes.filter((n) => n.id !== noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent"></div>
        </div>
      </Layout>
    )
  }

  if (!content) {
    return null
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
            {content.description && (
              <p className="mt-2 text-gray-600">{content.description}</p>
            )}
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <span className="capitalize">{content.content_type}</span>
              {content.video_duration && (
                <span>{Math.floor(content.video_duration / 60)} min</span>
              )}
              <span>{content.view_count || 0} views</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleFavorite}
              className={`btn ${isFavorite ? 'btn-primary' : 'btn-outline'}`}
            >
              {isFavorite ? '⭐ Saved' : '☆ Save'}
            </button>
            {progress?.status !== 'completed' && (
              <button onClick={markComplete} className="btn btn-primary">
                Mark Complete
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Your Progress</span>
              <span className="text-sm text-gray-600">{progress.progress_percentage}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${
                  progress.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                }`}
                style={{ width: `${progress.progress_percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="card p-6">
          {content.content_type === 'video' && content.video_url && (
            <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
              <video
                src={content.video_url}
                controls
                className="w-full h-full"
                onTimeUpdate={(e) => {
                  const video = e.currentTarget
                  const progressPercentage = (video.currentTime / video.duration) * 100
                  // Update progress in database periodically
                  console.log('Video progress:', progressPercentage)
                }}
              />
            </div>
          )}

          {content.content_type === 'article' && content.content_body && (
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content.content_body }} />
            </div>
          )}

          {content.content_type === 'pdf' && content.pdf_url && (
            <div className="text-center py-8">
              <a
                href={content.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                📄 Open PDF
              </a>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Notes</h2>

          <div className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              rows={3}
            />
            <button
              onClick={addNote}
              disabled={!newNote.trim()}
              className="mt-2 btn btn-primary disabled:opacity-50"
            >
              Add Note
            </button>
          </div>

          <div className="space-y-3">
            {notes.length === 0 ? (
              <p className="text-gray-600 text-sm">No notes yet. Add your first note above!</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-gray-900 flex-1">{note.note_text}</p>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
