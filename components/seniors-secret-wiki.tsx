"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  ThumbsUp,
  Eye,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Award,
  Code,
  Users,
  Lightbulb,
  Filter,
  Star
} from "lucide-react";

interface Experience {
  id: string;
  company_name: string;
  job_title: string;
  job_type: string;
  total_rounds: number;
  offer_received: boolean;
  student_branch?: string;
  student_gpa?: number;
  graduation_year: number;
  helpful_count: number;
  view_count: number;
  tags: string[];
  rounds?: Round[];
}

interface Round {
  round_number: number;
  round_name: string;
  round_type: string;
  duration_minutes: number;
  difficulty: string;
  questions_asked: string;
  topics_covered: string;
  coding_problems?: string;
  preparation_tips: string;
  leetcode_difficulty?: string;
  dsa_topics: string[];
}

export function SeniorsSecretWiki() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(false);
  const [popularCompanies, setPopularCompanies] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  
  // Submission form state
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobType: "Full-time",
    totalRounds: 1,
    offerReceived: false,
    studentBranch: "",
    studentGpa: "",
    graduationYear: new Date().getFullYear(),
    rounds: [
      {
        roundNumber: 1,
        roundName: "",
        roundType: "technical",
        durationMinutes: 60,
        difficulty: "medium",
        questionsAsked: "",
        topicsCovered: "",
        codingProblems: "",
        preparationTips: "",
        dsaTopics: ""
      }
    ]
  });

  useEffect(() => {
    fetchExperiences();
    fetchPopularCompanies();
    fetchTrendingTopics();
  }, []);

  useEffect(() => {
    filterExperiences();
  }, [searchQuery, experiences]);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/senior-secrets?action=search");
      const data = await response.json();
      
      if (data.success) {
        setExperiences(data.experiences);
      }
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularCompanies = async () => {
    try {
      const response = await fetch("/api/senior-secrets?action=popular-companies");
      const data = await response.json();
      
      if (data.success) {
        setPopularCompanies(data.companies);
      }
    } catch (error) {
      console.error("Failed to fetch popular companies:", error);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      const response = await fetch("/api/senior-secrets?action=trending-topics");
      const data = await response.json();
      
      if (data.success) {
        setTrendingTopics(data.topics);
      }
    } catch (error) {
      console.error("Failed to fetch trending topics:", error);
    }
  };

  const filterExperiences = () => {
    if (!searchQuery.trim()) {
      setFilteredExperiences(experiences);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = experiences.filter(exp =>
      exp.company_name.toLowerCase().includes(query) ||
      exp.job_title.toLowerCase().includes(query) ||
      exp.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    setFilteredExperiences(filtered);
  };

  const viewExperience = async (experienceId: string) => {
    try {
      const response = await fetch(`/api/senior-secrets?action=get-experience&id=${experienceId}`);
      const data = await response.json();
      
      if (data.success) {
        setSelectedExperience(data.experience);
      }
    } catch (error) {
      console.error("Failed to fetch experience details:", error);
    }
  };

  const markHelpful = async (experienceId: string) => {
    try {
      const response = await fetch("/api/senior-secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "mark-helpful",
          experienceId,
          ipAddress: "user-ip" // TODO: Get real IP
        })
      });

      if (response.ok) {
        // Update local state
        setExperiences(experiences.map(exp =>
          exp.id === experienceId
            ? { ...exp, helpful_count: exp.helpful_count + 1 }
            : exp
        ));
      }
    } catch (error) {
      console.error("Failed to mark helpful:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const response = await fetch("/api/senior-secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit-experience",
          ...formData
        })
      });

      const data = await response.json();
      
      if (data.success) {
        alert("Thank you for sharing! Your experience will help juniors prepare better. 🎉");
        setShowSubmitDialog(false);
        fetchExperiences();
        // Reset form
        setFormData({
          companyName: "",
          jobTitle: "",
          jobType: "Full-time",
          totalRounds: 1,
          offerReceived: false,
          studentBranch: "",
          studentGpa: "",
          graduationYear: new Date().getFullYear(),
          rounds: [{
            roundNumber: 1,
            roundName: "",
            roundType: "technical",
            durationMinutes: 60,
            difficulty: "medium",
            questionsAsked: "",
            topicsCovered: "",
            codingProblems: "",
            preparationTips: "",
            dsaTopics: ""
          }]
        });
      }
    } catch (error) {
      console.error("Failed to submit experience:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "easy") return "bg-green-500";
    if (difficulty === "medium") return "bg-yellow-500";
    return "bg-red-500";
  };

  const getRoundTypeIcon = (type: string) => {
    if (type === "coding") return <Code className="w-4 h-4" />;
    if (type === "hr") return <Users className="w-4 h-4" />;
    return <Lightbulb className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Submit */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by company, role, or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </div>

        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 gap-2">
              <Plus className="w-5 h-5" />
              Share Your Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Share Interview Experience (Anonymous)</DialogTitle>
              <DialogDescription>
                Help your juniors prepare better by sharing your interview experience
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company Name *</Label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g., Amazon"
                  />
                </div>

                <div>
                  <Label>Job Title *</Label>
                  <Input
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="e.g., SDE-1"
                  />
                </div>

                <div>
                  <Label>Job Type</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) => setFormData({ ...formData, jobType: value })}
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

                <div>
                  <Label>Total Rounds *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.totalRounds}
                    onChange={(e) => setFormData({ ...formData, totalRounds: parseInt(e.target.value) })}
                  />
                </div>

                <div className="col-span-2">
                  <Label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.offerReceived}
                      onChange={(e) => setFormData({ ...formData, offerReceived: e.target.checked })}
                    />
                    Received Offer
                  </Label>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Round Details</h3>
                
                {formData.rounds.map((round, idx) => (
                  <Card key={idx} className="mb-3">
                    <CardHeader>
                      <CardTitle className="text-sm">Round {round.roundNumber}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Round Name</Label>
                          <Input
                            placeholder="e.g., Technical Round 1"
                            value={round.roundName}
                            onChange={(e) => {
                              const newRounds = [...formData.rounds];
                              newRounds[idx].roundName = e.target.value;
                              setFormData({ ...formData, rounds: newRounds });
                            }}
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Difficulty</Label>
                          <Select
                            value={round.difficulty}
                            onValueChange={(value) => {
                              const newRounds = [...formData.rounds];
                              newRounds[idx].difficulty = value;
                              setFormData({ ...formData, rounds: newRounds });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Topics Covered</Label>
                        <Input
                          placeholder="e.g., Dynamic Programming, Trees"
                          value={round.topicsCovered}
                          onChange={(e) => {
                            const newRounds = [...formData.rounds];
                            newRounds[idx].topicsCovered = e.target.value;
                            setFormData({ ...formData, rounds: newRounds });
                          }}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Questions Asked / Coding Problems</Label>
                        <Textarea
                          placeholder="Describe the questions or problems"
                          value={round.codingProblems}
                          onChange={(e) => {
                            const newRounds = [...formData.rounds];
                            newRounds[idx].codingProblems = e.target.value;
                            setFormData({ ...formData, rounds: newRounds });
                          }}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">Preparation Tips</Label>
                        <Textarea
                          placeholder="What would you recommend to prepare for this round?"
                          value={round.preparationTips}
                          onChange={(e) => {
                            const newRounds = [...formData.rounds];
                            newRounds[idx].preparationTips = e.target.value;
                            setFormData({ ...formData, rounds: newRounds });
                          }}
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button onClick={handleSubmit} disabled={submitting} className="w-full" size="lg">
                {submitting ? "Submitting..." : "Submit Experience"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Popular Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {popularCompanies.slice(0, 5).map((company, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{company.company_name}</span>
                  <Badge variant="outline">{company.experience_count} exp</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Trending Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {trendingTopics.slice(0, 8).map((topic, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {topic.topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              Community Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Experiences</span>
                <span className="font-bold">{experiences.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Companies Covered</span>
                <span className="font-bold">{popularCompanies.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Helpful Votes</span>
                <span className="font-bold">
                  {experiences.reduce((sum, exp) => sum + exp.helpful_count, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Experiences List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading experiences...</p>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No experiences found. Try a different search query.</p>
            </CardContent>
          </Card>
        ) : (
          filteredExperiences.map((exp) => (
            <Card key={exp.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{exp.company_name}</CardTitle>
                      {exp.offer_received && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Offer
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-3 flex-wrap">
                      <span>{exp.job_title}</span>
                      <Badge variant="outline">{exp.job_type}</Badge>
                      <Badge variant="outline">{exp.total_rounds} Rounds</Badge>
                      {exp.student_branch && (
                        <Badge variant="outline">{exp.student_branch}</Badge>
                      )}
                      {exp.student_gpa && (
                        <Badge variant="outline">GPA: {exp.student_gpa}</Badge>
                      )}
                    </CardDescription>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                      <Eye className="w-4 h-4" />
                      {exp.view_count}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <ThumbsUp className="w-4 h-4" />
                      {exp.helpful_count}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {exp.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => viewExperience(exp.id)}
                    variant="outline"
                    className="flex-1"
                  >
                    View Full Experience
                  </Button>
                  <Button
                    onClick={() => markHelpful(exp.id)}
                    variant="outline"
                    className="gap-2"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Helpful
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Experience Detail Dialog */}
      {selectedExperience && (
        <Dialog open={!!selectedExperience} onOpenChange={() => setSelectedExperience(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-2xl">{selectedExperience.company_name}</DialogTitle>
                {selectedExperience.offer_received && (
                  <Badge className="bg-green-500">Offer Received</Badge>
                )}
              </div>
              <DialogDescription className="flex items-center gap-2 flex-wrap">
                <span>{selectedExperience.job_title}</span>
                <span>•</span>
                <span>{selectedExperience.job_type}</span>
                <span>•</span>
                <span>{selectedExperience.total_rounds} Rounds</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {selectedExperience.rounds?.map((round, idx) => (
                <Card key={idx} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getRoundTypeIcon(round.round_type)}
                        Round {round.round_number}: {round.round_name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(round.difficulty)}>
                          {round.difficulty}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="w-3 h-3" />
                          {round.duration_minutes} min
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-1">Topics Covered:</h4>
                      <p className="text-sm">{round.topics_covered}</p>
                    </div>

                    {round.coding_problems && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Coding Problems:</h4>
                        <p className="text-sm whitespace-pre-wrap">{round.coding_problems}</p>
                      </div>
                    )}

                    {round.dsa_topics.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">DSA Topics:</h4>
                        <div className="flex flex-wrap gap-1">
                          {round.dsa_topics.map((topic, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="font-semibold text-sm text-blue-900 mb-1 flex items-center gap-1">
                        <Lightbulb className="w-4 h-4" />
                        Preparation Tips:
                      </h4>
                      <p className="text-sm text-blue-800">{round.preparation_tips}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex gap-2">
                <Button
                  onClick={() => markHelpful(selectedExperience.id)}
                  className="gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Mark as Helpful
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedExperience(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
