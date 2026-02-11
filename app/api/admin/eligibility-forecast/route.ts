import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const criteria = await request.json();
    const { gpa_min, branches, skills } = criteria;

    // TODO: Query database to calculate eligibility
    // SELECT COUNT(*) FROM student_profiles 
    // WHERE gpa >= gpa_min
    // AND branch IN (branches)
    // AND skills @> ARRAY[skills]

    // Mock calculation
    const totalStudents = 150;
    let eligibleStudents = totalStudents;

    // Simple simulation logic
    if (gpa_min > 8.0) {
      eligibleStudents = Math.floor(totalStudents * 0.3);
    } else if (gpa_min > 7.5) {
      eligibleStudents = Math.floor(totalStudents * 0.5);
    } else if (gpa_min > 7.0) {
      eligibleStudents = Math.floor(totalStudents * 0.7);
    } else {
      eligibleStudents = Math.floor(totalStudents * 0.85);
    }

    const percentage = Math.round((eligibleStudents / totalStudents) * 100);

    // TODO: Also return breakdown
    // - How many fail GPA requirement
    // - How many fail branch requirement
    // - How many lack required skills
    // - Recommended actions (e.g., "Schedule Python workshop")

    const breakdown = {
      gpa_failures: totalStudents - eligibleStudents,
      branch_mismatches: 0,
      skill_gaps: {
        Python: 15,
        React: 22,
        "System Design": 45
      }
    };

    const recommendedActions = [];
    if (breakdown.skill_gaps.Python > 10) {
      recommendedActions.push({
        type: "workshop",
        skill: "Python",
        affected_students: breakdown.skill_gaps.Python
      });
    }

    return NextResponse.json({
      eligible: eligibleStudents,
      total: totalStudents,
      percentage,
      breakdown,
      recommendedActions
    });
  } catch (error) {
    console.error("Error in eligibility forecast:", error);
    return NextResponse.json(
      { error: "Failed to calculate forecast" },
      { status: 500 }
    );
  }
}
