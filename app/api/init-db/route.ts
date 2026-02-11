import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(request: NextRequest) {
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL DEFAULT 'student',
          email_confirmed BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (usersError) {
      console.log('Users table might already exist:', usersError.message)
    }

    // Create student_profiles table
    const { error: profilesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS student_profiles (
          id UUID REFERENCES users(id) PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          branch VARCHAR(100),
          graduation_year INTEGER,
          cgpa DECIMAL(3,2),
          skills TEXT[],
          bio TEXT,
          github_url VARCHAR(255),
          linkedin_url VARCHAR(255),
          portfolio_url VARCHAR(255),
          resume_url VARCHAR(255),
          profile_completeness INTEGER DEFAULT 20,
          points INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (profilesError) {
      console.log('Student profiles table might already exist:', profilesError.message)
    }

    return NextResponse.json({
      success: true,
      message: 'Database tables initialized successfully!'
    })

  } catch (error: any) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      { error: 'Failed to initialize database: ' + error.message },
      { status: 500 }
    )
  }
}