"use client";

import { Users, TrendingUp, Award, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ShadowProfileData {
  hired_count: number;
  avg_gpa: number;
  common_skills: string[];
  graduation_years: number[];
  branches: string[];
  sample_profiles?: Array<{
    gpa: number;
    year: number;
    branch: string;
    skills: string[];
  }>;
}

interface ShadowProfileProps {
  data: ShadowProfileData;
  companyName: string;
}

export function ShadowProfile({ data, companyName }: ShadowProfileProps) {
  // Don't show if no historical data
  if (!data || data.hired_count === 0) {
    return null;
  }

  // Determine color based on hired count
  const getBadgeColor = () => {
    if (data.hired_count >= 5) return "bg-green-100 text-green-800 border-green-200";
    if (data.hired_count >= 3) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-orange-100 text-orange-800 border-orange-200";
  };

  const getMatchStrength = () => {
    if (data.hired_count >= 5) return "Strong";
    if (data.hired_count >= 3) return "Good";
    return "Fair";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`border-2 ${getBadgeColor().replace("text-", "border-")} hover:shadow-lg transition-all cursor-help`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full ${getBadgeColor()} flex items-center justify-center`}>
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">Who Got In?</h3>
                    <Badge variant="outline" className={getBadgeColor()}>
                      {getMatchStrength()} Match
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <span className="font-bold text-primary">{data.hired_count}</span> senior
                    {data.hired_count > 1 ? "s" : ""} from our college with similar skills{" "}
                    {data.hired_count > 1 ? "were" : "was"} hired at{" "}
                    <span className="font-semibold">{companyName}</span>
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {data.avg_gpa > 0 && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <Award className="w-4 h-4 text-yellow-600" />
                    <div>
                      <p className="text-xs text-gray-600">Avg CGPA</p>
                      <p className="text-sm font-bold text-gray-900">{data.avg_gpa}</p>
                    </div>
                  </div>
                )}

                {data.graduation_years.length > 0 && (
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-600">Years</p>
                      <p className="text-sm font-bold text-gray-900">
                        {Math.min(...data.graduation_years)}-{Math.max(...data.graduation_years)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Common Skills */}
              {data.common_skills.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Most Common Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {data.common_skills.slice(0, 5).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TooltipTrigger>

        <TooltipContent className="max-w-sm p-4" side="right">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm mb-2">📊 Historical Insights</h4>
              <p className="text-xs text-gray-600">
                This data shows anonymized profiles of students from our college who successfully
                got offers from {companyName} in previous years.
              </p>
            </div>

            {data.branches.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Branches:</p>
                <div className="flex flex-wrap gap-1">
                  {data.branches.map((branch, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {branch}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {data.sample_profiles && data.sample_profiles.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-700 mb-2">Sample Profiles:</p>
                <div className="space-y-2">
                  {data.sample_profiles.map((profile, idx) => (
                    <div key={idx} className="bg-gray-50 rounded p-2 text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{profile.branch}</span>
                        <span className="text-gray-600">{profile.year}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>CGPA: {profile.gpa}</span>
                      </div>
                      {profile.skills && profile.skills.length > 0 && (
                        <div className="mt-1 flex gap-1 flex-wrap">
                          {profile.skills.map((skill, sidx) => (
                            <span key={sidx} className="text-[10px] bg-white px-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500 italic border-t pt-2">
              💡 Your chances improve with matching skills and competitive CGPA
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
