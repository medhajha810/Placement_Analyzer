"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, TrendingUp, Clock, Zap, BookOpen, CheckCircle2, XCircle, Sparkles, Trophy, Brain, Rocket } from "lucide-react";

interface DreamCompany {
  id: number;
  companyName: string;
  targetRole: string;
  priority: number;
  distanceToDream: number;
  matchedSkills: string[];
  missingSkills: string[];
  weakAreas: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  minGPA: number;
  avgCTC: number;
  codingDifficulty: string;
  commonTopics: string[];
  interviewPattern: string;
  addedAt: string;
}

interface RecommendedAction {
  action: string;
  priority: string;
  estimatedTime: string;
  impact: string;
  resources: string[];
}

interface Roadmap {
  distanceToDream: number;
  matchedSkills: string[];
  missingSkills: string[];
  weakAreas: string[];
  recommendedActions: RecommendedAction[];
  milestones: Array<{
    title: string;
    completed: boolean;
    dueDate: string;
  }>;
}

interface PopularCompany {
  companyName: string;
  targetRole: string;
  studentCount: number;
  avgDistance: number;
  readyStudents: number;
}

export default function DreamCompanyRoadmap() {
  const [dreamCompanies, setDreamCompanies] = useState<DreamCompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<DreamCompany | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [popularCompanies, setPopularCompanies] = useState<PopularCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [roadmapDialogOpen, setRoadmapDialogOpen] = useState(false);
  
  // Form state for adding dream company
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [addingCompany, setAddingCompany] = useState(false);

  useEffect(() => {
    fetchDreamCompanies();
    fetchPopularCompanies();
  }, []);

  const fetchDreamCompanies = async () => {
    try {
      const response = await fetch("/api/dream-roadmap?action=get-dream-companies&studentId=mock-student-123");
      const data = await response.json();
      setDreamCompanies(data.dreamCompanies || []);
    } catch (error) {
      console.error("Error fetching dream companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularCompanies = async () => {
    try {
      const response = await fetch("/api/dream-roadmap?action=get-popular-companies");
      const data = await response.json();
      setPopularCompanies(data.popularCompanies || []);
    } catch (error) {
      console.error("Error fetching popular companies:", error);
    }
  };

  const fetchRoadmap = async (dreamCompanyId: number) => {
    try {
      const response = await fetch(`/api/dream-roadmap?action=get-roadmap&dreamCompanyId=${dreamCompanyId}`);
      const data = await response.json();
      setRoadmap(data.roadmap);
    } catch (error) {
      console.error("Error fetching roadmap:", error);
    }
  };

  const addDreamCompany = async () => {
    if (!newCompany || !newRole) return;
    if (dreamCompanies.length >= 3) {
      alert("You can only add 3 dream companies maximum");
      return;
    }

    setAddingCompany(true);
    try {
      const response = await fetch("/api/dream-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add-dream-company",
          studentId: "mock-student-123",
          companyName: newCompany,
          targetRole: newRole
        })
      });

      const data = await response.json();
      if (data.success) {
        fetchDreamCompanies();
        setAddDialogOpen(false);
        setNewCompany("");
        setNewRole("");
      }
    } catch (error) {
      console.error("Error adding dream company:", error);
    } finally {
      setAddingCompany(false);
    }
  };

  const removeDreamCompany = async (dreamCompanyId: number) => {
    if (!confirm("Remove this dream company?")) return;

    try {
      await fetch("/api/dream-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "remove-dream-company",
          dreamCompanyId
        })
      });

      fetchDreamCompanies();
    } catch (error) {
      console.error("Error removing dream company:", error);
    }
  };

  const viewRoadmap = (company: DreamCompany) => {
    setSelectedCompany(company);
    fetchRoadmap(company.id);
    setRoadmapDialogOpen(true);
  };

  const getDistanceColor = (distance: number) => {
    if (distance <= 30) return "text-green-600";
    if (distance <= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getDistanceLabel = (distance: number) => {
    if (distance <= 30) return "🎯 Ready to Apply!";
    if (distance <= 60) return "⚡ Getting Close";
    return "🚀 Long Journey Ahead";
  };

  const getPriorityBadge = (priority: number) => {
    const colors = {
      1: "bg-yellow-500",
      2: "bg-blue-500",
      3: "bg-gray-500"
    };
    const labels = {
      1: "🥇 Priority 1",
      2: "🥈 Priority 2",
      3: "🥉 Priority 3"
    };
    return <Badge className={`${colors[priority as keyof typeof colors]} text-white`}>{labels[priority as keyof typeof labels]}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dream roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Target className="h-8 w-8 text-primary" />
            Dream Company Roadmap
          </h1>
          <p className="text-muted-foreground mt-1">
            Pick your top 3 dream companies and get a personalized roadmap to reach them
          </p>
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="lg" 
              disabled={dreamCompanies.length >= 3}
              className="gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Add Dream Company {dreamCompanies.length > 0 && `(${dreamCompanies.length}/3)`}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Your Dream Company</DialogTitle>
              <DialogDescription>
                Choose a target company and role. We'll calculate your "Distance to Dream" and show exactly what you need to get there.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="company">Company Name</Label>
                <Select value={newCompany} onValueChange={setNewCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Amazon">Amazon</SelectItem>
                    <SelectItem value="Microsoft">Microsoft</SelectItem>
                    <SelectItem value="Meta">Meta (Facebook)</SelectItem>
                    <SelectItem value="Apple">Apple</SelectItem>
                    <SelectItem value="Netflix">Netflix</SelectItem>
                    <SelectItem value="Uber">Uber</SelectItem>
                    <SelectItem value="Flipkart">Flipkart</SelectItem>
                    <SelectItem value="Atlassian">Atlassian</SelectItem>
                    <SelectItem value="Adobe">Adobe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="role">Target Role</Label>
                <Input
                  id="role"
                  placeholder="e.g., SDE-1, Software Engineer, Data Analyst"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                />
              </div>

              <Button 
                onClick={addDreamCompany} 
                disabled={addingCompany || !newCompany || !newRole}
                className="w-full"
              >
                {addingCompany ? "Adding..." : "Add Dream Company"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State */}
      {dreamCompanies.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Dream Companies Yet</h3>
            <p className="text-muted-foreground text-center mb-4 max-w-md">
              Add your top 3 target companies to see personalized roadmaps showing exactly what skills you need to acquire.
            </p>
            <Button onClick={() => setAddDialogOpen(true)} size="lg">
              <Sparkles className="mr-2 h-5 w-5" />
              Add Your First Dream Company
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Dream Companies Grid */}
      {dreamCompanies.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {dreamCompanies.map((company) => (
            <Card key={company.id} className="relative overflow-hidden">
              <div className="absolute top-0 right-0">
                {getPriorityBadge(company.priority)}
              </div>
              
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  {company.companyName}
                </CardTitle>
                <CardDescription>{company.targetRole}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Distance to Dream */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Distance to Dream</span>
                    <span className={`text-2xl font-bold ${getDistanceColor(company.distanceToDream)}`}>
                      {company.distanceToDream}
                    </span>
                  </div>
                  <Progress value={100 - company.distanceToDream} className="h-3" />
                  <p className="text-xs text-muted-foreground text-center">
                    {getDistanceLabel(company.distanceToDream)}
                  </p>
                </div>

                {/* Skills Summary */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{company.matchedSkills.length} Skills Matched</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {company.matchedSkills.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-green-600 text-green-600">
                        {skill}
                      </Badge>
                    ))}
                    {company.matchedSkills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{company.matchedSkills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">{company.missingSkills.length} Skills Missing</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {company.missingSkills.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs border-red-600 text-red-600">
                        {skill}
                      </Badge>
                    ))}
                    {company.missingSkills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{company.missingSkills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Company Info */}
                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg CTC</span>
                    <span className="font-semibold">₹{company.avgCTC} LPA</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Difficulty</span>
                    <Badge variant={
                      company.codingDifficulty === "Hard" ? "destructive" :
                      company.codingDifficulty === "Medium" ? "default" : "secondary"
                    }>
                      {company.codingDifficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Min GPA</span>
                    <span className="font-semibold">{company.minGPA}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={() => viewRoadmap(company)}
                    className="flex-1"
                    variant="default"
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    View Roadmap
                  </Button>
                  <Button 
                    onClick={() => removeDreamCompany(company.id)}
                    variant="outline"
                    size="icon"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Popular Dream Companies */}
      {popularCompanies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Dream Companies
            </CardTitle>
            <CardDescription>See what companies other students are targeting</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularCompanies.map((company, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-muted-foreground">#{idx + 1}</span>
                    <div>
                      <p className="font-semibold">{company.companyName}</p>
                      <p className="text-sm text-muted-foreground">{company.targetRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold">{company.studentCount}</p>
                      <p className="text-muted-foreground">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{company.avgDistance}</p>
                      <p className="text-muted-foreground">Avg Distance</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-green-600">{company.readyStudents}</p>
                      <p className="text-muted-foreground">Ready</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roadmap Detail Dialog */}
      <Dialog open={roadmapDialogOpen} onOpenChange={setRoadmapDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCompany && roadmap && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Rocket className="h-6 w-6 text-primary" />
                  Your Roadmap to {selectedCompany.companyName}
                </DialogTitle>
                <DialogDescription>
                  Follow this personalized plan to reach your dream company
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Current Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Distance to Dream</span>
                          <span className={`text-2xl font-bold ${getDistanceColor(roadmap.distanceToDream)}`}>
                            {roadmap.distanceToDream}/100
                          </span>
                        </div>
                        <Progress value={100 - roadmap.distanceToDream} className="h-3" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" />
                            Matched Skills ({roadmap.matchedSkills.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {roadmap.matchedSkills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="border-green-600 text-green-600">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-red-600 flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Missing Skills ({roadmap.missingSkills.length})
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {roadmap.missingSkills.map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="border-red-600 text-red-600">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Recommended Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {roadmap.recommendedActions.map((action, idx) => (
                        <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-lg">{action.action}</h4>
                            <Badge variant={
                              action.priority === "high" ? "destructive" :
                              action.priority === "medium" ? "default" : "secondary"
                            }>
                              {action.priority.toUpperCase()}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {action.estimatedTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" />
                              {action.impact}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <p className="text-sm font-medium flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              Learning Resources:
                            </p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {action.resources.map((resource, ridx) => (
                                <li key={ridx}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Interview Pattern */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Interview Pattern</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{selectedCompany.interviewPattern}</p>
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Common Topics:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.commonTopics.map((topic, idx) => (
                          <Badge key={idx} variant="secondary">{topic}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
