# Shadow Profiles Feature Guide

## Overview
Shadow Profiles provide students with **anonymized historical hiring insights** when viewing scraped job listings. This feature answers the question: "Who from our college got hired here before?"

## What It Shows

### Key Metrics
- **Hired Count**: Number of seniors from your college hired at this company
- **Average CGPA**: Mean CGPA of successfully placed students
- **Common Skills**: Most frequently shared skills among hired students
- **Graduation Years**: Range of years when students were hired
- **Branches**: Departments of successfully placed students
- **Sample Profiles**: Anonymous profile snippets (CGPA, year, branch, top skills)

## How It Works

### Backend Logic (`/api/jobs/scrape`)

1. **Data Collection**
   - Queries `applications` table for successful placements (`status = 'offer'`)
   - Joins with `student_profiles` to get GPA, skills, branch, graduation year
   - Joins with `placement_drives` and `companies` to match company names

2. **Skill Matching Algorithm**
   ```typescript
   // Filters students with:
   - Company name match (case-insensitive)
   - OR at least 2 matching skills with the job
   ```

3. **Statistics Calculation**
   - **Average GPA**: Mean of all matched students' GPAs
   - **Common Skills**: Top 5 most frequent skills (sorted by count)
   - **Hired Count**: Total matched students
   - **Years & Branches**: Unique values extracted

4. **Response Format**
   ```json
   {
     "shadow_profile": {
       "hired_count": 3,
       "avg_gpa": 8.2,
       "common_skills": ["Java", "Spring Boot", "REST APIs"],
       "graduation_years": [2024, 2025],
       "branches": ["Computer Science", "IT"],
       "sample_profiles": [
         {
           "gpa": 8.4,
           "year": 2025,
           "branch": "Computer Science",
           "skills": ["Java", "Spring Boot", "MySQL"]
         }
       ]
     }
   }
   ```

## Frontend Components

### 1. Shadow Profile Card (`components/shadow-profile.tsx`)
**Features:**
- 🎯 "Who Got In?" heading with match strength badge
- Color-coded based on hired count:
  - **Green** (Strong Match): 5+ students
  - **Blue** (Good Match): 3-4 students  
  - **Orange** (Fair Match): 1-2 students
- Stats grid showing Avg CGPA and graduation year range
- Common skills badges (top 5)
- Hover tooltip with detailed sample profiles

**Props:**
```typescript
interface ShadowProfileProps {
  data: ShadowProfileData;
  companyName: string;
}
```

### 2. Scraped Jobs Page (`app/student/scraped-jobs/page.tsx`)
**Features:**
- Search by job title, company, or skills
- Filter by location and source (LinkedIn, Indeed, Glassdoor)
- Refresh jobs button (triggers scraping)
- Stats dashboard (Total Jobs, Jobs with Shadow Profiles, Companies)
- Each job card displays Shadow Profile if data exists
- "Apply Now" button (opens external URL)

**URL:** `/student/scraped-jobs`

**Navigation:** Added to StudentNav with "NEW" badge (Sparkles icon)

## Database Schema

### Required Tables
1. **scraped_jobs**: Stores job listings from external sources
2. **applications**: Tracks student applications and outcomes
3. **student_profiles**: Contains GPA, skills, branch, graduation year
4. **placement_drives**: Links applications to companies
5. **companies**: Company information

### Key Relationships
```
scraped_jobs
  └─ company_name → companies.name (soft match)

applications (status='offer')
  ├─ student_id → users.id → student_profiles
  └─ drive_id → placement_drives → companies
```

## Setup Instructions

### 1. Run Seed Data
Execute the updated seed file to add historical students:
```bash
# Copy the SQL from scripts/seed-data.sql
# Paste into Supabase SQL Editor
# Click "Run"
```

**Seed Data Includes:**
- 5 alumni students (2024-2025 graduates)
- 3 completed placement drives (TCS, Infosys, Wipro)
- 5 successful offers with realistic profiles
- Skills: Java, Spring Boot, Python, Django, React, Node.js

### 2. Verify Database
Check that data exists:
```sql
-- Check historical students
SELECT u.full_name, sp.gpa, sp.skills, sp.graduation_year
FROM users u
JOIN student_profiles sp ON u.id = sp.user_id
WHERE u.email LIKE '%alumni%';

-- Check successful placements
SELECT u.full_name, c.name, a.status
FROM applications a
JOIN users u ON a.student_id = u.id
JOIN placement_drives d ON a.drive_id = d.id
JOIN companies c ON d.company_id = c.id
WHERE a.status = 'offer';
```

### 3. Test the Feature
1. **Login** as student: `john.doe@student.com` / `password123`
2. Click **"Scraped Jobs"** in navigation (has NEW badge)
3. Look for **"Who Got In?"** cards on job listings
4. **Hover** over shadow profile for detailed tooltip
5. Jobs from TCS, Infosys, Wipro should show matches

## Example Output

### TCS Software Developer Job
```
🎯 Who Got In? [Good Match]

2 seniors from our college with similar skills were hired at TCS

Avg CGPA: 8.2 | Years: 2024-2025

Most Common Skills:
[Java] [Spring Boot] [REST APIs] [MySQL] [Microservices]
```

### Infosys Full Stack Job
```
🎯 Who Got In? [Good Match]

2 seniors from our college with similar skills were hired at Infosys

Avg CGPA: 8.3 | Years: 2025

Most Common Skills:
[Node.js] [React] [MongoDB] [TypeScript] [Express]
```

## Customization Options

### Adjust Match Threshold
In `/api/jobs/scrape/route.ts`, modify the skill overlap requirement:
```typescript
// Current: requires 2+ matching skills
const skillOverlap = jobSkills.filter(...).length;
return companyMatches || skillOverlap >= 2; // Change this number
```

### Change Color Coding
In `components/shadow-profile.tsx`:
```typescript
const getBadgeColor = () => {
  if (data.hired_count >= 5) return "bg-green-100..."; // Strong
  if (data.hired_count >= 3) return "bg-blue-100...";  // Good
  return "bg-orange-100..."; // Fair - adjust thresholds here
};
```

### Modify Displayed Skills Count
```typescript
// Show top 3 instead of 5
const commonSkills = Object.entries(skillCounts)
  .sort(([,a]: any, [,b]: any) => b - a)
  .slice(0, 3) // Change from 5 to 3
  .map(([skill]) => skill);
```

## Privacy Considerations

✅ **Anonymous Data**
- No student names displayed
- Only aggregate statistics shown
- Sample profiles show generic info (GPA, year, branch, skills)
- No contact information exposed

⚠️ **Important Notes**
- Data is from your own college only
- Based on historical placement drive offers
- Match algorithm considers skill similarity
- Small numbers (<3) may not be statistically significant

## Troubleshooting

### No Shadow Profiles Showing
**Cause:** No historical application data in database
**Solution:** Run seed-data.sql or add real historical records

### Wrong Match Results
**Cause:** Company name mismatch between scraped_jobs and companies table
**Solution:** Ensure company names are consistent (case-insensitive match)

### Low Match Counts
**Cause:** Skill overlap threshold too strict
**Solution:** Lower the `skillOverlap >= 2` threshold in getHistoricalMatches()

## Future Enhancements

### Potential Features
1. **Time-based filtering**: "Hired in last 2 years"
2. **Branch-specific insights**: "3 CS students, 1 IT student"
3. **Success rate**: "80% of applicants got offers"
4. **Interview difficulty**: Community ratings
5. **Salary insights**: "Avg offer: ₹8.5 LPA"
6. **Application tips**: "Students with X skill had higher success"

### RapidAPI Integration
To fetch real job data, add your API key:
```typescript
// In .env.local
RAPIDAPI_KEY=your_key_here

// Uncomment in /api/jobs/scrape/route.ts
const response = await fetch(
  `https://jsearch.p.rapidapi.com/search?query=${keywords}`,
  {
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
      'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
    }
  }
);
```

## Technical Details

### Performance Optimization
- Shadow profile calculation happens once per job listing
- Results cached in scraped_jobs.historical_matches (JSONB field)
- Database queries use indexed columns (status, company_name)
- Limits to top 5 skills and 3 sample profiles

### Error Handling
- Returns empty profile if no matches found
- Graceful fallback if database query fails
- Console.error for debugging without crashing UI

### Type Safety
Full TypeScript interfaces:
```typescript
interface ShadowProfileData {
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
}
```

## Questions?

This feature provides unique value by showing students **real historical outcomes** from their own college, helping them make informed decisions about job applications based on peer success data.

The anonymous nature ensures privacy while still delivering actionable insights! 🎯
