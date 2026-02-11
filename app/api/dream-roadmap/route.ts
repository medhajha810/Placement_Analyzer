import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Calculate Distance to Dream metric (0-100)
// 0 = Ready to apply, 100 = Very far from requirements
function calculateDistanceToDream(
  studentSkills: string[],
  studentGPA: number,
  requiredSkills: string[],
  preferredSkills: string[],
  minGPA: number
): number {
  let distance = 100;
  let matchedCount = 0;

  // Skill matching (70% weight)
  for (const required of requiredSkills) {
    if (studentSkills.some(s => s.toLowerCase().includes(required.toLowerCase()))) {
      matchedCount++;
    }
  }

  const totalRequired = requiredSkills.length || 1;
  const skillMatchPercentage = (matchedCount / totalRequired) * 100;
  
  // Lower distance = better match
  distance = 100 - (skillMatchPercentage * 0.7);

  // GPA factor (20% weight)
  if (studentGPA >= minGPA) {
    distance -= 20; // Bonus for meeting GPA
  } else {
    const gapPercentage = ((minGPA - studentGPA) / minGPA) * 100;
    distance += Math.min(gapPercentage * 0.3, 20);
  }

  // Preferred skills bonus (10% weight)
  let preferredCount = 0;
  for (const preferred of preferredSkills) {
    if (studentSkills.some(s => s.toLowerCase().includes(preferred.toLowerCase()))) {
      preferredCount++;
    }
  }
  if (preferredSkills.length > 0) {
    distance -= (preferredCount / preferredSkills.length) * 10;
  }

  // Ensure 0-100 range
  return Math.max(0, Math.min(100, Math.round(distance)));
}

// Generate AI-powered learning roadmap
async function generateLearningRoadmap(
  missingSkills: string[],
  companyName: string,
  targetRole: string
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `As a career advisor, create a learning roadmap for a student targeting ${companyName} - ${targetRole}.

Missing Skills: ${missingSkills.join(", ")}

Generate a JSON array of 3-5 actionable steps. Return ONLY valid JSON without markdown:
[
  {
    "action": "Learn [Skill]",
    "priority": "high/medium/low",
    "estimatedTime": "X weeks",
    "impact": "Will improve your distance score by Y points",
    "resources": ["resource1", "resource2"]
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    return JSON.parse(text);
  } catch (error) {
    console.error("AI roadmap generation failed:", error);
    
    // Fallback roadmap
    return missingSkills.slice(0, 3).map(skill => ({
      action: `Learn ${skill}`,
      priority: "high",
      estimatedTime: "2-4 weeks",
      impact: `Essential skill for ${companyName}`,
      resources: [
        `Search YouTube: ${skill} tutorial`,
        `Official ${skill} documentation`,
        `LeetCode practice for ${skill}`
      ]
    }));
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const studentId = searchParams.get("studentId");

    if (action === "get-dream-companies") {
      // TODO: Fetch from database
      // SELECT dc.*, csr.*, dcp.distance_to_dream, dcp.matched_skills, dcp.missing_skills
      // FROM dream_companies dc
      // JOIN company_skill_requirements csr ON dc.company_name = csr.company_name
      // LEFT JOIN dream_company_progress dcp ON dc.id = dcp.dream_company_id
      // WHERE dc.student_id = studentId
      // ORDER BY dc.priority

      const mockDreamCompanies = [
        {
          id: 1,
          companyName: "Google",
          targetRole: "SWE Intern",
          priority: 1,
          distanceToDream: 45,
          matchedSkills: ["Python", "Data Structures", "Algorithms"],
          missingSkills: ["System Design", "Java"],
          weakAreas: [],
          requiredSkills: ["Data Structures", "Algorithms", "System Design", "Python", "Java"],
          preferredSkills: ["Distributed Systems", "Machine Learning"],
          minGPA: 8.0,
          avgCTC: 25.0,
          codingDifficulty: "Hard",
          commonTopics: ["DP", "Graphs", "Trees", "System Design"],
          interviewPattern: "Google focuses heavily on DSA and problem-solving. Expect 2 coding rounds (Leetcode Hard) and 1 system design round.",
          addedAt: "2026-01-15"
        },
        {
          id: 2,
          companyName: "Amazon",
          targetRole: "SDE-1",
          priority: 2,
          distanceToDream: 30,
          matchedSkills: ["Python", "Java", "Data Structures", "Algorithms", "OOP"],
          missingSkills: ["AWS"],
          weakAreas: ["Microservices"],
          requiredSkills: ["Data Structures", "Algorithms", "OOP", "Java", "Python"],
          preferredSkills: ["AWS", "Microservices"],
          minGPA: 7.5,
          avgCTC: 18.0,
          codingDifficulty: "Medium",
          commonTopics: ["DP", "Trees", "Graphs", "Amazon Leadership Principles"],
          interviewPattern: "Amazon uses the STAR method for behavioral rounds. Coding rounds focus on Leetcode Medium with emphasis on DP and Trees.",
          addedAt: "2026-01-20"
        },
        {
          id: 3,
          companyName: "Microsoft",
          targetRole: "SWE",
          priority: 3,
          distanceToDream: 60,
          matchedSkills: ["Data Structures", "Algorithms"],
          missingSkills: ["C++", "System Design", "Azure"],
          weakAreas: [".NET"],
          requiredSkills: ["Data Structures", "Algorithms", "C++", "System Design"],
          preferredSkills: ["Azure", ".NET"],
          minGPA: 7.5,
          avgCTC: 22.0,
          codingDifficulty: "Medium",
          commonTopics: ["DP", "Arrays", "Strings", "Design Patterns"],
          interviewPattern: "Microsoft balances coding and design. Expect 2 DSA rounds (Leetcode Medium) and 1 low-level design round.",
          addedAt: "2026-02-01"
        }
      ];

      return NextResponse.json({ dreamCompanies: mockDreamCompanies });
    }

    if (action === "get-roadmap") {
      const dreamCompanyId = searchParams.get("dreamCompanyId");
      
      // TODO: Fetch from database
      // SELECT * FROM dream_company_progress WHERE dream_company_id = dreamCompanyId
      
      const mockRoadmap = {
        distanceToDream: 45,
        matchedSkills: ["Python", "Data Structures", "Algorithms"],
        missingSkills: ["System Design", "Java"],
        weakAreas: [],
        recommendedActions: [
          {
            action: "Learn System Design fundamentals",
            priority: "high",
            estimatedTime: "4-6 weeks",
            impact: "Will reduce distance by 20 points",
            resources: [
              "System Design Primer (GitHub)",
              "Gaurav Sen YouTube channel",
              "Design Patterns book"
            ]
          },
          {
            action: "Master Java programming",
            priority: "high",
            estimatedTime: "3-4 weeks",
            impact: "Will reduce distance by 15 points",
            resources: [
              "Java Official Documentation",
              "Effective Java by Joshua Bloch",
              "Practice on HackerRank"
            ]
          },
          {
            action: "Practice Leetcode Hard problems",
            priority: "medium",
            estimatedTime: "Ongoing",
            impact: "Essential for Google interviews",
            resources: [
              "Blind 75 list",
              "NeetCode.io",
              "LeetCode Premium"
            ]
          }
        ],
        milestones: [
          { title: "Complete System Design course", completed: false, dueDate: "2026-03-15" },
          { title: "Solve 50 Leetcode Medium problems", completed: false, dueDate: "2026-03-01" },
          { title: "Build 2 full-stack projects", completed: false, dueDate: "2026-03-30" }
        ]
      };

      return NextResponse.json({ roadmap: mockRoadmap });
    }

    if (action === "get-popular-companies") {
      // TODO: Fetch from database
      // SELECT * FROM popular_dream_companies LIMIT 10
      
      const mockPopularCompanies = [
        { companyName: "Google", targetRole: "SWE Intern", studentCount: 145, avgDistance: 52, readyStudents: 12 },
        { companyName: "Amazon", targetRole: "SDE-1", studentCount: 128, avgDistance: 38, readyStudents: 28 },
        { companyName: "Microsoft", targetRole: "SWE", studentCount: 112, avgDistance: 45, readyStudents: 18 },
        { companyName: "Meta", targetRole: "Software Engineer", studentCount: 98, avgDistance: 58, readyStudents: 8 },
        { companyName: "Flipkart", targetRole: "SDE-2", studentCount: 87, avgDistance: 35, readyStudents: 22 }
      ];

      return NextResponse.json({ popularCompanies: mockPopularCompanies });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching dream company data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dream company data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "add-dream-company") {
      const { studentId, companyName, targetRole } = body;

      // TODO: Validate max 3 companies
      // SELECT COUNT(*) FROM dream_companies WHERE student_id = studentId
      // If count >= 3, return error

      // TODO: Insert into database
      // INSERT INTO dream_companies (student_id, company_name, target_role, priority)
      // VALUES (studentId, companyName, targetRole, (current_count + 1))

      // Fetch company requirements
      // SELECT * FROM company_skill_requirements 
      // WHERE company_name = companyName AND job_title = targetRole

      // Fetch student profile
      // SELECT skills, gpa FROM students WHERE id = studentId

      // Calculate distance
      const mockStudentProfile = {
        skills: ["Python", "JavaScript", "Data Structures", "Algorithms"],
        gpa: 8.2
      };

      const mockCompanyRequirements = {
        requiredSkills: ["Data Structures", "Algorithms", "System Design", "Python", "Java"],
        preferredSkills: ["Distributed Systems", "Machine Learning"],
        minGPA: 8.0
      };

      const distance = calculateDistanceToDream(
        mockStudentProfile.skills,
        mockStudentProfile.gpa,
        mockCompanyRequirements.requiredSkills,
        mockCompanyRequirements.preferredSkills,
        mockCompanyRequirements.minGPA
      );

      // Find missing skills
      const matchedSkills = mockCompanyRequirements.requiredSkills.filter(req =>
        mockStudentProfile.skills.some(s => s.toLowerCase().includes(req.toLowerCase()))
      );

      const missingSkills = mockCompanyRequirements.requiredSkills.filter(req =>
        !mockStudentProfile.skills.some(s => s.toLowerCase().includes(req.toLowerCase()))
      );

      // Generate AI roadmap
      const roadmap = await generateLearningRoadmap(missingSkills, companyName, targetRole);

      // TODO: Insert progress record
      // INSERT INTO dream_company_progress (student_id, dream_company_id, distance_to_dream, matched_skills, missing_skills, recommended_actions)
      // VALUES (studentId, dreamCompanyId, distance, matchedSkills, missingSkills, roadmap)

      return NextResponse.json({
        success: true,
        message: "Dream company added successfully",
        dreamCompany: {
          id: Math.floor(Math.random() * 1000),
          companyName,
          targetRole,
          distanceToDream: distance,
          matchedSkills,
          missingSkills,
          recommendedActions: roadmap
        }
      });
    }

    if (action === "remove-dream-company") {
      const { dreamCompanyId } = body;

      // TODO: Delete from database
      // DELETE FROM dream_companies WHERE id = dreamCompanyId
      // This will cascade delete dream_company_progress

      return NextResponse.json({
        success: true,
        message: "Dream company removed successfully"
      });
    }

    if (action === "refresh-roadmap") {
      const { studentId, dreamCompanyId } = body;

      // TODO: Recalculate distance and regenerate roadmap
      // This should be called when student updates skills or completes learning

      // Fetch updated student profile
      // SELECT skills, gpa FROM students WHERE id = studentId

      // Fetch company requirements
      // SELECT * FROM company_skill_requirements ...

      // Recalculate distance
      const updatedDistance = 35; // Mock value

      // TODO: Update progress record
      // UPDATE dream_company_progress 
      // SET distance_to_dream = updatedDistance, last_calculated = NOW()
      // WHERE student_id = studentId AND dream_company_id = dreamCompanyId

      return NextResponse.json({
        success: true,
        newDistance: updatedDistance,
        message: "Roadmap refreshed"
      });
    }

    if (action === "mark-milestone-complete") {
      const { studentId, dreamCompanyId, milestoneTitle } = body;

      // TODO: Update milestone status in database
      // Could be stored in JSONB field in dream_company_progress

      // Award achievement points
      // INSERT INTO student_achievements (student_id, achievement_type, achievement_title, points_earned)
      // VALUES (studentId, 'milestone_complete', milestoneTitle, 25)

      return NextResponse.json({
        success: true,
        pointsEarned: 25,
        message: "Milestone marked complete! +25 points"
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing dream company request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
