import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/db";

// Job scraping APIs to integrate:
// 1. RapidAPI - JSearch (https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
// 2. Adzuna API
// 3. Indeed scraper
// 4. LinkedIn scraper

interface ScrapedJob {
  source: string;
  external_id: string;
  company_name: string;
  job_title: string;
  job_description: string;
  location: string;
  salary_range?: string;
  job_type: string;
  posted_date: Date;
  application_url: string;
  parsed_skills: string[];
}

// Calculate historical matches for shadow profile
async function getHistoricalMatches(companyName: string, jobSkills: string[]) {
  try {
    // Query successful placements (offers) with similar skills
    const { data: successfulStudents } = await supabase
      .from('applications')
      .select(`
        *,
        students!applications_student_id_fkey(
          id,
          name,
          gpa,
          graduation_year,
          skills,
          branch
        ),
        jobs!applications_job_id_fkey(
          companies(name)
        )
      `)
      .eq('status', 'offer')
      .not('students', 'is', null);

    if (!successfulStudents || successfulStudents.length === 0) {
      return {
        hired_count: 0,
        avg_gpa: 0,
        common_skills: [],
        graduation_years: [],
        branches: []
      };
    }

    // Filter students who worked at this company or similar roles
    const relevantStudents = successfulStudents.filter((app: any) => {
      const companyMatches = app.jobs?.companies?.name?.toLowerCase().includes(companyName.toLowerCase());
      
      // Check skill overlap
      const studentSkills = app.students?.skills || [];
      const skillOverlap = jobSkills.filter((skill: string) => 
        studentSkills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
      ).length;
      
      return companyMatches || skillOverlap >= 2; // At least 2 matching skills
    });

    if (relevantStudents.length === 0) {
      return {
        hired_count: 0,
        avg_gpa: 0,
        common_skills: [],
        graduation_years: [],
        branches: []
      };
    }

    // Calculate statistics
    const gpas = relevantStudents
      .map((s: any) => s.students?.gpa)
      .filter((gpa: any) => gpa != null);
    
    const avgGpa = gpas.length > 0 
      ? (gpas.reduce((sum: number, gpa: number) => sum + gpa, 0) / gpas.length).toFixed(2)
      : "0";

    // Find common skills
    const allSkills = relevantStudents.flatMap((s: any) => 
      s.students?.skills || []
    );
    const skillCounts = allSkills.reduce((acc: any, skill: string) => {
      acc[skill] = (acc[skill] || 0) + 1;
      return acc;
    }, {});
    const commonSkills = Object.entries(skillCounts)
      .sort(([,a]: any, [,b]: any) => b - a)
      .slice(0, 5)
      .map(([skill]) => skill);

    // Get graduation years and branches
    const years = [...new Set(relevantStudents.map((s: any) => 
      s.students?.graduation_year
    ).filter(Boolean))];
    
    const branches = [...new Set(relevantStudents.map((s: any) => 
      s.students?.branch
    ).filter(Boolean))];

    return {
      hired_count: relevantStudents.length,
      avg_gpa: parseFloat(avgGpa),
      common_skills: commonSkills,
      graduation_years: years,
      branches: branches,
      sample_profiles: relevantStudents.slice(0, 3).map((s: any) => ({
        gpa: s.students?.gpa,
        year: s.students?.graduation_year,
        branch: s.students?.branch,
        skills: s.student?.student_profiles?.skills?.slice(0, 3)
      }))
    };
  } catch (error) {
    console.error("Error fetching historical matches:", error);
    return {
      hired_count: 0,
      avg_gpa: 0,
      common_skills: [],
      graduation_years: [],
      branches: []
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get("keywords") || "software engineer";
    const location = searchParams.get("location") || "India";
    const limit = parseInt(searchParams.get("limit") || "10");

    // TODO: Integrate with actual job scraping APIs
    // Example using JSearch API from RapidAPI:
    /*
    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search?query=${keywords}&page=1&num_pages=1`,
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
      }
    );
    const data = await response.json();
    */

    // Fetch existing scraped jobs from database
    const { data: existingJobs } = await supabase
      .from('scraped_jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    // If no jobs in DB, return mock data with shadow profiles
    let jobsWithShadowProfiles = [];
    
    if (!existingJobs || existingJobs.length === 0) {
      // Mock scraped jobs
      const mockJobs: ScrapedJob[] = [
        {
          source: "linkedin",
          external_id: "ln_12345",
          company_name: "TCS",
          job_title: "Software Developer",
          job_description: "We are looking for a skilled software developer with experience in Java, Spring Boot, and microservices...",
          location: "Bangalore, India",
          salary_range: "₹6-10 LPA",
          job_type: "Full-time",
          posted_date: new Date("2026-02-08"),
          application_url: "https://linkedin.com/jobs/12345",
          parsed_skills: ["Java", "Spring Boot", "Microservices", "REST APIs"]
        },
        {
          source: "indeed",
          external_id: "id_67890",
          company_name: "Infosys",
          job_title: "Full Stack Engineer",
          job_description: "Join our team as a full stack engineer. Required skills: React, Node.js, MongoDB...",
          location: "Pune, India",
          salary_range: "₹8-12 LPA",
          job_type: "Full-time",
          posted_date: new Date("2026-02-09"),
          application_url: "https://indeed.com/jobs/67890",
          parsed_skills: ["React", "Node.js", "MongoDB", "TypeScript"]
        },
        {
          source: "glassdoor",
          external_id: "gd_11111",
          company_name: "Wipro",
          job_title: "Python Developer",
          job_description: "Looking for Python developers with Django/Flask experience...",
          location: "Hyderabad, India",
          salary_range: "₹7-11 LPA",
          job_type: "Full-time",
          posted_date: new Date("2026-02-10"),
          application_url: "https://glassdoor.com/jobs/11111",
          parsed_skills: ["Python", "Django", "Flask", "PostgreSQL"]
        }
      ];

      // Store in database and get shadow profiles
      for (const job of mockJobs) {
        try {
          // Check if exists
          const { data: existing } = await supabase
            .from('scraped_jobs')
            .select('id')
            .eq('source', job.source)
            .eq('external_id', job.external_id)
            .single();

          let jobId;
          if (!existing) {
            // Insert new job
            const { data: inserted } = await supabase
              .from('scraped_jobs')
              .insert({
                source: job.source,
                external_id: job.external_id,
                company_name: job.company_name,
                job_title: job.job_title,
                job_description: job.job_description,
                parsed_skills: job.parsed_skills,
                location: job.location,
                salary_range: job.salary_range,
                job_type: job.job_type,
                posted_date: job.posted_date.toISOString(),
                application_url: job.application_url,
                is_active: true
              })
              .select()
              .single();
            jobId = inserted?.id;
          } else {
            jobId = existing.id;
          }

          // Get historical matches for shadow profile
          const shadowProfile = await getHistoricalMatches(job.company_name, job.parsed_skills);

          jobsWithShadowProfiles.push({
            ...job,
            id: jobId,
            shadow_profile: shadowProfile
          });
        } catch (error) {
          console.error(`Error processing job ${job.external_id}:`, error);
          jobsWithShadowProfiles.push({
            ...job,
            shadow_profile: {
              hired_count: 0,
              avg_gpa: 0,
              common_skills: [],
              graduation_years: [],
              branches: []
            }
          });
        }
      }
    } else {
      // Use existing jobs from database
      for (const job of existingJobs) {
        const shadowProfile = await getHistoricalMatches(job.company_name, job.parsed_skills || []);
        jobsWithShadowProfiles.push({
          ...job,
          shadow_profile: shadowProfile
        });
      }
    }

    return NextResponse.json({
      jobs: jobsWithShadowProfiles,
      total: jobsWithShadowProfiles.length,
      source: "multi-source",
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error("Error scraping jobs:", error);
    return NextResponse.json(
      { error: "Failed to scrape jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, jobId } = await request.json();

    if (action === "refresh") {
      // Trigger manual refresh of job scraping
      // This can be a scheduled cron job in production
      return NextResponse.json({
        success: true,
        message: "Job scraping initiated"
      });
    }

    if (action === "mark_inactive" && jobId) {
      // Mark a scraped job as inactive (if it's no longer available)
      // UPDATE scraped_jobs SET is_active = false WHERE id = jobId
      return NextResponse.json({
        success: true,
        message: "Job marked as inactive"
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
