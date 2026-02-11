-- Users table (for both students, companies, and admins)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'company', 'admin')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Students profile extension
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  resume_text TEXT,
  resume_url TEXT,
  resume_parsed_data JSONB, -- Structured resume data
  gpa DECIMAL(3,2),
  graduation_year INT,
  branch TEXT,
  skills TEXT[],
  certifications TEXT[],
  projects JSONB, -- Array of project objects
  profile_completeness INT DEFAULT 0, -- 0-100
  placement_readiness_score INT DEFAULT 0, -- 0-100 PRS
  dream_companies TEXT[], -- Target companies
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  industry TEXT,
  company_size TEXT,
  ceo_name TEXT,
  recent_funding TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Placement Drives table (replaces old companies approach)
CREATE TABLE IF NOT EXISTS placement_drives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  jd_text TEXT NOT NULL,
  jd_parsed JSONB, -- Structured JD (skills, experience, etc.)
  drive_date TIMESTAMP NOT NULL,
  drive_time TIME,
  registration_deadline TIMESTAMP,
  location TEXT,
  job_type TEXT, -- Full-time, Internship, Contract
  salary_range TEXT,
  eligibility_criteria JSONB, -- {gpa_min: 7.5, branches: ["CS", "IT"], skills: ["Python"]}
  required_skills TEXT[],
  preferred_skills TEXT[],
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Applications (Student-Drive relationship with detailed tracking)
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'participated', 'skipped', 'shortlisted', 'interview', 'offer', 'rejected', 'withdrawn')),
  suitability_score DECIMAL(5,2), -- 0-100
  skill_match_percentage DECIMAL(5,2), -- 0-100
  ai_recommendation TEXT, -- AI-generated insights
  registration_type TEXT DEFAULT 'manual' CHECK (registration_type IN ('manual', 'auto_suggested')),
  reminder_set BOOLEAN DEFAULT FALSE,
  reminder_time TIMESTAMP,
  applied_at TIMESTAMP DEFAULT now(),
  interview_rounds JSONB, -- Array of round details with feedback
  rejection_reason TEXT,
  rejection_feedback JSONB, -- Structured post-mortem data
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(student_id, drive_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('drive_alert', 'reminder', 'status_update', 'deadline', 'ai_suggestion', 'admin_announcement')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB, -- Additional data
  created_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP
);

-- Historical activity tracking
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL, -- 'drive_registered', 'drive_skipped', 'profile_updated', 'mock_completed', etc.
  action_details JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Skill gaps (AI-generated missing skills with learning paths)
CREATE TABLE IF NOT EXISTS skill_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  missing_skill TEXT NOT NULL,
  skill_importance TEXT DEFAULT 'medium' CHECK (skill_importance IN ('low', 'medium', 'high', 'critical')),
  learning_resources JSONB, -- Array of {type: 'youtube/docs/course', url, title, duration}
  mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- Real-time Job Scraping (Shadow Profiles)
CREATE TABLE IF NOT EXISTS scraped_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL, -- 'linkedin', 'indeed', 'glassdoor', etc.
  external_id TEXT, -- Job ID from source
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_description TEXT,
  parsed_skills TEXT[],
  location TEXT,
  salary_range TEXT,
  job_type TEXT,
  posted_date TIMESTAMP,
  application_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  historical_matches JSONB, -- {similar_hires: [{name, cgpa, year}]}
  created_at TIMESTAMP DEFAULT now(),
  last_checked TIMESTAMP DEFAULT now(),
  UNIQUE(source, external_id)
);

-- Mock Interviews
CREATE TABLE IF NOT EXISTS mock_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  drive_id UUID REFERENCES placement_drives(id) ON DELETE SET NULL,
  questions JSONB NOT NULL, -- Array of generated questions
  student_answers JSONB, -- Array of {question_id, answer_text, audio_url, video_url}
  ai_feedback JSONB, -- {sentiment, confidence_score, filler_words_count, technical_accuracy}
  overall_score DECIMAL(5,2),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP
);

-- Learning Progress Tracking
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  skill_gap_id UUID REFERENCES skill_gaps(id) ON DELETE CASCADE,
  resource_url TEXT NOT NULL,
  progress_percentage INT DEFAULT 0,
  time_spent_minutes INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Peer Comparison Data (for PRS)
CREATE TABLE IF NOT EXISTS placement_readiness_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  profile_score INT DEFAULT 0, -- 0-30 points
  mock_score INT DEFAULT 0, -- 0-30 points
  activity_score INT DEFAULT 0, -- 0-40 points
  total_score INT DEFAULT 0, -- 0-100
  percentile DECIMAL(5,2), -- Where student stands in batch
  last_calculated TIMESTAMP DEFAULT now()
);

-- Dream Company Roadmap
CREATE TABLE IF NOT EXISTS dream_company_roadmap (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  target_role TEXT,
  current_match_percentage DECIMAL(5,2),
  missing_skills TEXT[],
  estimated_time_to_ready TEXT, -- e.g., "3 months"
  distance_to_dream DECIMAL(5,2), -- 0-100 (lower is better)
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(student_id, company_name)
);

-- Company Flash Cards (for interview prep)
CREATE TABLE IF NOT EXISTS company_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  fact_type TEXT NOT NULL, -- 'ceo', 'funding', 'tech_stack', 'culture', 'recent_news'
  fact_content TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Senior's Secret Database (anonymous interview experiences)
CREATE TABLE IF NOT EXISTS interview_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  job_role TEXT NOT NULL,
  interview_year INT NOT NULL,
  round_number INT NOT NULL,
  round_type TEXT, -- 'technical', 'hr', 'managerial', 'case_study'
  topics_asked TEXT[],
  difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  anonymous_tips TEXT,
  helpful_votes INT DEFAULT 0,
  submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- Referral Board
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  referral_link TEXT NOT NULL,
  minimum_suitability_score DECIMAL(5,2), -- Only show to matching students
  required_skills TEXT[],
  expires_at TIMESTAMP,
  slots_available INT,
  slots_used INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

-- Admin Analytics & Forecasting
CREATE TABLE IF NOT EXISTS admin_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id UUID REFERENCES placement_drives(id) ON DELETE CASCADE,
  forecasted_eligible INT,
  forecasted_registrations INT,
  at_risk_students UUID[], -- Array of student IDs
  recommended_actions JSONB, -- {workshops: ['Python', 'DSA'], skill_gaps: {...}}
  created_at TIMESTAMP DEFAULT now()
);

-- Eligibility cache for forecasting
CREATE TABLE IF NOT EXISTS eligibility_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  drive_id UUID UNIQUE REFERENCES placement_drives(id) ON DELETE CASCADE,
  total_students INT DEFAULT 0,
  eligible_students INT DEFAULT 0,
  criteria_breakdown JSONB, -- {gpa_failures: 10, skill_mismatches: 5}
  last_calculated TIMESTAMP DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_gpa ON student_profiles(gpa);
CREATE INDEX IF NOT EXISTS idx_placement_drives_date ON placement_drives(drive_date);
CREATE INDEX IF NOT EXISTS idx_placement_drives_status ON placement_drives(status);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_drive_id ON applications(drive_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_application_id ON skill_gaps(application_id);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_is_active ON scraped_jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_created_at ON scraped_jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_student_id ON mock_interviews(student_id);
CREATE INDEX IF NOT EXISTS idx_interview_experiences_company_id ON interview_experiences(company_id);
CREATE INDEX IF NOT EXISTS idx_referrals_is_active ON referrals(is_active);
