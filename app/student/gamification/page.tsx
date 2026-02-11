"use client";

import StudentSidebarLayout from "@/components/student-sidebar-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Users, TrendingUp } from "lucide-react";
import DreamCompanyRoadmap from "@/components/dream-company-roadmap";
import ReferralMatchmaker from "@/components/referral-matchmaker";
import PostReferral from "@/components/post-referral";

// TODO: Import enhanced PRS dashboard when ready
// import ReadinessScoreDashboard from "@/components/readiness-score-dashboard";

export default function GamificationHub() {
  return (
    <StudentSidebarLayout>
      <div className="container mx-auto p-6 space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="h-10 w-10" />
            Gamification & Community
          </h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Stay engaged, track progress, and connect with your community — even when there are no active drives
          </p>
        </div>
        
        {/* Feature Pills */}
        <div className="flex flex-wrap gap-2 mt-6">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            🎯 Placement Readiness Score
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            🚀 Dream Company Roadmap
          </div>
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
            🤝 Referral Matchmaker
          </div>
          <a href="/student/games" className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
            🎮 Interactive Games
          </a>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Placement Readiness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your dynamic 0-100 score based on resume strength, mock test performance, and profile completeness. See how you rank against peers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Dream Company Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Pick your top 3 target companies and get a personalized roadmap showing the exact "Distance to Dream" and skills you need to acquire.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Alumni Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Browse referral opportunities posted by seniors and alumni. System matches your skills to show your suitability score for each role.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="prs" className="w-full">
        <TabsList className="grid w-full max-w-3xl grid-cols-3 mx-auto">
          <TabsTrigger value="prs" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Readiness Score
          </TabsTrigger>
          <TabsTrigger value="roadmap" className="gap-2">
            <Target className="h-4 w-4" />
            Dream Roadmap
          </TabsTrigger>
          <TabsTrigger value="referrals" className="gap-2">
            <Users className="h-4 w-4" />
            Referral Board
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Placement Readiness Score (PRS)</CardTitle>
              <CardDescription>
                Your dynamic score showing how ready you are for placements
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                <div className="relative inline-flex">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - 0.72)}`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-bold">72</div>
                      <div className="text-xs text-muted-foreground">PRS Score</div>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground max-w-md mx-auto">
                  Your Placement Readiness Score is calculated from resume strength (35%), mock test scores (30%), and activity level (35%). You're in the top 35% of your batch!
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">85</div>
                    <div className="text-sm text-muted-foreground">Resume Score</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">65</div>
                    <div className="text-sm text-muted-foreground">Mock Test Score</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">68</div>
                    <div className="text-sm text-muted-foreground">Activity Score</div>
                  </div>
                </div>

                {/* TODO: Replace with actual ReadinessScoreDashboard component */}
                <p className="text-sm text-muted-foreground italic pt-4">
                  ℹ️ Enhanced PRS dashboard with trend charts, benchmark comparison, and improvement suggestions coming soon!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6 space-y-6">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg">📚 How Dream Company Roadmap Works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li><strong>Add up to 3 dream companies</strong> you want to target (e.g., Google SWE, Amazon SDE-1)</li>
                <li><strong>"Distance to Dream" metric (0-100)</strong> shows how far you are from meeting their requirements</li>
                <li><strong>Matched vs Missing Skills</strong> highlight what you have and what you need to learn</li>
                <li><strong>AI-generated learning roadmap</strong> provides step-by-step actions with estimated time and impact</li>
                <li><strong>Track your progress</strong> as you acquire skills and reduce your distance score</li>
              </ol>
            </CardContent>
          </Card>

          <DreamCompanyRoadmap />
        </TabsContent>

        <TabsContent value="referrals" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <Card className="flex-1 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">🤝 How Referral Matchmaker Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li><strong>Alumni post referral opportunities</strong> with required skills, GPA, and eligibility criteria</li>
                  <li><strong>System calculates your suitability score</strong> for each referral based on skill matching</li>
                  <li><strong>Only see referrals you're eligible for</strong> — no wasting time on roles you can't apply to</li>
                  <li><strong>Apply with one click</strong> and get redirected to the referral link</li>
                  <li><strong>Track your applications</strong> and see status updates from alumni</li>
                </ol>
              </CardContent>
            </Card>

            <div className="ml-4">
              <PostReferral />
            </div>
          </div>

          <ReferralMatchmaker />
        </TabsContent>
      </Tabs>

      {/* Pro Tips Footer */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>💡 Pro Tips for Staying Engaged</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">🎯 For PRS</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Complete your profile 100%</li>
                <li>Take weekly mock tests</li>
                <li>Upload updated resume</li>
                <li>Track improvement over time</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🚀 For Dream Roadmap</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Add 3 realistic dream companies</li>
                <li>Follow AI-generated action plan</li>
                <li>Update skills as you learn</li>
                <li>Refresh roadmap monthly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🤝 For Referrals</h4>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Check board daily for new postings</li>
                <li>Apply only to high-match roles</li>
                <li>Add personalized notes</li>
                <li>Give back — post referrals as alumni!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </StudentSidebarLayout>
  );
}
