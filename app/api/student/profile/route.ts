import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET: Fetch student profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    const { data: profile, error } = await supabase
      .from("students")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error("Error in profile GET:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Update student profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      full_name,
      phone,
      branch,
      graduation_year,
      cgpa,
      skills,
      bio,
      github_url,
      linkedin_url,
      portfolio_url,
      resume_url
    } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Calculate profile completeness
    const fields = [
      full_name,
      phone,
      branch,
      graduation_year,
      cgpa,
      skills?.length > 0,
      bio,
      github_url,
      linkedin_url,
      portfolio_url,
      resume_url
    ];
    const filledFields = fields.filter(field => field).length;
    const profile_completeness = Math.round((filledFields / fields.length) * 100);

    // Update profile
    const { data: profile, error } = await supabase
      .from("students")
      .update({
        full_name,
        phone,
        branch,
        graduation_year,
        cgpa,
        skills,
        bio,
        github_url,
        linkedin_url,
        portfolio_url,
        resume_url,
        profile_completeness,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return NextResponse.json(
        { success: false, error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Error in profile POST:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
