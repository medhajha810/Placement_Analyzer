import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "studentId required" }, { status: 400 });
    }

    // Get student applications
    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('student_id', studentId);

    // Get stats
    const { count: totalApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId);

    const { count: acceptedApplications } = await supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('status', 'accepted');

    // Get upcoming jobs
    const { data: upcomingJobs } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    const stats = {
      totalApplications: totalApplications || 0,
      acceptedApplications: acceptedApplications || 0,
      pendingApplications: (totalApplications || 0) - (acceptedApplications || 0),
      successRate: totalApplications ? Math.round((acceptedApplications || 0) / totalApplications * 100) : 0
    };

    return NextResponse.json({
      stats,
      applications: applications || [],
      upcomingDrives: upcomingJobs || []
    });
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
