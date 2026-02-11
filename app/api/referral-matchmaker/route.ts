import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const studentId = searchParams.get("studentId");

    if (action === "get-referrals") {
      const company = searchParams.get("company");
      const jobType = searchParams.get("jobType");
      const minScore = searchParams.get("minScore");

      // TODO: Fetch from database with filters
      // SELECT rb.*, 
      //   (rb.max_referrals - rb.current_referrals) as slots_available
      // FROM referral_board rb
      // WHERE rb.is_active = TRUE 
      //   AND rb.expires_at > NOW()
      //   AND (company_name ILIKE '%' || company || '%' OR company IS NULL)
      //   AND (job_type = jobType OR jobType IS NULL)
      //   AND (min_suitability_score <= studentSuitabilityScore)
      // ORDER BY rb.created_at DESC

      const mockReferrals = [
        {
          id: 1,
          postedByName: "Rahul (2023 Grad)",
          companyName: "Amazon",
          jobTitle: "SDE-1",
          jobType: "Full-time",
          jobDescription: "Hiring for AWS team. Great learning opportunity with exposure to distributed systems.",
          requiredSkills: ["Java", "Python", "Data Structures", "Algorithms"],
          preferredSkills: ["AWS", "Microservices"],
          minGPA: 7.5,
          minSuitabilityScore: 65,
          graduationYear: 2025,
          referralLink: "mailto:rahul.referral@amazon.com",
          applicationDeadline: "2026-03-15",
          maxReferrals: 3,
          currentReferrals: 1,
          slotsAvailable: 2,
          tags: ["high-paying", "product-based"],
          createdAt: "2026-02-01",
          expiresAt: "2026-03-15"
        },
        {
          id: 2,
          postedByName: "Priya M. (2022 Grad)",
          companyName: "Google",
          jobTitle: "SWE Intern",
          jobType: "Internship",
          jobDescription: "Summer internship for 2026. Work on Google Maps team in Bangalore.",
          requiredSkills: ["Python", "Data Structures", "Algorithms"],
          preferredSkills: ["Machine Learning", "Android"],
          minGPA: 8.0,
          minSuitabilityScore: 75,
          graduationYear: 2026,
          referralLink: "https://forms.google.com/referral-xyz",
          applicationDeadline: "2026-02-28",
          maxReferrals: 5,
          currentReferrals: 3,
          slotsAvailable: 2,
          tags: ["dream-company", "internship", "high-ctc"],
          createdAt: "2026-01-20",
          expiresAt: "2026-02-28"
        },
        {
          id: 3,
          postedByName: "Anonymous Senior",
          companyName: "Microsoft",
          jobTitle: "SDE-2",
          jobType: "Full-time",
          jobDescription: "Looking for backend engineers for Azure team. 2+ years experience preferred but freshers can apply.",
          requiredSkills: ["C#", ".NET", "Azure", "System Design"],
          preferredSkills: ["Kubernetes", "Docker"],
          minGPA: 7.0,
          minSuitabilityScore: 60,
          graduationYear: 2024,
          referralLink: "https://careers.microsoft.com/referral/123",
          applicationDeadline: "2026-04-01",
          maxReferrals: 2,
          currentReferrals: 0,
          slotsAvailable: 2,
          tags: ["remote-friendly", "fast-hiring"],
          createdAt: "2026-02-05",
          expiresAt: "2026-04-01"
        },
        {
          id: 4,
          postedByName: "Arjun K. (Alumni)",
          companyName: "Flipkart",
          jobTitle: "SDE-1",
          jobType: "Full-time",
          jobDescription: "Backend role in supply chain team. Strong Java required. Competitive salary.",
          requiredSkills: ["Java", "Spring Boot", "SQL", "REST APIs"],
          preferredSkills: ["Kafka", "Redis"],
          minGPA: 7.0,
          minSuitabilityScore: 55,
          graduationYear: 2025,
          referralLink: "mailto:arjun.kumar@flipkart.com",
          applicationDeadline: "2026-03-30",
          maxReferrals: 4,
          currentReferrals: 2,
          slotsAvailable: 2,
          tags: ["product-based", "good-wlb"],
          createdAt: "2026-01-25",
          expiresAt: "2026-03-30"
        },
        {
          id: 5,
          postedByName: "Neha S. (2021 Grad)",
          companyName: "Atlassian",
          jobTitle: "Software Engineer",
          jobType: "Full-time",
          jobDescription: "Join the Jira team! Great culture and work-life balance. Sydney or Bangalore location.",
          requiredSkills: ["Java", "JavaScript", "React", "System Design"],
          preferredSkills: ["GraphQL", "TypeScript"],
          minGPA: 7.5,
          minSuitabilityScore: 70,
          graduationYear: 2025,
          referralLink: "https://atlassian.com/referral/neha",
          applicationDeadline: "2026-03-20",
          maxReferrals: 3,
          currentReferrals: 1,
          slotsAvailable: 2,
          tags: ["great-culture", "international"],
          createdAt: "2026-02-03",
          expiresAt: "2026-03-20"
        }
      ];

      // Calculate suitability match for each referral
      // TODO: Get student's actual skills and calculate match
      const mockStudentSkills = ["Python", "Java", "Data Structures", "Algorithms", "React"];
      const mockStudentGPA = 8.2;

      const referralsWithMatch = mockReferrals.map(referral => {
        const matchedSkills = referral.requiredSkills.filter(req =>
          mockStudentSkills.some(s => s.toLowerCase().includes(req.toLowerCase()))
        );
        
        const suitabilityScore = Math.min(
          (matchedSkills.length / referral.requiredSkills.length) * 100,
          100
        );

        const meetsGPA = mockStudentGPA >= referral.minGPA;
        const meetsMinScore = suitabilityScore >= referral.minSuitabilityScore;
        const isEligible = meetsGPA && meetsMinScore && referral.slotsAvailable > 0;

        return {
          ...referral,
          matchedSkills,
          suitabilityScore: Math.round(suitabilityScore),
          meetsGPA,
          meetsMinScore,
          isEligible
        };
      });

      return NextResponse.json({ referrals: referralsWithMatch });
    }

    if (action === "get-my-applications") {
      // TODO: Fetch from database
      // SELECT ra.*, rb.company_name, rb.job_title, rb.posted_by_name
      // FROM referral_applications ra
      // JOIN referral_board rb ON ra.referral_id = rb.id
      // WHERE ra.student_id = studentId
      // ORDER BY ra.applied_at DESC

      const mockApplications = [
        {
          id: 1,
          referralId: 2,
          companyName: "Google",
          jobTitle: "SWE Intern",
          postedByName: "Priya M. (2022 Grad)",
          suitabilityScore: 85,
          status: "applied",
          appliedAt: "2026-02-08",
          notes: "Excited to work on Google Maps!"
        }
      ];

      return NextResponse.json({ applications: mockApplications });
    }

    if (action === "get-stats") {
      // TODO: Fetch from database
      // SELECT 
      //   COUNT(*) as total_referrals,
      //   COUNT(CASE WHEN is_active = TRUE AND expires_at > NOW() THEN 1 END) as active_referrals,
      //   SUM(max_referrals - current_referrals) as total_slots,
      //   COUNT(DISTINCT company_name) as companies_count
      // FROM referral_board

      const mockStats = {
        totalReferrals: 25,
        activeReferrals: 18,
        totalSlots: 42,
        companiesCount: 15,
        myApplications: 3,
        avgMatchScore: 72
      };

      return NextResponse.json({ stats: mockStats });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    return NextResponse.json(
      { error: "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "post-referral") {
      const {
        postedByEmail,
        postedByName,
        companyName,
        jobTitle,
        jobType,
        jobDescription,
        requiredSkills,
        preferredSkills,
        minGPA,
        minSuitabilityScore,
        graduationYear,
        referralLink,
        applicationDeadline,
        maxReferrals,
        tags
      } = body;

      // Validate required fields
      if (!companyName || !jobTitle || !requiredSkills || !referralLink) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // TODO: Insert into database
      // INSERT INTO referral_board (
      //   posted_by_email, posted_by_name, company_name, job_title, 
      //   job_type, job_description, required_skills, preferred_skills,
      //   min_gpa, min_suitability_score, graduation_year, referral_link,
      //   application_deadline, max_referrals, tags, expires_at
      // ) VALUES (...)

      return NextResponse.json({
        success: true,
        message: "Referral posted successfully",
        referralId: Math.floor(Math.random() * 1000)
      });
    }

    if (action === "apply-referral") {
      const { studentId, referralId, notes } = body;

      // TODO: Check if student already applied
      // SELECT * FROM referral_applications 
      // WHERE student_id = studentId AND referral_id = referralId

      // TODO: Check if referral is full
      // SELECT current_referrals, max_referrals FROM referral_board WHERE id = referralId

      // TODO: Calculate suitability score
      // Get student skills and referral requirements, calculate match

      // TODO: Insert application
      // INSERT INTO referral_applications (referral_id, student_id, suitability_score, notes)
      // VALUES (referralId, studentId, calculatedScore, notes)

      // TODO: Increment referral count (handled by trigger in database)

      return NextResponse.json({
        success: true,
        message: "Application submitted successfully",
        applicationId: Math.floor(Math.random() * 1000)
      });
    }

    if (action === "update-application-status") {
      const { applicationId, status } = body;

      // TODO: Update in database (only alumni who posted can update)
      // UPDATE referral_applications 
      // SET status = status
      // WHERE id = applicationId

      return NextResponse.json({
        success: true,
        message: "Status updated successfully"
      });
    }

    if (action === "deactivate-referral") {
      const { referralId } = body;

      // TODO: Update in database (only poster can deactivate)
      // UPDATE referral_board 
      // SET is_active = FALSE
      // WHERE id = referralId

      return NextResponse.json({
        success: true,
        message: "Referral deactivated"
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing referral request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
