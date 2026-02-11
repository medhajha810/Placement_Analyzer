import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";

// Identify students at risk of being unprepared
async function identifyAtRiskStudents() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: allStudents } = await supabase
      .from('student_profiles')
      .select(`
        *,
        user:users!student_profiles_user_id_fkey(id, full_name, email)
      `);

    if (!allStudents || allStudents.length === 0) {
      return [];
    }

    const atRiskStudents = [];

    for (const student of allStudents) {
      const riskFactors = [];
      let riskScore = 0;

      // Factor 1: Low profile completeness
      if ((student.profile_completeness || 0) < 50) {
        riskFactors.push("Incomplete profile (<50%)");
        riskScore += 30;
      }

      // Factor 2: Low readiness score
      if ((student.placement_readiness_score || 0) < 40) {
        riskFactors.push("Low readiness score (<40)");
        riskScore += 25;
      }

      // Factor 3: Few skills
      if (!student.skills || student.skills.length < 3) {
        riskFactors.push("Limited skills (<3)");
        riskScore += 20;
      }

      // Factor 4: No resume
      if (!student.resume_url) {
        riskFactors.push("No resume uploaded");
        riskScore += 15;
      }

      // Factor 5: Check application activity
      const { count: appCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', student.user_id);

      if ((appCount || 0) === 0) {
        riskFactors.push("Never applied to any drive");
        riskScore += 20;
      }

      // Factor 6: Check mock interview participation
      const { count: mockCount } = await supabase
        .from('mock_interviews')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', student.user_id);

      if ((mockCount || 0) === 0) {
        riskFactors.push("No mock interviews taken");
        riskScore += 15;
      }

      // Only include if at risk (score >= 40)
      if (riskScore >= 40) {
        atRiskStudents.push({
          id: student.user_id,
          name: student.user?.full_name || "Unknown",
          email: student.user?.email,
          gpa: student.gpa || 0,
          branch: student.branch,
          graduationYear: student.graduation_year,
          riskScore,
          riskLevel: riskScore >= 70 ? "critical" : riskScore >= 50 ? "high" : "medium",
          riskFactors,
          profileCompleteness: student.profile_completeness || 0,
          readinessScore: student.placement_readiness_score || 0,
          skillCount: student.skills?.length || 0
        });
      }
    }

    // Sort by risk score (highest first)
    return atRiskStudents.sort((a, b) => b.riskScore - a.riskScore);
  } catch (error) {
    console.error("Error identifying at-risk students:", error);
    return [];
  }
}

// Forecast eligibility based on hypothetical JD criteria
async function forecastEligibility(criteria: {
  minGpa?: number;
  requiredSkills?: string[];
  preferredSkills?: string[];
  branches?: string[];
  minReadinessScore?: number;
  graduationYear?: number;
}) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: allStudents } = await supabase
      .from('student_profiles')
      .select(`
        *,
        user:users!student_profiles_user_id_fkey(id, full_name, email)
      `);

    if (!allStudents || allStudents.length === 0) {
      return {
        totalStudents: 0,
        eligibleCount: 0,
        eligibilityRate: 0,
        eligible: [],
        ineligible: [],
        gapAnalysis: {},
        recommendations: []
      };
    }

    let eligibleStudents = [];
    let ineligibleStudents = [];

    for (const student of allStudents) {
      const gaps = [];
      let isEligible = true;

      // Check GPA
      if (criteria.minGpa && (student.gpa || 0) < criteria.minGpa) {
        gaps.push(`GPA ${student.gpa || 0} < ${criteria.minGpa}`);
        isEligible = false;
      }

      // Check required skills
      if (criteria.requiredSkills && criteria.requiredSkills.length > 0) {
        const studentSkills = (student.skills || []).map((s: string) => s.toLowerCase());
        const missingSkills: string[] = criteria.requiredSkills.filter(
          (req: string) => !studentSkills.some((s: string) => s.includes(req.toLowerCase()))
        );
        
        if (missingSkills.length > 0) {
          gaps.push(`Missing skills: ${missingSkills.join(", ")}`);
          isEligible = false;
        }
      }

      // Check branch
      if (criteria.branches && criteria.branches.length > 0) {
        if (!criteria.branches.some(b => b.toLowerCase() === (student.branch || "").toLowerCase())) {
          gaps.push(`Branch ${student.branch} not eligible`);
          isEligible = false;
        }
      }

      // Check readiness score
      if (criteria.minReadinessScore && (student.placement_readiness_score || 0) < criteria.minReadinessScore) {
        gaps.push(`Readiness ${student.placement_readiness_score || 0} < ${criteria.minReadinessScore}`);
        isEligible = false;
      }

      // Check graduation year
      if (criteria.graduationYear && student.graduation_year !== criteria.graduationYear) {
        gaps.push(`Year ${student.graduation_year} ≠ ${criteria.graduationYear}`);
        isEligible = false;
      }

      const studentData = {
        id: student.user_id,
        name: student.user?.full_name || "Unknown",
        email: student.user?.email,
        gpa: student.gpa || 0,
        branch: student.branch,
        skills: student.skills || [],
        readinessScore: student.placement_readiness_score || 0,
        gaps
      };

      if (isEligible) {
        eligibleStudents.push(studentData);
      } else {
        ineligibleStudents.push(studentData);
      }
    }

    // Analyze common gaps
    const gapAnalysis: Record<string, number> = {};
    ineligibleStudents.forEach(student => {
      student.gaps.forEach((gap: string) => {
        gapAnalysis[gap] = (gapAnalysis[gap] || 0) + 1;
      });
    });

    // Generate recommendations
    const recommendations = generateRecommendations(gapAnalysis, criteria, ineligibleStudents.length);

    return {
      totalStudents: allStudents.length,
      eligibleCount: eligibleStudents.length,
      eligibilityRate: Math.round((eligibleStudents.length / allStudents.length) * 100),
      eligible: eligibleStudents,
      ineligible: ineligibleStudents,
      gapAnalysis,
      recommendations
    };
  } catch (error) {
    console.error("Error forecasting eligibility:", error);
    return {
      totalStudents: 0,
      eligibleCount: 0,
      eligibilityRate: 0,
      eligible: [],
      ineligible: [],
      gapAnalysis: {},
      recommendations: []
    };
  }
}

function generateRecommendations(
  gapAnalysis: Record<string, number>,
  criteria: any,
  ineligibleCount: number
) {
  const recommendations = [];

  // Analyze skill gaps
  if (criteria.requiredSkills) {
    const skillGaps = Object.entries(gapAnalysis)
      .filter(([gap]) => gap.includes("Missing skills"))
      .map(([gap, count]) => ({ gap, count }));

    if (skillGaps.length > 0) {
      // Extract most common missing skills
      const skillCounts: Record<string, number> = {};
      skillGaps.forEach(({ gap, count }) => {
        const skills = gap.replace("Missing skills: ", "").split(", ");
        skills.forEach(skill => {
          skillCounts[skill] = (skillCounts[skill] || 0) + count;
        });
      });

      const topMissingSkills = Object.entries(skillCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([skill, count]) => ({ skill, count }));

      topMissingSkills.forEach(({ skill, count }) => {
        recommendations.push({
          type: "workshop",
          priority: count > ineligibleCount * 0.5 ? "critical" : "high",
          title: `Schedule ${skill} Workshop`,
          description: `${count} students (${Math.round((count / ineligibleCount) * 100)}%) lack ${skill} skills`,
          action: `Organize a ${skill} training program`,
          impact: `Could make ${count} more students eligible`,
          icon: "📚"
        });
      });
    }
  }

  // Analyze GPA issues
  const gpaGaps = Object.entries(gapAnalysis)
    .filter(([gap]) => gap.includes("GPA"))
    .reduce((sum, [, count]) => sum + count, 0);

  if (gpaGaps > 0) {
    recommendations.push({
      type: "academic",
      priority: gpaGaps > ineligibleCount * 0.3 ? "high" : "medium",
      title: "Academic Support Program",
      description: `${gpaGaps} students don't meet GPA criteria (${criteria.minGpa || 0})`,
      action: "Consider lowering GPA threshold or offering academic support",
      impact: `Could make ${gpaGaps} more students eligible`,
      icon: "📖"
    });
  }

  // Analyze readiness score issues
  const readinessGaps = Object.entries(gapAnalysis)
    .filter(([gap]) => gap.includes("Readiness"))
    .reduce((sum, [, count]) => sum + count, 0);

  if (readinessGaps > 0) {
    recommendations.push({
      type: "engagement",
      priority: "high",
      title: "Boost Placement Readiness",
      description: `${readinessGaps} students have low readiness scores`,
      action: "Encourage mock interviews and more applications",
      impact: `Could improve readiness for ${readinessGaps} students`,
      icon: "🎯"
    });
  }

  // Branch restrictions
  const branchGaps = Object.entries(gapAnalysis)
    .filter(([gap]) => gap.includes("Branch"))
    .reduce((sum, [, count]) => sum + count, 0);

  if (branchGaps > 0) {
    recommendations.push({
      type: "policy",
      priority: "medium",
      title: "Reconsider Branch Restrictions",
      description: `${branchGaps} students excluded due to branch criteria`,
      action: "Consider opening drive to more branches",
      impact: `Could include ${branchGaps} more students`,
      icon: "🏛️"
    });
  }

  // Sort by priority
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return recommendations.sort((a, b) => 
    (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - 
    (priorityOrder[b.priority as keyof typeof priorityOrder] || 3)
  );
}

// Predict placement trends
async function predictPlacementTrends() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: students } = await supabase
      .from('student_profiles')
      .select('graduation_year, placement_readiness_score, gpa, skills');

    if (!students || students.length === 0) {
      return {
        averageReadiness: 0,
        averageGpa: 0,
        topSkills: [],
        yearlyTrends: []
      };
    }

    // Calculate averages
    const totalReadiness = students.reduce((sum, s) => sum + (s.placement_readiness_score || 0), 0);
    const totalGpa = students.reduce((sum, s) => sum + (s.gpa || 0), 0);
    const averageReadiness = Math.round(totalReadiness / students.length);
    const averageGpa = Math.round((totalGpa / students.length) * 10) / 10;

    // Aggregate skills
    const skillCounts: Record<string, number> = {};
    students.forEach(s => {
      (s.skills || []).forEach((skill: string) => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({
        skill,
        count,
        percentage: Math.round((count / students.length) * 100)
      }));

    // Yearly breakdown
    const yearGroups = students.reduce((acc, s) => {
      const year = s.graduation_year || "Unknown";
      if (!acc[year]) {
        acc[year] = { students: [], readiness: [], gpa: [] };
      }
      acc[year].students.push(s);
      if (s.placement_readiness_score) acc[year].readiness.push(s.placement_readiness_score);
      if (s.gpa) acc[year].gpa.push(s.gpa);
      return acc;
    }, {} as Record<string, any>);

    const yearlyTrends = Object.entries(yearGroups).map(([year, data]) => ({
      year: parseInt(year),
      studentCount: data.students.length,
      avgReadiness: data.readiness.length > 0 
        ? Math.round(data.readiness.reduce((a: number, b: number) => a + b, 0) / data.readiness.length)
        : 0,
      avgGpa: data.gpa.length > 0
        ? Math.round((data.gpa.reduce((a: number, b: number) => a + b, 0) / data.gpa.length) * 10) / 10
        : 0
    })).sort((a, b) => a.year - b.year);

    return {
      averageReadiness,
      averageGpa,
      topSkills,
      yearlyTrends
    };
  } catch (error) {
    console.error("Error predicting trends:", error);
    return {
      averageReadiness: 0,
      averageGpa: 0,
      topSkills: [],
      yearlyTrends: []
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "at-risk") {
      const atRiskStudents = await identifyAtRiskStudents();
      return NextResponse.json({
        success: true,
        atRiskCount: atRiskStudents.length,
        students: atRiskStudents
      });
    }

    if (action === "trends") {
      const trends = await predictPlacementTrends();
      return NextResponse.json({
        success: true,
        trends
      });
    }

    return NextResponse.json(
      { error: "Invalid action parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in predictive analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, criteria } = await request.json();

    if (action === "forecast") {
      const forecast = await forecastEligibility(criteria);
      return NextResponse.json({
        success: true,
        forecast
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in predictive analytics:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
