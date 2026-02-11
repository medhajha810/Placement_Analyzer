import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function handleGoogleAuth() {
  try {
    // Initialize Google OAuth with Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (data.url) {
      return NextResponse.redirect(data.url)
    }

    return NextResponse.json({
      success: true,
      url: data.url
    })

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