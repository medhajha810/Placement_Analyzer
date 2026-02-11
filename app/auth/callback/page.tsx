"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth/signin?error=auth_failed')
          return
        }

        if (data.session && data.session.user) {
          const user = data.session.user
          
          // Check for pending role from signup
          const pendingRole = localStorage.getItem('pendingRole') || 'student'
          localStorage.removeItem('pendingRole')
          
          const userData = {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            role: user.user_metadata?.role || pendingRole,
            avatar_url: user.user_metadata?.avatar_url
          }

          // Store user data
          localStorage.setItem('user', JSON.stringify(userData))
          
          // Create student profile if needed
          if (userData.role === 'student') {
            try {
              await supabase
                .from('student_profiles')
                .upsert({
                  id: user.id,
                  email: user.email,
                  full_name: userData.full_name,
                  profile_completeness: 20
                })
            } catch (profileError) {
              console.log('Could not create/update student profile:', profileError)
            }
          }

          // Redirect to dashboard
          router.push(`/${userData.role}/dashboard`)
        } else {
          router.push('/auth/signin?error=no_session')
        }
      } catch (error) {
        console.error('Callback handling error:', error)
        router.push('/auth/signin?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}