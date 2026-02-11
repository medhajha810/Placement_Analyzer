"use client"

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if there's a code in URL parameters
        const code = searchParams.get('code')
        
        if (code) {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Auth exchange error:', error)
            router.push('/auth/signin?error=oauth_exchange_failed')
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
            router.push('/auth/signin?error=no_session_after_exchange')
          }
        } else {
          // Check for error in URL
          const error = searchParams.get('error')
          const errorDescription = searchParams.get('error_description')
          
          if (error) {
            console.error('OAuth error:', error, errorDescription)
            router.push(`/auth/signin?error=${error}&description=${errorDescription}`)
            return
          }

          // Fallback: try to get existing session
          const { data, error: sessionError } = await supabase.auth.getSession()
          
          if (sessionError) {
            console.error('Auth callback error:', sessionError)
            router.push('/auth/signin?error=auth_failed')
            return
          }

          if (data.session && data.session.user) {
            const user = data.session.user
            
            const userData = {
              id: user.id,
              email: user.email,
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
              name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
              role: user.user_metadata?.role || 'student',
              avatar_url: user.user_metadata?.avatar_url
            }

            localStorage.setItem('user', JSON.stringify(userData))
            router.push(`/${userData.role}/dashboard`)
          } else {
            router.push('/auth/signin?error=no_code_no_session')
          }
        }
      } catch (error) {
        console.error('Callback handling error:', error)
        router.push('/auth/signin?error=callback_failed')
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
}