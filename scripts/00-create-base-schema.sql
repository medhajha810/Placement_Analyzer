-- ============================================
-- BASE SCHEMA - Core Tables
-- ============================================
-- Run this FIRST before any other migration scripts
-- This creates the foundational tables that other features depend on

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. STUDENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    branch VARCHAR(100), -- CS, IT, ECE, Mechanical, etc.
    graduation_year INT NOT NULL,
    current_year INT CHECK (current_year IN (1, 2, 3, 4)), -- 1st year, 2nd year, etc.
    gpa DECIMAL(3, 2) CHECK (gpa >= 0 AND gpa <= 10),
    phone VARCHAR(15),
    skills TEXT[], -- Array of skills ["Python", "React", "SQL"]
    resume_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    profile_completeness INT DEFAULT 0 CHECK (profile_completeness >= 0 AND profile_completeness <= 100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. COMPANIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255),
    industry VARCHAR(100), -- IT, Finance, Consulting, etc.
    company_size VARCHAR(50), -- Startup, Mid-size, Large, Enterprise
    website_url TEXT,
    description TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. JOBS/PLACEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    job_type VARCHAR(50), -- Full-time, Internship, Contract
    description TEXT,
    required_skills TEXT[],
    preferred_skills TEXT[],
    min_gpa DECIMAL(3, 2),
    eligible_branches TEXT[], -- ["CS", "IT", "ECE"]
    eligible_years INT[], -- [3, 4] for 3rd and 4th year
    ctc_lpa DECIMAL(5, 2), -- CTC in lakhs per annum
    location VARCHAR(255),
    work_mode VARCHAR(50), -- On-site, Remote, Hybrid
    application_deadline DATE,
    total_rounds INT,
    is_active BOOLEAN DEFAULT TRUE,
    posted_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 4. APPLICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'applied', -- applied, shortlisted, rejected, offered, accepted
    applied_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    UNIQUE(student_id, job_id)
);

-- ============================================
-- 5. MOCK TESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS mock_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    test_type VARCHAR(100), -- "Coding", "Aptitude", "Technical MCQ"
    topic VARCHAR(255), -- "Arrays & Strings", "System Design", "Quantitative"
    score INT CHECK (score >= 0 AND score <= 100),
    max_score INT DEFAULT 100,
    duration_minutes INT,
    difficulty VARCHAR(20), -- easy, medium, hard
    questions_attempted INT,
    questions_correct INT,
    taken_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 6. FLASH CARDS TABLE (For Interview Prep)
-- ============================================
CREATE TABLE IF NOT EXISTS flash_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE, -- NULL for global cards
    category VARCHAR(100), -- "DSA", "System Design", "Behavioral", "OOP"
    front_text TEXT NOT NULL, -- Question or concept
    back_text TEXT NOT NULL, -- Answer or explanation
    difficulty VARCHAR(20), -- easy, medium, hard
    tags TEXT[], -- ["trees", "recursion", "google"]
    is_favorite BOOLEAN DEFAULT FALSE,
    times_reviewed INT DEFAULT 0,
    last_reviewed_at TIMESTAMP,
    confidence_level VARCHAR(20) DEFAULT 'learning', -- learning, familiar, mastered
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Students indexes
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_graduation_year ON students(graduation_year);
CREATE INDEX IF NOT EXISTS idx_students_branch ON students(branch);
CREATE INDEX IF NOT EXISTS idx_students_gpa ON students(gpa DESC);

-- Companies indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON jobs(application_deadline);
CREATE INDEX IF NOT EXISTS idx_jobs_posted ON jobs(posted_at DESC);

-- Applications indexes
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied ON applications(applied_at DESC);

-- Mock Tests indexes
CREATE INDEX IF NOT EXISTS idx_mock_tests_student ON mock_tests(student_id);
CREATE INDEX IF NOT EXISTS idx_mock_tests_type ON mock_tests(test_type);
CREATE INDEX IF NOT EXISTS idx_mock_tests_taken ON mock_tests(taken_at DESC);

-- Flash Cards indexes
CREATE INDEX IF NOT EXISTS idx_flash_cards_student ON flash_cards(student_id);
CREATE INDEX IF NOT EXISTS idx_flash_cards_category ON flash_cards(category);
CREATE INDEX IF NOT EXISTS idx_flash_cards_confidence ON flash_cards(confidence_level);

-- ============================================
-- SEED DATA (Optional - for testing)
-- ============================================

-- Sample Students
INSERT INTO students (email, name, branch, graduation_year, current_year, gpa, skills, profile_completeness) VALUES
('raj.kumar@college.edu', 'Raj Kumar', 'Computer Science', 2026, 4, 8.5, ARRAY['Python', 'React', 'Node.js', 'SQL'], 85),
('priya.sharma@college.edu', 'Priya Sharma', 'Information Technology', 2026, 4, 9.1, ARRAY['Java', 'Spring Boot', 'Docker', 'AWS'], 92),
('amit.patel@college.edu', 'Amit Patel', 'Computer Science', 2027, 3, 7.8, ARRAY['JavaScript', 'MongoDB', 'Express', 'React'], 78),
('sneha.reddy@college.edu', 'Sneha Reddy', 'Electronics', 2026, 4, 8.2, ARRAY['Python', 'Machine Learning', 'TensorFlow'], 80),
('vikram.singh@college.edu', 'Vikram Singh', 'Information Technology', 2025, 4, 8.8, ARRAY['C++', 'Data Structures', 'Algorithms', 'System Design'], 90)
ON CONFLICT (email) DO NOTHING;

-- Sample Companies
INSERT INTO companies (name, industry, company_size, description) VALUES
('Google', 'Technology', 'Enterprise', 'Global technology leader in search, cloud, and AI'),
('Amazon', 'Technology', 'Enterprise', 'E-commerce and cloud computing giant'),
('Microsoft', 'Technology', 'Enterprise', 'Software and cloud services leader'),
('Flipkart', 'E-commerce', 'Large', 'Leading Indian e-commerce platform'),
('Infosys', 'IT Services', 'Enterprise', 'Global IT services and consulting'),
('TCS', 'IT Services', 'Enterprise', 'Tata Consultancy Services - IT services leader'),
('Wipro', 'IT Services', 'Large', 'IT services and consulting'),
('Cognizant', 'IT Services', 'Large', 'Professional services company'),
('Goldman Sachs', 'Finance', 'Enterprise', 'Global investment banking firm'),
('Accenture', 'Consulting', 'Enterprise', 'Global professional services company')
ON CONFLICT (name) DO NOTHING;

-- Sample Jobs
INSERT INTO jobs (company_id, title, job_type, required_skills, min_gpa, eligible_branches, eligible_years, ctc_lpa, location, work_mode, total_rounds, is_active)
SELECT 
    c.id,
    'Software Engineer',
    'Full-time',
    ARRAY['Java', 'Spring Boot', 'SQL'],
    7.5,
    ARRAY['Computer Science', 'Information Technology'],
    ARRAY[3, 4],
    12.5,
    'Bangalore',
    'On-site',
    4,
    TRUE
FROM companies c WHERE c.name = 'Infosys'
ON CONFLICT DO NOTHING;

INSERT INTO jobs (company_id, title, job_type, required_skills, min_gpa, eligible_branches, eligible_years, ctc_lpa, location, work_mode, total_rounds, is_active)
SELECT 
    c.id,
    'SDE-1',
    'Full-time',
    ARRAY['Data Structures', 'Algorithms', 'System Design'],
    8.0,
    ARRAY['Computer Science', 'Information Technology'],
    ARRAY[4],
    42.0,
    'Hyderabad',
    'On-site',
    5,
    TRUE
FROM companies c WHERE c.name = 'Amazon'
ON CONFLICT DO NOTHING;

-- Sample Mock Test Results
INSERT INTO mock_tests (student_id, test_type, topic, score, duration_minutes, difficulty, questions_attempted, questions_correct)
SELECT 
    s.id,
    'Coding',
    'Arrays & Strings',
    85,
    60,
    'medium',
    10,
    8
FROM students s WHERE s.email = 'raj.kumar@college.edu'
LIMIT 1;

INSERT INTO mock_tests (student_id, test_type, topic, score, duration_minutes, difficulty, questions_attempted, questions_correct)
SELECT 
    s.id,
    'Technical MCQ',
    'Operating Systems',
    72,
    45,
    'medium',
    20,
    14
FROM students s WHERE s.email = 'priya.sharma@college.edu'
LIMIT 1;

-- Sample Flash Cards
INSERT INTO flash_cards (category, front_text, back_text, difficulty, tags) VALUES
('DSA', 'What is the time complexity of Binary Search?', 'O(log n) - Binary search divides the search space in half with each iteration', 'easy', ARRAY['algorithms', 'time-complexity']),
('DSA', 'Explain Depth-First Search (DFS)', 'DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking. Can be implemented recursively or with a stack.', 'medium', ARRAY['graphs', 'traversal']),
('System Design', 'What is a Load Balancer?', 'A load balancer distributes incoming network traffic across multiple servers to ensure no single server is overwhelmed, improving reliability and performance.', 'medium', ARRAY['system-design', 'scalability']),
('Behavioral', 'Tell me about a time you faced a challenge', 'Use STAR method: Situation, Task, Action, Result. Be specific, quantify impact, and show learning/growth.', 'easy', ARRAY['interview-prep', 'behavioral']),
('OOP', 'What are the 4 pillars of OOP?', 'Encapsulation, Abstraction, Inheritance, Polymorphism', 'easy', ARRAY['oop', 'fundamentals'])
ON CONFLICT DO NOTHING;

COMMENT ON TABLE students IS 'Core student profiles with skills and academic info';
COMMENT ON TABLE companies IS 'Companies posting jobs or participating in placements';
COMMENT ON TABLE jobs IS 'Job postings from companies with eligibility criteria';
COMMENT ON TABLE applications IS 'Student applications to jobs with status tracking';
COMMENT ON TABLE mock_tests IS 'Mock test results for student readiness assessment';
COMMENT ON TABLE flash_cards IS 'Interview prep flash cards for quick revision';
