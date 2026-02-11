"use client";

import { useState, useEffect } from "react";
import StudentSidebarLayout from "@/components/student-sidebar-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Gamepad2,
  Trophy,
  Timer,
  Zap,
  Brain,
  Target,
  Award,
  Star,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "What is the time complexity of binary search?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correct: 1,
    explanation: "Binary search divides the search space in half each iteration, resulting in O(log n) time complexity.",
    category: "DSA"
  },
  {
    id: 2,
    question: "Which data structure uses LIFO?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    correct: 1,
    explanation: "Stack follows Last-In-First-Out (LIFO) principle.",
    category: "DSA"
  },
  {
    id: 3,
    question: "What does REST stand for?",
    options: ["Remote State Transfer", "Representational State Transfer", "Resource State Transfer", "Remote System Transfer"],
    correct: 1,
    explanation: "REST stands for Representational State Transfer, an architectural style for web services.",
    category: "Web Development"
  },
  {
    id: 4,
    question: "Which sorting algorithm has the best average case complexity?",
    options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"],
    correct: 1,
    explanation: "Quick Sort has O(n log n) average case complexity, making it one of the fastest sorting algorithms.",
    category: "DSA"
  },
  {
    id: 5,
    question: "What is a closure in JavaScript?",
    options: ["A loop", "A function with access to outer scope", "An object", "A class"],
    correct: 1,
    explanation: "A closure is a function that has access to variables in its outer (enclosing) scope.",
    category: "JavaScript"
  }
];

const speedQuestions: Question[] = [
  {
    id: 1,
    question: "What does HTML stand for?",
    options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink Text Markup Language"],
    correct: 0,
    explanation: "HTML stands for HyperText Markup Language.",
    category: "Web"
  },
  {
    id: 2,
    question: "Which is the largest planet?",
    options: ["Earth", "Jupiter", "Mars", "Saturn"],
    correct: 1,
    explanation: "Jupiter is the largest planet in our solar system.",
    category: "General"
  },
  {
    id: 3,
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correct: 1,
    explanation: "Basic arithmetic: 2 + 2 = 4.",
    category: "Math"
  },
  {
    id: 4,
    question: "Which company created JavaScript?",
    options: ["Microsoft", "Netscape", "Google", "Apple"],
    correct: 1,
    explanation: "JavaScript was created by Netscape (Brendan Eich).",
    category: "Tech"
  },
  {
    id: 5,
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
    correct: 2,
    explanation: "CSS stands for Cascading Style Sheets.",
    category: "Web"
  },
  {
    id: 6,
    question: "What year was JavaScript created?",
    options: ["1993", "1995", "1997", "1999"],
    correct: 1,
    explanation: "JavaScript was created in 1995.",
    category: "Tech"
  },
  {
    id: 7,
    question: "Which is NOT a programming language?",
    options: ["Python", "HTML", "Java", "C++"],
    correct: 1,
    explanation: "HTML is a markup language, not a programming language.",
    category: "Tech"
  },
  {
    id: 8,
    question: "What does API stand for?",
    options: ["Application Programming Interface", "Advanced Programming Interface", "Application Protocol Interface", "Advanced Protocol Interface"],
    correct: 0,
    explanation: "API stands for Application Programming Interface.",
    category: "Tech"
  },
  {
    id: 9,
    question: "Which is faster?",
    options: ["Array access", "Linked List traversal", "Hash table lookup", "Binary search"],
    correct: 0,
    explanation: "Array access is O(1), making it fastest for direct access.",
    category: "DSA"
  },
  {
    id: 10,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Rome"],
    correct: 2,
    explanation: "Paris is the capital of France.",
    category: "General"
  }
];

export default function InteractiveGamesPage() {
  const [gameMode, setGameMode] = useState<"menu" | "quiz" | "speed" | "results">("menu");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer, setTimer] = useState(30);
  const [speedTimer, setSpeedTimer] = useState(120); // 2 minutes for speed round
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [speedQuestionIndex, setSpeedQuestionIndex] = useState(0);

  useEffect(() => {
    if (gameMode === "quiz" && timer > 0 && !showExplanation) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !showExplanation) {
      handleAnswer(-1);
    }
  }, [timer, gameMode, showExplanation]);

  // Speed round timer
  useEffect(() => {
    if (gameMode === "speed" && speedTimer > 0) {
      const interval = setInterval(() => {
        setSpeedTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (gameMode === "speed" && speedTimer === 0) {
      setGameMode("results");
    }
  }, [speedTimer, gameMode]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    if (gameMode === "quiz") {
      setShowExplanation(true);
      
      const isCorrect = answerIndex === quizQuestions[currentQuestion].correct;
      const newAnswers = [...answers, isCorrect];
      setAnswers(newAnswers);
      
      if (isCorrect) {
        const timeBonus = Math.floor(timer / 5);
        setScore(score + 10 + timeBonus);
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
      } else {
        setStreak(0);
      }
    } else if (gameMode === "speed") {
      // Speed round - no explanations, immediate next question
      const isCorrect = answerIndex === speedQuestions[speedQuestionIndex].correct;
      const newAnswers = [...answers, isCorrect];
      setAnswers(newAnswers);
      
      if (isCorrect) {
        setScore(score + 15); // Higher points for speed round
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
      } else {
        setStreak(0);
      }
      
      // Move to next question or end game
      if (speedQuestionIndex < speedQuestions.length - 1) {
        setSpeedQuestionIndex(speedQuestionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setGameMode("results");
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimer(30);
    } else {
      setGameMode("results");
    }
  };

  const resetGame = () => {
    setGameMode("menu");
    setCurrentQuestion(0);
    setSpeedQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setTimer(30);
    setSpeedTimer(120);
    setAnswers([]);
    setStreak(0);
  };

  const startQuiz = () => {
    resetGame();
    setGameMode("quiz");
  };

  const startSpeedRound = () => {
    resetGame();
    setGameMode("speed");
  };

  if (gameMode === "menu") {
    return (
      <StudentSidebarLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl p-8 text-white shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Gamepad2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Interactive Learning Games</h1>
                    <p className="text-purple-100 text-lg">
                      Learn while having fun! Test your skills and climb the leaderboard
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="pt-6">
                  <Trophy className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{score}</p>
                  <p className="text-sm text-blue-100">Total Points</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="pt-6">
                  <Zap className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{bestStreak}</p>
                  <p className="text-sm text-purple-100">Best Streak</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
                <CardContent className="pt-6">
                  <Target className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">{answers.filter(a => a).length}</p>
                  <p className="text-sm text-pink-100">Correct Answers</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="pt-6">
                  <Award className="w-8 h-8 mb-2 opacity-80" />
                  <p className="text-2xl font-bold">Gold</p>
                  <p className="text-sm text-orange-100">Current Tier</p>
                </CardContent>
              </Card>
            </div>

            {/* Game Modes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-xl cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Technical Quiz</CardTitle>
                      <CardDescription>Test your DSA & coding knowledge</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <Badge>Medium</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-semibold">{quizQuestions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Time per question:</span>
                      <span className="font-semibold">30 seconds</span>
                    </div>
                    <Button 
                      onClick={startQuiz}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Gamepad2 className="w-4 h-4 mr-2" />
                      Start Quiz
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-xl cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                      <Timer className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Speed Round</CardTitle>
                      <CardDescription>Quick fire questions - race against time!</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <Badge variant="secondary">Easy</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">2 minutes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Max Points:</span>
                      <span className="font-semibold">150</span>
                    </div>
                    <Button 
                      onClick={startSpeedRound}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      <Timer className="w-4 h-4 mr-2" />
                      Start Speed Round
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </StudentSidebarLayout>
    );
  }

  if (gameMode === "quiz") {
    const question = quizQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    return (
      <StudentSidebarLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Live Score Tracker - Sticky at Top */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <Trophy className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-black">{score}</p>
                  <p className="text-xs text-white/80 font-semibold uppercase mt-1">Points</p>
                </div>

                <div className="text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-black">{streak}</p>
                  <p className="text-xs text-white/80 font-semibold uppercase mt-1">Streak</p>
                </div>

                <div className="text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-black">{answers.filter(a => a).length}/{currentQuestion + 1}</p>
                  <p className="text-xs text-white/80 font-semibold uppercase mt-1">Correct</p>
                </div>

                <div className={`text-center ${timer < 10 ? 'animate-pulse' : ''}`}>
                  <Timer className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <p className={`text-3xl font-black ${timer < 10 ? 'text-red-200' : ''}`}>{timer}s</p>
                  <p className="text-xs text-white/80 font-semibold uppercase mt-1">Time</p>
                </div>
              </div>
            </div>

            {/* Header */}
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                      Question {currentQuestion + 1}/{quizQuestions.length}
                    </Badge>
                    <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                      <Trophy className="w-4 h-4 mr-2" />
                      {score} pts
                    </Badge>
                    {streak > 0 && (
                      <Badge className="bg-orange-500 text-white text-lg px-4 py-2">
                        <Zap className="w-4 h-4 mr-2" />
                        {streak}x Streak
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="w-5 h-5" />
                    <span className={`text-2xl font-bold ${timer < 10 ? 'text-red-300 animate-pulse' : ''}`}>
                      {timer}s
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="h-2 bg-white/20" />
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="border-2 border-purple-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl">{question.question}</CardTitle>
                  <Badge variant="secondary">{question.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = index === question.correct;
                  const showResult = showExplanation;

                  let buttonClass = "w-full justify-start text-left h-auto py-4 px-6 text-lg ";
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += "bg-green-100 border-green-500 border-2 text-green-900 hover:bg-green-100";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "bg-red-100 border-red-500 border-2 text-red-900 hover:bg-red-100";
                    }
                  } else if (isSelected) {
                    buttonClass += "bg-purple-100 border-purple-500 border-2";
                  }

                  return (
                    <Button
                      key={index}
                      variant={showResult ? "secondary" : "outline"}
                      className={buttonClass}
                      onClick={() => !showExplanation && handleAnswer(index)}
                      disabled={showExplanation}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                        {showResult && isCorrect && <CheckCircle className="w-6 h-6 text-green-600" />}
                        {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-600" />}
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Explanation */}
            {showExplanation && (
              <Card className={`border-2 ${selectedAnswer === question.correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {selectedAnswer === question.correct ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h4 className={`font-bold text-lg mb-2 ${selectedAnswer === question.correct ? 'text-green-900' : 'text-red-900'}`}>
                        {selectedAnswer === question.correct ? '✨ Correct! Great job!' : '❌ Incorrect'}
                      </h4>
                      <p className={selectedAnswer === question.correct ? 'text-green-800' : 'text-red-800'}>
                        {question.explanation}
                      </p>
                      {selectedAnswer === question.correct && timer > 20 && (
                        <Badge className="mt-2 bg-orange-500">
                          +{Math.floor(timer / 5)} Time Bonus!
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    onClick={nextQuestion}
                    className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500"
                  >
                    {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </StudentSidebarLayout>
    );
  }

  if (gameMode === "speed") {
    const question = speedQuestions[speedQuestionIndex];
    const progress = ((speedQuestionIndex + 1) / speedQuestions.length) * 100;
    const minutes = Math.floor(speedTimer / 60);
    const seconds = speedTimer % 60;

    return (
      <StudentSidebarLayout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Live Score Tracker - Sticky Speed Round */}
            <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl p-6 shadow-xl">
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center border-r border-white/20">
                  <Star className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-black">{score}</p>
                  <p className="text-xs text-white/80 font-semibold uppercase mt-1">Points</p>
                </div>

                <div className="text-center border-r border-white/20">
                  <Zap className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-black">{streak}</p>
                  <p className="text-xs text-white/80 font-semibold uppercase mt-1">Streak</p>
                </div>

                <div className="text-center border-r border-white/20">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <p className="text-3xl font-black">{answers.filter(a => a).length}/{speedQuestionIndex + 1}</p>
                  <p className="text-xs text-white/80 font-semibold uppercase mt-1">Correct</p>
                </div>

                <div className="text-center border-r border-white/20">
                  <span className="text-2xl font-black">{Math.round(progress)}%</span>
                  <p className="text-xs text-white/80 font-semibold uppercase mt-1">Progress</p>
                </div>

                <div className={`text-center ${speedTimer < 30 ? 'animate-pulse' : ''}`}>
                  <Timer className="w-6 h-6 mx-auto mb-2 opacity-80" />
                  <p className={`text-3xl font-black ${speedTimer < 30 ? 'text-red-200' : ''}`}>{minutes}:{seconds.toString().padStart(2, '0')}</p>
                  <p className="text-xs text-white/80 font-semibold uppercase mt-1">Time</p>
                </div>
              </div>
            </div>

            {/* Header - Removed since score tracker is above */}

            {/* Progress Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold">Question {speedQuestionIndex + 1} of {speedQuestions.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Question Card */}
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl">{question.question}</CardTitle>
                  <Badge variant="secondary">{question.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, index) => {
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left h-auto py-4 px-6 text-lg hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => handleAnswer(index)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center font-bold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>
      </StudentSidebarLayout>
    );
  }

  if (gameMode === "results") {
    const correctAnswers = answers.filter(a => a).length;
    const totalQuestions = currentQuestions.length > 0 ? currentQuestions.length : 
                          (speedQuestionIndex > 0 ? speedQuestionIndex + 1 : quizQuestions.length);
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const grade = accuracy >= 80 ? 'A' : accuracy >= 60 ? 'B' : accuracy >= 40 ? 'C' : 'D';
    const gradeColor = accuracy >= 80 ? 'text-green-600' : accuracy >= 60 ? 'text-blue-600' : accuracy >= 40 ? 'text-yellow-600' : 'text-red-600';
    const isSpeedRound = currentQuestions === speedQuestions || speedQuestionIndex > 0;

    return (
      <StudentSidebarLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Results Header */}
            <Card className={`bg-gradient-to-r text-white border-0 ${isSpeedRound ? 'from-blue-600 to-cyan-600' : 'from-purple-600 via-pink-600 to-orange-600'}`}>
              <CardContent className="pt-8 text-center">
                <Trophy className="w-20 h-20 mx-auto mb-4" />
                <h1 className="text-4xl font-bold mb-2">{isSpeedRound ? 'Speed Round' : 'Quiz'} Complete!</h1>
                <p className="text-xl opacity-90">Here's how you performed</p>
              </CardContent>
            </Card>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className={`text-6xl font-bold ${gradeColor} mb-2`}>{grade}</div>
                  <p className="text-gray-600">Grade</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{score}</div>
                  <p className="text-gray-600">Total Points</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">{accuracy}%</div>
                  <p className="text-gray-600">Accuracy</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="text-4xl font-bold text-orange-600 mb-2">{bestStreak}</div>
                  <p className="text-gray-600">Best Streak</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Results */}
            <Card>
              <CardHeader>
                <CardTitle>Question Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(isSpeedRound ? speedQuestions.slice(0, speedQuestionIndex + 1) : quizQuestions).map((q, index) => (
                  <div key={q.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${answers[index] ? 'bg-green-100' : 'bg-red-100'}`}>
                      {answers[index] ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{q.question}</p>
                      <Badge variant="secondary">{q.category}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                onClick={startQuiz}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-lg py-6"
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play Again
              </Button>
              <Button 
                onClick={resetGame}
                variant="outline"
                className="flex-1 text-lg py-6"
              >
                Back to Menu
              </Button>
            </div>
          </div>
        </div>
      </StudentSidebarLayout>
    );
  }

  return null;
}
