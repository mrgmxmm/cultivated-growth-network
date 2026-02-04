import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../lib/supabase'
import { Layout } from '../components/Layout'

export function Profile() {
  const { profile } = useAuth()
  const { setProfile } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)

      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', profile!.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      setEditing(false)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Information */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || 'Profile'}
                  className="h-20 w-20 rounded-full"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Profile Photo</p>
                <p className="text-xs text-gray-500 mt-1">
                  Synced from your Google account
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input"
                />
              ) : (
                <p className="text-gray-900">{profile?.full_name || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-900">{profile?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Member Since
              </label>
              <p className="text-gray-900">
                {profile?.signup_date && new Date(profile.signup_date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false)
                    setFullName(profile?.full_name || '')
                  }}
                  disabled={saving}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="btn btn-primary">
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Membership Status */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Membership Status</h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Plan
              </label>
              <p className="text-gray-900 capitalize">{profile?.membership_tier}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <p className="text-gray-900 capitalize">{profile?.membership_status}</p>
            </div>

            {profile?.membership_tier === 'trial' && profile?.trial_end_date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trial Ends
                </label>
                <p className="text-gray-900">
                  {new Date(profile.trial_end_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <a href="/membership" className="btn btn-primary">
              Manage Membership
            </a>
          </div>
        </div>
      </div>
    </Layout>
  )
}
