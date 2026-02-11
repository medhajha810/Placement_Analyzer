"use client";

import { useState, useEffect } from "react";
import StudentSidebarLayout from "@/components/student-sidebar-layout";
import { ReadinessScoreCard } from "@/components/readiness-score-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  MessageSquare,
  Briefcase,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  Clock,
  Users
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ReadinessData {
  readinessScore: number;
  level: {
    label: string;
    color: string;
    emoji: string;
  };
  breakdown: any;
  tips: any[];
  peerComparison: any;
  lastUpdated: string;
}

export default function ReadinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [readinessData, setReadinessData] = useState<ReadinessData | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchReadinessScore(parsedUser.id);
    } else {
      router.push("/login");
    }
  }, []);

  const fetchReadinessScore = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/readiness-score?studentId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setReadinessData(data);
      }
    } catch (error) {
      console.error("Error fetching readiness score:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!user) return;
    
    setRefreshing(true);
    try {
      const response = await fetch(`/api/student/readiness-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user.id })
      });
      const data = await response.json();
      
      if (data.success) {
        setReadinessData(data);
      }
    } catch (error) {
      console.error("Error refreshing score:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <StudentSidebarLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Calculating your readiness score...</p>
            </div>
          </div>
        </div>
      </StudentSidebarLayout>
    );
  }

  if (!readinessData) {
    return (
      <StudentSidebarLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="py-12 text-center">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-600">Failed to load readiness score</p>
              <Button onClick={() => user && fetchReadinessScore(user.id)} className="mt-4">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </StudentSidebarLayout>
    );
  }

  return (
    <StudentSidebarLayout>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                <Award className="w-10 h-10 text-amber-500 drop-shadow" />
                Placement Readiness
              </h1>
              <p className="text-gray-700 mt-3 font-medium">
                Track your progress and see how you compare with your batch
              </p>
            </div>
            
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-blue-700 text-white font-bold py-2 px-4 shadow-lg"
            >
              {refreshing ? "Refreshing..." : "Refresh Score"}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Clock className="w-5 h-5 text-blue-600" />
            Last updated: <span className="text-blue-600">{new Date(readinessData.lastUpdated).toLocaleString()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Score Card */}
          <div className="lg:col-span-2">
            <ReadinessScoreCard
              score={readinessData.readinessScore}
              level={readinessData.level}
              breakdown={readinessData.breakdown}
              tips={readinessData.tips}
              peerComparison={readinessData.peerComparison}
              onRefresh={handleRefresh}
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card className="border-2 border-amber-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-200">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 font-bold">
                  <Zap className="w-6 h-6 text-amber-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <Button
                  onClick={() => router.push("/student/mock-interviews")}
                  className="w-full justify-start bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2.5 rounded-lg"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Take Mock Interview
                  {readinessData.breakdown.mockInterviews.count < 3 && (
                    <Badge className="ml-auto bg-yellow-400 text-yellow-900">+{(3 - readinessData.breakdown.mockInterviews.count) * 10}</Badge>
                  )}
                </Button>

                <Button
                  onClick={() => router.push("/student/jobs")}
                  className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-2.5 rounded-lg"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Browse Jobs
                  {readinessData.breakdown.applicationActivity.count < 5 && (
                    <Badge className="ml-auto bg-yellow-400 text-yellow-900">+7</Badge>
                  )}
                </Button>

                <Button
                  onClick={() => router.push("/student/onboarding")}
                  className="w-full justify-start bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-2.5 rounded-lg"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Complete Profile
                  {readinessData.breakdown.profileCompleteness.percentage < 100 && (
                    <Badge className="ml-auto bg-yellow-400 text-yellow-900">+35</Badge>
                  )}
                </Button>

                <Button
                  onClick={() => router.push("/student/analytics")}
                  className="w-full justify-start bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-2.5 rounded-lg"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Achievement Milestones */}
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-blue-200">
                <CardTitle className="text-lg flex items-center gap-2 text-gray-900 font-bold">
                  <Target className="w-6 h-6 text-blue-600" />
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                {[
                  { label: "Profile Complete", done: readinessData.breakdown.profileCompleteness.percentage === 100, score: 35 },
                  { label: "3 Mock Interviews", done: readinessData.breakdown.mockInterviews.count >= 3, score: 30 },
                  { label: "5 Applications", done: readinessData.breakdown.applicationActivity.count >= 5, score: 35 },
                  { label: "Elite Level", done: readinessData.readinessScore >= 85, score: 100 }
                ].map((milestone, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-lg transition-all ${milestone.done ? 'bg-green-50 border-2 border-green-300' : 'bg-gray-50 border-2 border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      {milestone.done ? (
                        <CheckCircle className="w-6 h-6 text-green-600 font-bold" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-3 border-gray-400" />
                      )}
                      <span className={`text-sm font-bold ${milestone.done ? "text-green-900" : "text-gray-700"}`}>
                        {milestone.label}
                      </span>
                    </div>
                    <Badge className={`font-bold text-xs px-2.5 py-1 ${milestone.done ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}>
                      {milestone.score} pts
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Tabs */}
        <div className="mt-8">
          <Tabs defaultValue="breakdown" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-200 rounded-lg p-1">
              <TabsTrigger value="breakdown" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white font-bold">Component Breakdown</TabsTrigger>
              <TabsTrigger value="tips" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white font-bold">Improvement Tips</TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white font-bold">Peer Analysis</TabsTrigger>
            </TabsList>

            {/* Component Breakdown Tab */}
            <TabsContent value="breakdown" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Profile Completeness */}
                <Card className="border-2 border-blue-300 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b-2 border-blue-200">
                    <CardTitle className="text-base flex items-center gap-2 text-gray-900 font-bold">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Profile
                    </CardTitle>
                    <CardDescription className="font-semibold text-blue-700">
                      {readinessData.breakdown.profileCompleteness.score} / {readinessData.breakdown.profileCompleteness.max} points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded">
                      <span className="text-sm font-medium">Basic Info</span>
                      {readinessData.breakdown.profileCompleteness.items.basicInfo ? (
                        <CheckCircle className="w-5 h-5 text-green-600 font-bold" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 font-bold" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded">
                      <span className="text-sm font-medium">Skills (5+)</span>
                      {readinessData.breakdown.profileCompleteness.items.skills ? (
                        <CheckCircle className="w-5 h-5 text-green-600 font-bold" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 font-bold" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded">
                      <span className="text-sm font-medium">Resume</span>
                      {readinessData.breakdown.profileCompleteness.items.resume ? (
                        <CheckCircle className="w-5 h-5 text-green-600 font-bold" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 font-bold" />
                      )}
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-blue-50 rounded">
                      <span className="text-sm font-medium">Social Links</span>
                      {readinessData.breakdown.profileCompleteness.items.socialLinks ? (
                        <CheckCircle className="w-5 h-5 text-green-600 font-bold" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 font-bold" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Mock Interviews */}
                <Card className="border-2 border-purple-300 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-200">
                    <CardTitle className="text-base flex items-center gap-2 text-gray-900 font-bold">
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      Practice
                    </CardTitle>
                    <CardDescription className="font-semibold text-purple-700">
                      {readinessData.breakdown.mockInterviews.score} / {readinessData.breakdown.mockInterviews.max} points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded">
                      <span className="text-sm font-medium">Mocks Completed</span>
                      <Badge className="bg-purple-600 text-white font-bold text-xs px-2.5 py-1">{readinessData.breakdown.mockInterviews.count}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded">
                      <span className="text-sm font-medium">Average Score</span>
                      <Badge className="bg-purple-200 text-purple-900 font-bold text-xs px-2.5 py-1">
                        {readinessData.breakdown.mockInterviews.avgScore || 0}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-purple-50 rounded">
                      <span className="text-sm font-medium">Remaining</span>
                      <Badge className="bg-orange-500 text-white font-bold text-xs px-2.5 py-1">
                        {Math.max(0, 3 - readinessData.breakdown.mockInterviews.count)} more
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Activity */}
                <Card className="border-2 border-green-300 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
                    <CardTitle className="text-base flex items-center gap-2 text-gray-900 font-bold">
                      <Briefcase className="w-5 h-5 text-green-600" />
                      Activity
                    </CardTitle>
                    <CardDescription className="font-semibold text-green-700">
                      {readinessData.breakdown.applicationActivity.score} / {readinessData.breakdown.applicationActivity.max} points
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                    <div className="flex items-center justify-between p-2 hover:bg-green-50 rounded">
                      <span className="text-sm font-medium">Applications (30d)</span>
                      <Badge className="bg-green-600 text-white font-bold text-xs px-2.5 py-1">{readinessData.breakdown.applicationActivity.count}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-green-50 rounded">
                      <span className="text-sm font-medium">Target</span>
                      <Badge className="bg-green-200 text-green-900 font-bold text-xs px-2.5 py-1">5 applications</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 hover:bg-green-50 rounded">
                      <span className="text-sm font-medium">Remaining</span>
                      <Badge className="bg-orange-500 text-white font-bold text-xs px-2.5 py-1">
                        {Math.max(0, 5 - readinessData.breakdown.applicationActivity.count)} more
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Improvement Tips Tab */}
            <TabsContent value="tips" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readinessData.tips.map((tip: any, idx: number) => (
                  <Card key={idx} className={`border-2 hover:shadow-xl transition-all ${
                    tip.impact === "high" ? "border-red-400 bg-red-50" :
                    tip.impact === "medium" ? "border-orange-400 bg-orange-50" :
                    "border-blue-400 bg-blue-50"
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <Badge className={
                          tip.impact === "high" ? "bg-red-600 text-white font-bold" :
                          tip.impact === "medium" ? "bg-orange-600 text-white font-bold" :
                          "bg-blue-600 text-white font-bold"
                        }>
                          {tip.category}
                        </Badge>
                        <Badge className="bg-amber-500 text-white font-bold">+{tip.points}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-900 font-medium">{tip.tip}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Peer Comparison Tab */}
            <TabsContent value="comparison" className="space-y-4">
              {readinessData.peerComparison && readinessData.peerComparison.batchSize > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-2 border-indigo-300 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 pb-3 border-b-2 border-indigo-200">
                        <CardDescription className="font-bold text-indigo-900">Your Score</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="text-4xl font-black text-indigo-600">{readinessData.readinessScore}</div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-purple-300 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-3 border-b-2 border-purple-200">
                        <CardDescription className="font-bold text-purple-900">Percentile</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="text-4xl font-black text-purple-600">
                          {readinessData.peerComparison.percentile}<span className="text-lg">th</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-green-300 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-3 border-b-2 border-green-200">
                        <CardDescription className="font-bold text-green-900">Batch Average</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="text-4xl font-black text-green-600">
                          {readinessData.peerComparison.stats.avg}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-amber-300 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 pb-3 border-b-2 border-amber-200">
                        <CardDescription className="font-bold text-amber-900">Batch Size</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="text-4xl font-black text-amber-600">
                          {readinessData.peerComparison.batchSize}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Your Position</CardTitle>
                      <CardDescription>
                        You're in the <strong>{readinessData.peerComparison.yourBucket}</strong> range
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {readinessData.readinessScore >= readinessData.peerComparison.stats.avg ? (
                          <div className="flex items-center gap-2 text-green-700">
                            <ArrowUp className="w-5 h-5" />
                            <span>
                              You're <strong>{(readinessData.readinessScore - readinessData.peerComparison.stats.avg).toFixed(1)}</strong> points above batch average
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-orange-700">
                            <ArrowDown className="w-5 h-5" />
                            <span>
                              You're <strong>{(readinessData.peerComparison.stats.avg - readinessData.readinessScore).toFixed(1)}</strong> points below batch average
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Not enough data for peer comparison</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </StudentSidebarLayout>
  );
}
