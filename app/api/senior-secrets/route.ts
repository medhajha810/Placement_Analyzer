import { NextRequest, NextResponse } from "next/server";

interface InterviewExperience {
  id: string;
  company_name: string;
  job_title: string;
  job_type: string;
  total_rounds: number;
  interview_date: string;
  offer_received: boolean;
  student_branch?: string;
  student_gpa?: number;
  graduation_year: number;
  helpful_count: number;
  view_count: number;
  created_at: string;
  rounds: InterviewRound[];
  tags: string[];
}

interface InterviewRound {
  id: string;
  round_number: number;
  round_name: string;
  round_type: string;
  duration_minutes: number;
  difficulty: string;
  questions_asked: string;
  topics_covered: string;
  coding_problems?: string;
  behavioral_questions?: string;
  preparation_tips: string;
  what_went_well?: string;
  what_could_improve?: string;
  leetcode_difficulty?: string;
  dsa_topics: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const company = searchParams.get("company");
    const experienceId = searchParams.get("id");
    
    // Action: Get single experience with full details
    if (action === "get-experience" && experienceId) {
      // TODO: Fetch from database
      // SELECT * FROM interview_experiences WHERE id = experienceId
      // SELECT * FROM interview_rounds WHERE experience_id = experienceId ORDER BY round_number
      // SELECT tag FROM experience_tags WHERE experience_id = experienceId
      // Call increment_view_count(experienceId)
      
      const mockExperience: InterviewExperience = {
        id: experienceId,
        company_name: "Amazon",
        job_title: "SDE-1",
        job_type: "Full-time",
        total_rounds: 5,
        interview_date: "2025-08-15",
        offer_received: true,
        student_branch: "Computer Science",
        student_gpa: 8.5,
        graduation_year: 2025,
        helpful_count: 42,
        view_count: 385,
        created_at: "2025-08-20T10:00:00Z",
        rounds: [
          {
            id: "r1",
            round_number: 1,
            round_name: "Online Coding Test",
            round_type: "coding",
            duration_minutes: 90,
            difficulty: "hard",
            questions_asked: "Solve 2 DSA problems in 90 minutes",
            topics_covered: "Dynamic Programming, Trees",
            coding_problems: "1. Maximum Subarray Sum (Kadane's Algorithm) 2. Lowest Common Ancestor in Binary Tree",
            preparation_tips: "Focus heavily on DP and Tree problems. Practice Leetcode Medium/Hard for 2 weeks.",
            leetcode_difficulty: "medium",
            dsa_topics: ["Dynamic Programming", "Trees", "Binary Search"]
          },
          {
            id: "r2",
            round_number: 2,
            round_name: "Technical Round 1",
            round_type: "technical",
            duration_minutes: 60,
            difficulty: "medium",
            questions_asked: "Solve a Leetcode Medium live, then explain system design",
            topics_covered: "Data Structures, System Design Basics",
            coding_problems: "Design a URL Shortener + Implement LRU Cache",
            preparation_tips: "Be ready to code on a whiteboard or shared editor. Explain your thought process clearly.",
            leetcode_difficulty: "medium",
            dsa_topics: ["Hashing", "Design Patterns", "Caching"]
          }
        ],
        tags: ["leetcode", "system-design", "high-difficulty", "coding-heavy"]
      };
      
      return NextResponse.json({
        success: true,
        experience: mockExperience
      });
    }
    
    // Action: Search experiences
    if (action === "search") {
      const jobTitle = searchParams.get("jobTitle");
      const roundType = searchParams.get("roundType");
      const difficulty = searchParams.get("difficulty");
      const tag = searchParams.get("tag");
      const limit = parseInt(searchParams.get("limit") || "20");
      const offset = parseInt(searchParams.get("offset") || "0");
      
      // TODO: Build dynamic query based on filters
      // SELECT * FROM interview_experiences
      // WHERE company_name ILIKE '%company%'
      // AND (jobTitle IS NULL OR job_title ILIKE '%jobTitle%')
      // ORDER BY helpful_count DESC, created_at DESC
      // LIMIT limit OFFSET offset
      
      const mockResults: InterviewExperience[] = [
        {
          id: "exp1",
          company_name: "Amazon",
          job_title: "SDE-1",
          job_type: "Full-time",
          total_rounds: 5,
          interview_date: "2025-08-15",
          offer_received: true,
          student_branch: "Computer Science",
          student_gpa: 8.5,
          graduation_year: 2025,
          helpful_count: 42,
          view_count: 385,
          created_at: "2025-08-20T10:00:00Z",
          rounds: [],
          tags: ["leetcode", "system-design"]
        },
        {
          id: "exp2",
          company_name: "Microsoft",
          job_title: "Software Engineer",
          job_type: "Full-time",
          total_rounds: 4,
          interview_date: "2025-07-20",
          offer_received: true,
          student_branch: "IT",
          student_gpa: 8.2,
          graduation_year: 2025,
          helpful_count: 38,
          view_count: 310,
          created_at: "2025-07-25T14:00:00Z",
          rounds: [],
          tags: ["system-design", "coding-heavy"]
        }
      ];
      
      return NextResponse.json({
        success: true,
        experiences: mockResults,
        total: mockResults.length,
        hasMore: false
      });
    }
    
    // Action: Get popular companies
    if (action === "popular-companies") {
      // TODO: SELECT * FROM popular_companies LIMIT 10
      
      const mockCompanies = [
        { company_name: "Amazon", experience_count: 15, offer_rate: 65.5, avg_rounds: 4.8 },
        { company_name: "Microsoft", experience_count: 12, offer_rate: 58.3, avg_rounds: 4.2 },
        { company_name: "Google", experience_count: 10, offer_rate: 40.0, avg_rounds: 5.1 },
        { company_name: "TCS", experience_count: 25, offer_rate: 85.0, avg_rounds: 2.5 }
      ];
      
      return NextResponse.json({
        success: true,
        companies: mockCompanies
      });
    }
    
    // Action: Get trending topics
    if (action === "trending-topics") {
      // TODO: SELECT * FROM trending_topics
      
      const mockTopics = [
        { topic: "Dynamic Programming", mention_count: 45 },
        { topic: "Trees", mention_count: 38 },
        { topic: "Graphs", mention_count: 32 },
        { topic: "System Design", mention_count: 28 },
        { topic: "Hashing", mention_count: 25 }
      ];
      
      return NextResponse.json({
        success: true,
        topics: mockTopics
      });
    }
    
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Senior's Secret API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();
    
    // Action: Submit new experience
    if (action === "submit-experience") {
      const {
        companyName,
        jobTitle,
        jobType,
        totalRounds,
        interviewDate,
        offerReceived,
        studentBranch,
        studentGpa,
        graduationYear,
        rounds,
        tags
      } = data;
      
      // Validation
      if (!companyName || !jobTitle || !totalRounds || !rounds || rounds.length === 0) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }
      
      // TODO: Insert into database
      // BEGIN TRANSACTION
      // INSERT INTO interview_experiences (...) RETURNING id
      // FOR EACH round: INSERT INTO interview_rounds (experience_id, ...)
      // FOR EACH tag: INSERT INTO experience_tags (experience_id, tag)
      // COMMIT
      
      const experienceId = "new-exp-id";
      
      return NextResponse.json({
        success: true,
        experienceId,
        message: "Thank you for sharing your experience! It will help juniors prepare better."
      });
    }
    
    // Action: Mark experience as helpful
    if (action === "mark-helpful") {
      const { experienceId, ipAddress } = data;
      
      if (!experienceId) {
        return NextResponse.json(
          { error: "Experience ID is required" },
          { status: 400 }
        );
      }
      
      // TODO: Call increment_helpful_count function
      // SELECT increment_helpful_count(experienceId, ipAddress)
      
      return NextResponse.json({
        success: true,
        message: "Marked as helpful"
      });
    }
    
    // Action: Report inappropriate content
    if (action === "report-experience") {
      const { experienceId, reason } = data;
      
      // TODO: Store report for admin review
      // INSERT INTO experience_reports (experience_id, reason, ip_address)
      
      return NextResponse.json({
        success: true,
        message: "Report submitted. Admins will review this content."
      });
    }
    
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Senior's Secret API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
