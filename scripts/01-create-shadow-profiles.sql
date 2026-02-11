-- ============================================
-- SHADOW PROFILES & ADVANCED FEATURES
-- ============================================
-- Run this AFTER 00-create-base-schema.sql
-- This extends the base schema with advanced features

-- ============================================
-- 1. USERS TABLE (for authentication)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'company', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Link existing students to users table
CREATE TABLE IF NOT EXISTS student_users (
  student_id UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. ENHANCED STUDENT PROFILES
-- ============================================
-- Extend student profiles with additional fields
CREATE TABLE IF NOT EXISTS student_profiles_extended (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  resume_text TEXT,
  resume_parsed_data JSONB, -- Structured resume data
  certifications TEXT[],
  projects JSONB, -- Array of project objects
  placement_readiness_score INT DEFAULT 0 CHECK (placement_readiness_score >= 0 AND placement_readiness_score <= 100),
  dream_companies TEXT[], -- Target companies
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. PLACEMENT DRIVES (Company-specific drives)
-- ============================================
CREATE TABLE IF NOT EXISTS placement_drives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE, -- Links to base jobs table
  drive_date TIMESTAMP NOT NULL,
  drive_time TIME,
  registration_deadline TIMESTAMP,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. ENHANCED APPLICATIONS TRACKING
-- ============================================
-- Add detailed tracking to base applications table
CREATE TABLE IF NOT EXISTS application_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID UNIQUE REFERENCES applications(id) ON DELETE CASCADE,
  suitability_score DECIMAL(5,2) CHECK (suitability_score >= 0 AND suitability_score <= 100),
  skill_match_percentage DECIMAL(5,2) CHECK (skill_match_percentage >= 0 AND skill_match_percentage <= 100),
  ai_recommendation TEXT,
  registration_type VARCHAR(50) DEFAULT 'manual' CHECK (registration_type IN ('manual', 'auto_suggested')),
  reminder_set BOOLEAN DEFAULT FALSE,
  reminder_time TIMESTAMP,
  interview_rounds JSONB, -- Array of round details with feedback
  rejection_reason TEXT,
  rejection_feedback JSONB, -- Structured post-mortem data
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 5. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('job_alert', 'reminder', 'status_update', 'deadline', 'ai_suggestion', 'admin_announcement')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- ============================================
-- 6. ACTIVITY LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  action_type VARCHAR(100) NOT NULL, -- 'job_applied', 'job_skipped', 'profile_updated', 'mock_completed'
  action_details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 7. SKILL GAPS & LEARNING
-- ============================================
CREATE TABLE IF NOT EXISTS skill_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  missing_skill VARCHAR(255) NOT NULL,
  skill_importance VARCHAR(20) DEFAULT 'medium' CHECK (skill_importance IN ('low', 'medium', 'high', 'critical')),
  learning_resources JSONB, -- Array of {type, url, title, duration}
  mastered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  skill_gap_id UUID REFERENCES skill_gaps(id) ON DELETE CASCADE,
  resource_url TEXT NOT NULL,
  progress_percentage INT DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 8. SCRAPED JOBS (Shadow Profiles)
-- ============================================
CREATE TABLE IF NOT EXISTS scraped_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(100) NOT NULL, -- 'linkedin', 'indeed', 'glassdoor'
  external_id VARCHAR(255),
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_description TEXT,
  parsed_skills TEXT[],
  location VARCHAR(255),
  salary_range VARCHAR(100),
  job_type VARCHAR(50),
  posted_date TIMESTAMP,
  application_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  historical_matches JSONB, -- {similar_hires: [{name, cgpa, year}]}
  created_at TIMESTAMP DEFAULT NOW(),
  last_checked TIMESTAMP DEFAULT NOW(),
  UNIQUE(source, external_id)
);

-- ============================================
-- 9. MOCK INTERVIEWS (AI-powered practice)
-- ============================================
CREATE TABLE IF NOT EXISTS mock_interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  questions JSONB NOT NULL, -- Array of generated questions
  student_answers JSONB, -- Array of {question_id, answer_text, audio_url, video_url}
  ai_feedback JSONB, -- {sentiment, confidence_score, filler_words_count, technical_accuracy}
  overall_score DECIMAL(5,2),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- ============================================
-- 10. PLACEMENT READINESS METRICS
-- ============================================
CREATE TABLE IF NOT EXISTS placement_readiness_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID UNIQUE REFERENCES students(id) ON DELETE CASCADE,
  profile_score INT DEFAULT 0 CHECK (profile_score >= 0 AND profile_score <= 30),
  mock_score INT DEFAULT 0 CHECK (mock_score >= 0 AND mock_score <= 30),
  activity_score INT DEFAULT 0 CHECK (activity_score >= 0 AND activity_score <= 40),
  total_score INT DEFAULT 0 CHECK (total_score >= 0 AND total_score <= 100),
  percentile DECIMAL(5,2),
  last_calculated TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 11. DREAM COMPANY ROADMAP
-- ============================================
CREATE TABLE IF NOT EXISTS dream_company_roadmap (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  target_role VARCHAR(255),
  current_match_percentage DECIMAL(5,2),
  missing_skills TEXT[],
  estimated_time_to_ready VARCHAR(100),
  distance_to_dream DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, company_name)
);

-- ============================================
-- 12. COMPANY FLASHCARDS
-- ============================================
CREATE TABLE IF NOT EXISTS company_flashcards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  fact_type VARCHAR(50) NOT NULL, -- 'ceo', 'funding', 'tech_stack', 'culture'
  fact_content TEXT NOT NULL,
  source_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 13. REFERRALS BOARD
-- ============================================
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  posted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  referral_link TEXT NOT NULL,
  minimum_suitability_score DECIMAL(5,2),
  required_skills TEXT[],
  expires_at TIMESTAMP,
  slots_available INT,
  slots_used INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 14. ADMIN FORECASTING
-- ============================================
CREATE TABLE IF NOT EXISTS admin_forecasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  forecasted_eligible INT,
  forecasted_registrations INT,
  at_risk_students UUID[], -- Array of student IDs
  recommended_actions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS eligibility_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID UNIQUE REFERENCES jobs(id) ON DELETE CASCADE,
  total_students INT DEFAULT 0,
  eligible_students INT DEFAULT 0,
  criteria_breakdown JSONB,
  last_calculated TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_student_profiles_extended_student ON student_profiles_extended(student_id);
CREATE INDEX IF NOT EXISTS idx_placement_drives_date ON placement_drives(drive_date);
CREATE INDEX IF NOT EXISTS idx_placement_drives_status ON placement_drives(status);
CREATE INDEX IF NOT EXISTS idx_application_details_application ON application_details(application_id);
CREATE INDEX IF NOT EXISTS idx_notifications_student ON notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_activity_logs_student ON activity_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_skill_gaps_application ON skill_gaps(application_id);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_active ON scraped_jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_scraped_jobs_created ON scraped_jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_mock_interviews_student ON mock_interviews(student_id);
CREATE INDEX IF NOT EXISTS idx_referrals_active ON referrals(is_active);

COMMENT ON TABLE users IS 'Authentication table for students, companies, and admins';
COMMENT ON TABLE student_profiles_extended IS 'Extended student profile data beyond base schema';
COMMENT ON TABLE placement_drives IS 'Company-specific recruitment drives';
COMMENT ON TABLE application_details IS 'Detailed tracking for job applications';
COMMENT ON TABLE scraped_jobs IS 'Real-time job scraping for shadow profiles';
COMMENT ON TABLE mock_interviews IS 'AI-powered mock interview practice';
COMMENT ON TABLE placement_readiness_metrics IS 'PRS calculation and peer comparison';
