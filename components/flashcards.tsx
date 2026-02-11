"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckCircle,
  Info,
  Lightbulb,
  Building2,
  Clock
} from "lucide-react";

interface FlashCard {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: string;
}

interface CompanyFacts {
  ceo: string;
  founded: string;
  headquarters: string;
  industry: string;
  employees: string;
  revenue: string;
  valuation: string;
  recentNews: string;
}

export function FlashCardsComponent({ driveId }: { driveId?: string }) {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [tips, setTips] = useState<string[]>([]);
  const [facts, setFacts] = useState<CompanyFacts | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (driveId) {
      fetchFlashCards();
    }
  }, [driveId]);

  const fetchFlashCards = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai/flashcards?driveId=${driveId}`);
      const data = await response.json();
      
      if (data.success) {
        setFlashCards(data.flashCards);
        setTips(data.tips || []);
        setFacts(data.facts || null);
        setCompanyName(data.company);
        setJobTitle(data.jobTitle);
      }
    } catch (error) {
      console.error("Failed to fetch flash cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex < flashCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const resetCards = () => {
    setCurrentIndex(0);
    setShowAnswer(false);
  };

  const flipCard = () => {
    setShowAnswer(!showAnswer);
  };

  // Touch handlers for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      nextCard();
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      prevCard();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevCard();
      if (e.key === "ArrowRight") nextCard();
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flipCard();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, showAnswer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating flash cards...</p>
        </div>
      </div>
    );
  }

  if (flashCards.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Info className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">No flash cards available. Please select a job drive first.</p>
        </CardContent>
      </Card>
    );
  }

  const currentCard = flashCards[currentIndex];
  const progress = Math.round(((currentIndex + 1) / flashCards.length) * 100);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-2xl font-bold">{companyName}</h2>
        </div>
        <p className="text-gray-600">{jobTitle}</p>
        <Badge variant="outline" className="mt-2 gap-1">
          <Clock className="w-3 h-3" />
          10-Minute Interview Prep
        </Badge>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Card {currentIndex + 1} of {flashCards.length}
        </span>
        <span className="text-sm text-gray-600">{progress}% Complete</span>
      </div>
      
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flash Card */}
      <div
        className="perspective-1000"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Card 
          className={`min-h-[400px] cursor-pointer transform transition-all duration-500 hover:scale-105 ${
            showAnswer ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-white'
          } border-2 ${showAnswer ? 'border-blue-300' : 'border-gray-200'}`}
          onClick={flipCard}
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge className="bg-blue-500">
                {currentCard.category}
              </Badge>
              <span className="text-4xl">{currentCard.icon}</span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center justify-center min-h-[280px] text-center px-6">
            {!showAnswer ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {currentCard.question}
                </h3>
                <p className="text-sm text-gray-500">
                  Click or tap to reveal answer
                </p>
                <div className="text-6xl opacity-20">🤔</div>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-semibold text-gray-700">
                  {currentCard.question}
                </h3>
                <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                <p className="text-lg text-gray-900 leading-relaxed">
                  {currentCard.answer}
                </p>
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mt-4" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={prevCard}
          disabled={currentIndex === 0}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        <Button
          onClick={resetCards}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          onClick={nextCard}
          disabled={currentIndex === flashCards.length - 1}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <p className="text-center text-sm text-gray-500">
        💡 Use arrow keys or swipe to navigate
      </p>

      {/* Company Facts */}
      {facts && (
        <Card className="border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Quick Company Facts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">CEO</p>
                <p className="text-gray-900">{facts.ceo}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Founded</p>
                <p className="text-gray-900">{facts.founded}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Headquarters</p>
                <p className="text-gray-900">{facts.headquarters}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Industry</p>
                <p className="text-gray-900">{facts.industry}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Employees</p>
                <p className="text-gray-900">{facts.employees}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Valuation</p>
                <p className="text-gray-900">{facts.valuation}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-gray-600">Recent News</p>
                <p className="text-gray-900">{facts.recentNews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview Tips */}
      {tips.length > 0 && (
        <Card className="border-2 border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Interview Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 font-bold mt-0.5">{idx + 1}.</span>
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Completion Message */}
      {currentIndex === flashCards.length - 1 && showAnswer && (
        <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardContent className="py-6 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">You're Ready! 🚀</h3>
            <p className="text-white/90">
              You've reviewed all flash cards. Good luck with your interview!
            </p>
            <Button
              onClick={resetCards}
              variant="secondary"
              className="mt-4"
              size="lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Review Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
