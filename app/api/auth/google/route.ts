import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function handleGoogleAuth() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Initialize Google OAuth with proper PKCE flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        skipBrowserRedirect: false
      },
    })

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (data.url) {
      // Redirect to Google OAuth URL
      return NextResponse.redirect(data.url)
    }

    return NextResponse.json({
      success: false,
      error: 'No authorization URL generated'
    }, { status: 500 })

  } catch (error: any) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initialize Google sign-in' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  return handleGoogleAuth()
}

export async function POST(request: NextRequest) {
  return handleGoogleAuth()
}