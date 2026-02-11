"use client";

import { useState, useEffect } from "react";
import StudentSidebarLayout from "@/components/student-sidebar-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShadowProfile } from "@/components/shadow-profile";
import {
  Search,
  MapPin,
  Briefcase,
  Calendar,
  ExternalLink,
  RefreshCw,
  Filter,
  DollarSign,
  Building2,
  Sparkles
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScrapedJob {
  id?: string;
  source: string;
  external_id: string;
  company_name: string;
  job_title: string;
  job_description: string;
  location: string;
  salary_range?: string;
  job_type: string;
  posted_date: Date | string;
  application_url: string;
  parsed_skills: string[];
  shadow_profile?: {
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
  };
}

export default function ScrapedJobsPage() {
  const [jobs, setJobs] = useState<ScrapedJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<ScrapedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, locationFilter, sourceFilter, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs/scrape?limit=20");
      const data = await response.json();
      
      if (data.jobs) {
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
        setLastUpdated(new Date(data.lastUpdated));
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetch("/api/jobs/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refresh" })
      });
      await fetchJobs();
    } catch (error) {
      console.error("Error refreshing jobs:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.parsed_skills.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter(job => job.source === sourceFilter);
    }

    setFilteredJobs(filtered);
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      linkedin: "bg-blue-100 text-blue-800",
      indeed: "bg-green-100 text-green-800",
      glassdoor: "bg-purple-100 text-purple-800",
      naukri: "bg-orange-100 text-orange-800"
    };
    return colors[source.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString();
  };

  const uniqueLocations = Array.from(new Set(jobs.map(j => j.location.split(",")[0].trim())));
  const uniqueSources = Array.from(new Set(jobs.map(j => j.source)));

  return (
    <StudentSidebarLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-primary" />
                Live Job Opportunities
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time jobs from multiple sources with historical hiring insights
              </p>
            </div>
            
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh Jobs"}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            {mounted && lastUpdated ? `Last updated: ${lastUpdated.toLocaleString()}` : "Loading..."}
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs, companies, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map((loc) => (
                    <SelectItem key={loc} value={loc.toLowerCase()}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {uniqueSources.map((source) => (
                    <SelectItem key={source} value={source}>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold">{filteredJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">With Shadow Profiles</p>
                  <p className="text-2xl font-bold">
                    {filteredJobs.filter(j => j.shadow_profile && j.shadow_profile.hired_count > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Companies</p>
                  <p className="text-2xl font-bold">
                    {new Set(filteredJobs.map(j => j.company_name)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No jobs found matching your filters</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setLocationFilter("all");
                  setSourceFilter("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job, idx) => (
              <Card key={job.external_id || idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{job.job_title}</CardTitle>
                        <Badge className={getSourceColor(job.source)}>
                          {job.source}
                        </Badge>
                      </div>
                      
                      <CardDescription className="flex items-center gap-4 text-base">
                        <span className="flex items-center gap-1 font-medium text-gray-700">
                          <Building2 className="w-4 h-4" />
                          {job.company_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(job.posted_date)}
                        </span>
                      </CardDescription>
                    </div>
                    
                    {job.salary_range && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {job.salary_range}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-gray-700 line-clamp-3">{job.job_description}</p>

                  {/* Skills */}
                  {job.parsed_skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">Required Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {job.parsed_skills.map((skill, sidx) => (
                          <Badge key={sidx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shadow Profile */}
                  {job.shadow_profile && job.shadow_profile.hired_count > 0 && (
                    <div className="pt-2">
                      <ShadowProfile
                        data={job.shadow_profile}
                        companyName={job.company_name}
                      />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <Button asChild className="flex-1">
                      <a
                        href={job.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Apply Now
                      </a>
                    </Button>
                    
                    <Button variant="outline">
                      Save for Later
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StudentSidebarLayout>
  );
}
