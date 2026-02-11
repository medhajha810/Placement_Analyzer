"use client";

import { useState, useEffect } from "react";
import StudentSidebarLayout from "@/components/student-sidebar-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Upload,
  Save,
  Edit,
  CheckCircle
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StudentProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  branch?: string;
  graduation_year?: number;
  cgpa?: number;
  skills?: string[];
  bio?: string;
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_url?: string;
  profile_completeness?: number;
  points?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [formData, setFormData] = useState<Partial<StudentProfile>>({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      fetchProfile(user.id);
    } else {
      router.push("/auth/signin");
    }
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/student/profile?userId=${userId}`);
      const data = await response.json();
      
      if (data.success && data.profile) {
        setProfile(data.profile);
        setFormData(data.profile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/student/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setProfile(data.profile);
        setEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully!",
          variant: "default"
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(",").map(s => s.trim()).filter(s => s);
    setFormData(prev => ({ ...prev, skills }));
  };

  if (loading) {
    return (
      <StudentSidebarLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <User className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
              <p className="text-gray-600">Loading profile...</p>
            </div>
          </div>
        </div>
      </StudentSidebarLayout>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <StudentSidebarLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <User className="w-8 h-8 text-primary" />
                My Profile
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your personal information and settings
              </p>
            </div>
            
            {!editing ? (
              <Button onClick={() => setEditing(true)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => {
                  setEditing(false);
                  setFormData(profile || {});
                }} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Profile Completeness</p>
                    <p className="text-2xl font-bold text-primary">
                      {profile?.profile_completeness || 0}%
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Points Earned</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {profile?.points || 0}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Skills</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {profile?.skills?.length || 0}
                    </p>
                  </div>
                  <Code className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Quick Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Avatar className="w-32 h-32 mx-auto mb-4">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`} />
                    <AvatarFallback className="text-2xl">
                      {profile?.full_name ? getInitials(profile.full_name) : "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold mb-1">{profile?.full_name}</h2>
                  <p className="text-gray-600 text-sm mb-4">{profile?.email}</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {profile?.branch && (
                      <Badge variant="secondary">
                        <GraduationCap className="w-3 h-3 mr-1" />
                        {profile.branch}
                      </Badge>
                    )}
                    {profile?.graduation_year && (
                      <Badge variant="secondary">
                        Class of {profile.graduation_year}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Info */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="social">Social Links</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.full_name || ""}
                          onChange={(e) => handleInputChange("full_name", e.target.value)}
                          disabled={!editing}
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email || ""}
                          disabled
                          placeholder="john@example.com"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          <Phone className="w-4 h-4 inline mr-2" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={formData.phone || ""}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          disabled={!editing}
                          placeholder="+1 234 567 8900"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cgpa">
                          <Award className="w-4 h-4 inline mr-2" />
                          CGPA
                        </Label>
                        <Input
                          id="cgpa"
                          type="number"
                          step="0.01"
                          value={formData.cgpa || ""}
                          onChange={(e) => handleInputChange("cgpa", parseFloat(e.target.value))}
                          disabled={!editing}
                          placeholder="8.5"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={formData.bio || ""}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        disabled={!editing}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Academic Tab */}
              <TabsContent value="academic">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                    <CardDescription>
                      Your educational background and skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="branch">
                          <GraduationCap className="w-4 h-4 inline mr-2" />
                          Branch
                        </Label>
                        <Input
                          id="branch"
                          value={formData.branch || ""}
                          onChange={(e) => handleInputChange("branch", e.target.value)}
                          disabled={!editing}
                          placeholder="Computer Science"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">
                          <GraduationCap className="w-4 h-4 inline mr-2" />
                          Graduation Year
                        </Label>
                        <Input
                          id="graduationYear"
                          type="number"
                          value={formData.graduation_year || ""}
                          onChange={(e) => handleInputChange("graduation_year", parseInt(e.target.value))}
                          disabled={!editing}
                          placeholder="2026"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">
                        <Code className="w-4 h-4 inline mr-2" />
                        Skills (comma-separated)
                      </Label>
                      <Textarea
                        id="skills"
                        value={formData.skills?.join(", ") || ""}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        disabled={!editing}
                        placeholder="JavaScript, React, Node.js, Python"
                        rows={3}
                      />
                      <p className="text-sm text-gray-500">
                        Separate multiple skills with commas
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">
                        <Upload className="w-4 h-4 inline mr-2" />
                        Resume URL
                      </Label>
                      <Input
                        id="resume"
                        value={formData.resume_url || ""}
                        onChange={(e) => handleInputChange("resume_url", e.target.value)}
                        disabled={!editing}
                        placeholder="https://drive.google.com/..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Social Links Tab */}
              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Links</CardTitle>
                    <CardDescription>
                      Connect your professional profiles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="github">
                        <Code className="w-4 h-4 inline mr-2" />
                        GitHub URL
                      </Label>
                      <Input
                        id="github"
                        value={formData.github_url || ""}
                        onChange={(e) => handleInputChange("github_url", e.target.value)}
                        disabled={!editing}
                        placeholder="https://github.com/username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="linkedin">
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        LinkedIn URL
                      </Label>
                      <Input
                        id="linkedin"
                        value={formData.linkedin_url || ""}
                        onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                        disabled={!editing}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="portfolio">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Portfolio URL
                      </Label>
                      <Input
                        id="portfolio"
                        value={formData.portfolio_url || ""}
                        onChange={(e) => handleInputChange("portfolio_url", e.target.value)}
                        disabled={!editing}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </StudentSidebarLayout>
  );
}
