"use client";

import { useState } from "react";
import StudentSidebarLayout from "@/components/student-sidebar-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MockInterviewComponent } from "@/components/mock-interview";
import { FlashCardsComponent } from "@/components/flashcards";
import { SeniorsSecretWiki } from "@/components/seniors-secret-wiki";
import { Mic, CreditCard, Users, Brain, Zap, TrendingUp } from "lucide-react";

export default function InterviewIntelligencePage() {
  const [selectedDriveId, setSelectedDriveId] = useState<string>("drive-1");

  return (
    <StudentSidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center gap-3 mb-3">
            <Brain className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Interview Intelligence Suite</h1>
          </div>
          <p className="text-purple-100 text-lg max-w-3xl mb-6">
            Go beyond tracking and master your actual interview performance with AI-powered tools
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-white/20 text-white text-sm px-4 py-2 flex items-center gap-2">
              <Mic className="w-4 h-4" />
              AI Mock Interviewer
            </Badge>
            <Badge className="bg-white/20 text-white text-sm px-4 py-2 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              JD Flash-Cards
            </Badge>
            <Badge className="bg-white/20 text-white text-sm px-4 py-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Senior's Secret Database
            </Badge>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">🎤</div>
              <h3 className="font-bold text-lg mb-2">AI Mock Interviewer</h3>
              <p className="text-sm text-gray-700">
                Practice with role-specific questions. Get "Vibe Check" analyzing confidence, filler words, and technical accuracy.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-purple-600">
                <Zap className="w-3 h-3" />
                <span>Real-time speech analysis</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">📇</div>
              <h3 className="font-bold text-lg mb-2">JD Flash-Cards</h3>
              <p className="text-sm text-gray-700">
                Convert long JDs into 5-10 quick facts (CEO, funding, tech stack). Swipe through on mobile 10 min before interview.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-blue-600">
                <CreditCard className="w-3 h-3" />
                <span>Mobile-friendly swipe interface</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="font-bold text-lg mb-2">Senior's Secret Database</h3>
              <p className="text-sm text-gray-700">
                Anonymous round-wise details from alumni. "Round 2 of Amazon was 80% Leetcode Medium on Trees."
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                <span>Real interview experiences</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className="border-2 border-gray-200">
          <Tabs defaultValue="mock-interview" className="w-full">
            <div className="border-b bg-gray-50 p-4">
              <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
                <TabsTrigger value="mock-interview" className="gap-2">
                  <Mic className="w-4 h-4" />
                  Mock Interview
                </TabsTrigger>
                <TabsTrigger value="flashcards" className="gap-2">
                  <CreditCard className="w-4 h-4" />
                  Flash-Cards
                </TabsTrigger>
                <TabsTrigger value="seniors-secret" className="gap-2">
                  <Users className="w-4 h-4" />
                  Senior's Secret
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="mock-interview" className="p-6">
              <div className="space-y-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-purple-900 mb-2">🎯 How It Works:</h3>
                  <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                    <li>AI generates custom questions based on the actual JD</li>
                    <li>Record your audio/video answer</li>
                    <li>Get instant "Vibe Check": confidence score, filler word count, technical accuracy</li>
                    <li>Receive personalized improvement tips</li>
                  </ol>
                </div>

                <MockInterviewComponent driveId={selectedDriveId} />
              </div>
            </TabsContent>

            <TabsContent value="flashcards" className="p-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-blue-900 mb-2">⚡ Perfect for Last-Minute Prep:</h3>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                    <li>AI extracts key facts: Company CEO, recent funding, core tech stack</li>
                    <li>Swipe through 5-10 cards on your phone</li>
                    <li>Review 10 minutes before your interview</li>
                    <li>Includes company facts and interview tips</li>
                  </ul>
                </div>

                <FlashCardsComponent driveId={selectedDriveId} />
              </div>
            </TabsContent>

            <TabsContent value="seniors-secret" className="p-6">
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold text-green-900 mb-2">💡 Learn from Real Experiences:</h3>
                  <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                    <li>Searchable wiki with anonymous alumni submissions</li>
                    <li>Round-wise breakdowns: "Round 2 was 80% Leetcode Medium on Trees"</li>
                    <li>Company-specific prep tips and insights</li>
                    <li>Vote helpful experiences to surface the best content</li>
                  </ul>
                </div>

                <SeniorsSecretWiki />
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer Tips */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <CardContent className="pt-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Pro Tips for Maximum Impact
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-purple-900 mb-1">Mock Interview</p>
                <p className="text-gray-700">
                  Practice 2-3 times per day leading up to your interview. Focus on reducing filler words by 50%.
                </p>
              </div>
              <div>
                <p className="font-semibold text-blue-900 mb-1">Flash-Cards</p>
                <p className="text-gray-700">
                  Create cards for every drive you apply to. Review them in the waiting room before your interview.
                </p>
              </div>
              <div>
                <p className="font-semibold text-green-900 mb-1">Senior's Secret</p>
                <p className="text-gray-700">
                  Search by company name before applying. Look for patterns in questions and DSA topics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </StudentSidebarLayout>
  );
}
