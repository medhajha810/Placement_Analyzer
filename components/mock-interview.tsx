"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Target,
  MessageSquare
} from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: "behavioral" | "technical" | "situational";
  difficulty: "easy" | "medium" | "hard";
  expectedPoints: string[];
  timeLimit: number;
}

interface VibeCheck {
  confidenceScore: number;
  fillerWordCount: number;
  fillerWordPercentage: number;
  speakingPace: string;
  technicalAccuracy: number;
  detectedFillerWords: { word: string; count: number }[];
  strengths: string[];
  improvements: string[];
  overallFeedback: string;
}

export function MockInterviewComponent({ driveId }: { driveId?: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [vibeCheck, setVibeCheck] = useState<VibeCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [isRecognitionRunning, setIsRecognitionRunning] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (driveId) {
      fetchQuestions();
    }
    
    // Setup Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(prev => prev + finalTranscript);
      };

      recognitionRef.current.onend = () => {
        setIsRecognitionRunning(false);
      };
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecognitionRunning(false);
      }
    };
  }, [driveId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai/mock-interview?driveId=${driveId}`);
      const data = await response.json();
      
      if (data.success) {
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setTranscript("");
      setVibeCheck(null);
      
      // Start speech recognition (only if not already running)
      if (recognitionRef.current && !isRecognitionRunning) {
        try {
          recognitionRef.current.start();
          setIsRecognitionRunning(true);
        } catch (error) {
          console.error("Failed to start speech recognition:", error);
        }
      }
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error("Failed to start recording:", error);
      alert("Please allow microphone access to use the mock interviewer");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        setIsRecognitionRunning(false);
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Analyze response
      analyzeResponse();
    }
  };

  const analyzeResponse = async () => {
    if (!transcript || transcript.trim().length === 0) {
      alert("No speech detected. Please try again.");
      resetRecording();
      return;
    }
    
    try {
      setAnalyzing(true);
      const currentQuestion = questions[currentQuestionIndex];
      
      const response = await fetch("/api/ai/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "analyze-response",
          transcript,
          question: currentQuestion.question,
          duration: recordingTime,
          expectedPoints: currentQuestion.expectedPoints
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVibeCheck(data.vibeCheck);
      }
    } catch (error) {
      console.error("Failed to analyze response:", error);
      alert("Failed to analyze your response. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const resetRecording = () => {
    setRecordingTime(0);
    setTranscript("");
    setVibeCheck(null);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "easy") return "bg-green-500";
    if (difficulty === "medium") return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTypeIcon = (type: string) => {
    if (type === "technical") return "💻";
    if (type === "behavioral") return "🗣️";
    return "🎯";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">No interview questions available. Please select a job drive first.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
            </span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getTypeIcon(currentQuestion.type)}</span>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
                <Badge variant="outline">{currentQuestion.type}</Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.floor(currentQuestion.timeLimit / 60)} min
                </Badge>
              </div>
              <CardTitle className="text-2xl mb-3">{currentQuestion.question}</CardTitle>
              <CardDescription>
                <strong>Points to cover:</strong>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {currentQuestion.expectedPoints.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Recording Controls */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 mb-4">
            <div className="flex flex-col items-center gap-4">
              <div className="text-4xl font-bold text-blue-600">
                {formatTime(recordingTime)}
              </div>
              
              {isRecording && (
                <div className="flex items-center gap-2 text-red-600 animate-pulse">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span className="font-medium">Recording...</span>
                </div>
              )}
              
              <div className="flex gap-3">
                {!isRecording && !vibeCheck ? (
                  <Button 
                    onClick={startRecording} 
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    Start Recording Answer
                  </Button>
                ) : isRecording ? (
                  <>
                    <Button 
                      onClick={stopRecording} 
                      size="lg"
                      variant="destructive"
                      className="gap-2"
                    >
                      <MicOff className="w-5 h-5" />
                      Stop & Analyze
                    </Button>
                  </>
                ) : null}
                
                {vibeCheck && !isRecording && (
                  <Button 
                    onClick={resetRecording} 
                    size="lg"
                    variant="outline"
                    className="gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Live Transcript */}
          {(isRecording || transcript) && !vibeCheck && (
            <Card className="border border-gray-300">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Your Response (Live Transcript)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {transcript || "Start speaking..."}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Analyzing State */}
          {analyzing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Performing Vibe Check...</p>
              <p className="text-sm text-gray-500 mt-1">Analyzing confidence, filler words, and technical accuracy</p>
            </div>
          )}

          {/* Vibe Check Results */}
          {vibeCheck && !analyzing && (
            <div className="space-y-4">
              {/* Overall Feedback - PROMINENT FIRST */}
              <Card className="border-2 border-purple-600 bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Zap className="w-6 h-6" />
                    Overall Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base font-semibold text-white/95 leading-relaxed">{vibeCheck.overallFeedback}</p>
                </CardContent>
              </Card>

              <h3 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
                Detailed Vibe Check Results
              </h3>

              {/* Score Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className={`text-3xl font-bold ${getScoreColor(vibeCheck.confidenceScore)}`}>
                      {vibeCheck.confidenceScore}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Confidence</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className={`text-3xl font-bold ${getScoreColor(vibeCheck.technicalAccuracy)}`}>
                      {vibeCheck.technicalAccuracy}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Technical Accuracy</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className={`text-3xl font-bold ${vibeCheck.fillerWordCount > 10 ? 'text-red-600' : vibeCheck.fillerWordCount > 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {vibeCheck.fillerWordCount}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Filler Words</div>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-blue-600">
                      {vibeCheck.speakingPace}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Speaking Pace</div>
                  </CardContent>
                </Card>
              </div>

              {/* Filler Word Breakdown */}
              {vibeCheck.detectedFillerWords.length > 0 && (
                <Card className="border-2 border-orange-200 bg-orange-50/50">
                  <CardHeader>
                    <CardTitle className="text-sm">Filler Word Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {vibeCheck.detectedFillerWords.map((item, idx) => (
                        <Badge key={idx} variant="outline" className="bg-white">
                          "{item.word}" x {item.count}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {vibeCheck.fillerWordPercentage}% of your words were fillers
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Strengths */}
              <Card className="border-2 border-green-200 bg-green-50/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vibeCheck.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Improvements */}
              <Card className="border-2 border-blue-200 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {vibeCheck.improvements.map((improvement, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span>{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Next Question Button */}
              {currentQuestionIndex < questions.length - 1 && (
                <Button onClick={nextQuestion} className="w-full" size="lg">
                  Next Question →
                </Button>
              )}
              
              {currentQuestionIndex === questions.length - 1 && (
                <Card className="bg-green-50 border-2 border-green-300">
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-green-900 mb-2">
                      Interview Complete! 🎉
                    </h3>
                    <p className="text-gray-700">
                      Great job practicing! Review your performance and keep improving.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
