"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  TrendingUp,
  Users,
  Lightbulb,
  RefreshCw,
  ChevronRight,
  Award,
  Target,
  FileText,
  Briefcase,
  MessageSquare
} from "lucide-react";

interface ReadinessScoreProps {
  score: number;
  level: {
    label: string;
    color: string;
    emoji: string;
  };
  breakdown: {
    profileCompleteness: {
      score: number;
      max: number;
      percentage: number;
      items: any;
    };
    mockInterviews: {
      score: number;
      max: number;
      percentage: number;
      count: number;
      avgScore: number;
    };
    applicationActivity: {
      score: number;
      max: number;
      percentage: number;
      count: number;
    };
  };
  tips: Array<{
    category: string;
    tip: string;
    impact: string;
    points: string;
  }>;
  peerComparison?: {
    percentile: number;
    batchSize: number;
    distribution: Array<{
      range: string;
      count: number;
    }>;
    stats: {
      avg: number;
      median: number;
    };
    yourBucket?: string;
  };
  onRefresh?: () => void;
  onViewDetails?: () => void;
}

export function ReadinessScoreCard({
  score,
  level,
  breakdown,
  tips,
  peerComparison,
  onRefresh,
  onViewDetails
}: ReadinessScoreProps) {
  const getLevelColor = (color: string) => {
    const colors: Record<string, string> = {
      green: "bg-green-500",
      blue: "bg-blue-500",
      cyan: "bg-cyan-500",
      yellow: "bg-yellow-500",
      orange: "bg-orange-500"
    };
    return colors[color] || "bg-gray-500";
  };

  const getLevelBgColor = (color: string) => {
    const colors: Record<string, string> = {
      green: "bg-green-50 border-green-200",
      blue: "bg-blue-50 border-blue-200",
      cyan: "bg-cyan-50 border-cyan-200",
      yellow: "bg-yellow-50 border-yellow-200",
      orange: "bg-orange-50 border-orange-200"
    };
    return colors[color] || "bg-gray-50 border-gray-200";
  };

  const getImpactColor = (impact: string) => {
    if (impact === "high") return "bg-red-500 text-white border-0";
    if (impact === "medium") return "bg-orange-500 text-white border-0";
    if (impact === "info") return "bg-blue-500 text-white border-0";
    return "bg-gray-500 text-white border-0";
  };

  return (
    <div className="space-y-4">
      {/* Main Score Card */}
      <Card className={`border-2 ${getLevelBgColor(level.color)} shadow-lg`}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Trophy className="w-7 h-7 text-amber-500" />
                Placement Readiness Score
              </CardTitle>
              <CardDescription className="mt-2 text-gray-600">
                Your comprehensive placement preparation metric
              </CardDescription>
            </div>
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh} className="hover:bg-primary hover:text-white">
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Circular Score Display */}
          <div className="flex items-center justify-center py-6">
            <div className="relative">
              {/* Circular progress background */}
              <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 200 200">
                {/* Light background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="#e5e7eb"
                  strokeWidth="14"
                  fill="none"
                />
                {/* Progress circle with gradient */}
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={
                      level.color === 'green' ? '#10b981' :
                      level.color === 'blue' ? '#3b82f6' :
                      level.color === 'cyan' ? '#06b6d4' :
                      level.color === 'yellow' ? '#f59e0b' :
                      level.color === 'orange' ? '#f97316' : '#6b7280'
                    } />
                    <stop offset="100%" stopColor={
                      level.color === 'green' ? '#059669' :
                      level.color === 'blue' ? '#1d4ed8' :
                      level.color === 'cyan' ? '#0891b2' :
                      level.color === 'yellow' ? '#d97706' :
                      level.color === 'orange' ? '#ea580c' : '#4b5563'
                    } />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  stroke="url(#progressGradient)"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - score / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                />
              </svg>
              
              {/* Score in center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <div className="text-6xl font-black text-transparent bg-clip-text" style={{
                  backgroundImage: `linear-gradient(135deg, ${
                    level.color === 'green' ? '#10b981, #059669' :
                    level.color === 'blue' ? '#3b82f6, #1d4ed8' :
                    level.color === 'cyan' ? '#06b6d4, #0891b2' :
                    level.color === 'yellow' ? '#f59e0b, #d97706' :
                    level.color === 'orange' ? '#f97316, #ea580c' : '#6b7280, #4b5563'
                  })`
                }}>{score}</div>
                <div className="text-xs font-semibold text-gray-700 tracking-wider">OUT OF 100</div>
                <div className="mt-2 text-3xl">{level.emoji}</div>
              </div>
            </div>
          </div>

          {/* Level Badge */}
          <div className="flex justify-center">
            <Badge className={`${getLevelColor(level.color)} text-white px-6 py-2 text-base font-bold shadow-lg`}>
              {level.label}
            </Badge>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-4 bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Score Breakdown
            </h3>

            {/* Profile Completeness */}
            <div className="space-y-2.5 bg-white rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600 font-bold" />
                  <span className="font-semibold text-gray-900">Profile Completeness</span>
                </div>
                <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">
                  {breakdown.profileCompleteness.score}/{breakdown.profileCompleteness.max}
                </span>
              </div>
              <Progress value={breakdown.profileCompleteness.percentage} className="h-3" />
            </div>

            {/* Mock Interviews */}
            <div className="space-y-2.5 bg-white rounded-lg p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600 font-bold" />
                  <span className="font-semibold text-gray-900">Mock Interviews ({breakdown.mockInterviews.count})</span>
                </div>
                <span className="font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full text-sm">
                  {breakdown.mockInterviews.score}/{breakdown.mockInterviews.max}
                </span>
              </div>
              <Progress value={breakdown.mockInterviews.percentage} className="h-3" />
            </div>

            {/* Application Activity */}
            <div className="space-y-2.5 bg-white rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-600 font-bold" />
                  <span className="font-semibold text-gray-900">Application Activity ({breakdown.applicationActivity.count})</span>
                </div>
                <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
                  {breakdown.applicationActivity.score}/{breakdown.applicationActivity.max}
                </span>
              </div>
              <Progress value={breakdown.applicationActivity.percentage} className="h-3" />
            </div>
          </div>

          {/* Peer Comparison */}
          {peerComparison && peerComparison.batchSize > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-lg p-6 border-2 border-indigo-200">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-indigo-600" />
                Peer Comparison
              </h3>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border-2 border-indigo-300 shadow-sm">
                  <div className="text-3xl font-black text-indigo-600">
                    {peerComparison.percentile}
                    <span className="text-lg">th</span>
                  </div>
                  <div className="text-xs font-bold text-gray-700 mt-1 uppercase tracking-wider">Percentile</div>
                </div>
                <div className="bg-white rounded-lg p-4 border-2 border-purple-300 shadow-sm">
                  <div className="text-3xl font-black text-purple-600">
                    {peerComparison.batchSize}
                  </div>
                  <div className="text-xs font-bold text-gray-700 mt-1 uppercase tracking-wider">In Batch</div>
                </div>
              </div>

              {/* Bell Curve Distribution */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Score Distribution</div>
                <div className="flex items-end justify-between gap-1 h-28 bg-white rounded-lg p-4 border border-indigo-200">
                  {peerComparison.distribution.map((bucket, idx) => {
                    const maxCount = Math.max(...peerComparison.distribution.map(b => b.count));
                    const height = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
                    const isYourBucket = bucket.range === peerComparison.yourBucket;
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full rounded-t-lg relative" style={{ height: `${height}%`, minHeight: '6px' }}>
                          {isYourBucket && (
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg flex items-center justify-center shadow-lg">
                              <Award className="w-4 h-4 text-white font-bold" />
                            </div>
                          )}
                          {!isYourBucket && bucket.count > 0 && (
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-400 to-gray-300 rounded-t-lg" />
                          )}
                          {bucket.count === 0 && (
                            <div className="absolute inset-0 bg-gray-200 rounded-t-lg opacity-40" />
                          )}
                        </div>
                        <div className="text-[10px] font-bold text-gray-700 text-center">
                          {bucket.range}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-sm font-semibold text-gray-800 bg-white rounded-lg p-3 border border-indigo-200">
                <span>📊 Avg: <span className="text-indigo-600">{peerComparison.stats.avg}</span></span>
                <span>📈 Median: <span className="text-indigo-600">{peerComparison.stats.median}</span></span>
              </div>
            </div>
          )}

          {/* Improvement Tips */}
          {tips.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                How to Improve
              </h3>
              
              <div className="space-y-3">
                {tips.slice(0, 3).map((tip, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`${getImpactColor(tip.impact)} font-bold text-xs`}>
                            {tip.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs font-bold bg-amber-100 text-amber-900">
                            +{tip.points}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-800">{tip.tip}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* View Details Button */}
          {onViewDetails && (
            <Button onClick={onViewDetails} className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary hover:to-blue-700 text-white font-bold py-3 text-base shadow-lg">
              <TrendingUp className="w-5 h-5 mr-2" />
              View Detailed Analysis
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
