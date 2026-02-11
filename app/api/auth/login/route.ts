import { NextRequest, NextResponse } from "next/server";
import { db, supabase } from "@/lib/db";

// Simple login - NO password hashing for demo purposes
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const { data: user, error } = await db.getUserByEmail(email);

    if (error || !user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // In production, you'd use bcrypt to compare hashed passwords
    // For demo, we're doing simple string comparison
    if (user.password_hash !== password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Get additional profile data if student
    let profile = null;
    if (user.role === 'student') {
      const { data: studentProfile } = await db.getStudentProfile(user.id);
      profile = studentProfile;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      },
      profile
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
