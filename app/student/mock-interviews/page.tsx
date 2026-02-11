"use client";

import { useState, useEffect } from "react";
import StudentSidebarLayout from "@/components/student-sidebar-layout";
import VoiceRecorder from "@/components/voice-recorder";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  GraduationCap, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Clock,
  Award,
  Lightbulb
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  keywords: string[];
  idealAnswerPoints?: string[];
}

interface MockInterview {
  id: string;
  questions: Question[];
  driveTitle: string;
}

export default function MockInterviewsPage() {
  const [drives, setDrives] = useState<any[]>([]);
  const [selectedDrive, setSelectedDrive] = useState<string | null>(null);
  const [currentMock, setCurrentMock] = useState<MockInterview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"select" | "interview" | "results">("select");

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await fetch("/api/admin/drives");
      const data = await response.json();
      if (data.drives && data.drives.length > 0) {
        setDrives(data.drives);
      } else {
        // Add sample drives if none exist
        const sampleDrives = [
          {
            id: "1",
            company_name: "Google",
            job_title: "Software Engineer",
            drive_date: "2026-03-15",
            description: "Full Stack Developer position with focus on React and Node.js"
          },
          {
            id: "2", 
            company_name: "Microsoft",
            job_title: "Frontend Developer",
            drive_date: "2026-03-20",
            description: "Frontend Developer role working with modern JavaScript frameworks"
          },
          {
            id: "3",
            company_name: "Amazon",
            job_title: "Backend Developer",
            drive_date: "2026-03-25",
            description: "Backend Developer position focusing on scalable web services"
          },
          {
            id: "4",
            company_name: "Meta",
            job_title: "Full Stack Engineer",
            drive_date: "2026-04-01",
            description: "Full Stack Engineer role with React and Python"
          }
        ];
        setDrives(sampleDrives);
      }
    } catch (error) {
      console.error("Failed to fetch drives:", error);
      // Fallback to sample drives on error
      const sampleDrives = [
        {
          id: "1",
          company_name: "Google",
          job_title: "Software Engineer",
          drive_date: "2026-03-15",
          description: "Full Stack Developer position with focus on React and Node.js"
        },
        {
          id: "2", 
          company_name: "Microsoft",
          job_title: "Frontend Developer",
          drive_date: "2026-03-20",
          description: "Frontend Developer role working with modern JavaScript frameworks"
        },
        {
          id: "3",
          company_name: "Amazon",
          job_title: "Backend Developer",
          drive_date: "2026-03-25",
          description: "Backend Developer position focusing on scalable web services"
        },
        {
          id: "4",
          company_name: "Meta",
          job_title: "Full Stack Engineer",
          drive_date: "2026-04-01",
          description: "Full Stack Engineer role with React and Python"
        }
      ];
      setDrives(sampleDrives);
    }
  };

  const startMockInterview = async (driveId: string) => {
    setLoading(true);
    try {
      // Generate mock questions based on company/role
      const drive = drives.find(d => d.id === driveId);
      const companyName = drive?.company?.name || drive?.company_name || "Company";
      const jobTitle = drive?.job_title || "Software Engineer";
      
      const mockQuestions = generateMockQuestions(companyName, jobTitle);
      
      setCurrentMock({
        id: `mock_${Date.now()}`,
        questions: mockQuestions,
        driveTitle: `${companyName} - ${jobTitle}`
      });
      setViewMode("interview");
      setCurrentQuestionIndex(0);
      setAnswers([]);
    } catch (error) {
      console.error("Failed to start mock interview:", error);
      alert("Failed to generate interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateMockQuestions = (companyName: string, jobTitle: string): Question[] => {
    const questionSets: { [key: string]: Question[] } = {
      "Google": [
        {
          id: "1",
          question: "Tell me about a time when you had to solve a complex algorithmic problem. How did you approach it?",
          category: "technical",
          difficulty: "medium",
          keywords: ["algorithms", "problem-solving", "data structures"],
          idealAnswerPoints: ["Problem definition", "Approach explanation", "Code implementation", "Time/space complexity analysis"]
        },
        {
          id: "2", 
          question: "How would you design a scalable system for Google Search autocomplete?",
          category: "system-design",
          difficulty: "hard",
          keywords: ["scalability", "system design", "distributed systems"],
          idealAnswerPoints: ["Trie data structure", "Caching strategy", "Load balancing", "Database sharding"]
        },
        {
          id: "3",
          question: "Describe a time when you had to work with a difficult team member. How did you handle it?",
          category: "behavioral", 
          difficulty: "medium",
          keywords: ["teamwork", "communication", "conflict resolution"],
          idealAnswerPoints: ["Situation description", "Actions taken", "Result achieved", "Lessons learned"]
        }
      ],
      "Microsoft": [
        {
          id: "1",
          question: "Explain the difference between C# and Java. When would you choose one over the other?",
          category: "technical",
          difficulty: "medium", 
          keywords: ["programming languages", "C#", "Java", "comparison"],
          idealAnswerPoints: ["Language features", "Platform differences", "Performance considerations", "Use cases"]
        },
        {
          id: "2",
          question: "How would you approach debugging a performance issue in a large-scale application?",
          category: "technical",
          difficulty: "hard",
          keywords: ["debugging", "performance", "optimization"],
          idealAnswerPoints: ["Profiling tools", "Bottleneck identification", "Optimization strategies", "Testing approach"]
        },
        {
          id: "3",
          question: "Tell me about a project where you had to learn a new technology quickly.",
          category: "behavioral",
          difficulty: "medium",
          keywords: ["learning", "adaptability", "technology"],
          idealAnswerPoints: ["Learning approach", "Challenges faced", "Resources used", "Outcome"]
        }
      ],
      "default": [
        {
          id: "1",
          question: "Walk me through your resume and tell me about your most significant project.",
          category: "behavioral",
          difficulty: "easy",
          keywords: ["experience", "projects", "background"],
          idealAnswerPoints: ["Project overview", "Technologies used", "Your role", "Impact/results"]
        },
        {
          id: "2",
          question: "What is your favorite programming language and why?",
          category: "technical", 
          difficulty: "easy",
          keywords: ["programming", "preferences", "language features"],
          idealAnswerPoints: ["Language choice", "Specific features", "Use cases", "Personal experience"]
        },
        {
          id: "3",
          question: "How do you stay updated with the latest technology trends?",
          category: "behavioral",
          difficulty: "easy", 
          keywords: ["learning", "technology trends", "professional development"],
          idealAnswerPoints: ["Learning sources", "Continuous improvement", "Practical application", "Knowledge sharing"]
        },
        {
          id: "4",
          question: "Describe a challenging bug you encountered and how you resolved it.",
          category: "technical",
          difficulty: "medium",
          keywords: ["debugging", "problem-solving", "technical challenges"],
          idealAnswerPoints: ["Bug description", "Investigation process", "Solution approach", "Prevention measures"]
        },
        {
          id: "5",
          question: "Where do you see yourself in 5 years?",
          category: "behavioral", 
          difficulty: "easy",
          keywords: ["career goals", "aspirations", "planning"],
          idealAnswerPoints: ["Career vision", "Skill development", "Growth areas", "Alignment with role"]
        }
      ]
    };

    return questionSets[companyName] || questionSets["default"];
  };

  const handleAnswerSubmit = (audioBlob: Blob, answerText: string) => {
    console.log("handleAnswerSubmit called:", {
      audioBlob: !!audioBlob,
      answerText: answerText?.length || 0,
      currentQuestionIndex,
      questionId: currentMock?.questions[currentQuestionIndex]?.id
    });
    
    if (!currentMock) {
      console.error("No current mock interview");
      return;
    }
    
    const currentQuestion = currentMock.questions[currentQuestionIndex];
    if (!currentQuestion) {
      console.error("No current question found at index:", currentQuestionIndex);
      return;
    }
    
    const newAnswer = {
      question_id: currentQuestion.id,
      answer_text: answerText,
      audio_url: audioBlob ? "recorded" : null,
      timestamp: new Date().toISOString()
    };

    console.log("New answer created:", newAnswer);

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Move to next question or finish
    if (currentQuestionIndex < currentMock.questions.length - 1) {
      console.log("Moving to next question");
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      console.log("All questions answered, submitting to API");
      submitAllAnswers(updatedAnswers);
    }
  };

  const submitAllAnswers = async (allAnswers: any[]) => {
    setLoading(true);
    console.log("Submitting all answers:", allAnswers);
    
    try {
      const response = await fetch("/api/mock-interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_answers",
          mockId: currentMock!.id,
          answers: allAnswers,
          questions: currentMock!.questions  // Send questions so backend doesn't need to fetch
        })
      });

      console.log("API response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API error response:", errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("API response data:", data);
      
      setFeedback(data);
      setViewMode("results");
      
      // Update readiness score after successful mock interview
      updateReadinessScore(data.overallScore);
    } catch (error) {
      console.error("Failed to submit answers:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      alert(`Failed to get feedback: ${errorMessage}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const updateReadinessScore = async (mockScore: number) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      const response = await fetch(`/api/student/readiness-score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          mockInterviewScore: mockScore,
          action: 'update_mock_score'
        })
      });
      
      if (response.ok) {
        console.log('Readiness score updated successfully');
      }
    } catch (error: any) {
      console.error('Failed to update readiness score:', error?.message || error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500 text-white";
      case "medium": return "bg-orange-500 text-white";
      case "hard": return "bg-red-600 text-white";
      default: return "bg-gray-600 text-white";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "technical": return "💻";
      case "behavioral": return "🤝";
      case "system-design": return "🏗️";
      case "hr": return "👔";
      default: return "❓";
    }
  };

  // Select Drive View
  if (viewMode === "select") {
    return (
      <StudentSidebarLayout>
        <div className="container mx-auto p-6 space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-black text-gray-900">Mock Interviews</h1>
              <p className="text-gray-700 font-medium mt-2">
                Practice with AI-generated questions based on real job descriptions
              </p>
            </div>
            <GraduationCap className="h-16 w-16 text-blue-600" />
          </div>

          {/* Feature Info */}
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-gray-900 font-bold">
                <Lightbulb className="h-6 w-6 text-amber-500" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 font-bold flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900">AI generates 8 custom questions based on job description and your resume</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 font-bold flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900">Record voice answers OR type them out</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 font-bold flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900">Get AI feedback on sentiment, technical accuracy, and communication</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 font-bold flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900">Receive personalized improvement suggestions</p>
              </div>
            </CardContent>
          </Card>

          {/* Available Drives */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Select a Drive to Practice</h2>
            
            {drives.length === 0 ? (
              <Card className="border-2 border-gray-300">
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                  <p className="text-gray-700 font-medium">No drives available yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {drives.map((drive) => (
                  <Card key={drive.id} className="border-2 border-indigo-300 shadow-lg hover:shadow-xl hover:border-indigo-500 transition-all bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50">
                    <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200">
                      <CardTitle className="text-xl font-bold text-gray-900">{drive.company?.name || drive.company_name}</CardTitle>
                      <CardDescription className="text-gray-700 font-semibold text-base">{drive.job_title}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      {drive.description && (
                        <p className="text-sm font-medium text-gray-800 leading-relaxed">{drive.description}</p>
                      )}
                      <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700 bg-indigo-100 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        Drive Date: {new Date(drive.drive_date).toLocaleDateString()}
                      </div>
                      <Button
                        onClick={() => startMockInterview(drive.id)}
                        disabled={loading}
                        className="w-full gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 text-base"
                      >
                        <Play className="h-5 w-5" />
                        Start Mock Interview
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </StudentSidebarLayout>
    );
  }

  // Interview View
  if (viewMode === "interview" && currentMock) {
    const currentQuestion = currentMock.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / currentMock.questions.length) * 100;

    return (
      <StudentSidebarLayout>
        <div className="container mx-auto p-6 space-y-6 max-w-4xl">
          {/* Progress */}
          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{currentMock.driveTitle}</span>
                <span className="text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {currentMock.questions.length}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>

          {/* Current Question */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getCategoryIcon(currentQuestion.category)}</span>
                    <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                      {currentQuestion.difficulty}
                    </Badge>
                    <Badge variant="outline">{currentQuestion.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentQuestion.idealAnswerPoints && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium mb-2">💡 Consider mentioning:</p>
                  <ul className="text-sm space-y-1">
                    {currentQuestion.idealAnswerPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Voice Recorder */}
          <VoiceRecorder
            questionId={currentQuestion.id}
            onRecordingComplete={handleAnswerSubmit}
          />

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Analyzing your answers with AI...</p>
            </div>
          )}
        </div>
      </StudentSidebarLayout>
    );
  }

  // Results View
  if (viewMode === "results" && feedback) {
    return (
      <StudentSidebarLayout>
        <div className="container mx-auto p-6 space-y-6 max-w-4xl">
          {/* Overall Score - PROMINENT */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 blur-xl opacity-20"></div>
            <Card className="bg-gradient-to-br from-green-600 to-emerald-600 border-0 text-white shadow-2xl relative z-10">
              <CardHeader>
                <div className="text-center">
                  <div className="text-7xl font-black mb-2 drop-shadow-lg">
                    {feedback.overallScore}
                  </div>
                  <p className="text-green-100 text-xl font-bold">Overall Interview Score</p>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-green-100 text-lg font-semibold">
                  {feedback.overallScore >= 80 && "Excellent Performance! 🌟"}
                  {feedback.overallScore >= 60 && feedback.overallScore < 80 && "Good Job! Keep improving 💪"}
                  {feedback.overallScore < 60 && "Great effort! Practice makes perfect 🚀"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedback.summary.strengths.map((strength: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <TrendingUp className="h-5 w-5" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feedback.summary.improvements.map((improvement: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600">→</span>
                      <span className="text-sm">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Question-by-Question Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="0">
                <TabsList className="w-full overflow-x-auto flex justify-start">
                  {feedback.feedback.map((f: any, idx: number) => (
                    <TabsTrigger key={idx} value={idx.toString()}>
                      Q{idx + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {feedback.feedback.map((f: any, idx: number) => (
                  <TabsContent key={idx} value={idx.toString()} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Sentiment</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {f.sentiment?.confidence_score || 0}%
                          </div>
                          <p className="text-xs text-muted-foreground capitalize">
                            {f.sentiment?.overall || "N/A"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Technical Accuracy</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {f.technical_accuracy?.score || 0}%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {f.technical_accuracy?.keywords_covered?.length || 0} keywords used
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm">Communication</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {f.communication?.clarity_score || 0}%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {f.communication?.filler_words_count || 0} filler words
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium mb-1">✨ AI Feedback</p>
                        <p className="text-sm">{f.technical_accuracy?.feedback}</p>
                      </div>

                      {f.strengths && f.strengths.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Strengths:</p>
                          <ul className="text-sm space-y-1">
                            {f.strengths.map((s: string, i: number) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                                {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {f.improvements && f.improvements.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Improvements:</p>
                          <ul className="text-sm space-y-1">
                            {f.improvements.map((i: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <TrendingUp className="h-4 w-4 text-orange-600 mt-0.5" />
                                {i}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setViewMode("select");
                setCurrentMock(null);
                setFeedback(null);
                setAnswers([]);
              }}
              variant="outline"
              className="flex-1"
            >
              Practice Another Drive
            </Button>
            <Button className="flex-1">
              <Award className="h-4 w-4 mr-2" />
              View All Mock Interviews
            </Button>
          </div>
        </div>
      </StudentSidebarLayout>
    );
  }

  return null;
}
