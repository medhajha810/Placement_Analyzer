import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/auth";

// Function to extract skills from CV text (simple keyword matching)
function extractSkillsFromCV(cvText: string): string[] {
  const commonSkills = [
    "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Go", "Rust", "Swift", "Kotlin",
    "React", "Angular", "Vue", "Next.js", "Node.js", "Express", "Django", "Flask", "Spring Boot",
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "AWS", "Azure", "GCP", "Docker", "Kubernetes",
    "Git", "CI/CD", "Jenkins", "GitHub Actions", "Terraform", "Ansible",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-learn",
    "Data Structures", "Algorithms", "System Design", "REST API", "GraphQL", "Microservices",
    "HTML", "CSS", "Tailwind", "Bootstrap", "Material-UI", "SQL", "NoSQL",
    "Agile", "Scrum", "JIRA", "Linux", "Bash", "PowerShell"
  ];

  const foundSkills: string[] = [];
  const lowerCaseCV = cvText.toLowerCase();

  for (const skill of commonSkills) {
    if (lowerCaseCV.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  }

  return foundSkills;
}

// Calculate match percentage between student skills and job requirements
function calculateJobMatch(studentSkills: string[], jobRequiredSkills: string[]): number {
  if (jobRequiredSkills.length === 0) return 0;

  const studentSkillsLower = studentSkills.map(s => s.toLowerCase());
  const matchedSkills = jobRequiredSkills.filter(skill => 
    studentSkillsLower.includes(skill.toLowerCase())
  );

  return Math.round((matchedSkills.length / jobRequiredSkills.length) * 100);
}

// Analyze CV and return extracted information
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("cv") as File;
    const studentId = formData.get("studentId") as string;

    if (!file) {
      return NextResponse.json({ error: "CV file is required" }, { status: 400 });
    }

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Read file content
    const cvText = await file.text();
    
    // Extract skills from CV
    const extractedSkills = extractSkillsFromCV(cvText);

    // Get student's current profile
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Merge extracted skills with existing skills
    const currentSkills = student.skills || [];
    const allSkills = [...new Set([...currentSkills, ...extractedSkills])];

    // Update student profile with extracted skills
    const { error: updateError } = await supabase
      .from('students')
      .update({ 
        skills: allSkills,
        resume_url: file.name, // In production, upload to storage and save URL
        profile_completeness: calculateProfileCompleteness({
          ...student,
          skills: allSkills,
          resume_url: file.name
        })
      })
      .eq('id', studentId);

    if (updateError) {
      console.error("Error updating student profile:", updateError);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    // Get all available jobs
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .limit(50);

    // Calculate match percentage for each job
    const jobMatches = (jobs || []).map(job => {
      const requiredSkills = job.required_skills || [];
      const matchPercentage = calculateJobMatch(allSkills, requiredSkills);
      const missingSkills: string[] = requiredSkills.filter(skill => 
        !allSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      );

      return {
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.company_name || "Unknown",
        matchPercentage,
        missingSkills,
        requiredSkills,
        minGpa: job.min_gpa,
        isEligible: student.gpa >= (job.min_gpa || 0) && matchPercentage >= 50
      };
    });

    // Sort by match percentage
    jobMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Award points for completing profile
    const pointsEarned = 35;

    return NextResponse.json({
      success: true,
      message: "CV analyzed successfully",
      extractedSkills,
      totalSkills: allSkills.length,
      profileCompleteness: calculateProfileCompleteness({
        ...student,
        skills: allSkills,
        resume_url: file.name
      }),
      pointsEarned,
      jobMatches: jobMatches.slice(0, 10), // Top 10 matches
      topMatches: jobMatches.filter(j => j.matchPercentage >= 70).length,
      eligibleJobs: jobMatches.filter(j => j.isEligible).length
    });
  } catch (error) {
    console.error("Error analyzing CV:", error);
    return NextResponse.json(
      { error: "Failed to analyze CV" },
      { status: 500 }
    );
  }
}

// Calculate profile completeness percentage
function calculateProfileCompleteness(student: any): number {
  let completeness = 0;

  if (student.name) completeness += 10;
  if (student.email) completeness += 10;
  if (student.phone) completeness += 5;
  if (student.branch) completeness += 10;
  if (student.current_year) completeness += 5;
  if (student.graduation_year) completeness += 5;
  if (student.gpa) completeness += 10;
  if (student.skills && student.skills.length >= 3) completeness += 15;
  if (student.resume_url) completeness += 20;
  if (student.linkedin_url) completeness += 5;
  if (student.github_url) completeness += 5;

  return Math.min(completeness, 100);
}

// GET endpoint to fetch job matches for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    // Get student profile
    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', studentId)
      .single();

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const studentSkills = student.skills || [];

    // Get all available jobs
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .limit(50);

    // Calculate match percentage for each job
    const jobMatches = (jobs || []).map(job => {
      const requiredSkills = job.required_skills || [];
      const matchPercentage = calculateJobMatch(studentSkills, requiredSkills);
      interface JobMatch {
        jobId: string;
        jobTitle: string;
        companyName: string;
        matchPercentage: number;
        missingSkills: string[];
        requiredSkills: string[];
        minGpa: number;
        isEligible: boolean;
      }

      interface Student {
        id: string;
        name?: string;
        email?: string;
        phone?: string;
        branch?: string;
        current_year?: number;
        graduation_year?: number;
        gpa?: number;
        skills?: string[];
        resume_url?: string;
        linkedin_url?: string;
        github_url?: string;
      }

      interface Job {
        id: string;
        title: string;
        company_name?: string;
        required_skills?: string[];
        min_gpa?: number;
      }

      interface JobMatchResponse {
        success: boolean;
        studentSkills: string[];
        jobMatches: JobMatch[];
        topMatches: number;
        eligibleJobs: number;
      }

      return {
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.company_name || "Unknown",
        matchPercentage,
        missingSkills,
        requiredSkills,
        minGpa: job.min_gpa,
        isEligible: student.gpa >= (job.min_gpa || 0) && matchPercentage >= 50
      };
    });

    // Sort by match percentage
    jobMatches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    return NextResponse.json({
      success: true,
      studentSkills,
      jobMatches: jobMatches.slice(0, 20), // Top 20 matches
      topMatches: jobMatches.filter(j => j.matchPercentage >= 70).length,
      eligibleJobs: jobMatches.filter(j => j.isEligible).length
    });
  } catch (error) {
    console.error("Error fetching job matches:", error);
    return NextResponse.json(
      { error: "Failed to fetch job matches" },
      { status: 500 }
    );
  }
}
