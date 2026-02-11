'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Target, Plus, TrendingUp, CheckCircle2, Clock, XCircle, ArrowUpRight, Award, Users, Zap } from 'lucide-react'

interface Application {
  id: string
  company: string
  position: string
  status: 'applied' | 'reviewing' | 'interview' | 'offered' | 'rejected'
  appliedDate: string
  salary?: string
  location: string
}

const mockApplications: Application[] = [
  { id: '1', company: 'Google', position: 'Software Engineer', status: 'interview', appliedDate: '2024-02-01', salary: '$150K', location: 'Mountain View' },
  { id: '2', company: 'Microsoft', position: 'Full Stack Developer', status: 'reviewing', appliedDate: '2024-02-05', location: 'Seattle' },
  { id: '3', company: 'Amazon', position: 'Backend Engineer', status: 'applied', appliedDate: '2024-02-08', location: 'Seattle' },
  { id: '4', company: 'Meta', position: 'Frontend Engineer', status: 'offered', appliedDate: '2024-01-15', salary: '$180K', location: 'Menlo Park' },
]

const statusConfig = {
  applied: { label: 'Applied', color: 'bg-blue-500', icon: Clock },
  reviewing: { label: 'Under Review', color: 'bg-yellow-500', icon: Clock },
  interview: { label: 'Interview', color: 'bg-purple-500', icon: TrendingUp },
  offered: { label: 'Offered', color: 'bg-green-500', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-500', icon: XCircle },
}

export function StudentDashboard() {
  const router = useRouter()
  const [applications, setApplications] = useState(mockApplications)
  const [newJob, setNewJob] = useState({ company: '', position: '', location: '' })
  const [readinessData, setReadinessData] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchReadinessScore(parsedUser.id);
    }
  }, []);

  const fetchReadinessScore = async (userId: string) => {
    try {
      const response = await fetch(`/api/student/readiness-score?studentId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setReadinessData(data);
      }
    } catch (error) {
      console.error("Error fetching readiness score:", error);
    }
  };
  const handleAddJob = () => {
    if (newJob.company && newJob.position) {
      setApplications([...applications, {
        id: Date.now().toString(),
        ...newJob,
        status: 'applied',
        appliedDate: new Date().toISOString().split('T')[0],
      }])
      setNewJob({ company: '', position: '', location: '' })
    }
  }

  const getApplicationsByStatus = (status: Application['status']) => {
    return applications.filter(app => app.status === status)
  }

  const stats = {
    total: applications.length,
    offered: applications.filter(a => a.status === 'offered').length,
    interviews: applications.filter(a => a.status === 'interview').length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Target className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">My Dashboard</h1>
              <p className="text-slate-400">Track your job applications and placement progress</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" /> Add Application
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add Job Application</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-200">Company Name</Label>
                  <Input
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    placeholder="e.g., Google"
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Position</Label>
                  <Input
                    value={newJob.position}
                    onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                    placeholder="e.g., Software Engineer"
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-200">Location</Label>
                  <Input
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    placeholder="e.g., San Francisco"
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button onClick={handleAddJob} className="w-full bg-blue-600 hover:bg-blue-700">
                  Add Application
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Readiness Score Widget - Prominent Feature */}
        {readinessData && (
          <Card className="border-blue-500 bg-gradient-to-br from-blue-900 to-purple-900 mb-8 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2 text-2xl">
                    <Award className="w-7 h-7 text-yellow-400" />
                    Placement Readiness Score
                  </CardTitle>
                  <CardDescription className="text-blue-200 mt-1">
                    Your comprehensive placement preparation metric
                  </CardDescription>
                </div>
                <Button
                  onClick={() => router.push('/student/readiness')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold"
                >
                  View Details <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Score Display */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="none"
                        className="text-blue-300 opacity-30"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 70}`}
                        strokeDashoffset={`${2 * Math.PI * 70 * (1 - readinessData.readinessScore / 100)}`}
                        className="text-yellow-400"
                        strokeLinecap="round"
                      />
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-white">{readinessData.readinessScore}</div>
                      <div className="text-sm text-blue-200">out of 100</div>
                      <div className="text-3xl mt-1">{readinessData.level.emoji}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats and Actions */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-500 text-gray-900 text-base px-3 py-1">
                      {readinessData.level.label}
                    </Badge>
                    {readinessData.peerComparison && readinessData.peerComparison.batchSize > 0 && (
                      <div className="flex items-center gap-2 text-sm text-blue-200">
                        <Users className="w-4 h-4" />
                        <span>{readinessData.peerComparison.percentile}th percentile</span>
                      </div>
                    )}
                  </div>

                  {/* Component Breakdown */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm text-white">
                        <span>Profile Completeness</span>
                        <span>{readinessData.breakdown.profileCompleteness.percentage}%</span>
                      </div>
                      <Progress value={readinessData.breakdown.profileCompleteness.percentage} className="h-2 bg-blue-300" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm text-white">
                        <span>Mock Interviews</span>
                        <span>{readinessData.breakdown.mockInterviews.percentage}%</span>
                      </div>
                      <Progress value={readinessData.breakdown.mockInterviews.percentage} className="h-2 bg-purple-300" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm text-white">
                        <span>Application Activity</span>
                        <span>{readinessData.breakdown.applicationActivity.percentage}%</span>
                      </div>
                      <Progress value={readinessData.breakdown.applicationActivity.percentage} className="h-2 bg-green-300" />
                    </div>
                  </div>

                  {/* Top Tip */}
                  {readinessData.tips && readinessData.tips.length > 0 && (
                    <div className="bg-blue-800 bg-opacity-50 rounded-lg p-3 border border-blue-400">
                      <div className="flex items-start gap-2">
                        <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-blue-200 font-medium mb-1">Quick Win</p>
                          <p className="text-sm text-white">{readinessData.tips[0].tip}</p>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {readinessData.tips[0].points}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="border-slate-700 bg-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Applications</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Interview Rounds</p>
                  <p className="text-3xl font-bold text-white">{stats.interviews}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Offers Received</p>
                  <p className="text-3xl font-bold text-green-400">{stats.offered}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Application Pipeline</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((status) => {
              const config = statusConfig[status]
              const statusApps = getApplicationsByStatus(status)
              const Icon = config.icon

              return (
                <div key={status} className="bg-slate-700 bg-opacity-50 rounded-lg p-4 min-h-[500px]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                    <h3 className="font-semibold text-white">{config.label}</h3>
                    <Badge variant="secondary" className="ml-auto">{statusApps.length}</Badge>
                  </div>

                  <div className="space-y-3">
                    {statusApps.map((app) => (
                      <div key={app.id} className="bg-slate-600 rounded-lg p-3 hover:bg-slate-500 transition cursor-pointer">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-white text-sm">{app.company}</p>
                            <p className="text-xs text-slate-300">{app.position}</p>
                            <p className="text-xs text-slate-400 mt-2">{app.location}</p>
                          </div>
                        </div>
                        {app.salary && (
                          <div className="mt-2 pt-2 border-t border-slate-500">
                            <p className="text-xs font-semibold text-green-400 flex items-center gap-1">
                              <ArrowUpRight className="w-3 h-3" /> {app.salary}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 mt-2">Applied: {app.appliedDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Skills Tab */}
        <Tabs defaultValue="applications" className="mt-8">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="applications" className="text-slate-200">Applications</TabsTrigger>
            <TabsTrigger value="skills" className="text-slate-200">Skill Gaps</TabsTrigger>
            <TabsTrigger value="companies" className="text-slate-200">Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">All Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applications.map((app) => {
                    const config = statusConfig[app.status]
                    const Icon = config.icon
                    return (
                      <div key={app.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-white font-semibold">{app.company}</p>
                            <p className="text-sm text-slate-400">{app.position} • {app.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {app.salary && <span className="text-green-400 font-semibold">{app.salary}</span>}
                          <Badge className={`${config.color}`}>{config.label}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Skill Gap Analysis</CardTitle>
                <CardDescription>AI-recommended skills to improve</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                    <h3 className="font-semibold text-white mb-2">To Land Google SDE Role</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Advanced Algorithms</Badge>
                      <Badge variant="outline">System Design</Badge>
                      <Badge variant="outline">Go Programming</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="mt-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Company Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Google', match: '92%', opening: 'Senior SDE' },
                    { name: 'Microsoft', match: '88%', opening: 'Cloud Architect' },
                    { name: 'Amazon', match: '85%', opening: 'DevOps Engineer' },
                  ].map((company) => (
                    <div key={company.name} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div>
                        <p className="text-white font-semibold">{company.name}</p>
                        <p className="text-sm text-slate-400">{company.opening}</p>
                      </div>
                      <Badge className="bg-green-600">{company.match}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
