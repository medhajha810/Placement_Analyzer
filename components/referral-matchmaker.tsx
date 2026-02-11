"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Briefcase, Clock, TrendingUp, CheckCircle2, AlertCircle, ExternalLink, Filter, Send } from "lucide-react";

interface Referral {
  id: number;
  postedByName: string;
  companyName: string;
  jobTitle: string;
  jobType: string;
  jobDescription: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minGPA: number;
  minSuitabilityScore: number;
  graduationYear: number;
  referralLink: string;
  applicationDeadline: string;
  maxReferrals: number;
  currentReferrals: number;
  slotsAvailable: number;
  tags: string[];
  createdAt: string;
  matchedSkills: string[];
  suitabilityScore: number;
  meetsGPA: boolean;
  meetsMinScore: boolean;
  isEligible: boolean;
}

interface Application {
  id: number;
  referralId: number;
  companyName: string;
  jobTitle: string;
  postedByName: string;
  suitabilityScore: number;
  status: string;
  appliedAt: string;
  notes: string;
}

interface Stats {
  totalReferrals: number;
  activeReferrals: number;
  totalSlots: number;
  companiesCount: number;
  myApplications: number;
  avgMatchScore: number;
}

export default function ReferralMatchmaker() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [applicationNotes, setApplicationNotes] = useState("");
  const [applying, setApplying] = useState(false);
  
  // Filters
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");

  useEffect(() => {
    fetchReferrals();
    fetchApplications();
    fetchStats();
  }, [companyFilter, jobTypeFilter]);

  const fetchReferrals = async () => {
    try {
      let url = "/api/referral-matchmaker?action=get-referrals&studentId=mock-student-123";
      if (companyFilter) url += `&company=${companyFilter}`;
      if (jobTypeFilter !== "all") url += `&jobType=${jobTypeFilter}`;

      const response = await fetch(url);
      const data = await response.json();
      setReferrals(data.referrals || []);
    } catch (error) {
      console.error("Error fetching referrals:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/referral-matchmaker?action=get-my-applications&studentId=mock-student-123");
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/referral-matchmaker?action=get-stats");
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleApply = async () => {
    if (!selectedReferral) return;

    setApplying(true);
    try {
      const response = await fetch("/api/referral-matchmaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "apply-referral",
          studentId: "mock-student-123",
          referralId: selectedReferral.id,
          notes: applicationNotes
        })
      });

      const data = await response.json();
      if (data.success) {
        setApplyDialogOpen(false);
        setApplicationNotes("");
        fetchReferrals();
        fetchApplications();
        fetchStats();
      }
    } catch (error) {
      console.error("Error applying to referral:", error);
    } finally {
      setApplying(false);
    }
  };

  const getSuitabilityColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getSuitabilityLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Below Requirements";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied": return "bg-blue-500";
      case "shortlisted": return "bg-yellow-500";
      case "interviewed": return "bg-purple-500";
      case "offer": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading referrals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Referral Matchmaker
        </h1>
        <p className="text-muted-foreground mt-1">
          Alumni-posted referral opportunities matched to your skills
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.activeReferrals}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Slots</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalSlots}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Companies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.companiesCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>My Applications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{stats.myApplications}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Match Score</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.avgMatchScore}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Referrals</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalReferrals}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="browse">Browse Referrals</TabsTrigger>
          <TabsTrigger value="applications">My Applications ({applications.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by company name..."
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Referrals Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {referrals.map((referral) => (
              <Card key={referral.id} className={`relative ${!referral.isEligible ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{referral.companyName}</CardTitle>
                      <CardDescription>{referral.jobTitle}</CardDescription>
                    </div>
                    <Badge className="shrink-0">{referral.jobType}</Badge>
                  </div>

                  {/* Suitability Score */}
                  <div className="mt-4 p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Your Match Score</span>
                      <span className={`text-2xl font-bold ${getSuitabilityColor(referral.suitabilityScore)}`}>
                        {referral.suitabilityScore}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {getSuitabilityLabel(referral.suitabilityScore)}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Posted By */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Posted by <span className="font-medium">{referral.postedByName}</span></span>
                  </div>

                  {/* Description */}
                  <p className="text-sm line-clamp-2">{referral.jobDescription}</p>

                  {/* Skills Match */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Matched Skills ({referral.matchedSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {referral.matchedSkills.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-green-600 text-green-600">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Min GPA:</span>
                      <span className={`ml-2 font-semibold ${referral.meetsGPA ? 'text-green-600' : 'text-red-600'}`}>
                        {referral.minGPA}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Min Score:</span>
                      <span className={`ml-2 font-semibold ${referral.meetsMinScore ? 'text-green-600' : 'text-red-600'}`}>
                        {referral.minSuitabilityScore}%
                      </span>
                    </div>
                  </div>

                  {/* Deadline & Slots */}
                  <div className="flex items-center justify-between text-sm border-t pt-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Deadline: {new Date(referral.applicationDeadline).toLocaleDateString()}</span>
                    </div>
                    <div className={`flex items-center gap-1 font-semibold ${
                      referral.slotsAvailable > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <Briefcase className="h-4 w-4" />
                      <span>{referral.slotsAvailable} / {referral.maxReferrals} slots</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {referral.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {referral.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Eligibility Warning */}
                  {!referral.isEligible && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      <div className="text-xs text-red-600">
                        <p className="font-semibold mb-1">Not Eligible</p>
                        {!referral.meetsGPA && <p>• Your GPA is below minimum required</p>}
                        {!referral.meetsMinScore && <p>• Your match score is below minimum required</p>}
                        {referral.slotsAvailable === 0 && <p>• All referral slots are filled</p>}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => {
                      setSelectedReferral(referral);
                      setApplyDialogOpen(true);
                    }}
                    disabled={!referral.isEligible}
                    className="w-full"
                    variant={referral.isEligible ? "default" : "outline"}
                  >
                    {referral.isEligible ? (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Apply for Referral
                      </>
                    ) : (
                      "Not Eligible"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {referrals.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Referrals Found</h3>
                <p className="text-muted-foreground text-center">
                  No active referrals match your filters. Try adjusting your search criteria.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{app.companyName}</CardTitle>
                        <CardDescription>{app.jobTitle}</CardDescription>
                      </div>
                      <Badge className={`${getStatusColor(app.status)} text-white`}>
                        {getStatusLabel(app.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Posted by:</span>
                      <span className="font-medium">{app.postedByName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Match Score:</span>
                      <span className={`font-bold ${getSuitabilityColor(app.suitabilityScore)}`}>
                        {app.suitabilityScore}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Applied On:</span>
                      <span className="font-medium">{new Date(app.appliedAt).toLocaleDateString()}</span>
                    </div>
                    {app.notes && (
                      <div className="text-sm border-t pt-3">
                        <p className="text-muted-foreground mb-1">Your Note:</p>
                        <p className="italic">{app.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground text-center">
                  You haven't applied to any referrals yet. Browse available referrals and apply!
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Apply Dialog */}
      <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
        <DialogContent>
          {selectedReferral && (
            <>
              <DialogHeader>
                <DialogTitle>Apply for Referral</DialogTitle>
                <DialogDescription>
                  {selectedReferral.companyName} - {selectedReferral.jobTitle}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Your Match Score</span>
                    <span className={`text-2xl font-bold ${getSuitabilityColor(selectedReferral.suitabilityScore)}`}>
                      {selectedReferral.suitabilityScore}%
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getSuitabilityLabel(selectedReferral.suitabilityScore)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Add a personal note (optional)
                  </label>
                  <textarea
                    className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                    placeholder="Why are you interested in this role? What makes you a good fit?"
                    value={applicationNotes}
                    onChange={(e) => setApplicationNotes(e.target.value)}
                  />
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-600">
                    You'll be redirected to the referral link. Make sure to mention you're applying through this platform!
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleApply} disabled={applying} className="flex-1">
                    {applying ? "Applying..." : "Apply & Open Referral Link"}
                  </Button>
                  <Button variant="outline" onClick={() => setApplyDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>

                {selectedReferral.referralLink && (
                  <a
                    href={selectedReferral.referralLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Referral Link
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
