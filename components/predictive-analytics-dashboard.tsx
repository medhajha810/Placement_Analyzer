"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  TrendingUp,
  Users,
  Lightbulb,
  Search,
  Target,
  CheckCircle,
  XCircle,
  Zap,
  RefreshCw
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AtRiskStudent {
  id: string;
  name: string;
  email: string;
  gpa: number;
  branch: string;
  graduationYear: number;
  riskScore: number;
  riskLevel: string;
  riskFactors: string[];
  profileCompleteness: number;
  readinessScore: number;
  skillCount: number;
}

interface Recommendation {
  type: string;
  priority: string;
  title: string;
  description: string;
  action: string;
  impact: string;
  icon: string;
}

interface ForecastCriteria {
  minGpa: string;
  requiredSkills: string;
  preferredSkills: string;
  branches: string;
  minReadinessScore: string;
  graduationYear: string;
}

export function PredictiveAnalyticsDashboard() {
  const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([]);
  const [forecastResult, setForecastResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [forecasting, setForecasting] = useState(false);
  
  const [criteria, setCriteria] = useState<ForecastCriteria>({
    minGpa: "",
    requiredSkills: "",
    preferredSkills: "",
    branches: "",
    minReadinessScore: "",
    graduationYear: ""
  });

  useEffect(() => {
    fetchAtRiskStudents();
  }, []);

  const fetchAtRiskStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/predictive-analytics?action=at-risk");
      const data = await response.json();
      
      if (data.success) {
        setAtRiskStudents(data.students);
      }
    } catch (error) {
      console.error("Error fetching at-risk students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForecast = async () => {
    try {
      setForecasting(true);
      
      // Parse criteria
      const parsedCriteria: any = {};
      
      if (criteria.minGpa) parsedCriteria.minGpa = parseFloat(criteria.minGpa);
      if (criteria.requiredSkills) {
        parsedCriteria.requiredSkills = criteria.requiredSkills
          .split(",")
          .map(s => s.trim())
          .filter(s => s);
      }
      if (criteria.preferredSkills) {
        parsedCriteria.preferredSkills = criteria.preferredSkills
          .split(",")
          .map(s => s.trim())
          .filter(s => s);
      }
      if (criteria.branches) {
        parsedCriteria.branches = criteria.branches
          .split(",")
          .map(s => s.trim())
          .filter(s => s);
      }
      if (criteria.minReadinessScore) {
        parsedCriteria.minReadinessScore = parseInt(criteria.minReadinessScore);
      }
      if (criteria.graduationYear) {
        parsedCriteria.graduationYear = parseInt(criteria.graduationYear);
      }

      const response = await fetch("/api/admin/predictive-analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forecast", criteria: parsedCriteria })
      });

      const data = await response.json();
      
      if (data.success) {
        setForecastResult(data.forecast);
      }
    } catch (error) {
      console.error("Error forecasting eligibility:", error);
    } finally {
      setForecasting(false);
    }
  };

  const getRiskColor = (level: string) => {
    if (level === "critical") return "bg-red-100 text-red-800 border-red-300";
    if (level === "high") return "bg-orange-100 text-orange-800 border-orange-300";
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  };

  const getPriorityColor = (priority: string) => {
    if (priority === "critical") return "bg-red-500 text-white";
    if (priority === "high") return "bg-orange-500 text-white";
    if (priority === "medium") return "bg-yellow-500 text-gray-900";
    return "bg-blue-500 text-white";
  };

  return (
    <div className="space-y-6">
      {/* At-Risk Students Section */}
      <Card className="border-2 border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                Students At Risk
              </CardTitle>
              <CardDescription className="mt-1">
                Students who may struggle with placements without intervention
              </CardDescription>
            </div>
            <Button onClick={fetchAtRiskStudents} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading risk assessment...</div>
          ) : atRiskStudents.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">No students currently at high risk!</p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center gap-3">
                <Badge className="bg-red-500 text-white px-3 py-1">
                  {atRiskStudents.filter(s => s.riskLevel === "critical").length} Critical
                </Badge>
                <Badge className="bg-orange-500 text-white px-3 py-1">
                  {atRiskStudents.filter(s => s.riskLevel === "high").length} High Risk
                </Badge>
                <Badge className="bg-yellow-500 text-gray-900 px-3 py-1">
                  {atRiskStudents.filter(s => s.riskLevel === "medium").length} Medium Risk
                </Badge>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {atRiskStudents.map((student) => (
                  <Card key={student.id} className={`border-2 ${getRiskColor(student.riskLevel)}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{student.name}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {student.branch}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              GPA: {student.gpa}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">
                            {student.riskScore}
                          </div>
                          <div className="text-xs text-gray-600">Risk Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-3">
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-sm font-semibold">{student.profileCompleteness}%</div>
                          <div className="text-xs text-gray-600">Profile</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-sm font-semibold">{student.readinessScore}</div>
                          <div className="text-xs text-gray-600">Readiness</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-sm font-semibold">{student.skillCount}</div>
                          <div className="text-xs text-gray-600">Skills</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-700">Risk Factors:</p>
                        {student.riskFactors.map((factor, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                            <XCircle className="w-3 h-3 text-red-500" />
                            {factor}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Eligibility Forecasting Section */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="w-6 h-6 text-blue-500" />
            Eligibility Forecasting
          </CardTitle>
          <CardDescription>
            Test hypothetical JD criteria to see how many students currently qualify
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Minimum GPA</Label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g., 7.5"
                value={criteria.minGpa}
                onChange={(e) => setCriteria({ ...criteria, minGpa: e.target.value })}
              />
            </div>

            <div>
              <Label>Minimum Readiness Score</Label>
              <Input
                type="number"
                placeholder="e.g., 60"
                value={criteria.minReadinessScore}
                onChange={(e) => setCriteria({ ...criteria, minReadinessScore: e.target.value })}
              />
            </div>

            <div>
              <Label>Required Skills (comma-separated)</Label>
              <Input
                placeholder="e.g., Python, React, Node.js"
                value={criteria.requiredSkills}
                onChange={(e) => setCriteria({ ...criteria, requiredSkills: e.target.value })}
              />
            </div>

            <div>
              <Label>Preferred Skills (comma-separated)</Label>
              <Input
                placeholder="e.g., Docker, AWS"
                value={criteria.preferredSkills}
                onChange={(e) => setCriteria({ ...criteria, preferredSkills: e.target.value })}
              />
            </div>

            <div>
              <Label>Eligible Branches (comma-separated)</Label>
              <Input
                placeholder="e.g., Computer Science, IT"
                value={criteria.branches}
                onChange={(e) => setCriteria({ ...criteria, branches: e.target.value })}
              />
            </div>

            <div>
              <Label>Graduation Year</Label>
              <Input
                type="number"
                placeholder="e.g., 2026"
                value={criteria.graduationYear}
                onChange={(e) => setCriteria({ ...criteria, graduationYear: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={handleForecast}
            disabled={forecasting}
            className="w-full"
            size="lg"
          >
            <Search className="w-4 h-4 mr-2" />
            {forecasting ? "Analyzing..." : "Run Forecast"}
          </Button>

          {/* Forecast Results */}
          {forecastResult && (
            <div className="mt-6 space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-300">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">
                      {forecastResult.eligibilityRate}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Eligibility Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">
                      {forecastResult.eligibleCount}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Eligible Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600">
                      {forecastResult.totalStudents - forecastResult.eligibleCount}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Need Support</div>
                  </div>
                </div>

                <Progress value={forecastResult.eligibilityRate} className="h-3" />
              </div>

              {/* Recommendations */}
              {forecastResult.recommendations && forecastResult.recommendations.length > 0 && (
                <Card className="border-2 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Actionable Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {forecastResult.recommendations.map((rec: Recommendation, idx: number) => (
                      <Card key={idx} className="border">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="text-3xl">{rec.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{rec.title}</h3>
                                <Badge className={getPriorityColor(rec.priority)}>
                                  {rec.priority}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                              <div className="bg-blue-50 rounded-lg p-3 mb-2">
                                <p className="text-sm font-medium text-blue-900">
                                  <Zap className="w-4 h-4 inline mr-1" />
                                  Action: {rec.action}
                                </p>
                              </div>
                              <p className="text-xs text-gray-600 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Impact: {rec.impact}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Detailed Lists */}
              <Tabs defaultValue="eligible" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="eligible">
                    Eligible ({forecastResult.eligibleCount})
                  </TabsTrigger>
                  <TabsTrigger value="ineligible">
                    Need Support ({forecastResult.totalStudents - forecastResult.eligibleCount})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="eligible" className="space-y-2 max-h-64 overflow-y-auto">
                  {forecastResult.eligible.map((student: any) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.branch} • GPA: {student.gpa}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="ineligible" className="space-y-2 max-h-64 overflow-y-auto">
                  {forecastResult.ineligible.map((student: any) => (
                    <div key={student.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.branch} • GPA: {student.gpa}</p>
                        </div>
                        <XCircle className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="space-y-1">
                        {student.gaps.map((gap: string, idx: number) => (
                          <p key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                            <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                            {gap}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
