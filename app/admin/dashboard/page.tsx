"use client";

import { useState, useEffect } from "react";
import AdminNav from "@/components/admin-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Plus, Users, Building, TrendingUp, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface Drive {
  id: string;
  company_name: string;
  job_title: string;
  drive_date: string;
  status: string;
  registered_count?: number;
}

export default function AdminDashboard() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeDrives: 0,
    upcomingDrives: 0,
    atRiskStudents: 0
  });

  // Form state for creating drives
  const [formData, setFormData] = useState({
    companyName: "",
    logo_url: "",
    website: "",
    description: "",
    industry: "",
    job_title: "",
    jd_text: "",
    drive_date: new Date(),
    drive_time: "",
    registration_deadline: new Date(),
    location: "",
    job_type: "Full-time",
    salary_range: "",
    eligibility_criteria: {
      gpa_min: "",
      branches: [] as string[],
      skills: [] as string[]
    },
    required_skills: "",
    preferred_skills: ""
  });

  const [whatIfCriteria, setWhatIfCriteria] = useState({
    gpa_min: 7.5,
    branches: ["CS", "IT"],
    skills: ["Python"]
  });

  const [eligibilityForecast, setEligibilityForecast] = useState({
    eligible: 0,
    total: 0,
    percentage: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard");
      const data = await response.json();
      setDrives(data.drives || []);
      
      // Fetch at-risk students count from predictive analytics
      try {
        const analyticsResponse = await fetch("/api/admin/predictive-analytics?action=at-risk");
        const analyticsData = await analyticsResponse.json();
        const atRiskCount = analyticsData.success ? analyticsData.students.length : 0;
        
        setStats({
          ...data.stats,
          atRiskStudents: atRiskCount
        });
      } catch (error) {
        console.error("Failed to fetch at-risk count:", error);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  const handleCreateDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const driveData = {
      ...formData,
      eligibility_criteria: {
        gpa_min: parseFloat(formData.eligibility_criteria.gpa_min),
        branches: formData.eligibility_criteria.branches,
        skills: formData.required_skills.split(",").map(s => s.trim())
      },
      required_skills: formData.required_skills.split(",").map(s => s.trim()),
      preferred_skills: formData.preferred_skills.split(",").map(s => s.trim())
    };

    try {
      const response = await fetch("/api/admin/drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driveData)
      });

      if (response.ok) {
        alert("Drive created successfully!");
        fetchDashboardData();
        // Reset form
        setFormData({
          companyName: "",
          logo_url: "",
          website: "",
          description: "",
          industry: "",
          job_title: "",
          jd_text: "",
          drive_date: new Date(),
          drive_time: "",
          registration_deadline: new Date(),
          location: "",
          job_type: "Full-time",
          salary_range: "",
          eligibility_criteria: {
            gpa_min: "",
            branches: [],
            skills: []
          },
          required_skills: "",
          preferred_skills: ""
        });
      }
    } catch (error) {
      console.error("Failed to create drive:", error);
      alert("Failed to create drive");
    }
  };

  const runWhatIfSimulation = async () => {
    try {
      const response = await fetch("/api/admin/eligibility-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(whatIfCriteria)
      });
      const data = await response.json();
      setEligibilityForecast(data);
    } catch (error) {
      console.error("Failed to run simulation:", error);
    }
  };

  return (
    <>
      <AdminNav />
      <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="outline">Placement Officer</Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Drives</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeDrives}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Drives</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingDrives}</div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50"
          onClick={() => window.location.href = '/admin/analytics'}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At-Risk Students</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.atRiskStudents}</div>
            <p className="text-xs text-orange-600 mt-1">Click to view analytics →</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="create" className="space-y-4">
        <TabsList>
          <TabsTrigger value="create">Create Drive</TabsTrigger>
          <TabsTrigger value="drives">Manage Drives</TabsTrigger>
          <TabsTrigger value="forecast">What-If Simulator</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Placement Drive</CardTitle>
              <CardDescription>Add company details, JD, and schedule drive</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateDrive} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title *</Label>
                    <Input
                      id="job_title"
                      value={formData.job_title}
                      onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo_url">Company Logo URL</Label>
                    <Input
                      id="logo_url"
                      type="url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({...formData, logo_url: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job_type">Job Type</Label>
                    <Select
                      value={formData.job_type}
                      onValueChange={(value) => setFormData({...formData, job_type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary_range">Salary Range</Label>
                    <Input
                      id="salary_range"
                      placeholder="e.g., ₹8-12 LPA"
                      value={formData.salary_range}
                      onChange={(e) => setFormData({...formData, salary_range: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drive_date">Drive Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.drive_date, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.drive_date}
                          onSelect={(date) => date && setFormData({...formData, drive_date: date})}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="drive_time">Drive Time</Label>
                    <Input
                      id="drive_time"
                      type="time"
                      value={formData.drive_time}
                      onChange={(e) => setFormData({...formData, drive_time: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registration_deadline">Registration Deadline *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(formData.registration_deadline, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.registration_deadline}
                          onSelect={(date) => date && setFormData({...formData, registration_deadline: date})}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpa_min">Minimum GPA</Label>
                    <Input
                      id="gpa_min"
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={formData.eligibility_criteria.gpa_min}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligibility_criteria: {
                          ...formData.eligibility_criteria,
                          gpa_min: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jd_text">Job Description *</Label>
                  <Textarea
                    id="jd_text"
                    value={formData.jd_text}
                    onChange={(e) => setFormData({...formData, jd_text: e.target.value})}
                    rows={8}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="required_skills">Required Skills (comma-separated) *</Label>
                  <Input
                    id="required_skills"
                    placeholder="e.g., Python, React, Node.js"
                    value={formData.required_skills}
                    onChange={(e) => setFormData({...formData, required_skills: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferred_skills">Preferred Skills (comma-separated)</Label>
                  <Input
                    id="preferred_skills"
                    placeholder="e.g., Docker, AWS, GraphQL"
                    value={formData.preferred_skills}
                    onChange={(e) => setFormData({...formData, preferred_skills: e.target.value})}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Placement Drive
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Placement Drives</CardTitle>
              <CardDescription>View and manage placement drives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {drives.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No drives created yet</p>
                ) : (
                  drives.map((drive) => (
                    <Card key={drive.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{drive.company_name}</CardTitle>
                            <CardDescription>{drive.job_title}</CardDescription>
                          </div>
                          <Badge>{drive.status}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(drive.drive_date).toLocaleDateString()}
                        </p>
                        {drive.registered_count !== undefined && (
                          <p className="text-sm mt-2">
                            Registrations: <span className="font-semibold">{drive.registered_count}</span>
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eligibility "What-If" Simulator</CardTitle>
              <CardDescription>
                Adjust criteria to see how many students would be eligible
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sim_gpa">Minimum GPA: {whatIfCriteria.gpa_min}</Label>
                <Input
                  id="sim_gpa"
                  type="range"
                  min="5"
                  max="10"
                  step="0.1"
                  value={whatIfCriteria.gpa_min}
                  onChange={(e) => setWhatIfCriteria({
                    ...whatIfCriteria,
                    gpa_min: parseFloat(e.target.value)
                  })}
                />
              </div>

              <Button onClick={runWhatIfSimulation} className="w-full">
                Run Simulation
              </Button>

              {eligibilityForecast.total > 0 && (
                <Card className="bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <p className="text-4xl font-bold text-primary">
                        {eligibilityForecast.percentage}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {eligibilityForecast.eligible} out of {eligibilityForecast.total} students are eligible
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>Coming soon: Advanced analytics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This section will include charts, graphs, and predictive analytics.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </>
  );
}
