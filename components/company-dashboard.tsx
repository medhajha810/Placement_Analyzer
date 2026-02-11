'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Briefcase, Plus, Users, TrendingUp, CheckCircle2, Clock } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface JobPosting {
  id: string
  title: string
  location: string
  level: string
  salary: string
  applications: number
  status: 'open' | 'closed' | 'hiring'
}

interface Candidate {
  id: string
  name: string
  position: string
  experience: string
  match: number
  status: 'screening' | 'interview' | 'offer' | 'hired'
}

const mockJobs: JobPosting[] = [
  { id: '1', title: 'Senior Software Engineer', location: 'SF', level: 'Senior', salary: '$180-220K', applications: 145, status: 'open' },
  { id: '2', title: 'Product Manager', location: 'NYC', level: 'Mid', salary: '$150-180K', applications: 89, status: 'open' },
  { id: '3', title: 'Data Scientist', location: 'Remote', level: 'Senior', salary: '$170-210K', applications: 112, status: 'hiring' },
]

const mockCandidates: Candidate[] = [
  { id: '1', name: 'Alex Johnson', position: 'Senior SDE', experience: '5 years', match: 95, status: 'interview' },
  { id: '2', name: 'Sarah Chen', position: 'Senior SDE', experience: '6 years', match: 92, status: 'offer' },
  { id: '3', name: 'Mike Rodriguez', position: 'SDE', experience: '3 years', match: 88, status: 'screening' },
  { id: '4', name: 'Emma Wilson', position: 'Senior SDE', experience: '7 years', match: 96, status: 'hired' },
]

const chartData = [
  { month: 'Jan', applications: 280, hired: 12 },
  { month: 'Feb', applications: 320, hired: 18 },
  { month: 'Mar', applications: 410, hired: 25 },
  { month: 'Apr', applications: 380, hired: 22 },
  { month: 'May', applications: 450, hired: 28 },
  { month: 'Jun', applications: 520, hired: 35 },
]

const statusConfig = {
  screening: { color: 'bg-blue-500', label: 'Screening' },
  interview: { color: 'bg-yellow-500', label: 'Interview' },
  offer: { color: 'bg-purple-500', label: 'Offer' },
  hired: { color: 'bg-green-500', label: 'Hired' },
}

export function CompanyDashboard() {
  const [jobs, setJobs] = useState<JobPosting[]>(mockJobs)
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [newJob, setNewJob] = useState({ title: '', location: '', level: '', salary: '' })

  const handleAddJob = () => {
    if (newJob.title && newJob.location) {
      setJobs([...jobs, {
        id: Date.now().toString(),
        ...newJob,
        applications: 0,
        status: 'open',
      }])
      setNewJob({ title: '', location: '', level: '', salary: '' })
    }
  }

  const stats = {
    totalJobs: jobs.length,
    totalApplications: jobs.reduce((sum, job) => sum + job.applications, 0),
    hired: candidates.filter(c => c.status === 'hired').length,
    avgMatch: Math.round(candidates.reduce((sum, c) => sum + c.match, 0) / candidates.length),
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Company Dashboard</h1>
              <p className="text-slate-400">Manage job postings and top candidates</p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                <Plus className="w-4 h-4" /> Post Job
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Post New Job</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-200">Job Title</Label>
                  <Input
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g., Senior Software Engineer"
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-slate-200">Location</Label>
                    <Input
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      placeholder="e.g., San Francisco"
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-200">Level</Label>
                    <Input
                      value={newJob.level}
                      onChange={(e) => setNewJob({ ...newJob, level: e.target.value })}
                      placeholder="e.g., Senior"
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-200">Salary Range</Label>
                  <Input
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    placeholder="e.g., $180-220K"
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button onClick={handleAddJob} className="w-full bg-blue-600 hover:bg-blue-700">
                  Post Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-700 bg-slate-800">
            <CardContent className="pt-6">
              <div>
                <p className="text-slate-400 text-sm">Open Positions</p>
                <p className="text-3xl font-bold text-white">{stats.totalJobs}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800">
            <CardContent className="pt-6">
              <div>
                <p className="text-slate-400 text-sm">Applications</p>
                <p className="text-3xl font-bold text-white">{stats.totalApplications}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800">
            <CardContent className="pt-6">
              <div>
                <p className="text-slate-400 text-sm">Hired</p>
                <p className="text-3xl font-bold text-green-400">{stats.hired}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-700 bg-slate-800">
            <CardContent className="pt-6">
              <div>
                <p className="text-slate-400 text-sm">Avg Match %</p>
                <p className="text-3xl font-bold text-blue-400">{stats.avgMatch}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Applications Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Hiring Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }} />
                  <Legend />
                  <Bar dataKey="hired" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="jobs" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="jobs" className="text-slate-200">Job Postings</TabsTrigger>
            <TabsTrigger value="candidates" className="text-slate-200">Top Candidates</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="mt-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Your Job Postings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg border border-slate-600 hover:border-blue-400 transition">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{job.title}</h3>
                        <div className="flex gap-2 mt-2 text-sm text-slate-400">
                          <span>{job.location}</span>
                          <span>•</span>
                          <span>{job.level}</span>
                          <span>•</span>
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-blue-400 font-semibold">{job.applications}</p>
                          <p className="text-xs text-slate-400">applications</p>
                        </div>
                        <Badge className={job.status === 'open' ? 'bg-green-600' : 'bg-yellow-600'}>
                          {job.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates" className="mt-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Top Candidates</CardTitle>
                <CardDescription>AI-matched candidates ranked by fit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {candidates.map((candidate) => {
                    const config = statusConfig[candidate.status as keyof typeof statusConfig]
                    return (
                      <div key={candidate.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-slate-400">{candidate.position} • {candidate.experience}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-green-400 font-semibold text-lg">{candidate.match}%</p>
                            <p className="text-xs text-slate-400">Match</p>
                          </div>
                          <Badge className={`${config.color}`}>{config.label}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
