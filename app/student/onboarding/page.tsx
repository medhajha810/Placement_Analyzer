"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Upload, 
  User, 
  GraduationCap, 
  Code, 
  CheckCircle2, 
  ArrowRight,
  X,
  Plus,
  Trophy,
  Briefcase,
  Target
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  branch: string;
  graduation_year: number;
  current_year: number;
  gpa: number;
  phone: string;
  skills: string[];
  resume_url: string;
  linkedin_url: string;
  github_url: string;
}

interface JobMatch {
  jobId: string;
  jobTitle: string;
  companyName: string;
  matchPercentage: number;
  missingSkills: string[];
  requiredSkills: string[];
  isEligible: boolean;
}

export default function ProfileCompletionPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    email: "",
    branch: "",
    graduation_year: new Date().getFullYear() + 2,
    current_year: 3,
    gpa: 0,
    phone: "",
    skills: [],
    resume_url: "",
    linkedin_url: "",
    github_url: ""
  });

  const [newSkill, setNewSkill] = useState("");
  const [completionPercentage, setCompletionPercentage] = useState(0);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/signin");
    }
    calculateCompletion();
  }, [profileData]);

  const calculateCompletion = () => {
    const fields = [
      profileData.name,
      profileData.email,
      profileData.branch,
      profileData.gpa > 0,
      profileData.phone,
      profileData.skills.length > 0,
      profileData.resume_url,
      profileData.linkedin_url || profileData.github_url
    ];
    
    const completed = fields.filter(Boolean).length;
    const percentage = Math.round((completed / fields.length) * 100);
    setCompletionPercentage(percentage);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(s => s !== skill)
    });
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.txt')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or TXT file",
        variant: "destructive"
      });
      return;
    }

    setCvFile(file);
    setUploadingResume(true);
    
    // Simulate file upload
    setTimeout(() => {
      setProfileData({
        ...profileData,
        resume_url: file.name
      });
      setUploadingResume(false);
      
      toast({
        title: "CV uploaded successfully!",
        description: "Your resume has been uploaded. Click 'Analyze CV' to get job matches.",
      });
    }, 1500);
  };

  const handleAnalyzeCV = async () => {
    if (!cvFile) {
      toast({
        title: "No CV uploaded",
        description: "Please upload your CV first",
        variant: "destructive"
      });
      return;
    }

    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/auth/signin");
      return;
    }

    const user = JSON.parse(userData);
    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("cv", cvFile);
      formData.append("studentId", user.id);

      const response = await fetch("/api/student/analyze-cv", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data);
        setPointsEarned(data.pointsEarned || 35);
        
        // Update skills from CV
        setProfileData({
          ...profileData,
          skills: [...new Set([...profileData.skills, ...(data.extractedSkills || [])])]
        });

        setShowResults(true);
        
        toast({
          title: `🎉 Profile Complete! +${data.pointsEarned} Points`,
          description: `Found ${data.extractedSkills.length} skills and ${data.topMatches} high-match jobs!`,
        });
      } else {
        toast({
          title: "Analysis failed",
          description: data.error || "Failed to analyze CV",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error analyzing CV:", error);
      toast({
        title: "Error",
        description: "Failed to analyze CV. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const userData = localStorage.getItem("user");
      if (!userData) {
        router.push("/auth/signin");
        return;
      }

      const user = JSON.parse(userData);
      
      const response = await fetch("/api/student/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileData,
          studentId: user.id
        })
      });

      if (response.ok) {
        toast({
          title: "✅ Profile saved successfully!",
          description: `You earned ${pointsEarned} points! Redirecting to dashboard...`,
        });
        
        setTimeout(() => {
          router.push("/student/dashboard");
        }, 2000);
      } else {
        toast({
          title: "Failed to save profile",
          description: "Please try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const isStepComplete = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return profileData.name && profileData.email && profileData.phone;
      case 2:
        return profileData.branch && profileData.gpa > 0 && profileData.graduation_year;
      case 3:
        return profileData.skills.length >= 3;
      case 4:
        return profileData.resume_url;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600">
              Help us understand you better to provide personalized placement assistance
            </p>
          </div>

          {/* Progress Bar */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm font-medium text-indigo-600">
                  {completionPercentage}%
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <div className="flex justify-between mt-4">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`flex items-center gap-2 ${
                      step === s ? "text-indigo-600 font-medium" : "text-gray-400"
                    }`}
                  >
                    {isStepComplete(s) ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-current" />
                    )}
                    <span className="text-xs hidden sm:inline">Step {s}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {step === 1 && "Personal Information"}
                {step === 2 && "Academic Details"}
                {step === 3 && "Skills & Expertise"}
                {step === 4 && "Resume & Links"}
              </CardTitle>
              <CardDescription>
                {step === 1 && "Let's start with your basic information"}
                {step === 2 && "Tell us about your educational background"}
                {step === 3 && "What are your technical skills?"}
                {step === 4 && "Upload your resume and add profile links"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="pl-10"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@college.edu"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({ ...profileData, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({ ...profileData, phone: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* Step 2: Academic Details */}
              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch/Department *</Label>
                    <select
                      id="branch"
                      className="w-full px-3 py-2 border rounded-md"
                      value={profileData.branch}
                      onChange={(e) =>
                        setProfileData({ ...profileData, branch: e.target.value })
                      }
                    >
                      <option value="">Select Branch</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics">Electronics & Communication</option>
                      <option value="Mechanical">Mechanical Engineering</option>
                      <option value="Civil">Civil Engineering</option>
                      <option value="Electrical">Electrical Engineering</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current_year">Current Year *</Label>
                      <select
                        id="current_year"
                        className="w-full px-3 py-2 border rounded-md"
                        value={profileData.current_year}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            current_year: parseInt(e.target.value)
                          })
                        }
                      >
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="graduation_year">Graduation Year *</Label>
                      <Input
                        id="graduation_year"
                        type="number"
                        min="2024"
                        max="2030"
                        value={profileData.graduation_year}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            graduation_year: parseInt(e.target.value)
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gpa">CGPA/Percentage *</Label>
                    <Input
                      id="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      placeholder="8.5"
                      value={profileData.gpa || ""}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          gpa: parseFloat(e.target.value)
                        })
                      }
                    />
                    <p className="text-xs text-gray-500">Enter CGPA out of 10</p>
                  </div>
                </>
              )}

              {/* Step 3: Skills */}
              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label>Add Your Skills * (minimum 3)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., Python, React, SQL"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                      />
                      <Button onClick={handleAddSkill} size="icon">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="px-3 py-1 flex items-center gap-2"
                      >
                        {skill}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-red-500"
                          onClick={() => handleRemoveSkill(skill)}
                        />
                      </Badge>
                    ))}
                  </div>

                  {profileData.skills.length < 3 && (
                    <p className="text-sm text-amber-600">
                      Please add at least 3 skills to continue
                    </p>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      💡 Skill Suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {["JavaScript", "Python", "Java", "React", "Node.js", "SQL", "MongoDB"].map(
                        (skill) =>
                          !profileData.skills.includes(skill) && (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="cursor-pointer hover:bg-blue-100"
                              onClick={() => {
                                setProfileData({
                                  ...profileData,
                                  skills: [...profileData.skills, skill]
                                });
                              }}
                            >
                              + {skill}
                            </Badge>
                          )
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Resume & Links */}
              {step === 4 && (
                <>
                  <div className="space-y-2">
                    <Label>Upload Resume * (PDF or TXT)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
                      {profileData.resume_url ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2 text-green-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Resume uploaded: {profileData.resume_url}</span>
                          </div>
                          <Button 
                            onClick={handleAnalyzeCV}
                            disabled={analyzing}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                          >
                            {analyzing ? "Analyzing CV..." : "🔍 Analyze CV & Find Job Matches"}
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                          <input
                            type="file"
                            accept=".pdf,.txt"
                            onChange={handleResumeUpload}
                            className="hidden"
                            id="resume-upload"
                          />
                          <label htmlFor="resume-upload" className="cursor-pointer">
                            <Button variant="outline" disabled={uploadingResume} asChild>
                              <span>
                                {uploadingResume ? "Uploading..." : "Choose File"}
                              </span>
                            </Button>
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            PDF or TXT format, max 5MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* CV Analysis Results */}
                  {showResults && analysisResult && (
                    <Card className="border-2 border-green-500 bg-green-50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700">
                          <Trophy className="w-6 h-6" />
                          CV Analysis Complete! 🎉
                        </CardTitle>
                        <CardDescription>
                          You earned <strong>{pointsEarned} points</strong> for completing your profile!
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              {analysisResult.extractedSkills?.length || 0}
                            </div>
                            <div className="text-xs text-gray-600">Skills Found</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {analysisResult.topMatches || 0}
                            </div>
                            <div className="text-xs text-gray-600">High Matches</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              {analysisResult.eligibleJobs || 0}
                            </div>
                            <div className="text-xs text-gray-600">Eligible Jobs</div>
                          </div>
                        </div>

                        {/* Top Job Matches */}
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Top Job Matches:
                          </h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {analysisResult.jobMatches?.slice(0, 5).map((job: any, idx: number) => (
                              <div key={idx} className="bg-white p-3 rounded-lg border">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm">{job.jobTitle}</div>
                                    <div className="text-xs text-gray-600">{job.companyName}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Badge 
                                      className={
                                        job.matchPercentage >= 70 
                                          ? "bg-green-500" 
                                          : job.matchPercentage >= 50 
                                          ? "bg-yellow-500" 
                                          : "bg-red-500"
                                      }
                                    >
                                      {job.matchPercentage}% match
                                    </Badge>
                                    {job.isEligible && (
                                      <Badge variant="outline" className="text-green-600 border-green-600">
                                        ✓ Eligible
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                {job.missingSkills?.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    Missing: {job.missingSkills.slice(0, 3).join(", ")}
                                    {job.missingSkills.length > 3 && " ..."}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Extracted Skills */}
                        {analysisResult.extractedSkills?.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              Skills from CV:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {analysisResult.extractedSkills.map((skill: string) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={profileData.linkedin_url}
                      onChange={(e) =>
                        setProfileData({ ...profileData, linkedin_url: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub Profile</Label>
                    <Input
                      id="github"
                      type="url"
                      placeholder="https://github.com/yourusername"
                      value={profileData.github_url}
                      onChange={(e) =>
                        setProfileData({ ...profileData, github_url: e.target.value })
                      }
                    />
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  Previous
                </Button>

                {step < 4 ? (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={!isStepComplete(step)}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!isStepComplete(4) || loading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600"
                  >
                    {loading ? "Saving..." : "Complete Profile"}
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
