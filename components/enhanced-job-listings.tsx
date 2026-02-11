"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  MapPin, 
  Building, 
  Calendar, 
  TrendingUp, 
  ExternalLink, 
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Clock,
  Youtube,
  Book
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Job {
  id: string;
  source: "drive" | "scraped";
  company_name: string;
  job_title: string;
  location: string;
  salary_range?: string;
  job_type: string;
  drive_date?: Date;
  posted_date?: Date;
  required_skills: string[];
  suitability_score?: number;
  application_url?: string;
  registration_deadline?: Date;
}

interface SkillGap {
  skill: string;
  importance: "low" | "medium" | "high" | "critical";
  resources: LearningResource[];
}

interface LearningResource {
  type: "youtube" | "docs" | "course";
  title: string;
  url: string;
  duration?: string;
  provider: string;
}

export function EnhancedJobListings() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "drive" | "scraped">("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [suitabilityAnalysis, setSuitabilityAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [filterType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Fetch both placement drives and scraped jobs
      const [drivesRes, scrapedRes] = await Promise.all([
        fetch("/api/admin/drives?status=upcoming"),
        fetch("/api/jobs/scrape?keywords=software engineer&limit=10")
      ]);

      const drivesData = await drivesRes.json();
      const scrapedData = await scrapedRes.json();

      const allJobs: Job[] = [
        ...(drivesData.drives || []).map((d: any) => ({
          id: d.id,
          source: "drive",
          company_name: d.company_name,
          job_title: d.job_title,
          location: d.location,
          salary_range: d.salary_range,
          job_type: d.job_type,
          drive_date: new Date(d.drive_date),
          required_skills: d.required_skills || [],
          registration_deadline: d.registration_deadline ? new Date(d.registration_deadline) : undefined
        })),
        ...(scrapedData.jobs || []).map((j: any) => ({
          id: j.external_id,
          source: "scraped",
          company_name: j.company_name,
          job_title: j.job_title,
          location: j.location,
          salary_range: j.salary_range,
          job_type: j.job_type,
          posted_date: new Date(j.posted_date),
          required_skills: j.parsed_skills || [],
          application_url: j.application_url
        }))
      ];

      setJobs(allJobs);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSuitability = async (job: Job) => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/analyze-suitability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: "current", // TODO: Get from auth
          driveId: job.source === "drive" ? job.id : null,
          jobDetails: job
        })
      });

      const data = await response.json();
      setSuitabilityAnalysis(data.analysis);
    } catch (error) {
      console.error("Failed to analyze suitability:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    analyzeSuitability(job);
  };

  const handleRegister = async (jobId: string) => {
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          studentId: "current" // TODO: Get from auth
        })
      });

      if (response.ok) {
        alert("Successfully registered!");
        setSelectedJob(null);
      }
    } catch (error) {
      console.error("Failed to register:", error);
      alert("Registration failed");
    }
  };

  const setReminder = async (jobId: string, reminderTime: Date) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "current",
          driveId: jobId,
          reminderTime
        })
      });

      if (response.ok) {
        alert("Reminder set successfully!");
      }
    } catch (error) {
      console.error("Failed to set reminder:", error);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (filterType !== "all" && job.source !== filterType) return false;
    if (searchQuery && !job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !job.job_title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "critical": return "destructive";
      case "high": return "default";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        <Badge variant="outline">{filteredJobs.length} Available</Badge>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by company or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={filterType} onValueChange={(v: any) => setFilterType(v)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="drive">Campus Drives</TabsTrigger>
                <TabsTrigger value="scraped">External Jobs</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && filteredJobs.length === 0 ? (
          <p className="col-span-3 text-center text-muted-foreground py-8">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="col-span-3 text-center text-muted-foreground py-8">No jobs found</p>
        ) : (
          filteredJobs.map((job) => (
            <Card key={job.id} className="cursor-pointer hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{job.job_title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building className="h-3 w-3" />
                      {job.company_name}
                    </CardDescription>
                  </div>
                  <Badge variant={job.source === "drive" ? "default" : "secondary"}>
                    {job.source === "drive" ? "Campus" : "External"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </div>
                  {job.salary_range && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3" />
                      {job.salary_range}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {job.source === "drive" && job.drive_date
                      ? `Drive: ${job.drive_date.toLocaleDateString()}`
                      : `Posted: ${job.posted_date?.toLocaleDateString()}`}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {job.required_skills.slice(0, 3).map((skill) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {job.required_skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.required_skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      className="w-full" 
                      onClick={() => handleJobClick(job)}
                    >
                      View Details & Apply
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{selectedJob?.job_title}</DialogTitle>
                      <DialogDescription>{selectedJob?.company_name}</DialogDescription>
                    </DialogHeader>

                    {loading ? (
                      <p className="text-center py-8">Analyzing your suitability...</p>
                    ) : suitabilityAnalysis ? (
                      <div className="space-y-6">
                        {/* Suitability Score */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Your Suitability</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-3xl font-bold">
                                {suitabilityAnalysis.suitabilityScore}%
                              </span>
                              <Badge variant={
                                suitabilityAnalysis.suitabilityScore >= 70 ? "default" : "secondary"
                              }>
                                {suitabilityAnalysis.suitabilityScore >= 70 ? "Great Match!" : "Fair Match"}
                              </Badge>
                            </div>
                            <Progress value={suitabilityAnalysis.suitabilityScore} className="h-2" />
                            <p className="text-sm text-muted-foreground">
                              {suitabilityAnalysis.recommendation}
                            </p>
                          </CardContent>
                        </Card>

                        {/* Matched Skills */}
                        {suitabilityAnalysis.matchedSkills?.length > 0 && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                Your Matching Skills
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex flex-wrap gap-2">
                                {suitabilityAnalysis.matchedSkills.map((skill: string) => (
                                  <Badge key={skill} variant="default">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Skill Gaps with Learning Paths */}
                        {suitabilityAnalysis.skillGaps?.length > 0 && (
                          <Card className="border-orange-200">
                            <CardHeader>
                              <CardTitle className="text-base flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-orange-500" />
                                Skills to Improve (Skill-Gap Bridge)
                              </CardTitle>
                              <CardDescription>
                                Learn these skills to boost your chances
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              {suitabilityAnalysis.skillGaps.map((gap: SkillGap) => (
                                <Card key={gap.skill}>
                                  <CardHeader className="pb-3">
                                    <div className="flex justify-between items-center">
                                      <CardTitle className="text-sm">{gap.skill}</CardTitle>
                                      <Badge variant={getImportanceColor(gap.importance) as any}>
                                        {gap.importance}
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <p className="text-sm font-medium">One-Click Learning Resources:</p>
                                    {gap.resources.map((resource, idx) => (
                                      <a
                                        key={idx}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-2 border rounded hover:bg-accent transition-colors"
                                      >
                                        <div className="flex items-center gap-2">
                                          {resource.type === "youtube" ? (
                                            <Youtube className="h-4 w-4 text-red-500" />
                                          ) : (
                                            <Book className="h-4 w-4 text-blue-500" />
                                          )}
                                          <div>
                                            <p className="text-sm font-medium">{resource.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                              {resource.provider}
                                              {resource.duration && ` • ${resource.duration}`}
                                            </p>
                                          </div>
                                        </div>
                                        <ExternalLink className="h-4 w-4" />
                                      </a>
                                    ))}
                                  </CardContent>
                                </Card>
                              ))}
                            </CardContent>
                          </Card>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {selectedJob?.source === "drive" ? (
                            <>
                              <Button 
                                className="flex-1"
                                onClick={() => handleRegister(selectedJob.id)}
                              >
                                Register for Drive
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  const reminderTime = new Date();
                                  reminderTime.setHours(reminderTime.getHours() + 24);
                                  setReminder(selectedJob.id, reminderTime);
                                }}
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                Set Reminder
                              </Button>
                            </>
                          ) : (
                            <Button 
                              className="flex-1"
                              onClick={() => window.open(selectedJob?.application_url, "_blank")}
                            >
                              Apply on {selectedJob?.source}
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        Click "View Details & Apply" to see your suitability analysis
                      </p>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
