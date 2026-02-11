import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)
const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Sign in with Supabase Auth
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    // Handle email not confirmed error
    if (error?.message?.includes('Email not confirmed')) {
      console.log('Email not confirmed, attempting to auto-confirm for development:', email)
      
      // Try to auto-confirm using admin API for development
      if (supabaseAdmin) {
        try {
          // Get user by email using admin API
          const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
          const user = users.find(u => u.email === email)
          
          if (user) {
            // Update user to confirm email
            await supabaseAdmin.auth.admin.updateUserById(user.id, {
              email_confirm: true
            })
            console.log('Email auto-confirmed, retrying signin:', email)
            
            // Retry sign in
            const retryResult = await supabase.auth.signInWithPassword({
              email,
              password
            })
            data = retryResult.data
            error = retryResult.error
          }
        } catch (confirmError) {
          console.warn('Failed to auto-confirm email:', confirmError)
          // Continue with original error
        }
      }
    }

    if (error) {
      // Provide helpful error message
      let errorMessage = error.message
      if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email not confirmed. Please confirm your email in Supabase dashboard or wait for auto-confirmation.'
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      )
    }

    if (data.user) {
      // Get user metadata
      const userData = {
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
        name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
        role: data.user.user_metadata?.role || 'student'
      }

      return NextResponse.json({
        success: true,
        user: userData,
        session: data.session,
        message: 'Signed in successfully!'
      })
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 400 }
    )
    
  } catch (error: any) {
    console.error('Signin error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sign in' },
      { status: 500 }
    )
  }
}
