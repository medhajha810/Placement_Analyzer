"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, X, Send, Check } from "lucide-react";

export default function PostReferral() {
  const [formData, setFormData] = useState({
    postedByEmail: "",
    postedByName: "",
    companyName: "",
    jobTitle: "",
    jobType: "Full-time",
    jobDescription: "",
    requiredSkills: [] as string[],
    preferredSkills: [] as string[],
    minGPA: "",
    minSuitabilityScore: "60",
    graduationYear: "",
    referralLink: "",
    applicationDeadline: "",
    maxReferrals: "3",
    tags: [] as string[],
    isAnonymous: false
  });

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentPreferredSkill, setCurrentPreferredSkill] = useState("");
  const [currentTag, setCurrentTag] = useState("");
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const addSkill = () => {
    if (currentSkill && !formData.requiredSkills.includes(currentSkill)) {
      setFormData({ ...formData, requiredSkills: [...formData.requiredSkills, currentSkill] });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, requiredSkills: formData.requiredSkills.filter(s => s !== skill) });
  };

  const addPreferredSkill = () => {
    if (currentPreferredSkill && !formData.preferredSkills.includes(currentPreferredSkill)) {
      setFormData({ ...formData, preferredSkills: [...formData.preferredSkills, currentPreferredSkill] });
      setCurrentPreferredSkill("");
    }
  };

  const removePreferredSkill = (skill: string) => {
    setFormData({ ...formData, preferredSkills: formData.preferredSkills.filter(s => s !== skill) });
  };

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData({ ...formData, tags: [...formData.tags, currentTag] });
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName || !formData.jobTitle || formData.requiredSkills.length === 0 || !formData.referralLink) {
      alert("Please fill all required fields");
      return;
    }

    setPosting(true);
    try {
      const response = await fetch("/api/referral-matchmaker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "post-referral",
          ...formData,
          postedByName: formData.isAnonymous ? "Anonymous Senior" : formData.postedByName,
          minGPA: parseFloat(formData.minGPA) || 0,
          minSuitabilityScore: parseInt(formData.minSuitabilityScore),
          maxReferrals: parseInt(formData.maxReferrals),
          graduationYear: parseInt(formData.graduationYear) || new Date().getFullYear()
        })
      });

      const data = await response.json();
      if (data.success) {
        setPosted(true);
        setTimeout(() => {
          setDialogOpen(false);
          resetForm();
        }, 2000);
      }
    } catch (error) {
      console.error("Error posting referral:", error);
    } finally {
      setPosting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      postedByEmail: "",
      postedByName: "",
      companyName: "",
      jobTitle: "",
      jobType: "Full-time",
      jobDescription: "",
      requiredSkills: [],
      preferredSkills: [],
      minGPA: "",
      minSuitabilityScore: "60",
      graduationYear: "",
      referralLink: "",
      applicationDeadline: "",
      maxReferrals: "3",
      tags: [],
      isAnonymous: false
    });
    setPosted(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Post Referral
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a Referral Opportunity</DialogTitle>
          <DialogDescription>
            Help your juniors by posting referral opportunities from your company
          </DialogDescription>
        </DialogHeader>

        {posted ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-green-100 dark:bg-green-900 p-4 mb-4">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Referral Posted Successfully!</h3>
            <p className="text-muted-foreground text-center">
              Your referral is now live and visible to eligible students.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Anonymous Posting */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="anonymous">Post anonymously</Label>
            </div>

            {/* Personal Info */}
            {!formData.isAnonymous && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Your Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.postedByEmail}
                    onChange={(e) => setFormData({ ...formData, postedByEmail: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={formData.postedByName}
                    onChange={(e) => setFormData({ ...formData, postedByName: e.target.value })}
                    placeholder="e.g., Rahul (2023 Grad)"
                  />
                </div>
              </div>
            )}

            {/* Job Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g., SDE-1, Software Engineer"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobType">Job Type</Label>
                <Select value={formData.jobType} onValueChange={(value) => setFormData({ ...formData, jobType: value })}>
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
                <Label htmlFor="graduationYear">Target Graduation Year</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  placeholder="2025"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                placeholder="Brief description of the role, team, and what makes it exciting..."
                rows={3}
              />
            </div>

            {/* Required Skills */}
            <div>
              <Label>Required Skills *</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  placeholder="e.g., Python, React, Data Structures"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} size="icon">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="default" className="gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Preferred Skills */}
            <div>
              <Label>Preferred Skills (Optional)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentPreferredSkill}
                  onChange={(e) => setCurrentPreferredSkill(e.target.value)}
                  placeholder="e.g., AWS, Docker, Kubernetes"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPreferredSkill())}
                />
                <Button type="button" onClick={addPreferredSkill} size="icon">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.preferredSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1">
                    {skill}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removePreferredSkill(skill)} />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minGPA">Minimum GPA</Label>
                <Input
                  id="minGPA"
                  type="number"
                  step="0.1"
                  value={formData.minGPA}
                  onChange={(e) => setFormData({ ...formData, minGPA: e.target.value })}
                  placeholder="7.5"
                />
              </div>
              <div>
                <Label htmlFor="minScore">Minimum Suitability Score (%)</Label>
                <Input
                  id="minScore"
                  type="number"
                  value={formData.minSuitabilityScore}
                  onChange={(e) => setFormData({ ...formData, minSuitabilityScore: e.target.value })}
                />
              </div>
            </div>

            {/* Referral Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="referralLink">Referral Link / Email *</Label>
                <Input
                  id="referralLink"
                  value={formData.referralLink}
                  onChange={(e) => setFormData({ ...formData, referralLink: e.target.value })}
                  placeholder="https://... or mailto:..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.applicationDeadline}
                  onChange={(e) => setFormData({ ...formData, applicationDeadline: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="maxReferrals">Maximum Referrals</Label>
              <Input
                id="maxReferrals"
                type="number"
                value={formData.maxReferrals}
                onChange={(e) => setFormData({ ...formData, maxReferrals: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                How many students can you refer?
              </p>
            </div>

            {/* Tags */}
            <div>
              <Label>Tags (Optional)</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="e.g., high-paying, remote-friendly, fast-hiring"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="icon">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="gap-1">
                    {tag}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" disabled={posting} className="flex-1">
                {posting ? "Posting..." : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Post Referral
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
