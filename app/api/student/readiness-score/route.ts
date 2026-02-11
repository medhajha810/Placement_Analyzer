import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/auth";

// Calculate placement readiness score based on multiple factors
async function calculateReadinessScore(studentId: string) {
  try {
    // 1. Profile Completeness Score (0-35 points)
    const { data: profile } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    let profileScore = 0;
    if (profile) {
      const fields = [
        profile.gpa ? 5 : 0,
        profile.skills?.length >= 5 ? 10 : (profile.skills?.length || 0) * 2,
        profile.branch ? 3 : 0,
        profile.graduation_year ? 3 : 0,
        profile.resume_url ? 7 : 0,
        profile.github_url ? 3 : 0,
        profile.linkedin_url ? 4 : 0
      ];
      profileScore = fields.reduce((sum, val) => sum + val, 0);
    }

    // 2. Mock Interview Score (0-30 points)
    const { data: mocks, count: mockCount } = await supabase
      .from('mock_tests')
      .select('*', { count: 'exact' })
      .eq('student_id', studentId);

    let mockScore = 0;
    if (mockCount) {
      // 10 points per mock, max 3 mocks = 30 points
      mockScore = Math.min(mockCount * 10, 30);
      
      // Bonus for high scores
      const avgScore = mocks?.reduce((sum: number, m: any) => 
        sum + (m.overall_score || 0), 0) / (mocks?.length || 1);
      if (avgScore >= 80) mockScore += 5; // Bonus capped at 30 total
    }

    // 3. Application Consistency Score (0-35 points)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: applications, count: appCount } = await supabase
      .from('applications')
      .select('*', { count: 'exact' })
      .eq('student_id', studentId)
      .gte('created_at', thirtyDaysAgo.toISOString());

    let applicationScore = 0;
    if (appCount) {
      // 7 points per application in last 30 days, max 5 apps = 35 points
      applicationScore = Math.min(appCount * 7, 35);
    }

    // Total Score (0-100)
    const totalScore = Math.min(profileScore + mockScore + applicationScore, 100);

    // Calculate component scores as percentages of their max
    const breakdown = {
      profileCompleteness: {
        score: profileScore,
        max: 35,
        percentage: Math.round((profileScore / 35) * 100),
        items: {
          basicInfo: profile?.gpa && profile?.branch && profile?.graduation_year,
          skills: (profile?.skills?.length || 0) >= 5,
          resume: !!profile?.resume_url,
          socialLinks: !!(profile?.github_url && profile?.linkedin_url)
        }
      },
      mockInterviews: {
        score: mockScore,
        max: 30,
        percentage: Math.round((mockScore / 30) * 100),
        count: mockCount || 0,
        avgScore: mocks?.length ? 
          Math.round(mocks.reduce((sum: any, m: any) => sum + (m.overall_score || 0), 0) / mocks.length) : 0
      },
      applicationActivity: {
        score: applicationScore,
        max: 35,
        percentage: Math.round((applicationScore / 35) * 100),
        count: appCount || 0,
        lastApplicationDate: applications?.[0]?.applied_at || null
      }
    };

    return {
      totalScore,
      breakdown,
      level: getReadinessLevel(totalScore),
      tips: generateImprovementTips(breakdown)
    };
  } catch (error) {
    console.error("Error calculating readiness score:", error);
    throw error;
  }
}

function getReadinessLevel(score: number) {
  if (score >= 85) return { label: "Elite", color: "green", emoji: "🏆" };
  if (score >= 70) return { label: "Highly Ready", color: "blue", emoji: "⭐" };
  if (score >= 55) return { label: "Ready", color: "cyan", emoji: "✅" };
  if (score >= 40) return { label: "Almost There", color: "yellow", emoji: "⚡" };
  return { label: "Getting Started", color: "orange", emoji: "🎯" };
}

function generateImprovementTips(breakdown: any) {
  const tips = [];

  // Profile tips
  if (breakdown.profileCompleteness.percentage < 80) {
    if (!breakdown.profileCompleteness.items.resume) {
      tips.push({
        category: "Profile",
        tip: "Upload your resume to increase visibility",
        impact: "high",
        points: "+7"
      });
    }
    if (!breakdown.profileCompleteness.items.skills) {
      tips.push({
        category: "Profile",
        tip: "Add at least 5 relevant skills to your profile",
        impact: "high",
        points: "+10"
      });
    }
    if (!breakdown.profileCompleteness.items.socialLinks) {
      tips.push({
        category: "Profile",
        tip: "Connect your GitHub and LinkedIn profiles",
        impact: "medium",
        points: "+7"
      });
    }
  }

  // Mock interview tips
  if (breakdown.mockInterviews.count < 3) {
    tips.push({
      category: "Practice",
      tip: `Complete ${3 - breakdown.mockInterviews.count} more mock interview(s)`,
      impact: "high",
      points: `+${(3 - breakdown.mockInterviews.count) * 10}`
    });
  }

  // Application tips
  if (breakdown.applicationActivity.count < 5) {
    tips.push({
      category: "Activity",
      tip: "Apply to more placement drives to boost consistency",
      impact: "medium",
      points: "+7 per application"
    });
  }

  if (tips.length === 0) {
    tips.push({
      category: "Excellent",
      tip: "You're doing great! Keep maintaining this momentum",
      impact: "info",
      points: "—"
    });
  }

  return tips;
}

// Calculate peer comparison data (bell curve)
async function calculatePeerComparison(studentScore: number, graduationYear: number) {
  try {
    // Get all students from same batch
    const { data: batchProfiles } = await supabase
      .from('students')
      .select('id, gpa, graduation_year')
      .eq('graduation_year', graduationYear);

    if (!batchProfiles || batchProfiles.length === 0) {
      return {
        percentile: 50,
        batchSize: 0,
        distribution: [],
        stats: { min: 0, max: 0, avg: 0, median: 0 }
      };
    }

    // Calculate scores for all batch mates (in real app, this would be cached)
    const batchScores = batchProfiles.map((p: any) => 
      p.placement_readiness_score || studentScore // Fallback for demo
    );

    // Sort scores for percentile calculation
    const sortedScores = [...batchScores].sort((a, b) => a - b);
    const studentRank = sortedScores.filter(s => s < studentScore).length;
    const percentile = Math.round((studentRank / sortedScores.length) * 100);

    // Create distribution buckets for bell curve
    const buckets = [
      { range: "0-20", count: 0, min: 0, max: 20 },
      { range: "21-40", count: 0, min: 21, max: 40 },
      { range: "41-60", count: 0, min: 41, max: 60 },
      { range: "61-80", count: 0, min: 61, max: 80 },
      { range: "81-100", count: 0, min: 81, max: 100 }
    ];

    sortedScores.forEach(score => {
      const bucket = buckets.find(b => score >= b.min && score <= b.max);
      if (bucket) bucket.count++;
    });

    // Calculate statistics
    const avg = sortedScores.reduce((sum, s) => sum + s, 0) / sortedScores.length;
    const median = sortedScores[Math.floor(sortedScores.length / 2)];

    return {
      percentile,
      batchSize: batchScores.length,
      distribution: buckets,
      stats: {
        min: Math.min(...sortedScores),
        max: Math.max(...sortedScores),
        avg: Math.round(avg * 10) / 10,
        median: Math.round(median)
      },
      yourScore: studentScore,
      yourBucket: buckets.find(b => studentScore >= b.min && studentScore <= b.max)?.range
    };
  } catch (error) {
    console.error("Error calculating peer comparison:", error);
    return {
      percentile: 50,
      batchSize: 0,
      distribution: [],
      stats: { min: 0, max: 0, avg: 0, median: 0 }
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Get student's graduation year for peer comparison
    const { data: profile } = await supabase
      .from('students')
      .select('graduation_year')
      .eq('id', studentId)
      .single();

    const graduationYear = profile?.graduation_year || new Date().getFullYear();

    // Calculate readiness score
    const scoreData = await calculateReadinessScore(studentId);

    // Calculate peer comparison
    const peerData = await calculatePeerComparison(scoreData.totalScore, graduationYear);

    // Update the score in database for future reference
    await supabase
      .from('students')
      .update({ profile_completeness: scoreData.totalScore })
      .eq('id', studentId);

    return NextResponse.json({
      success: true,
      readinessScore: scoreData.totalScore,
      level: scoreData.level,
      breakdown: scoreData.breakdown,
      tips: scoreData.tips,
      peerComparison: peerData,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching readiness score:", error);
    return NextResponse.json(
      { error: "Failed to calculate readiness score" },
      { status: 500 }
    );
  }
}

// POST endpoint to manually trigger score recalculation
export async function POST(request: NextRequest) {
  try {
    const { studentId } = await request.json();

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from('students')
      .select('graduation_year')
      .eq('id', studentId)
      .single();

    const graduationYear = profile?.graduation_year || new Date().getFullYear();

    const scoreData = await calculateReadinessScore(studentId);
    const peerData = await calculatePeerComparison(scoreData.totalScore, graduationYear);

    // Update score in database
    await supabase
      .from('students')
      .update({ profile_completeness: scoreData.totalScore })
      .eq('id', studentId);

    return NextResponse.json({
      success: true,
      message: "Readiness score recalculated successfully",
      readinessScore: scoreData.totalScore,
      level: scoreData.level,
      breakdown: scoreData.breakdown,
      tips: scoreData.tips,
      peerComparison: peerData
    });
  } catch (error) {
    console.error("Error recalculating readiness score:", error);
    return NextResponse.json(
      { error: "Failed to recalculate readiness score" },
      { status: 500 }
    );
  }
}
