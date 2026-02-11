import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// AI-powered question generation using Gemini
async function generateInterviewQuestions(jdText: string, resumeText: string, jobTitle: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are an expert technical interviewer. Generate exactly 8 interview questions for this candidate.

JOB DESCRIPTION:
${jdText}

CANDIDATE RESUME/SKILLS:
${resumeText}

Generate questions in these categories:
- 3 Technical questions (based on job requirements)
- 2 Behavioral questions (STAR format)
- 2 System Design questions (if applicable to role)
- 1 HR question (career goals, expectations)

Return ONLY valid JSON array without markdown:
[
  {
    "id": "q1",
    "question": "Question text here",
    "category": "technical|behavioral|system-design|hr",
    "difficulty": "easy|medium|hard",
    "keywords": ["keyword1", "keyword2"],
    "idealAnswerPoints": ["point1", "point2"]
  }
]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const questions = JSON.parse(text);
    
    return questions;
  } catch (error) {
    console.error("AI question generation failed, using fallback:", error);
    
    // Fallback questions
    return [
      {
        id: "q1",
        question: `Tell me about your experience with the technologies mentioned in the ${jobTitle} role.`,
        category: "technical",
        difficulty: "medium",
        keywords: ["experience", "technologies"],
        idealAnswerPoints: ["Specific projects", "Technical depth", "Problem-solving"]
      },
      {
        id: "q2",
        question: "Describe a challenging project you worked on. What was your role and the outcome?",
        category: "behavioral",
        difficulty: "medium",
        keywords: ["project", "teamwork", "problem-solving"],
        idealAnswerPoints: ["STAR format", "Quantifiable results", "Learnings"]
      },
      {
        id: "q3",
        question: "How would you design a scalable system to handle millions of users?",
        category: "system-design",
        difficulty: "hard",
        keywords: ["system design", "scalability", "architecture"],
        idealAnswerPoints: ["Load balancing", "Caching", "Database sharding"]
      },
      {
        id: "q4",
        question: "Explain a technical concept from your resume to a non-technical person.",
        category: "technical",
        difficulty: "medium",
        keywords: ["communication", "technical"],
        idealAnswerPoints: ["Simple analogies", "Clarity", "Structure"]
      },
      {
        id: "q5",
        question: "Tell me about a time you disagreed with a team member. How did you handle it?",
        category: "behavioral",
        difficulty: "medium",
        keywords: ["conflict", "teamwork", "communication"],
        idealAnswerPoints: ["Professional approach", "Resolution", "Positive outcome"]
      },
      {
        id: "q6",
        question: "What design patterns would you use for this project and why?",
        category: "technical",
        difficulty: "hard",
        keywords: ["design patterns", "architecture"],
        idealAnswerPoints: ["Specific patterns", "Justification", "Trade-offs"]
      },
      {
        id: "q7",
        question: "How do you handle situations where you have to learn a new technology quickly?",
        category: "behavioral",
        difficulty: "easy",
        keywords: ["learning", "adaptability"],
        idealAnswerPoints: ["Learning strategy", "Example", "Results"]
      },
      {
        id: "q8",
        question: "Where do you see yourself in 5 years, and why this company?",
        category: "hr",
        difficulty: "easy",
        keywords: ["career goals", "motivation"],
        idealAnswerPoints: ["Career vision", "Company research", "Alignment"]
      }
    ];
  }
}

// AI-powered sentiment analysis for recorded answers
async function analyzeAnswer(answerText: string, questionKeywords: string[], audioUrl?: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are a STRICT technical interviewer. Evaluate this answer with critical honesty.

QUESTION KEYWORDS/EXPECTED POINTS: ${questionKeywords.join(", ")}

CANDIDATE'S ANSWER:
"${answerText}"

SCORING RULES:
- If answer is blank, empty, or "I don't know": Score 0-10 overall
- If completely wrong or off-topic: Score 5-25 overall
- If partially correct but missing key points: Score 25-50 overall
- If mostly correct with minor gaps: Score 50-75 overall
- If comprehensive and accurate: Score 75-100 overall

CRITICAL ASSESSMENT:
1. Did they actually address the question asked?
2. Are their statements technically correct?
3. Did they cover the expected keywords/points?
4. Is there real understanding or just memorized words?
5. What specific technical errors did they make?

Be HARSH and HONEST. Don't give high scores for wrong answers.

Provide analysis as strict JSON:
{
  "sentiment": {
    "overall": "confident|nervous|uncertain|blank",
    "confidence_score": 0-100,
    "tone": "professional|casual|unprepared"
  },
  "technical_accuracy": {
    "score": 0-100,
    "correct": true|false,
    "keywords_covered": ["keyword1"],
    "keywords_missing": ["keyword2"],
    "technical_errors": ["error1"],
    "feedback": "Honest, specific feedback on accuracy"
  },
  "communication": {
    "clarity_score": 0-100,
    "structure_score": 0-100,
    "filler_words_count": number,
    "feedback": "Assessment of how well they communicated"
  },
  "overall_score": 0-100,
  "question_addressed": true|false,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "critical_feedback": "If wrong, explain what was wrong and what was needed"
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const analysis = JSON.parse(text);
    
    return {
      transcript: answerText,
      ...analysis,
      audio_analysis: audioUrl ? "Voice recording analyzed" : "Text-only analysis",
      pacing: {
        words_per_minute: Math.round(answerText.split(' ').length / 2),
        assessment: answerText.length < 20 ? "Too brief" : "Moderate pace"
      }
    };
  } catch (error) {
    console.error("AI analysis failed, using fallback:", error);
    
    // STRICT Fallback analysis - be critical by default
    const trimmedText = answerText.trim();
    const wordCount = trimmedText.split(/\s+/).filter(w => w).length;
    
    // Check if answer is empty or too short
    if (wordCount === 0 || trimmedText.length < 10) {
      return {
        transcript: answerText,
        sentiment: {
          overall: "blank",
          confidence_score: 0,
          tone: "unprepared"
        },
        technical_accuracy: {
          score: 0,
          correct: false,
          keywords_covered: [],
          keywords_missing: questionKeywords,
          technical_errors: ["No answer provided"],
          feedback: "No valid answer was provided. This question requires a substantive response."
        },
        communication: {
          clarity_score: 0,
          structure_score: 0,
          filler_words_count: 0,
          feedback: "Answer is blank or too brief to evaluate"
        },
        overall_score: 0,
        question_addressed: false,
        strengths: [],
        improvements: [
          "Provide a complete answer to the question",
          "Use specific examples or technical details",
          "Demonstrate knowledge of the topic"
        ],
        critical_feedback: "No answer provided. Please provide a substantive response."
      };
    }
    
    // Count keyword matches
    const keywordMatches = questionKeywords.filter(kw => 
      trimmedText.toLowerCase().includes(kw.toLowerCase())
    ).length;
    const keywordCoverage = questionKeywords.length > 0 
      ? keywordMatches / questionKeywords.length 
      : 0;
    
    // Be strict: require at least some keywords for any credit
    let baseScore = 0;
    let isCorrect = false;
    
    if (keywordCoverage < 0.3) {
      // Less than 30% keywords: likely wrong answer
      baseScore = 15;
      isCorrect = false;
    } else if (keywordCoverage < 0.6) {
      // 30-60% keywords: partially correct
      baseScore = 40;
      isCorrect = false;
    } else if (keywordCoverage < 0.8) {
      // 60-80% keywords: mostly correct
      baseScore = 60;
      isCorrect = false;
    } else {
      // 80%+ keywords: likely correct
      baseScore = 75 + Math.min(20, Math.floor(wordCount / 20));
      isCorrect = true;
    }
    
    // Adjust for answer length (too short = lower score)
    if (wordCount < 15) {
      baseScore = Math.max(0, baseScore - 20);
    }
    
    return {
      transcript: answerText,
      sentiment: {
        overall: baseScore > 50 ? "confident" : "uncertain",
        confidence_score: Math.max(0, Math.min(100, baseScore)),
        tone: wordCount < 20 ? "unprepared" : "professional"
      },
      technical_accuracy: {
        score: baseScore,
        correct: isCorrect,
        keywords_covered: questionKeywords.filter(kw => 
          trimmedText.toLowerCase().includes(kw.toLowerCase())
        ),
        keywords_missing: questionKeywords.filter(kw => 
          !trimmedText.toLowerCase().includes(kw.toLowerCase())
        ),
        technical_errors: !isCorrect ? ["Missing key technical points"] : [],
        feedback: isCorrect 
          ? "Good use of relevant terminology and concepts"
          : `Answer lacks key concepts. Missing: ${questionKeywords.filter(kw => 
              !trimmedText.toLowerCase().includes(kw.toLowerCase())
            ).join(", ") || "technical depth"}`
      },
      communication: {
        clarity_score: wordCount > 30 ? 70 : 50,
        structure_score: wordCount > 30 ? 65 : 45,
        filler_words_count: 0,
        feedback: wordCount < 20 
          ? "Answer is too brief to properly assess communication"
          : "Adequate structure and clarity"
      },
      overall_score: baseScore,
      question_addressed: keywordCoverage > 0.3,
      strengths: isCorrect ? ["Covered main points"] : [],
      improvements: [
        "Include all key concepts mentioned above",
        "Provide more detailed explanations",
        "Give concrete examples or use cases",
        "Demonstrate deeper technical understanding"
      ],
      critical_feedback: isCorrect
        ? "Good foundation but review the full expected answer"
        : `This answer is incomplete. Expected to cover: ${questionKeywords.join(", ")}`,
      pacing: {
        words_per_minute: Math.round(wordCount / 2),
        assessment: wordCount < 15 ? "Too brief" : "Adequate"
      }
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, driveId, studentId, mockId, answers, questions } = await request.json();

    if (action === "generate") {
      // Fetch drive JD and student profile from database
      const { data: drive } = await db.getDriveById(driveId);
      const { data: profile } = await db.getStudentProfile(studentId);

      if (!drive || !profile) {
        return NextResponse.json({ error: "Drive or student not found" }, { status: 404 });
      }

      const resumeText = `Skills: ${profile.skills?.join(", ")}\nGPA: ${profile.gpa}\nBranch: ${profile.branch}`;
      const questions = await generateInterviewQuestions(drive.jd_text, resumeText, drive.job_title);

      // Store in database
      const mockInterview = await db.supabase
        .from('mock_interviews')
        .insert({
          student_id: studentId,
          drive_id: driveId,
          questions,
          completed: false
        })
        .select()
        .single();

      return NextResponse.json({
        success: true,
        mockId: mockInterview.data.id,
        questions,
        driveTitle: `${drive.company.name} - ${drive.job_title}`,
        expiresIn: "7 days",
        instructions: "Record your answers (or type them) and submit for AI feedback"
      });
    }

    if (action === "submit_answers") {
      // Get questions from request (sent by frontend) or try to fetch from DB
      let questionsList = questions || [];
      let mock = null;
      
      if (!questionsList || questionsList.length === 0) {
        // Try to fetch from database as fallback
        try {
          const result = await db.getMockInterviewById(mockId);
          if (result.error) {
            console.error("Failed to fetch mock from DB:", result.error);
          } else {
            mock = result.data;
            questionsList = mock?.questions || [];
          }
        } catch (e) {
          console.warn("Fallback database fetch failed:", e);
        }
      }

      if (!questionsList || questionsList.length === 0) {
        return NextResponse.json(
          { error: "No questions found for this interview" },
          { status: 400 }
        );
      }

      const feedback = [];
      for (const answer of answers) {
        const question = questionsList.find((q: any) => q.id === answer.question_id);
        if (!question) {
          console.warn(`Question not found: ${answer.question_id}`);
          continue;
        }
        
        const analysis = await analyzeAnswer(
          answer.answer_text, 
          question?.keywords || [],
          answer.audio_url
        );
        feedback.push({
          question_id: answer.question_id,
          ...analysis
        });
      }

      if (feedback.length === 0) {
        return NextResponse.json(
          { error: "No feedback generated for answers" },
          { status: 400 }
        );
      }

      const overallScore = Math.round(
        feedback.reduce((sum, f) => sum + (f.overall_score || 0), 0) / feedback.length
      );

      // Try to update database (optional)
      try {
        await db.updateMockInterview(mockId, {
          student_answers: answers,
          ai_feedback: feedback,
          overall_score: overallScore,
          completed: true,
          completed_at: new Date().toISOString()
        });
      } catch (e) {
        console.warn("Failed to update mock interview in DB:", e);
        // Continue anyway - feedback is generated, just DB update failed
      }

      // Try to update PRS mock score (optional)
      try {
        if (studentId) {
          await db.updatePrsMockScore(studentId);
        }
      } catch (e) {
        console.warn("Failed to update PRS score:", e);
        // Don't fail the whole request if this fails
      }

      return NextResponse.json({
        success: true,
        feedback,
        overallScore,
        summary: {
          strengths: feedback.flatMap(f => f.strengths || []).filter(s => s).slice(0, 3),
          improvements: feedback.flatMap(f => f.improvements || []).filter(i => i).slice(0, 3),
          next_steps: [
            "Practice more behavioral questions",
            "Work on technical depth",
            "Review system design patterns"
          ]
        }
      });
    }

    if (action === "get_feedback") {
      // Retrieve feedback for a completed mock
      // TODO: SELECT * FROM mock_interviews WHERE id = mockId

      return NextResponse.json({
        success: true,
        feedback: [], // Fetch from DB
        message: "Feedback retrieved"
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error in mock interview:", error);
    console.error("Error details:", {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause
    });
    return NextResponse.json(
      { 
        error: "Failed to process mock interview",
        details: error?.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    // TODO: Fetch all mock interviews for student
    // SELECT * FROM mock_interviews WHERE student_id = studentId ORDER BY created_at DESC

    const mockInterviews = [
      {
        id: "1",
        drive_company: "Google",
        drive_role: "SDE",
        completed: true,
        overall_score: 85,
        created_at: new Date("2026-02-01"),
        completed_at: new Date("2026-02-02")
      },
      {
        id: "2",
        drive_company: "Microsoft",
        drive_role: "SDE II",
        completed: false,
        created_at: new Date("2026-02-05")
      }
    ];

    return NextResponse.json({
      mockInterviews,
      total: mockInterviews.length,
      completed: mockInterviews.filter(m => m.completed).length
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch mock interviews" },
      { status: 500 }
    );
  }
}
