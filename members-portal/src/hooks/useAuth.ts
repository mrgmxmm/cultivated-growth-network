import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../store/authStore'

export function useAuth() {
  const { user, profile, loading, setUser, setProfile, setLoading, logout } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Check active session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.user) {
          setUser(session.user)

          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profileData) {
            setProfile(profileData)
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)

        // Fetch or create profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }
      } else if (event === 'SIGNED_OUT') {
        logout()
        navigate('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setUser, setProfile, setLoading, logout, navigate])

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
    logout()
    navigate('/login')
  }

  const hasActiveMembership = () => {
    if (!profile) return false

    if (profile.membership_status !== 'active') return false

    if (profile.membership_tier === 'trial') {
      return profile.trial_end_date && new Date(profile.trial_end_date) > new Date()
    }

    return profile.membership_tier === 'monthly' || profile.membership_tier === 'annual'
  }

  const canAccessContent = (requiredTier: string) => {
    if (!profile) return false
    if (requiredTier === 'free') return true
    if (!hasActiveMembership()) return false

    const tierHierarchy = { free: 0, trial: 1, monthly: 2, annual: 3 }
    const userTier = tierHierarchy[profile.membership_tier as keyof typeof tierHierarchy] || 0
    const required = tierHierarchy[requiredTier as keyof typeof tierHierarchy] || 0

    return userTier >= required
  }

  return {
    user,
    profile,
    loading,
    signInWithGoogle,
    signOut,
    hasActiveMembership,
    canAccessContent,
  }
}
