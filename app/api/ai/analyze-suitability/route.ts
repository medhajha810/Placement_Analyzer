import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// AI-powered suitability analysis with Gemini
async function analyzeSuitability(studentProfile: any, driveDetails: any) {
  const { skills, gpa, projects, resume_text } = studentProfile;
  const { jd_text, required_skills, preferred_skills, eligibility_criteria } = driveDetails;

  let matchedSkills: string[] = [];
  let missingSkills: string[] = [];
  let score = 0;

  // Check GPA eligibility
  if (eligibility_criteria?.gpa_min && gpa >= eligibility_criteria.gpa_min) {
    score += 20;
  }

  // Match required skills
  for (const requiredSkill of required_skills || []) {
    if (skills?.some((s: string) => s.toLowerCase().includes(requiredSkill.toLowerCase()))) {
      matchedSkills.push(requiredSkill);
      score += 10;
    } else {
      missingSkills.push(requiredSkill);
    }
  }

  // Bonus for preferred skills
  for (const preferredSkill of preferred_skills || []) {
    if (skills?.some((s: string) => s.toLowerCase().includes(preferredSkill.toLowerCase()))) {
      matchedSkills.push(preferredSkill);
      score += 5;
    } else if (!missingSkills.includes(preferredSkill)) {
      missingSkills.push(preferredSkill);
    }
  }

  // Normalize score to 0-100
  score = Math.min(score, 100);

  // Use AI to generate personalized recommendation
  let recommendation = "";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `As a placement advisor, analyze this student's fit for a job:

Student Skills: ${skills?.join(", ") || "None listed"}
Student GPA: ${gpa}
Job Required Skills: ${required_skills?.join(", ")}
Match Score: ${score}/100
Missing Skills: ${missingSkills.join(", ")}

Provide a 2-sentence personalized recommendation. Be encouraging but honest.`;

    const result = await model.generateContent(prompt);
    recommendation = result.response.text();
  } catch (error) {
    console.error("AI recommendation failed:", error);
    recommendation = score >= 70 
      ? "Highly suitable! You have most required skills. Apply with confidence." 
      : score >= 50
      ? "Good match. Consider learning the missing skills to increase your chances."
      : "Focus on building the required skills first. You can become suitable with some effort.";
  }

  return {
    score,
    matchedSkills,
    missingSkills,
    recommendation
  };
}

async function generateLearningResources(skill: string) {
  // AI-powered resource generation with fallback to curated resources
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  try {
    const prompt = `Generate 3 best learning resources for "${skill}". 
Return ONLY valid JSON array without any markdown:
[
  {
    "type": "youtube",
    "title": "Best YouTube tutorial title",
    "url": "actual YouTube URL",
    "duration": "estimated time",
    "provider": "channel name"
  },
  {
    "type": "docs",
    "title": "Official documentation or blog",
    "url": "actual URL",
    "provider": "website name"
  },
  {
    "type": "course",
    "title": "Free course name",
    "url": "course URL",
    "duration": "estimated time",
    "provider": "platform name"
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const aiResources = JSON.parse(text);
    
    return aiResources;
  } catch (error) {
    console.error("AI resource generation failed, using fallback:", error);
    
    // Fallback curated resources
    const resourceMap: Record<string, any[]> = {
      Python: [
        {
          type: "youtube",
          title: "Python Full Course for Beginners",
          url: "https://youtube.com/watch?v=_uQrJ0TkZlc",
          duration: "4h 26m",
          provider: "Programming with Mosh"
        },
        {
          type: "docs",
          title: "Official Python Documentation",
          url: "https://docs.python.org/3/tutorial/",
          provider: "Python.org"
        }
      ],
      React: [
        {
          type: "youtube",
          title: "React Course - Beginner's Tutorial",
          url: "https://youtube.com/watch?v=bMknfKXIFA8",
          duration: "11h 55m",
          provider: "freeCodeCamp"
        },
        {
          type: "docs",
          title: "React Official Documentation",
          url: "https://react.dev/learn",
          provider: "React.dev"
        }
      ],
      "System Design": [
        {
          type: "youtube",
          title: "System Design Interview Course",
          url: "https://youtube.com/watch?v=F2FmTdLtb_4",
          duration: "2h 30m",
          provider: "Gaurav Sen"
        },
        {
          type: "docs",
          title: "System Design Primer",
          url: "https://github.com/donnemartin/system-design-primer",
          provider: "GitHub"
        }
      ]
  };

  return resourceMap[skill] || [
    {
      type: "youtube",
      title: `Learn ${skill}`,
      url: `https://youtube.com/results?search_query=learn+${encodeURIComponent(skill)}+tutorial`,
      provider: "YouTube Search"
    }
  ];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, driveId } = await request.json();

    // TODO: Fetch student profile and drive details from database
    const studentProfile = {
      resume_text: "Sample resume",
      skills: ["Python", "JavaScript", "React"],
      gpa: 8.5,
      projects: []
    };

    const driveDetails = {
      jd_text: "Looking for software engineers...",
      required_skills: ["Python", "React", "System Design"],
      preferred_skills: ["Docker", "AWS"],
      eligibility_criteria: { gpa_min: 7.5 }
    };

    // Run AI analysis
    const analysis = await analyzeSuitability(studentProfile, driveDetails);

    // Generate learning resources for missing skills
    const skillGaps = [];
    for (const skill of analysis.missingSkills) {
      const resources = await generateLearningResources(skill);
      skillGaps.push({
        skill,
        importance: "high",
        resources
      });
    }

    // TODO: Store analysis in database
    // INSERT INTO applications (student_id, drive_id, suitability_score, ai_recommendation)
    // VALUES (studentId, driveId, analysis.score, analysis.recommendation)
    
    // TODO: Create skill_gaps records
    // For each missing skill, INSERT INTO skill_gaps

    return NextResponse.json({
      success: true,
      analysis: {
        suitabilityScore: analysis.score,
        matchedSkills: analysis.matchedSkills,
        skillGaps,
        recommendation: analysis.recommendation
      }
    });
  } 
  catch (error) {
    console.error("Error analyzing suitability:", error);
    return NextResponse.json(
      { error: "Failed to analyze suitability" },
      { status: 500 }
    );
  }
}
