import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)
const supabaseAdmin = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Signup request body:', body)
    
    const { email, password, full_name, role = 'student' } = body

    if (!email || !password || !full_name) {
      console.log('Missing fields:', { email: !!email, password: !!password, full_name: !!full_name })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
          name: full_name
        },
        emailRedirectTo: undefined // Disable email confirmation for development
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Auto-confirm email for development (if service role key is available)
    if (data.user && supabaseAdmin) {
      try {
        await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
          email_confirm: true,
          user_metadata: {
            full_name,
            role,
            email_confirmed: true
          }
        })
        console.log('Email auto-confirmed for development:', email)
      } catch (confirmError) {
        console.log('Could not auto-confirm email (service role key may not be set):', confirmError)
        // Continue anyway - user can still confirm manually from Supabase dashboard
      }
    }

    if (data.user) {
      // Create student profile if role is student
      if (role === 'student') {
        try {
          await supabase
            .from('student_profiles')
            .insert({
              id: data.user.id,
              email: data.user.email,
              full_name: full_name,
              profile_completeness: 20
            })
        } catch (profileError) {
          console.log('Could not create student profile:', profileError)
        }
      }

      const userData = {
        id: data.user.id,
        email: data.user.email,
        full_name: full_name,
        name: full_name,
        role: role,
        created_at: data.user.created_at
      }

      return NextResponse.json({
        success: true,
        user: userData,
        message: 'Account created successfully!'
      })
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
    
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create account' },
      { status: 500 }
    )
  }
}
