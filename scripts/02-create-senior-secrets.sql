-- Senior's Secret Database: Anonymous Interview Experiences

-- Table to store interview experiences shared by alumni
CREATE TABLE IF NOT EXISTS interview_experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Company Info
  company_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  job_type VARCHAR(50) DEFAULT 'Full-time', -- Full-time, Internship, Contract
  
  -- Interview Details
  total_rounds INTEGER NOT NULL,
  interview_date DATE,
  offer_received BOOLEAN DEFAULT FALSE,
  
  -- Anonymized Student Info
  student_branch VARCHAR(100), -- CS, IT, ECE, etc. (optional)
  student_gpa DECIMAL(3, 2), -- Optional, for context
  graduation_year INTEGER,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE, -- Admin can verify authentic experiences
  helpful_count INTEGER DEFAULT 0, -- Upvote count
  view_count INTEGER DEFAULT 0
);

-- Table to store round-wise details
CREATE TABLE IF NOT EXISTS interview_rounds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID REFERENCES interview_experiences(id) ON DELETE CASCADE,
  
  -- Round Info
  round_number INTEGER NOT NULL,
  round_name VARCHAR(100), -- "Technical Round 1", "HR Round", "Coding Test"
  round_type VARCHAR(50), -- coding, technical, hr, aptitude, case-study, group-discussion
  
  -- Round Details
  duration_minutes INTEGER,
  difficulty VARCHAR(20), -- easy, medium, hard
  
  -- Content
  questions_asked TEXT, -- List of questions or topics
  topics_covered TEXT, -- Main technical topics
  coding_problems TEXT, -- LeetCode problems or descriptions
  behavioral_questions TEXT, -- HR/behavioral questions
  
  -- Tips & Insights
  preparation_tips TEXT,
  what_went_well TEXT,
  what_could_improve TEXT,
  
  -- Statistics (for pattern recognition)
  leetcode_difficulty VARCHAR(20), -- easy, medium, hard (if applicable)
  dsa_topics TEXT[], -- ["Trees", "Dynamic Programming", "Graphs"]
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store helpful votes (prevent duplicate votes)
CREATE TABLE IF NOT EXISTS experience_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID REFERENCES interview_experiences(id) ON DELETE CASCADE,
  user_id UUID, -- Anonymous or logged in
  ip_address VARCHAR(45), -- For rate limiting
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(experience_id, user_id),
  UNIQUE(experience_id, ip_address)
);

-- Table for tags/keywords for better searchability
CREATE TABLE IF NOT EXISTS experience_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  experience_id UUID REFERENCES interview_experiences(id) ON DELETE CASCADE,
  tag VARCHAR(50) NOT NULL,
  
  UNIQUE(experience_id, tag)
);

-- Indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_experiences_company ON interview_experiences(company_name);
CREATE INDEX IF NOT EXISTS idx_experiences_job_title ON interview_experiences(job_title);
CREATE INDEX IF NOT EXISTS idx_experiences_graduation_year ON interview_experiences(graduation_year);
CREATE INDEX IF NOT EXISTS idx_experiences_created_at ON interview_experiences(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiences_helpful ON interview_experiences(helpful_count DESC);
CREATE INDEX IF NOT EXISTS idx_rounds_experience ON interview_rounds(experience_id);
CREATE INDEX IF NOT EXISTS idx_rounds_type ON interview_rounds(round_type);
CREATE INDEX IF NOT EXISTS idx_tags_experience ON experience_tags(experience_id);
CREATE INDEX IF NOT EXISTS idx_tags_tag ON experience_tags(tag);

-- View for popular companies
CREATE OR REPLACE VIEW popular_companies AS
SELECT 
  company_name,
  COUNT(*) as experience_count,
  AVG(CASE WHEN offer_received THEN 1 ELSE 0 END) * 100 as offer_rate,
  AVG(total_rounds) as avg_rounds
FROM interview_experiences
GROUP BY company_name
ORDER BY experience_count DESC;

-- View for trending topics (most discussed in last 30 days)
CREATE OR REPLACE VIEW trending_topics AS
SELECT 
  UNNEST(dsa_topics) as topic,
  COUNT(*) as mention_count
FROM interview_rounds
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY topic
ORDER BY mention_count DESC
LIMIT 20;

-- Function to increment helpful count
CREATE OR REPLACE FUNCTION increment_helpful_count(exp_id UUID, user_ip VARCHAR(45))
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if already voted
  IF EXISTS (
    SELECT 1 FROM experience_votes 
    WHERE experience_id = exp_id AND ip_address = user_ip
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Insert vote
  INSERT INTO experience_votes (experience_id, ip_address)
  VALUES (exp_id, user_ip);
  
  -- Increment count
  UPDATE interview_experiences
  SET helpful_count = helpful_count + 1
  WHERE id = exp_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(exp_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE interview_experiences
  SET view_count = view_count + 1
  WHERE id = exp_id;
END;
$$ LANGUAGE plpgsql;

-- Seed data: Sample interview experiences
INSERT INTO interview_experiences (
  company_name, job_title, job_type, total_rounds, interview_date,
  offer_received, student_branch, student_gpa, graduation_year,
  is_verified, helpful_count
) VALUES
(
  'Amazon', 'SDE-1', 'Full-time', 5, '2025-08-15',
  TRUE, 'Computer Science', 8.5, 2025,
  TRUE, 42
),
(
  'Microsoft', 'Software Engineer', 'Full-time', 4, '2025-07-20',
  TRUE, 'IT', 8.2, 2025,
  TRUE, 38
),
(
  'Google', 'SWE Intern', 'Internship', 3, '2025-06-10',
  FALSE, 'Computer Science', 9.1, 2026,
  TRUE, 55
),
(
  'TCS', 'Ninja', 'Full-time', 3, '2025-09-01',
  TRUE, 'ECE', 7.8, 2025,
  TRUE, 28
),
(
  'Infosys', 'Systems Engineer', 'Full-time', 2, '2025-08-25',
  TRUE, 'IT', 7.5, 2025,
  TRUE, 19
);

-- Seed data: Sample round details
INSERT INTO interview_rounds (
  experience_id, round_number, round_name, round_type, duration_minutes,
  difficulty, questions_asked, topics_covered, coding_problems,
  preparation_tips, leetcode_difficulty, dsa_topics
) VALUES
(
  (SELECT id FROM interview_experiences WHERE company_name = 'Amazon' LIMIT 1),
  1, 'Online Coding Test', 'coding', 90, 'hard',
  'Solve 2 DSA problems in 90 minutes',
  'Dynamic Programming, Trees',
  '1. Maximum Subarray Sum (Kadane''s Algorithm) 2. Lowest Common Ancestor in Binary Tree',
  'Focus heavily on DP and Tree problems. Practice Leetcode Medium/Hard for 2 weeks.',
  'medium',
  ARRAY['Dynamic Programming', 'Trees', 'Binary Search']
),
(
  (SELECT id FROM interview_experiences WHERE company_name = 'Amazon' LIMIT 1),
  2, 'Technical Round 1', 'technical', 60, 'medium',
  'Solve a Leetcode Medium live, then explain system design',
  'Data Structures, System Design Basics',
  'Design a URL Shortener + Implement LRU Cache',
  'Be ready to code on a whiteboard or shared editor. Explain your thought process clearly.',
  'medium',
  ARRAY['Hashing', 'Design Patterns', 'Caching']
),
(
  (SELECT id FROM interview_experiences WHERE company_name = 'Google' LIMIT 1),
  1, 'Phone Screen', 'coding', 45, 'medium',
  'Solve 1-2 coding problems over phone',
  'Arrays, Strings, Recursion',
  'Find all permutations of a string',
  'Practice talking through your solution. They care about communication as much as correctness.',
  'medium',
  ARRAY['Strings', 'Recursion', 'Backtracking']
),
(
  (SELECT id FROM interview_experiences WHERE company_name = 'TCS' LIMIT 1),
  1, 'Aptitude Test', 'aptitude', 60, 'easy',
  '30 quantitative aptitude + 20 logical reasoning',
  'Basic Math, Profit/Loss, Time & Speed',
  'N/A',
  'IndiaBix and Arun Sharma books are sufficient. Focus on speed.',
  NULL,
  ARRAY[]::TEXT[]
),
(
  (SELECT id FROM interview_experiences WHERE company_name = 'Microsoft' LIMIT 1),
  2, 'Technical Round 2', 'technical', 60, 'hard',
  'Design a distributed cache + solve a hard graph problem',
  'System Design, Graphs',
  'Shortest Path in Weighted Graph (Dijkstra)',
  'Study system design patterns. Read "Designing Data-Intensive Applications".',
  'hard',
  ARRAY['Graphs', 'Distributed Systems', 'Caching']
);

-- Add tags for searchability
INSERT INTO experience_tags (experience_id, tag)
SELECT id, 'leetcode' FROM interview_experiences WHERE company_name IN ('Amazon', 'Google', 'Microsoft')
UNION ALL
SELECT id, 'system-design' FROM interview_experiences WHERE company_name IN ('Amazon', 'Microsoft')
UNION ALL
SELECT id, 'easy-process' FROM interview_experiences WHERE company_name IN ('TCS', 'Infosys')
UNION ALL
SELECT id, 'high-difficulty' FROM interview_experiences WHERE company_name IN ('Google', 'Amazon')
UNION ALL
SELECT id, 'coding-heavy' FROM interview_experiences WHERE company_name IN ('Amazon', 'Google', 'Microsoft');

COMMENT ON TABLE interview_experiences IS 'Anonymous interview experiences shared by alumni';
COMMENT ON TABLE interview_rounds IS 'Detailed round-wise breakdown of interview processes';
COMMENT ON TABLE experience_votes IS 'Tracks helpful votes to prevent duplicates';
COMMENT ON TABLE experience_tags IS 'Tags for improved search and filtering';
