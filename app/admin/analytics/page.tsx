"use client";

import { PredictiveAnalyticsDashboard } from "@/components/predictive-analytics-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, TrendingUp, Target, AlertTriangle } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Brain className="w-10 h-10" />
                Predictive Analytics
              </h1>
              <p className="text-blue-100 text-lg max-w-2xl">
                AI-powered insights to identify at-risk students and forecast placement eligibility
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <AlertTriangle className="w-6 h-6 mb-2" />
              <h3 className="font-semibold mb-1">Risk Assessment</h3>
              <p className="text-sm text-blue-100">
                Identify students who may struggle with placements
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Target className="w-6 h-6 mb-2" />
              <h3 className="font-semibold mb-1">Eligibility Forecasting</h3>
              <p className="text-sm text-blue-100">
                Test criteria to see how many students qualify
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <TrendingUp className="w-6 h-6 mb-2" />
              <h3 className="font-semibold mb-1">Smart Recommendations</h3>
              <p className="text-sm text-blue-100">
                Get actionable insights for workshops & interventions
              </p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full p-2">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Superpower Your Placement Strategy
                </h3>
                <p className="text-sm text-gray-700">
                  Instead of just tracking "who skipped," predict "who is at risk" and take 
                  proactive action. Test hypothetical JD criteria like "8+ GPA and Python" to 
                  see "Only 12% of your students currently meet this. You should schedule a Python workshop."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard */}
        <PredictiveAnalyticsDashboard />

        {/* Footer Tips */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg">Pro Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p>
                <strong>Critical Risk Students:</strong> Reach out immediately with personalized 
                guidance to boost profile completion and readiness scores.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p>
                <strong>Use Forecasting:</strong> Before sharing a JD with students, test the criteria 
                to understand eligibility rates and plan interventions.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p>
                <strong>Act on Recommendations:</strong> Schedule workshops for missing skills, 
                academic support for low GPAs, and engagement programs for low readiness.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              <p>
                <strong>Track Progress:</strong> Re-run risk assessments monthly to measure the 
                impact of your interventions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
