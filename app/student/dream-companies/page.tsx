"use client";

import { useState, useEffect } from "react";
import StudentSidebarLayout from "@/components/student-sidebar-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, TrendingUp, Clock, ExternalLink, BookOpen, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface DreamCompany {
  id: string;
  company_name: string;
  target_role: string;
  current_match_percentage: number;
  missing_skills: string[];
  estimated_time_to_ready: string;
}

export default function DreamCompaniesPage() {
  const { toast } = useToast();
  const [dreamCompanies, setDreamCompanies] = useState<DreamCompany[]>([
    {
      id: "1",
      company_name: "Google",
      target_role: "Software Engineer",
      current_match_percentage: 75,
      missing_skills: ["System Design", "Go", "Kubernetes"],
      estimated_time_to_ready: "3 months"
    },
    {
      id: "2",
      company_name: "Microsoft",
      target_role: "Cloud Engineer",
      current_match_percentage: 60,
      missing_skills: ["Azure", "Terraform", "CI/CD"],
      estimated_time_to_ready: "5 months"
    }
  ]);

  const [newCompany, setNewCompany] = useState({
    company_name: "",
    target_role: ""
  });

  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const [showRoadmapDialog, setShowRoadmapDialog] = useState(false);
  const [showLearningDialog, setShowLearningDialog] = useState(false);

  const handleAddCompany = async () => {
    toast({
      title: "Adding dream company",
      description: `${newCompany.company_name} added to your roadmap!`,
    });
    setNewCompany({ company_name: "", target_role: "" });
  };

  const handleViewRoadmap = async (company: DreamCompany) => {
    if (company.missing_skills.length === 0) {
      toast({
        title: "No skills to learn!",
        description: "You already have all required skills.",
      });
      return;
    }

    const skill = company.missing_skills[0];
    setSelectedSkill(skill);
    setLoadingRoadmap(true);
    setShowRoadmapDialog(true);

    try {
      const response = await fetch(`/api/roadmap?skill=${encodeURIComponent(skill)}`);
      const data = await response.json();

      if (data.success) {
        setRoadmapData(data.roadmap);
      }
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      toast({
        title: "Error",
        description: "Failed to load roadmap",
        variant: "destructive"
      });
    } finally {
      setLoadingRoadmap(false);
    }
  };

  const handleStartLearning = (company: DreamCompany) => {
    if (company.missing_skills.length === 0) return;
    
    setSelectedSkill(company.missing_skills[0]);
    setShowLearningDialog(true);
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <StudentSidebarLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dream Companies Roadmap</h1>
            <p className="text-muted-foreground mt-1">
              Track your progress towards your target companies
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Dream Company
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Dream Company</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    placeholder="e.g., Amazon"
                    value={newCompany.company_name}
                    onChange={(e) => setNewCompany({ ...newCompany, company_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Target Role</Label>
                  <Input
                    placeholder="e.g., SDE II"
                    value={newCompany.target_role}
                    onChange={(e) => setNewCompany({ ...newCompany, target_role: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddCompany} className="w-full">
                  Add Company
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dream Companies Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {dreamCompanies.map((company) => (
            <Card key={company.id} className="border-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{company.company_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {company.target_role}
                    </CardDescription>
                  </div>
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Match Percentage */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Match Percentage</span>
                    <span className={`text-2xl font-bold ${getMatchColor(company.current_match_percentage)}`}>
                      {company.current_match_percentage}%
                    </span>
                  </div>
                  <Progress value={company.current_match_percentage} className="h-2" />
                </div>

                {/* Missing Skills */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Skills to Learn</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {company.missing_skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Estimated time to ready: <strong>{company.estimated_time_to_ready}</strong>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => handleViewRoadmap(company)}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Roadmap
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleStartLearning(company)}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start Learning
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {dreamCompanies.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No dream companies added yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your target companies to track your readiness
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Dream Company
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Roadmap Dialog */}
        <Dialog open={showRoadmapDialog} onOpenChange={setShowRoadmapDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden flex flex-col">
            <DialogHeader className="border-b p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
              <DialogTitle className="text-2xl">
                {selectedSkill} - Learning Roadmap
              </DialogTitle>
            </DialogHeader>
            
            <div className="overflow-y-auto flex-1 p-6">
              {loadingRoadmap ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading roadmap...</p>
                </div>
              ) : roadmapData ? (
                <div className="space-y-6">
                {/* Overview */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="text-lg font-semibold">{roadmapData.duration}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Difficulty</div>
                      <Badge className="mt-1">{roadmapData.difficulty}</Badge>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Phases</div>
                      <div className="text-lg font-semibold">{roadmapData.phases?.length || 0}</div>
                    </div>
                  </div>
                </div>

                {/* Prerequisites */}
                {roadmapData.prerequisites && roadmapData.prerequisites.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Prerequisites:</h3>
                    <div className="flex flex-wrap gap-2">
                      {roadmapData.prerequisites.map((prereq: string) => (
                        <Badge key={prereq} variant="outline">{prereq}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Phases */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Learning Path:</h3>
                  {roadmapData.phases?.map((phase: any) => (
                    <Card key={phase.phase} className="border-l-4 border-l-indigo-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <Badge variant="secondary" className="mb-2">Phase {phase.phase}</Badge>
                            <CardTitle className="text-lg">{phase.title}</CardTitle>
                            <CardDescription className="flex items-center gap-2 mt-1">
                              <Clock className="w-4 h-4" />
                              {phase.duration}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Topics */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Topics to cover:</h4>
                          <ul className="space-y-1">
                            {phase.topics?.map((topic: string, idx: number) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-green-500 mt-0.5">✓</span>
                                {topic}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Resources */}
                        {phase.resources && phase.resources.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Learning Resources:</h4>
                            <div className="space-y-2">
                              {phase.resources.map((resource: any, idx: number) => (
                                <a
                                  key={idx}
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    {resource.type === 'video' && <Play className="w-4 h-4 text-red-500" />}
                                    {resource.type === 'article' && <BookOpen className="w-4 h-4 text-blue-500" />}
                                    {resource.type === 'course' && <BookOpen className="w-4 h-4 text-purple-500" />}
                                    {resource.type === 'practice' && <Target className="w-4 h-4 text-green-500" />}
                                    <div>
                                      <div className="text-sm font-medium">{resource.title}</div>
                                      <div className="text-xs text-gray-500">{resource.platform}</div>
                                    </div>
                                  </div>
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Milestones */}
                {roadmapData.milestones && roadmapData.milestones.length > 0 && (
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-green-600" />
                        Success Milestones
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {roadmapData.milestones.map((milestone: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 mt-0.5">🎯</span>
                            <span className="text-sm">{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : null}
            </div>
          </DialogContent>
        </Dialog>

        {/* Learning Resources Dialog */}
        <Dialog open={showLearningDialog} onOpenChange={setShowLearningDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Start Learning {selectedSkill || ""}
              </DialogTitle>
            </DialogHeader>
            
            {selectedSkill && (
            <Tabs defaultValue="videos" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
                <TabsTrigger value="docs">Docs</TabsTrigger>
              </TabsList>

              <TabsContent value="videos" className="space-y-3 mt-4">
                <h3 className="font-semibold">Recommended Video Tutorials:</h3>
                {[
                  { title: `${selectedSkill} Tutorial for Beginners`, platform: "YouTube", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedSkill + " tutorial beginners")}` },
                  { title: `${selectedSkill} Crash Course`, platform: "YouTube", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedSkill + " crash course")}` },
                  { title: `Advanced ${selectedSkill} Tutorial`, platform: "YouTube", url: `https://www.youtube.com/results?search_query=${encodeURIComponent("advanced " + selectedSkill)}` },
                  { title: `${selectedSkill} Project Tutorial`, platform: "YouTube", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedSkill + " project tutorial")}` }
                ].map((video, idx) => (
                  <a
                    key={idx}
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-red-500" />
                      <div>
                        <div className="font-medium">{video.title}</div>
                        <div className="text-sm text-gray-500">{video.platform}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </TabsContent>

              <TabsContent value="courses" className="space-y-3 mt-4">
                <h3 className="font-semibold">Online Courses:</h3>
                {[
                  { title: `Complete ${selectedSkill} Course`, platform: "Udemy", url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(selectedSkill)}` },
                  { title: `${selectedSkill} Specialization`, platform: "Coursera", url: `https://www.coursera.org/search?query=${encodeURIComponent(selectedSkill)}` },
                  { title: `Learn ${selectedSkill}`, platform: "Pluralsight", url: `https://www.pluralsight.com/search?q=${encodeURIComponent(selectedSkill)}` },
                  { title: `${selectedSkill} Path`, platform: "LinkedIn Learning", url: `https://www.linkedin.com/learning/search?keywords=${encodeURIComponent(selectedSkill)}` }
                ].map((course, idx) => (
                  <a
                    key={idx}
                    href={course.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.platform}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </TabsContent>

              <TabsContent value="practice" className="space-y-3 mt-4">
                <h3 className="font-semibold">Practice & Build Projects:</h3>
                {[
                  { title: `${selectedSkill} Practice Problems`, platform: "LeetCode", url: `https://leetcode.com/problemset/all/?search=${encodeURIComponent(selectedSkill)}` },
                  { title: `${selectedSkill} Projects`, platform: "GitHub", url: `https://github.com/search?q=${encodeURIComponent(selectedSkill + " projects")}` },
                  { title: `${selectedSkill} Challenges`, platform: "HackerRank", url: `https://www.hackerrank.com/domains/tutorials/10-days-of-${encodeURIComponent(selectedSkill.toLowerCase())}` },
                  { title: `Build with ${selectedSkill}`, platform: "DEV Community", url: `https://dev.to/search?q=${encodeURIComponent(selectedSkill)}` }
                ].map((practice, idx) => (
                  <a
                    key={idx}
                    href={practice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium">{practice.title}</div>
                        <div className="text-sm text-gray-500">{practice.platform}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </TabsContent>

              <TabsContent value="docs" className="space-y-3 mt-4">
                <h3 className="font-semibold">Official Documentation & Guides:</h3>
                {[
                  { title: `${selectedSkill} Official Docs`, platform: "Official", url: `https://www.google.com/search?q=${encodeURIComponent(selectedSkill + " official documentation")}` },
                  { title: `${selectedSkill} Getting Started`, platform: "Docs", url: `https://www.google.com/search?q=${encodeURIComponent(selectedSkill + " getting started guide")}` },
                  { title: `${selectedSkill} Best Practices`, platform: "Medium", url: `https://medium.com/search?q=${encodeURIComponent(selectedSkill + " best practices")}` },
                  { title: `${selectedSkill} Cheat Sheet`, platform: "Dev.to", url: `https://dev.to/search?q=${encodeURIComponent(selectedSkill + " cheat sheet")}` }
                ].map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-sm text-gray-500">{doc.platform}</div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                ))}
              </TabsContent>
            </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </StudentSidebarLayout>
  );
}
