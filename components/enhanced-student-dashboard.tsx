"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, TrendingUp, Target, Award, Calendar, CheckCircle, XCircle, Clock, BarChart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  read: boolean;
  created_at: Date;
  action_url?: string;
  metadata?: any;
}

interface DriveStats {
  registered: number;
  participated: number;
  skipped: number;
  offers: number;
}

export function EnhancedStudentDashboard() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [placementReadinessScore, setPlacementReadinessScore] = useState(75);
  const [driveStats, setDriveStats] = useState<DriveStats>({
    registered: 12,
    participated: 8,
    skipped: 2,
    offers: 1
  });
  const [timeFilter, setTimeFilter] = useState("all");

  useEffect(() => {
    fetchNotifications();
    fetchDashboardStats();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications?userId=current&unreadOnly=false");
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/student/dashboard-stats");
      const data = await response.json();
      setPlacementReadinessScore(data.placementReadinessScore || 75);
      setDriveStats(data.driveStats || driveStats);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationIds: [notificationId],
          markAsRead: true
        })
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "default";
      case "normal": return "secondary";
      default: return "outline";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <div className="relative">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 px-2 py-1 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Placement Readiness Score */}
      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Placement Readiness Score (PRS)
          </CardTitle>
          <CardDescription>Your overall readiness for placements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-5xl font-bold ${getScoreColor(placementReadinessScore)}`}>
                {placementReadinessScore}/100
              </span>
              <Badge variant="outline">Top 25%</Badge>
            </div>
            <Progress value={placementReadinessScore} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Profile</p>
                <p className="font-semibold">25/30</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mocks</p>
                <p className="font-semibold">18/30</p>
              </div>
              <div>
                <p className="text-muted-foreground">Activity</p>
                <p className="font-semibold">32/40</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications {unreadCount > 0 && `(${unreadCount})`}
          </TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="dream">Dream Companies</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered</CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{driveStats.registered}</div>
                <p className="text-xs text-muted-foreground">drives registered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Participated</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{driveStats.participated}</div>
                <p className="text-xs text-muted-foreground">drives attended</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Skipped</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{driveStats.skipped}</div>
                <p className="text-xs text-muted-foreground">missed drives</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offers</CardTitle>
                <Award className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{driveStats.offers}</div>
                <p className="text-xs text-muted-foreground">job offers</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="default">
                  Browse Available Jobs
                </Button>
                <Button className="w-full" variant="outline">
                  Take Mock Interview
                </Button>
                <Button className="w-full" variant="outline">
                  Update Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Drives</CardTitle>
                <CardDescription>Your registered drives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">Google - SDE</p>
                      <p className="text-sm text-muted-foreground">March 15, 2026</p>
                    </div>
                    <Badge>87% Match</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-semibold">Microsoft - SDE II</p>
                      <p className="text-sm text-muted-foreground">March 20, 2026</p>
                    </div>
                    <Badge>92% Match</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>Stay updated with drive alerts and reminders</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {notifications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No notifications yet</p>
                  ) : (
                    notifications.map((notification) => (
                      <Card 
                        key={notification.id} 
                        className={notification.read ? "opacity-60" : "border-primary"}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{notification.title}</CardTitle>
                            <Badge variant={getPriorityColor(notification.priority) as any}>
                              {notification.priority}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {notification.message}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notification.created_at).toLocaleString()}
                            </span>
                            {!notification.read && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Performance Analytics
              </CardTitle>
              <CardDescription>Track your placement journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant={timeFilter === "week" ? "default" : "outline"}
                    onClick={() => setTimeFilter("week")}
                  >
                    Last Week
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeFilter === "month" ? "default" : "outline"}
                    onClick={() => setTimeFilter("month")}
                  >
                    Last Month
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeFilter === "year" ? "default" : "outline"}
                    onClick={() => setTimeFilter("year")}
                  >
                    Last Year
                  </Button>
                  <Button 
                    size="sm" 
                    variant={timeFilter === "all" ? "default" : "outline"}
                    onClick={() => setTimeFilter("all")}
                  >
                    All Time
                  </Button>
                </div>
                
                <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/30">
                  <p className="text-muted-foreground">
                    📊 Charts will be displayed here (Bar/Line charts for drives over time)
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-500">
                          {driveStats.registered}
                        </p>
                        <p className="text-sm text-muted-foreground">Registered</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">
                          {driveStats.participated}
                        </p>
                        <p className="text-sm text-muted-foreground">Participated</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-500">
                          {driveStats.skipped}
                        </p>
                        <p className="text-sm text-muted-foreground">Skipped</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dream" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Dream Company Roadmap
              </CardTitle>
              <CardDescription>Track your progress towards target companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <DreamCompanyCard 
                  company="Google"
                  role="Software Engineer"
                  matchPercentage={67}
                  missingSkills={["System Design", "Distributed Systems"]}
                  estimatedTime="3 months"
                />
                <DreamCompanyCard 
                  company="Microsoft"
                  role="SDE II"
                  matchPercentage={82}
                  missingSkills={["Azure", "C#"]}
                  estimatedTime="1 month"
                />
                <DreamCompanyCard 
                  company="Amazon"
                  role="SDE I"
                  matchPercentage={75}
                  missingSkills={["AWS", "Leadership Principles"]}
                  estimatedTime="2 months"
                />
                <Button className="w-full" variant="outline">
                  + Add Dream Company
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function DreamCompanyCard({ 
  company, 
  role, 
  matchPercentage, 
  missingSkills, 
  estimatedTime 
}: {
  company: string;
  role: string;
  matchPercentage: number;
  missingSkills: string[];
  estimatedTime: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{company}</CardTitle>
            <CardDescription>{role}</CardDescription>
          </div>
          <Badge variant={matchPercentage >= 75 ? "default" : "secondary"}>
            {matchPercentage}% Match
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={matchPercentage} className="h-2" />
        
        <div>
          <p className="text-sm font-medium mb-2">Missing Skills:</p>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <Badge key={skill} variant="outline">{skill}</Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Est. {estimatedTime}
          </span>
          <Button size="sm">View Roadmap</Button>
        </div>
      </CardContent>
    </Card>
  );
}
