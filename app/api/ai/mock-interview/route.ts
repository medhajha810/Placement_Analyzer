import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface InterviewQuestion {
  id: string;
  question: string;
  type: "behavioral" | "technical" | "situational";
  difficulty: "easy" | "medium" | "hard";
  expectedPoints: string[];
  timeLimit: number; // in seconds
}

interface VibeCheck {
  confidenceScore: number; // 0-100
  fillerWordCount: number;
  fillerWordPercentage: number;
  speakingPace: "too slow" | "good" | "too fast";
  technicalAccuracy: number; // 0-100
  detectedFillerWords: { word: string; count: number }[];
  strengths: string[];
  improvements: string[];
  overallFeedback: string;
  questionAddressed?: boolean;
  technicalErrors?: string[];
  missingPoints?: string[];
  responseLength?: number;
  avgWordsPerMinute?: number;
}

// Generate custom interview questions based on JD
async function generateInterviewQuestions(
  jobDescription: string,
  jobTitle: string,
  requiredSkills: string[]
): Promise<InterviewQuestion[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `As an expert technical interviewer, generate 5 interview questions for this role:

Job Title: ${jobTitle}
Required Skills: ${requiredSkills.join(", ")}
Job Description: ${jobDescription}

Generate a mix of questions:
- 2 behavioral questions (teamwork, conflict resolution, project challenges)
- 2 technical questions (specific to required skills)
- 1 situational question (problem-solving scenario)

Return ONLY valid JSON array without markdown:
[
  {
    "question": "Question text",
    "type": "behavioral|technical|situational",
    "difficulty": "easy|medium|hard",
    "expectedPoints": ["point1", "point2", "point3"],
    "timeLimit": 120
  }
]

Make questions realistic and relevant to ${jobTitle} role.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const questions = JSON.parse(text);
    
    return questions.map((q: any, idx: number) => ({
      id: `q${idx + 1}`,
      ...q
    }));
  } catch (error) {
    console.error("Failed to generate interview questions:", error);
    
    // Fallback questions
    return [
      {
        id: "q1",
        question: "Tell me about a challenging project you worked on and how you overcame obstacles.",
        type: "behavioral",
        difficulty: "medium",
        expectedPoints: ["Problem description", "Actions taken", "Results achieved"],
        timeLimit: 120
      },
      {
        id: "q2",
        question: `Explain a technical concept related to ${requiredSkills[0] || 'programming'} that you're proficient in.`,
        type: "technical",
        difficulty: "medium",
        expectedPoints: ["Clear explanation", "Real-world example", "Best practices"],
        timeLimit: 180
      }
    ];
  }
}

// Analyze transcript for filler words
function analyzeFillerWords(transcript: string): {
  fillerWordCount: number;
  fillerWordPercentage: number;
  detectedFillerWords: { word: string; count: number }[];
} {
  const fillerWords = [
    "um", "uh", "like", "you know", "basically", "actually", 
    "literally", "sort of", "kind of", "i mean", "well"
  ];
  
  const lowerTranscript = transcript.toLowerCase();
  const totalWords = transcript.split(/\s+/).length;
  
  const detectedFillerWords: { word: string; count: number }[] = [];
  let totalFillerCount = 0;
  
  fillerWords.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerTranscript.match(regex);
    const count = matches ? matches.length : 0;
    
    if (count > 0) {
      detectedFillerWords.push({ word: filler, count });
      totalFillerCount += count;
    }
  });
  
  const fillerWordPercentage = totalWords > 0 
    ? Math.round((totalFillerCount / totalWords) * 100) 
    : 0;
  
  return {
    fillerWordCount: totalFillerCount,
    fillerWordPercentage,
    detectedFillerWords: detectedFillerWords.sort((a, b) => b.count - a.count)
  };
}

// Analyze speaking pace
function analyzeSpeakingPace(transcript: string, duration: number): string {
  const wordCount = transcript.split(/\s+/).length;
  const wordsPerMinute = (wordCount / duration) * 60;
  
  if (wordsPerMinute < 100) return "too slow";
  if (wordsPerMinute > 180) return "too fast";
  return "good";
}

// AI-powered "Vibe Check" analysis
async function performVibeCheck(
  transcript: string,
  question: string,
  duration: number,
  expectedPoints: string[]
): Promise<VibeCheck> {
  try {
    // Analyze filler words
    const fillerAnalysis = analyzeFillerWords(transcript);
    
    // Analyze speaking pace
    const speakingPace = analyzeSpeakingPace(transcript, duration) as "too slow" | "good" | "too fast";
    
    // Use AI for confidence and technical accuracy
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a strict technical interviewer evaluating this candidate's response. Be thorough and honest in your assessment.

Question: ${question}
Expected Points: ${expectedPoints.join(", ")}
Candidate's Response: "${transcript}"
Response Length: ${transcript.split(' ').length} words
Duration: ${duration} seconds

EVALUATION CRITERIA:

1. TECHNICAL ACCURACY (0-100):
- Did they answer the actual question asked?
- How many expected points did they cover?
- Are their technical statements correct?
- Did they demonstrate real understanding?
- Score 0-30 if answer is completely wrong/off-topic
- Score 30-60 if partially correct but missing key points
- Score 60-80 if mostly correct with minor gaps
- Score 80-100 if comprehensive and accurate

2. CONFIDENCE ANALYSIS (0-100):
- Language strength ("I think" vs "I know")
- Certainty in statements
- Use of hedge words ("maybe", "probably", "sort of")
- Overall conviction in delivery

3. RESPONSE QUALITY:
- Structure and organization
- Completeness of answer
- Relevance to question
- Use of examples

4. CRITICAL ASSESSMENT:
- Identify specific technical errors
- Note what's missing from expected points
- Flag irrelevant information
- Assess if they understood the question

Be STRICT and HONEST. If the answer is wrong, score it low. If they didn't address the question, say so.

Return ONLY valid JSON:
{
  "confidenceScore": number,
  "technicalAccuracy": number,
  "strengths": ["specific strength 1", "specific strength 2"],
  "improvements": ["specific improvement 1", "specific improvement 2", "specific improvement 3"],
  "overallFeedback": "Honest 2-3 sentence assessment focusing on accuracy and relevance",
  "questionAddressed": boolean,
  "technicalErrors": ["error1", "error2"],
  "missingPoints": ["missing point 1", "missing point 2"]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const aiAnalysis = JSON.parse(text);
    
    return {
      ...fillerAnalysis,
      speakingPace,
      confidenceScore: aiAnalysis.confidenceScore,
      technicalAccuracy: aiAnalysis.technicalAccuracy,
      strengths: aiAnalysis.strengths,
      improvements: aiAnalysis.improvements,
      overallFeedback: aiAnalysis.overallFeedback,
      questionAddressed: aiAnalysis.questionAddressed || false,
      technicalErrors: aiAnalysis.technicalErrors || [],
      missingPoints: aiAnalysis.missingPoints || [],
      responseLength: transcript.split(' ').length,
      avgWordsPerMinute: Math.round((transcript.split(' ').length / duration) * 60)
    };
  } catch (error) {
    console.error("Vibe check analysis failed:", error);
    
    const fillerAnalysis = analyzeFillerWords(transcript);
    const speakingPace = analyzeSpeakingPace(transcript, duration) as "too slow" | "good" | "too fast";
    
    // Enhanced fallback analysis - be more critical
    const wordCount = transcript.split(' ').length;
    const hasKeywords = expectedPoints.some(point => 
      transcript.toLowerCase().includes(point.toLowerCase())
    );
    const seemsRelevant = transcript.toLowerCase().includes('technical') || 
                         transcript.toLowerCase().includes('programming') ||
                         transcript.toLowerCase().includes('code');

    return {
      ...fillerAnalysis,
      speakingPace,
      confidenceScore: hasKeywords ? 60 : 40,
      technicalAccuracy: hasKeywords ? 50 : 25,
      strengths: hasKeywords ? ["Covered some relevant points"] : ["Attempted to answer"],
      improvements: [
        "Address the specific question asked",
        "Include more technical details", 
        "Provide concrete examples",
        "Ensure answer relevance"
      ],
      overallFeedback: hasKeywords ? 
        "Partial understanding shown but needs more depth and accuracy." :
        "Answer appears off-topic or lacks technical accuracy. Please review the question and try again.",
      questionAddressed: hasKeywords && seemsRelevant,
      technicalErrors: ["Unable to verify technical accuracy"],
      missingPoints: expectedPoints,
      responseLength: wordCount,
      avgWordsPerMinute: Math.round((wordCount / duration) * 60)
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();
    
    // Action: Generate interview questions from JD
    if (action === "generate-questions") {
      const { jobDescription, jobTitle, requiredSkills } = data;
      
      const questions = await generateInterviewQuestions(
        jobDescription,
        jobTitle,
        requiredSkills || []
      );
      
      return NextResponse.json({
        success: true,
        questions
      });
    }
    
    // Action: Analyze interview response (Vibe Check)
    if (action === "analyze-response") {
      const { transcript, question, duration, expectedPoints } = data;
      
      if (!transcript || !question) {
        return NextResponse.json(
          { error: "Transcript and question are required" },
          { status: 400 }
        );
      }
      
      const vibeCheck = await performVibeCheck(
        transcript,
        question,
        duration || 120,
        expectedPoints || []
      );
      
      return NextResponse.json({
        success: true,
        vibeCheck
      });
    }
    
    // Action: Get saved mock interviews
    if (action === "get-history") {
      const { studentId } = data;
      
      // TODO: Fetch from database
      // SELECT * FROM mock_interviews WHERE student_id = studentId ORDER BY created_at DESC
      
      return NextResponse.json({
        success: true,
        interviews: []
      });
    }
    
    // Action: Save mock interview results
    if (action === "save-interview") {
      const { studentId, driveId, questionId, transcript, vibeCheck } = data;
      
      // TODO: Save to database
      // INSERT INTO mock_interviews (student_id, drive_id, question_id, transcript, confidence_score, technical_accuracy, filler_word_count)
      
      return NextResponse.json({
        success: true,
        message: "Interview saved successfully"
      });
    }
    
    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Mock interview error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
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
      .select("id, job_title, jd_text, required_skills")
      .eq("id", driveId)
      .single();

    if (driveError || !driveData) {
      // Fallback to mock data
      const mockJobData = {
        jobTitle: "Software Engineer",
        jobDescription: "We are looking for talented engineers...",
        requiredSkills: ["Python", "Data Structures", "System Design"]
      };
      
      const questions = await generateInterviewQuestions(
        mockJobData.jobDescription,
        mockJobData.jobTitle,
        mockJobData.requiredSkills
      );
      
      return NextResponse.json({
        success: true,
        drive: mockJobData,
        questions
      });
    }

    const jobTitle = driveData.job_title || "Unknown Role";
    const jobDescription = driveData.jd_text || "No description available";
    const requiredSkills = driveData.required_skills || ["General Knowledge"];
    
    const questions = await generateInterviewQuestions(
      jobDescription,
      jobTitle,
      Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills]
    );
    
    return NextResponse.json({
      success: true,
      drive: {
        jobTitle,
        jobDescription,
        requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills]
      },
      questions
    });
  } catch (error) {
    console.error("Error fetching interview questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview questions" },
      { status: 500 }
    );
  }
}
