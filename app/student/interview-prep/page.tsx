"use client";

import { useState, useEffect } from "react";
import StudentSidebarLayout from "@/components/student-sidebar-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MockInterviewComponent } from "@/components/mock-interview";
import { FlashCardsComponent } from "@/components/flashcards";
import { SeniorsSecretWiki } from "@/components/seniors-secret-wiki";
import { 
  Mic, 
  CreditCard, 
  Users, 
  Brain, 
  Zap, 
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Video,
  Code,
  MessageSquare,
  Building2,
  Loader2
} from "lucide-react";

interface Drive {
  id: string;
  job_title: string;
  company: { name: string };
  drive_date: string;
}

export default function InterviewPrepPage() {
  const [selectedDriveId, setSelectedDriveId] = useState("");
  const [drives, setDrives] = useState<Drive[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/student/drives");
      const data = await response.json();
      
      if (data.success && data.drives.length > 0) {
        setDrives(data.drives);
        setSelectedDriveId(data.drives[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch drives:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentSidebarLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Hero Header */}
          <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Brain className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Interview Intelligence Suite</h1>
                  <p className="text-indigo-100 text-lg">
                    Master your interviews with AI-powered preparation tools
                  </p>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 mt-6">
                <Badge className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm flex items-center gap-2 border-0">
                  <Mic className="w-4 h-4" />
                  AI Mock Interviews
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm flex items-center gap-2 border-0">
                  <CreditCard className="w-4 h-4" />
                  Smart Flashcards
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm flex items-center gap-2 border-0">
                  <Users className="w-4 h-4" />
                  Senior Insights
                </Badge>
                <Badge className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 text-sm flex items-center gap-2 border-0">
                  <Zap className="w-4 h-4" />
                  Real-time Feedback
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-2 border-blue-800 shadow-xl hover:shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wide">Practice Sessions</p>
                    <p className="text-4xl font-black mt-2">24</p>
                  </div>
                  <Mic className="w-12 h-12 opacity-90" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-700 text-white border-2 border-purple-800 shadow-xl hover:shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs font-bold uppercase tracking-wide">Avg Score</p>
                    <p className="text-4xl font-black mt-2">82<span className="text-2xl">%</span></p>
                  </div>
                  <TrendingUp className="w-12 h-12 opacity-90" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-500 to-pink-700 text-white border-2 border-pink-800 shadow-xl hover:shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-xs font-bold uppercase tracking-wide">Topics Mastered</p>
                    <p className="text-4xl font-black mt-2">15</p>
                  </div>
                  <Target className="w-12 h-12 opacity-90" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-700 text-white border-2 border-orange-800 shadow-xl hover:shadow-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-xs font-bold uppercase tracking-wide">Badges Earned</p>
                    <p className="text-4xl font-black mt-2">8</p>
                  </div>
                  <Award className="w-12 h-12 opacity-90" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Company Selector */}
          {loading ? (
            <Card className="border-2 border-indigo-400 shadow-xl">
              <CardContent className="pt-6 flex items-center justify-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <p className="text-gray-700 font-medium">Loading available companies...</p>
              </CardContent>
            </Card>
          ) : drives.length > 0 ? (
            <Card className="border-2 border-indigo-400 shadow-xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-6 h-6 text-indigo-600 font-bold" />
                    <label className="font-semibold text-gray-900">Select Company:</label>
                  </div>
                  <Select value={selectedDriveId} onValueChange={setSelectedDriveId}>
                    <SelectTrigger className="w-64 border-2 border-indigo-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {drives.map((drive) => (
                        <SelectItem key={drive.id} value={drive.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{drive.company?.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({drive.job_title})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-yellow-400 shadow-xl bg-yellow-50">
              <CardContent className="pt-6">
                <p className="text-yellow-900 font-medium">No active companies available at the moment. Please check back later!</p>
              </CardContent>
            </Card>
          )}

          {/* Main Content Tabs */}
          <Tabs defaultValue="mock-interview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-lg rounded-lg">
              <TabsTrigger 
                value="mock-interview" 
                className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 font-bold"
              >
                <Mic className="w-5 h-5" />
                Mock Interview
              </TabsTrigger>
              <TabsTrigger 
                value="flashcards" 
                className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 font-bold"
              >
                <CreditCard className="w-5 h-5" />
                Flashcards
              </TabsTrigger>
              <TabsTrigger 
                value="wiki" 
                className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white py-3 font-bold"
              >
                <Users className="w-5 h-5" />
                Senior Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mock-interview" className="mt-6">
              <Card className="border-2 border-indigo-400 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
                      <Mic className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">AI-Powered Mock Interview</CardTitle>
                      <CardDescription className="text-base font-medium text-gray-700 mt-1">
                        Practice with real-time AI feedback and speech recognition
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Mock Interview Component */}
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                    <MockInterviewComponent driveId={selectedDriveId} />
                  </div>

                  {/* Tips Section */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-400 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <Video className="w-6 h-6 text-blue-700 mt-0.5 font-bold" />
                          <div>
                            <h4 className="font-bold text-blue-900 mb-2 text-lg">
                              Video Tips
                            </h4>
                            <p className="text-sm font-medium text-blue-800">
                              Maintain eye contact with the camera and speak clearly
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-400 shadow-lg">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-6 h-6 text-purple-700 mt-0.5 font-bold" />
                          <div>
                            <h4 className="font-bold text-purple-900 mb-2 text-lg">
                              Communication
                            </h4>
                            <p className="text-sm font-medium text-purple-800">
                              Structure your answers using STAR method
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="flashcards" className="mt-6">
              <Card className="border-2 border-blue-400 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                      <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">Smart Flashcards</CardTitle>
                      <CardDescription className="text-base font-medium text-gray-700 mt-1">
                        Master key concepts with AI-generated flashcards
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                    <FlashCardsComponent driveId={selectedDriveId} />
                  </div>

                  {/* Progress Cards */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 shadow-lg">
                      <CardContent className="pt-6 text-center">
                        <BookOpen className="w-8 h-8 text-green-700 mx-auto mb-2 font-bold" />
                        <p className="text-2xl font-black text-green-900">234</p>
                        <p className="text-sm font-bold text-green-700 mt-1">Cards Learned</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-400 shadow-lg">
                      <CardContent className="pt-6 text-center">
                        <TrendingUp className="w-8 h-8 text-indigo-700 mx-auto mb-2 font-bold" />
                        <p className="text-2xl font-black text-indigo-900">76%</p>
                        <p className="text-sm font-bold text-indigo-700 mt-1">Retention Rate</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-400 shadow-lg">
                      <CardContent className="pt-6 text-center">
                        <Target className="w-8 h-8 text-blue-700 mx-auto mb-2 font-bold" />
                        <p className="text-2xl font-black text-blue-900">89%</p>
                        <p className="text-sm font-bold text-blue-700 mt-1">Accuracy Rate</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-400 shadow-lg">
                      <CardContent className="pt-6 text-center">
                        <Zap className="w-8 h-8 text-purple-700 mx-auto mb-2 font-bold" />
                        <p className="text-2xl font-black text-purple-900">12</p>
                        <p className="text-sm font-bold text-purple-700 mt-1">Day Streak</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wiki" className="mt-6">
              <Card className="border-2 border-pink-400 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-orange-50 border-b-2 border-pink-300">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-pink-600 to-orange-600 rounded-lg">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-900">Senior Insights Wiki</CardTitle>
                      <CardDescription className="text-base font-medium text-gray-700 mt-1">
                        Real interview experiences from seniors who got placed
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
                    <SeniorsSecretWiki />
                  </div>

                  {/* Pro Tips */}
                  <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-400 shadow-lg">
                    <div className="flex items-start gap-3">
                      <Code className="w-6 h-6 text-orange-700 flex-shrink-0 mt-1 font-bold" />
                      <div>
                        <h4 className="font-bold text-orange-900 text-lg mb-3">
                          💡 Pro Tips from Seniors
                        </h4>
                        <ul className="space-y-3 text-orange-800">
                          <li className="flex items-start gap-3">
                            <span className="text-orange-700 font-black text-lg">✓</span>
                            <span className="font-semibold">Search by company name before applying</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-orange-700 font-black text-lg">✓</span>
                            <span className="font-semibold">Look for patterns in frequently asked questions</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-orange-700 font-black text-lg">✓</span>
                            <span className="font-semibold">Focus on DSA topics mentioned by multiple seniors</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="text-orange-700 font-black text-lg">✓</span>
                            <span className="font-semibold">Practice similar questions before your interview</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StudentSidebarLayout>
  );
}
