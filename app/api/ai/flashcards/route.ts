import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface FlashCard {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: string;
}

// Generate flash cards from JD and company info
async function generateFlashCards(
  companyName: string,
  jobDescription: string,
  jobTitle: string
): Promise<FlashCard[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Generate 8-10 quick fact flash cards for last-minute interview prep for ${companyName}.

Job Title: ${jobTitle}
Job Description: ${jobDescription}

Create cards covering:
1. Company CEO/Founder (name)
2. Recent Funding/Valuation (if tech company)
3. Core Tech Stack (3-4 main technologies)
4. Key Products/Services
5. Company Mission/Vision
6. Recent News/Achievements
7. Company Culture Keywords
8. Interview Tips specific to this role

Format each as Q&A. Return ONLY valid JSON array without markdown:
[
  {
    "category": "Leadership",
    "question": "Who is the CEO?",
    "answer": "Name and brief bio",
    "icon": "👤"
  },
  {
    "category": "Tech Stack",
    "question": "What technologies do they use?",
    "answer": "React, Node.js, AWS, MongoDB",
    "icon": "💻"
  }
]

Use emojis for icons: 👤 (people), 💰 (money), 💻 (tech), 🎯 (mission), 📰 (news), 🏢 (company), 💡 (tips), 🚀 (products)`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const cards = JSON.parse(text);
    
    return cards.map((card: any, idx: number) => ({
      id: `card${idx + 1}`,
      ...card
    }));
  } catch (error) {
    console.error("Failed to generate flash cards:", error);
    
    // Fallback cards
    return [
      {
        id: "card1",
        category: "Company",
        question: `What does ${companyName} do?`,
        answer: "Research the company's main products and services before your interview.",
        icon: "🏢"
      },
      {
        id: "card2",
        category: "Role",
        question: "What is the job role?",
        answer: jobTitle,
        icon: "🎯"
      },
      {
        id: "card3",
        category: "Tech Stack",
        question: "What skills are required?",
        answer: "Check the job description for required technical skills.",
        icon: "💻"
      }
    ];
  }
}

// Generate company-specific interview tips
async function generateInterviewTips(
  companyName: string,
  jobTitle: string
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Generate 5 specific interview tips for applying to ${companyName} as a ${jobTitle}.

Focus on:
- Company-specific preparation advice
- What interviewers look for
- Common interview formats
- Cultural fit considerations
- Things to avoid

Return ONLY valid JSON array of strings without markdown:
["Tip 1", "Tip 2", "Tip 3", "Tip 4", "Tip 5"]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const tips = JSON.parse(text);
    
    return tips;
  } catch (error) {
    console.error("Failed to generate tips:", error);
    
    return [
      `Research ${companyName}'s recent projects and achievements`,
      "Prepare specific examples from your experience",
      "Practice explaining technical concepts clearly",
      "Prepare thoughtful questions about the role",
      "Be authentic and show genuine interest"
    ];
  }
}

// Generate quick company facts
async function generateCompanyFacts(companyName: string): Promise<{
  ceo: string;
  founded: string;
  headquarters: string;
  industry: string;
  employees: string;
  revenue: string;
  valuation: string;
  recentNews: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Provide key facts about ${companyName}. If you don't know exact information, provide realistic estimates or say "Not publicly available".

Return ONLY valid JSON without markdown:
{
  "ceo": "Name",
  "founded": "Year",
  "headquarters": "Location",
  "industry": "Industry",
  "employees": "Number or range",
  "revenue": "Amount or Not publicly available",
  "valuation": "Amount or Not publicly available",
  "recentNews": "Latest major announcement or achievement"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const facts = JSON.parse(text);
    
    return facts;
  } catch (error) {
    console.error("Failed to generate company facts:", error);
    
    return {
      ceo: "Research required",
      founded: "N/A",
      headquarters: "N/A",
      industry: "N/A",
      employees: "N/A",
      revenue: "Not publicly available",
      valuation: "Not publicly available",
      recentNews: "Check company website for latest news"
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, companyName, jobDescription, jobTitle } = await request.json();
    
    if (action === "generate-flashcards") {
      if (!companyName || !jobDescription || !jobTitle) {
        return NextResponse.json(
          { error: "Company name, job description, and job title are required" },
          { status: 400 }
        );
      }
      
      const [flashCards, tips, facts] = await Promise.all([
        generateFlashCards(companyName, jobDescription, jobTitle),
        generateInterviewTips(companyName, jobTitle),
        generateCompanyFacts(companyName)
      ]);
      
      return NextResponse.json({
        success: true,
        flashCards,
        tips,
        facts
      });
    }
    
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Flash cards error:", error);
    return NextResponse.json(
      { error: "Failed to generate flash cards" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driveId = searchParams.get("driveId");
    
    if (!driveId) {
      return NextResponse.json(
        { error: "Drive ID is required" },
        { status: 400 }
      );
    }

    // Fetch job/drive details from Supabase
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

    const { data: driveData, error: driveError } = await supabase
      .from("placement_drives")
      .select("id, job_title, jd_text, company_id")
      .eq("id", driveId)
      .single();

    if (driveError || !driveData) {
      // Fallback to mock data
      const mockDriveData = {
        company: { name: "TCS" },
        jobTitle: "Software Engineer",
        jobDescription: "We are looking for talented engineers to join our team as part of our expansion in the placement program..."
      };
      
      const [flashCards, tips, facts] = await Promise.all([
        generateFlashCards(
          mockDriveData.company.name,
          mockDriveData.jobDescription,
          mockDriveData.jobTitle
        ),
        generateInterviewTips(mockDriveData.company.name, mockDriveData.jobTitle),
        generateCompanyFacts(mockDriveData.company.name)
      ]);
      
      return NextResponse.json({
        success: true,
        company: mockDriveData.company.name,
        jobTitle: mockDriveData.jobTitle,
        flashCards,
        tips,
        facts
      });
    }

    // Get company name separately
    const { data: companyData } = await supabase
      .from("companies")
      .select("name")
      .eq("id", driveData.company_id)
      .single();

    const companyName = companyData?.name || "Unknown Company";
    const jobTitle = driveData.job_title || "Unknown Role";
    const jobDescription = driveData.jd_text || "No description available";
    
    const [flashCards, tips, facts] = await Promise.all([
      generateFlashCards(companyName, jobDescription, jobTitle),
      generateInterviewTips(companyName, jobTitle),
      generateCompanyFacts(companyName)
    ]);
    
    return NextResponse.json({
      success: true,
      company: companyName,
      jobTitle: jobTitle,
      flashCards,
      tips,
      facts
    });
  } catch (error) {
    console.error("Error fetching flash cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch flash cards" },
      { status: 500 }
    );
  }
}
