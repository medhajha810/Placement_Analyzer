"use client";

import { useState, useEffect } from "react";
import StudentSidebarLayout from "@/components/student-sidebar-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, TrendingUp, Calendar, Award } from "lucide-react";

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year" | "all">("month");
  const [stats, setStats] = useState({
    registered: 0,
    participated: 0,
    skipped: 0,
    offers: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeFilter]);

  const fetchAnalytics = async () => {
    // TODO: Fetch filtered analytics based on timeFilter
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    try {
      const response = await fetch(`/api/student/dashboard-stats?studentId=${user.id}`);
      const data = await response.json();
      setStats(data.stats || { registered: 0, participated: 0, skipped: 0, offers: 0 });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    }
  };

  return (
    <StudentSidebarLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <BarChart className="h-8 w-8 text-blue-600" />
        </div>

        {/* Time Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={timeFilter === "week" ? "default" : "outline"}
                onClick={() => setTimeFilter("week")}
              >
                Last Week
              </Button>
              <Button
                variant={timeFilter === "month" ? "default" : "outline"}
                onClick={() => setTimeFilter("month")}
              >
                Last Month
              </Button>
              <Button
                variant={timeFilter === "year" ? "default" : "outline"}
                onClick={() => setTimeFilter("year")}
              >
                Last Year
              </Button>
              <Button
                variant={timeFilter === "all" ? "default" : "outline"}
                onClick={() => setTimeFilter("all")}
              >
                All Time
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Registered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.registered}</div>
              <p className="text-xs text-muted-foreground mt-1">Drives registered</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Participated</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.participated}</div>
              <p className="text-xs text-muted-foreground mt-1">Drives attended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Skipped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats.skipped}</div>
              <p className="text-xs text-muted-foreground mt-1">Missed opportunities</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Offers Received</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{stats.offers}</div>
              <p className="text-xs text-muted-foreground mt-1">Job offers</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="comparison">Peer Comparison</TabsTrigger>
            <TabsTrigger value="skills">Skill Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Application Trends</CardTitle>
                <CardDescription>
                  Your application activity over time ({timeFilter})
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Chart will render here</p>
                    <p className="text-sm">(Recharts integration ready)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Peer Comparison</CardTitle>
                <CardDescription>
                  See how you compare with your batch
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Percentile chart will render here</p>
                    <p className="text-sm">(Your PRS: 75/100 - Top 15%)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Skill Development Progress</CardTitle>
                <CardDescription>
                  Track your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Skill progress chart will render here</p>
                    <p className="text-sm">(Completed: 5 skills | In Progress: 3)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentSidebarLayout>
  );
}
