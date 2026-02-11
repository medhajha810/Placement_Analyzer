-- ============================================
-- GAMIFICATION & COMMUNITY ENGAGEMENT SCHEMA
-- ============================================
-- Features: Dream Company Roadmap, Referral Matchmaker, Enhanced PRS

-- ============================================
-- 1. DREAM COMPANY ROADMAP
-- ============================================

-- Track student's dream companies (max 3)
CREATE TABLE dream_companies (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    target_role VARCHAR(255) NOT NULL, -- e.g., "SDE-1", "Data Analyst"
    priority INT CHECK (priority IN (1, 2, 3)), -- 1 = highest priority
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, company_name, target_role)
);

-- Historical skill requirements from past placements
CREATE TABLE company_skill_requirements (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    required_skills TEXT[] NOT NULL, -- Array of skills
    preferred_skills TEXT[],
    min_gpa DECIMAL(3, 2),
    technical_rounds INT DEFAULT 2,
    coding_difficulty VARCHAR(50), -- "Easy", "Medium", "Hard", "Mixed"
    common_topics TEXT[], -- ["DP", "Trees", "System Design"]
    interview_pattern TEXT, -- AI-generated description
    avg_ctc_lpa DECIMAL(5, 2),
    data_source VARCHAR(50) DEFAULT 'historical', -- 'historical', 'scraped', 'manual'
    last_updated TIMESTAMP DEFAULT NOW(),
    UNIQUE(company_name, job_title)
);

-- Track student's progress toward dream company
CREATE TABLE dream_company_progress (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    dream_company_id INT NOT NULL REFERENCES dream_companies(id) ON DELETE CASCADE,
    distance_to_dream INT DEFAULT 100, -- 0 (ready) to 100 (far away)
    matched_skills TEXT[],
    missing_skills TEXT[],
    weak_areas TEXT[], -- Skills student has but needs improvement
    recommended_actions JSONB, -- [{"action": "Learn React", "impact": "high", "time": "2 weeks"}]
    last_calculated TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, dream_company_id)
);

-- ============================================
-- 2. REFERRAL MATCHMAKER
-- ============================================

-- Alumni post referral opportunities
CREATE TABLE referral_board (
    id SERIAL PRIMARY KEY,
    posted_by_email VARCHAR(255) NOT NULL, -- Alumni email (optional anonymous)
    posted_by_name VARCHAR(255), -- Optional: can be "Anonymous Senior"
    company_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_type VARCHAR(50), -- "Full-time", "Internship"
    job_description TEXT,
    required_skills TEXT[] NOT NULL,
    preferred_skills TEXT[],
    min_gpa DECIMAL(3, 2),
    min_suitability_score INT DEFAULT 60, -- Only students with 60+ suitability can see
    graduation_year INT, -- For targeting specific batches
    referral_link TEXT, -- Direct application link or email
    application_deadline DATE,
    max_referrals INT DEFAULT 5, -- Limit number of referrals
    current_referrals INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    tags TEXT[], -- ["high-paying", "remote-friendly", "fast-hiring"]
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- Track student applications to referrals
CREATE TABLE referral_applications (
    id SERIAL PRIMARY KEY,
    referral_id INT NOT NULL REFERENCES referral_board(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    suitability_score INT NOT NULL, -- Calculated at time of application
    matched_skills TEXT[],
    status VARCHAR(50) DEFAULT 'applied', -- 'applied', 'shortlisted', 'interviewed', 'rejected', 'offer'
    applied_at TIMESTAMP DEFAULT NOW(),
    notes TEXT, -- Student's personalized message
    UNIQUE(referral_id, student_id)
);

-- ============================================
-- 3. ENHANCED PLACEMENT READINESS SCORE
-- ============================================

-- Store historical PRS snapshots for trend analysis
CREATE TABLE prs_history (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    prs_score INT NOT NULL CHECK (prs_score >= 0 AND prs_score <= 100),
    resume_score INT,
    mock_test_score INT,
    profile_score INT,
    activity_score INT,
    skill_score INT,
    benchmark_percentile INT, -- Where student stands vs peers
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Track specific achievements/milestones for gamification
CREATE TABLE student_achievements (
    id SERIAL PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100) NOT NULL, -- "first_mock_test", "100_prs", "dream_company_ready"
    achievement_title VARCHAR(255) NOT NULL,
    achievement_description TEXT,
    points_earned INT DEFAULT 0,
    badge_icon VARCHAR(50), -- Emoji or icon name
    unlocked_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, achievement_type)
);

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- Top Dream Companies (What companies are students targeting?)
CREATE VIEW popular_dream_companies AS
SELECT 
    company_name,
    target_role,
    COUNT(*) as student_count,
    AVG(dp.distance_to_dream) as avg_distance,
    COUNT(CASE WHEN dp.distance_to_dream <= 30 THEN 1 END) as ready_students
FROM dream_companies dc
LEFT JOIN dream_company_progress dp ON dc.id = dp.dream_company_id
GROUP BY company_name, target_role
ORDER BY student_count DESC;

-- Active Referrals with Match Rate
CREATE VIEW active_referrals_summary AS
SELECT 
    rb.*,
    COUNT(ra.id) as application_count,
    AVG(ra.suitability_score) as avg_applicant_score,
    (rb.current_referrals::FLOAT / NULLIF(rb.max_referrals, 0) * 100) as fill_percentage
FROM referral_board rb
LEFT JOIN referral_applications ra ON rb.id = ra.referral_id
WHERE rb.is_active = TRUE 
  AND rb.expires_at > NOW()
GROUP BY rb.id
ORDER BY rb.created_at DESC;

-- Student Engagement Leaderboard
CREATE VIEW engagement_leaderboard AS
SELECT 
    s.id,
    s.name,
    s.branch,
    s.graduation_year,
    ph.prs_score,
    ph.benchmark_percentile,
    COUNT(DISTINCT dc.id) as dream_companies_count,
    COUNT(DISTINCT ra.id) as referral_applications_count,
    COUNT(DISTINCT sa.id) as achievements_count,
    SUM(sa.points_earned) as total_points
FROM students s
LEFT JOIN prs_history ph ON s.id = ph.student_id 
    AND ph.recorded_at = (
        SELECT MAX(recorded_at) 
        FROM prs_history 
        WHERE student_id = s.id
    )
LEFT JOIN dream_companies dc ON s.id = dc.student_id
LEFT JOIN referral_applications ra ON s.id = ra.student_id
LEFT JOIN student_achievements sa ON s.id = sa.student_id
GROUP BY s.id, s.name, s.branch, s.graduation_year, ph.prs_score, ph.benchmark_percentile
ORDER BY total_points DESC, ph.prs_score DESC;

-- ============================================
-- FUNCTIONS
-- ============================================

-- Calculate Distance to Dream metric (0-100)
CREATE OR REPLACE FUNCTION calculate_distance_to_dream(
    p_student_id UUID,
    p_dream_company_id INT
)
RETURNS INT AS $$
DECLARE
    v_distance INT := 100;
    v_student_skills TEXT[];
    v_student_gpa DECIMAL;
    v_required_skills TEXT[];
    v_min_gpa DECIMAL;
    v_matched_count INT := 0;
    v_total_required INT;
BEGIN
    -- Get student info
    SELECT skills, gpa INTO v_student_skills, v_student_gpa
    FROM students
    WHERE id = p_student_id;
    
    -- Get company requirements
    SELECT csr.required_skills, csr.min_gpa INTO v_required_skills, v_min_gpa
    FROM dream_companies dc
    JOIN company_skill_requirements csr 
        ON dc.company_name = csr.company_name 
        AND dc.target_role = csr.job_title
    WHERE dc.id = p_dream_company_id;
    
    -- Count matched skills
    v_total_required := array_length(v_required_skills, 1);
    
    IF v_total_required IS NULL OR v_total_required = 0 THEN
        RETURN 50; -- Default if no requirements found
    END IF;
    
    -- Calculate skill match
    SELECT COUNT(*) INTO v_matched_count
    FROM unnest(v_required_skills) AS req_skill
    WHERE EXISTS (
        SELECT 1 FROM unnest(v_student_skills) AS stud_skill
        WHERE LOWER(stud_skill) LIKE '%' || LOWER(req_skill) || '%'
    );
    
    -- Calculate distance (lower is better)
    v_distance := 100 - ((v_matched_count::FLOAT / v_total_required) * 70)::INT;
    
    -- GPA penalty
    IF v_min_gpa IS NOT NULL AND v_student_gpa < v_min_gpa THEN
        v_distance := v_distance + 20;
    ELSE
        v_distance := v_distance - 10; -- Bonus for meeting GPA
    END IF;
    
    -- Ensure 0-100 range
    v_distance := GREATEST(0, LEAST(100, v_distance));
    
    RETURN v_distance;
END;
$$ LANGUAGE plpgsql;

-- Increment referral count when student applies
CREATE OR REPLACE FUNCTION increment_referral_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE referral_board
    SET current_referrals = current_referrals + 1
    WHERE id = NEW.referral_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_referral_application
AFTER INSERT ON referral_applications
FOR EACH ROW
EXECUTE FUNCTION increment_referral_count();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_dream_companies_student ON dream_companies(student_id);
CREATE INDEX idx_dream_companies_company ON dream_companies(company_name);
CREATE INDEX idx_skill_requirements_company ON company_skill_requirements(company_name, job_title);
CREATE INDEX idx_referral_board_active ON referral_board(is_active, expires_at) WHERE is_active = TRUE;
CREATE INDEX idx_referral_board_company ON referral_board(company_name);
CREATE INDEX idx_referral_applications_student ON referral_applications(student_id);
CREATE INDEX idx_referral_applications_referral ON referral_applications(referral_id);
CREATE INDEX idx_prs_history_student ON prs_history(student_id, recorded_at DESC);
CREATE INDEX idx_achievements_student ON student_achievements(student_id);

-- ============================================
-- SEED DATA
-- ============================================

-- Popular company skill requirements (based on historical data)
INSERT INTO company_skill_requirements (company_name, job_title, required_skills, preferred_skills, min_gpa, technical_rounds, coding_difficulty, common_topics, interview_pattern, avg_ctc_lpa) VALUES
('Google', 'SWE Intern', ARRAY['Data Structures', 'Algorithms', 'System Design', 'Python', 'Java'], ARRAY['Distributed Systems', 'Machine Learning'], 8.0, 3, 'Hard', ARRAY['DP', 'Graphs', 'Trees', 'System Design'], 'Google focuses heavily on DSA and problem-solving. Expect 2 coding rounds (Leetcode Hard) and 1 system design round. Strong emphasis on code optimization and edge cases.', 25.0),
('Amazon', 'SDE-1', ARRAY['Data Structures', 'Algorithms', 'OOP', 'Java', 'Python'], ARRAY['AWS', 'Microservices'], 7.5, 4, 'Medium', ARRAY['DP', 'Trees', 'Graphs', 'Amazon Leadership Principles'], 'Amazon uses the STAR method for behavioral rounds. Coding rounds focus on Leetcode Medium with emphasis on DP and Trees. Bar Raiser round is critical.', 18.0),
('Microsoft', 'SWE', ARRAY['Data Structures', 'Algorithms', 'C++', 'System Design'], ARRAY['Azure', '.NET'], 7.5, 3, 'Medium', ARRAY['DP', 'Arrays', 'Strings', 'Design Patterns'], 'Microsoft balances coding and design. Expect 2 DSA rounds (Leetcode Medium) and 1 low-level design round. They value clean code and testing.', 22.0),
('Meta', 'Software Engineer', ARRAY['Data Structures', 'Algorithms', 'System Design', 'Python', 'JavaScript'], ARRAY['React', 'GraphQL'], 8.0, 3, 'Hard', ARRAY['DP', 'Graphs', 'System Design', 'Behavioral'], 'Meta (Facebook) has intense coding rounds with focus on optimization. Behavioral round tests core values. System design expects scalability discussion.', 28.0),
('Flipkart', 'SDE-2', ARRAY['Java', 'Spring Boot', 'Microservices', 'SQL', 'System Design'], ARRAY['Kafka', 'Redis'], 7.0, 3, 'Medium', ARRAY['LLD', 'HLD', 'Concurrency'], 'Flipkart focuses on backend development. Expect design rounds (both LLD and HLD), 1 DSA round, and strong emphasis on Java ecosystem.', 16.0),
('Atlassian', 'Software Engineer', ARRAY['Java', 'Algorithms', 'System Design', 'REST APIs'], ARRAY['Spring', 'Kubernetes'], 7.5, 3, 'Medium', ARRAY['Design', 'APIs', 'Testing'], 'Atlassian values code quality and testing. Rounds include DSA, system design, and pair programming. Culture fit is important.', 20.0),
('Goldman Sachs', 'Analyst', ARRAY['C++', 'Java', 'Data Structures', 'SQL', 'OOP'], ARRAY['Linux', 'Finance'], 8.5, 2, 'Medium', ARRAY['Arrays', 'Strings', 'Math'], 'Goldman Sachs has tough GPA cutoff. Coding rounds focus on implementation and optimization. Finance knowledge is a bonus.', 19.0),
('Uber', 'Backend Engineer', ARRAY['Java', 'Python', 'System Design', 'Distributed Systems'], ARRAY['Go', 'Kafka'], 7.5, 3, 'Hard', ARRAY['System Design', 'Concurrency', 'Scalability'], 'Uber emphasizes system design and real-world problem solving. Expect detailed architecture discussions and trade-off analysis.', 24.0),
('Stripe', 'Software Engineer', ARRAY['Algorithms', 'System Design', 'APIs', 'Python', 'Ruby'], ARRAY['Payment Systems', 'Security'], 8.0, 3, 'Hard', ARRAY['APIs', 'Distributed Systems', 'Data Modeling'], 'Stripe focuses on API design and scalability. Coding rounds test problem-solving with real-world scenarios. Security awareness is valued.', 26.0),
('Adobe', 'Software Engineer', ARRAY['C++', 'Data Structures', 'Algorithms', 'Computer Graphics'], ARRAY['Machine Learning', 'Computer Vision'], 7.5, 3, 'Medium', ARRAY['DP', 'Graphs', 'Image Processing'], 'Adobe values strong fundamentals in DSA and graphics. Expect coding rounds with visual/geometric problems and design discussions.', 17.0);

-- Sample achievements/badges
INSERT INTO student_achievements (student_id, achievement_type, achievement_title, achievement_description, points_earned, badge_icon) VALUES
-- Mock data - replace with actual student IDs
((SELECT id FROM students LIMIT 1), 'profile_complete', 'Profile Perfectionist', 'Completed 100% of your profile', 50, '✅'),
((SELECT id FROM students LIMIT 1), 'first_mock_test', 'First Steps', 'Completed your first mock interview', 25, '🎤'),
((SELECT id FROM students LIMIT 1), 'prs_50', 'Halfway There', 'Reached 50 PRS score', 50, '⭐'),
((SELECT id FROM students LIMIT 1), 'dream_company_added', 'Dream Big', 'Added your first dream company', 30, '🎯');

-- Sample referral postings (from alumni)
INSERT INTO referral_board (posted_by_email, posted_by_name, company_name, job_title, job_type, job_description, required_skills, preferred_skills, min_gpa, min_suitability_score, graduation_year, referral_link, application_deadline, max_referrals, tags, expires_at) VALUES
('alumni1@example.com', 'Rahul (2023 Grad)', 'Amazon', 'SDE-1', 'Full-time', 'Hiring for AWS team. Great learning opportunity with exposure to distributed systems.', ARRAY['Java', 'Python', 'Data Structures', 'Algorithms'], ARRAY['AWS', 'Microservices'], 7.5, 65, 2025, 'mailto:rahul.referral@amazon.com', '2026-03-15', 3, ARRAY['high-paying', 'product-based'], '2026-03-15'),
('alumni2@example.com', 'Priya M. (2022 Grad)', 'Google', 'SWE Intern', 'Internship', 'Summer internship for 2026. Work on Google Maps team in Bangalore.', ARRAY['Python', 'Data Structures', 'Algorithms'], ARRAY['Machine Learning', 'Android'], 8.0, 75, 2026, 'https://forms.google.com/referral-xyz', '2026-02-28', 5, ARRAY['dream-company', 'internship', 'high-ctc'], '2026-02-28'),
('alumni3@example.com', 'Anonymous Senior', 'Microsoft', 'SDE-2', 'Full-time', 'Looking for backend engineers for Azure team. 2+ years experience preferred but freshers can apply.', ARRAY['C#', '.NET', 'Azure', 'System Design'], ARRAY['Kubernetes', 'Docker'], 7.0, 60, 2024, 'https://careers.microsoft.com/referral/123', '2026-04-01', 2, ARRAY['remote-friendly', 'fast-hiring'], '2026-04-01'),
('alumni4@example.com', 'Arjun K. (Alumni)', 'Flipkart', 'SDE-1', 'Full-time', 'Backend role in supply chain team. Strong Java required. Competitive salary.', ARRAY['Java', 'Spring Boot', 'SQL', 'REST APIs'], ARRAY['Kafka', 'Redis'], 7.0, 55, 2025, 'mailto:arjun.kumar@flipkart.com', '2026-03-30', 4, ARRAY['product-based', 'good-wlb'], '2026-03-30'),
('alumni5@example.com', 'Neha S. (2021 Grad)', 'Atlassian', 'Software Engineer', 'Full-time', 'Join the Jira team! Great culture and work-life balance. Sydney or Bangalore location.', ARRAY['Java', 'JavaScript', 'React', 'System Design'], ARRAY['GraphQL', 'TypeScript'], 7.5, 70, 2025, 'https://atlassian.com/referral/neha', '2026-03-20', 3, ARRAY['great-culture', 'international'], '2026-03-20');

-- Sample PRS history (for trend visualization)
-- This would be generated dynamically, but here's example data
-- INSERT INTO prs_history (student_id, prs_score, resume_score, mock_test_score, profile_score, activity_score, skill_score, benchmark_percentile)
-- VALUES (...);

COMMENT ON TABLE dream_companies IS 'Stores student dream companies (max 3) for personalized roadmap generation';
COMMENT ON TABLE company_skill_requirements IS 'Historical hiring patterns and skill requirements from past placements';
COMMENT ON TABLE referral_board IS 'Alumni-posted referral opportunities with eligibility criteria';
COMMENT ON TABLE referral_applications IS 'Tracks student applications to referral postings';
COMMENT ON TABLE prs_history IS 'Historical snapshots of Placement Readiness Score for trend analysis';
COMMENT ON TABLE student_achievements IS 'Gamification achievements and milestones';

COMMENT ON COLUMN dream_company_progress.distance_to_dream IS '0 = Ready to apply, 100 = Very far from requirements';
COMMENT ON COLUMN referral_board.min_suitability_score IS 'Only students meeting this score can see the referral';
COMMENT ON COLUMN prs_history.benchmark_percentile IS 'Student rank compared to peers (0-100)';
