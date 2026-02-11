'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Briefcase, MapPin, DollarSign, Search, Heart } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  level: string
  description: string
  tags: string[]
  match: number
  application_url?: string
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '$200-240K',
    level: 'Senior',
    description: 'Looking for experienced engineers to build scalable systems',
    tags: ['Go', 'System Design', 'Leadership'],
    match: 95,
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    salary: '$150-190K',
    level: 'Mid',
    description: 'Join our cloud team to build next-gen products',
    tags: ['React', 'Node.js', 'Azure'],
    match: 88,
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'Amazon',
    location: 'Remote',
    salary: '$170-210K',
    level: 'Senior',
    description: 'Build infrastructure for millions of customers',
    tags: ['Java', 'AWS', 'Microservices'],
    match: 85,
  },
  {
    id: '4',
    title: 'Frontend Engineer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salary: '$180-220K',
    level: 'Mid',
    description: 'Create experiences for billions of users',
    tags: ['React', 'TypeScript', 'Performance'],
    match: 92,
  },
]

export function JobListings() {
  const [jobs, setJobs] = useState(mockJobs)
  const [searchTerm, setSearchTerm] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleFavorite = (jobId: string) => {
    setFavorites((prev) =>
      prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]
    )
  }

  const handleApplyNow = (job: Job) => {
    if (job.application_url) {
      window.open(job.application_url, '_blank')
    } else {
      // Fallback: Construct URL based on company career page
      const companyUrls: { [key: string]: string } = {
        'Google': 'https://careers.google.com',
        'Microsoft': 'https://careers.microsoft.com',
        'Amazon': 'https://amazon.jobs',
        'Meta': 'https://www.metacareers.com',
      }
      const url = companyUrls[job.company] || `https://www.google.com/search?q=${job.company}+careers`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Briefcase className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Discover Jobs</h1>
              <p className="text-slate-400">AI-matched opportunities for you</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title, company, or location..."
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 py-6"
            />
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="border-slate-700 bg-slate-800 hover:border-blue-400 transition">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white">{job.title}</h3>
                        <p className="text-slate-400">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="border-slate-600 text-slate-200">{job.level}</Badge>
                      <div className="flex items-center gap-1 text-slate-300 text-sm">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1 text-green-400 font-semibold text-sm">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    </div>

                    <p className="text-slate-300 mb-4">{job.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <Badge key={tag} className="bg-blue-900 text-blue-300 hover:bg-blue-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">{job.match}%</div>
                      <p className="text-xs text-slate-400">Match</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(job.id)}
                        className={favorites.includes(job.id) ? 'text-red-400' : 'text-slate-400'}
                      >
                        <Heart className="w-5 h-5" fill={favorites.includes(job.id) ? 'currentColor' : 'none'} />
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleApplyNow(job)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No jobs found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}
