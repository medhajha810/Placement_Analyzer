-- Seed data for testing the placement portal

-- Create admin user
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('admin@placement.com', 'admin123', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create sample students
INSERT INTO users (email, password_hash, full_name, role) 
VALUES 
  ('john.doe@student.com', 'password123', 'John Doe', 'student'),
  ('jane.smith@student.com', 'password123', 'Jane Smith', 'student'),
  ('bob.wilson@student.com', 'password123', 'Bob Wilson', 'student')
ON CONFLICT (email) DO NOTHING;

-- Create student profiles
INSERT INTO student_profiles (user_id, gpa, graduation_year, branch, skills, profile_completeness, placement_readiness_score)
SELECT 
  u.id,
  8.5,
  2026,
  'Computer Science',
  ARRAY['Python', 'JavaScript', 'React', 'Node.js', 'SQL'],
  85,
  75
FROM users u WHERE u.email = 'john.doe@student.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO student_profiles (user_id, gpa, graduation_year, branch, skills, profile_completeness, placement_readiness_score)
SELECT 
  u.id,
  7.8,
  2026,
  'Information Technology',
  ARRAY['Java', 'Spring Boot', 'MySQL', 'Docker'],
  70,
  65
FROM users u WHERE u.email = 'jane.smith@student.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO student_profiles (user_id, gpa, graduation_year, branch, skills, profile_completeness, placement_readiness_score)
SELECT 
  u.id,
  9.2,
  2026,
  'Computer Science',
  ARRAY['Python', 'Machine Learning', 'TensorFlow', 'Data Science'],
  95,
  88
FROM users u WHERE u.email = 'bob.wilson@student.com'
ON CONFLICT (user_id) DO NOTHING;

-- Create sample companies
INSERT INTO companies (name, logo_url, website, description, industry, company_size)
VALUES 
  ('Google', 'https://logo.clearbit.com/google.com', 'https://google.com', 'Technology giant focusing on search, cloud, and AI', 'Technology', '10000+'),
  ('Microsoft', 'https://logo.clearbit.com/microsoft.com', 'https://microsoft.com', 'Leading software and cloud services provider', 'Technology', '10000+'),
  ('Amazon', 'https://logo.clearbit.com/amazon.com', 'https://amazon.com', 'E-commerce and cloud computing leader', 'E-commerce', '10000+'),
  ('Infosys', 'https://logo.clearbit.com/infosys.com', 'https://infosys.com', 'Global IT services and consulting company', 'IT Services', '5000-10000')
ON CONFLICT DO NOTHING;

-- Create sample placement drives
INSERT INTO placement_drives (
  company_id, 
  job_title, 
  jd_text, 
  jd_parsed,
  drive_date, 
  drive_time,
  registration_deadline,
  location,
  job_type,
  salary_range,
  eligibility_criteria,
  required_skills,
  preferred_skills,
  status
)
SELECT 
  c.id,
  'Software Engineer',
  E'We are looking for talented Software Engineers to join our team.\n\nResponsibilities:\n- Design and develop scalable applications\n- Collaborate with cross-functional teams\n- Write clean, maintainable code\n\nRequirements:\n- Strong programming skills in Python or Java\n- Experience with web frameworks\n- Good understanding of data structures and algorithms',
  '{"experience": "0-2 years", "education": "B.Tech/B.E.", "skills": ["Python", "Java", "DSA"]}'::jsonb,
  CURRENT_DATE + INTERVAL '7 days',
  '10:00:00',
  CURRENT_DATE + INTERVAL '3 days',
  'Bangalore',
  'Full-time',
  '12-18 LPA',
  '{"gpa_min": 7.0, "branches": ["Computer Science", "Information Technology"], "skills": ["Python", "Java"]}'::jsonb,
  ARRAY['Python', 'Java', 'DSA', 'Web Development'],
  ARRAY['React', 'Node.js', 'Cloud'],
  'upcoming'
FROM companies c WHERE c.name = 'Google'
LIMIT 1;

INSERT INTO placement_drives (
  company_id, 
  job_title, 
  jd_text,
  jd_parsed,
  drive_date, 
  drive_time,
  registration_deadline,
  location,
  job_type,
  salary_range,
  eligibility_criteria,
  required_skills,
  preferred_skills,
  status
)
SELECT 
  c.id,
  'Cloud Engineer',
  E'Join Microsoft Azure team as a Cloud Engineer.\n\nKey Responsibilities:\n- Deploy and manage cloud infrastructure\n- Optimize cloud costs and performance\n- Implement security best practices\n\nQualifications:\n- Knowledge of Azure/AWS\n- Experience with containerization (Docker, Kubernetes)\n- Strong scripting skills',
  '{"experience": "0-3 years", "education": "B.Tech", "cloud_platforms": ["Azure", "AWS"]}'::jsonb,
  CURRENT_DATE + INTERVAL '14 days',
  '14:00:00',
  CURRENT_DATE + INTERVAL '10 days',
  'Hyderabad',
  'Full-time',
  '15-22 LPA',
  '{"gpa_min": 7.5, "branches": ["Computer Science", "IT"], "skills": ["Docker", "Kubernetes"]}'::jsonb,
  ARRAY['Docker', 'Kubernetes', 'Cloud', 'Linux'],
  ARRAY['Azure', 'AWS', 'Terraform'],
  'upcoming'
FROM companies c WHERE c.name = 'Microsoft'
LIMIT 1;

INSERT INTO placement_drives (
  company_id, 
  job_title, 
  jd_text,
  jd_parsed,
  drive_date, 
  drive_time,
  registration_deadline,
  location,
  job_type,
  salary_range,
  eligibility_criteria,
  required_skills,
  preferred_skills,
  status
)
SELECT 
  c.id,
  'Data Analyst',
  E'Amazon is hiring Data Analysts for our analytics team.\n\nWhat You''ll Do:\n- Analyze large datasets to derive insights\n- Create dashboards and reports\n- Work with stakeholders to define metrics\n\nWhat We Need:\n- SQL proficiency\n- Python/R for data analysis\n- Data visualization skills',
  '{"experience": "0-2 years", "tools": ["SQL", "Python", "Tableau"]}'::jsonb,
  CURRENT_DATE + INTERVAL '21 days',
  '11:30:00',
  CURRENT_DATE + INTERVAL '17 days',
  'Mumbai',
  'Full-time',
  '10-15 LPA',
  '{"gpa_min": 7.0, "branches": ["Computer Science", "IT", "Electronics"], "skills": ["SQL", "Python"]}'::jsonb,
  ARRAY['SQL', 'Python', 'Data Analysis'],
  ARRAY['Tableau', 'PowerBI', 'R'],
  'upcoming'
FROM companies c WHERE c.name = 'Amazon'
LIMIT 1;

-- Create sample notifications for students
INSERT INTO notifications (user_id, drive_id, type, title, message, priority)
SELECT 
  u.id,
  d.id,
  'drive_alert',
  'New Placement Drive: Google Software Engineer',
  'A new placement drive has been posted by Google. Registration deadline is in 3 days!',
  'high'
FROM users u
CROSS JOIN placement_drives d
JOIN companies c ON d.company_id = c.id
WHERE u.role = 'student' AND c.name = 'Google';

-- Sample scraped jobs
INSERT INTO scraped_jobs (
  source,
  external_id,
  company_name,
  job_title,
  job_description,
  parsed_skills,
  location,
  salary_range,
  job_type,
  posted_date,
  application_url
)
VALUES 
  (
    'linkedin',
    'ln_12345',
    'Flipkart',
    'Frontend Developer',
    'Looking for React developers with 0-2 years experience',
    ARRAY['React', 'JavaScript', 'HTML', 'CSS'],
    'Bangalore',
    '8-12 LPA',
    'Full-time',
    NOW() - INTERVAL '2 days',
    'https://linkedin.com/jobs/12345'
  ),
  (
    'indeed',
    'id_67890',
    'Paytm',
    'Backend Developer',
    'Node.js developer needed for payment systems',
    ARRAY['Node.js', 'MongoDB', 'Express', 'REST API'],
    'Noida',
    '10-14 LPA',
    'Full-time',
    NOW() - INTERVAL '1 day',
    'https://indeed.com/jobs/67890'
  ),
  (
    'naukri',
    'nk_54321',
    'Zomato',
    'Full Stack Developer',
    'Join our engineering team building food tech solutions',
    ARRAY['React', 'Node.js', 'PostgreSQL', 'Redis'],
    'Gurgaon',
    '12-18 LPA',
    'Full-time',
    NOW(),
    'https://naukri.com/jobs/54321'
  );

-- Create additional students for historical data (2025 graduates who got placed)
INSERT INTO users (email, password_hash, full_name, role) 
VALUES 
  ('alice.brown@alumni.com', 'password123', 'Alice Brown', 'student'),
  ('charlie.davis@alumni.com', 'password123', 'Charlie Davis', 'student'),
  ('emma.wilson@alumni.com', 'password123', 'Emma Wilson', 'student'),
  ('david.lee@alumni.com', 'password123', 'David Lee', 'student'),
  ('sarah.johnson@alumni.com', 'password123', 'Sarah Johnson', 'student')
ON CONFLICT (email) DO NOTHING;

-- Create profiles for historical students with relevant skills
INSERT INTO student_profiles (user_id, gpa, graduation_year, branch, skills, profile_completeness, placement_readiness_score)
SELECT 
  u.id,
  8.4,
  2025,
  'Computer Science',
  ARRAY['Java', 'Spring Boot', 'Microservices', 'REST APIs', 'MySQL'],
  100,
  85
FROM users u WHERE u.email = 'alice.brown@alumni.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO student_profiles (user_id, gpa, graduation_year, branch, skills, profile_completeness, placement_readiness_score)
SELECT 
  u.id,
  7.9,
  2025,
  'Information Technology',
  ARRAY['Java', 'Spring Boot', 'MongoDB', 'Docker', 'Kubernetes'],
  95,
  78
FROM users u WHERE u.email = 'charlie.davis@alumni.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO student_profiles (user_id, gpa, graduation_year, branch, skills, profile_completeness, placement_readiness_score)
SELECT 
  u.id,
  8.6,
  2025,
  'Computer Science',
  ARRAY['React', 'Node.js', 'MongoDB', 'TypeScript', 'Express'],
  100,
  88
FROM users u WHERE u.email = 'emma.wilson@alumni.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO student_profiles (user_id, gpa, graduation_year, branch, skills, profile_completeness, placement_readiness_score)
SELECT 
  u.id,
  8.1,
  2024,
  'Computer Science',
  ARRAY['Python', 'Django', 'PostgreSQL', 'REST APIs', 'Docker'],
  100,
  82
FROM users u WHERE u.email = 'david.lee@alumni.com'
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO student_profiles (user_id, gpa, graduation_year, branch, skills, profile_completeness, placement_readiness_score)
SELECT 
  u.id,
  8.8,
  2024,
  'Information Technology',
  ARRAY['Java', 'Spring Boot', 'REST APIs', 'PostgreSQL', 'Redis'],
  100,
  90
FROM users u WHERE u.email = 'sarah.johnson@alumni.com'
ON CONFLICT (user_id) DO NOTHING;

-- Create historical placement drives for TCS, Infosys, Wipro (completed)
INSERT INTO placement_drives (
  company_id, 
  job_title, 
  jd_text, 
  jd_parsed,
  drive_date, 
  drive_time,
  registration_deadline,
  location,
  job_type,
  salary_range,
  eligibility_criteria,
  required_skills,
  preferred_skills,
  status
)
VALUES 
  (
    (SELECT id FROM companies WHERE name = 'Infosys' LIMIT 1),
    'Software Developer',
    'Software development role requiring Java/Spring Boot expertise',
    '{"experience": "0-1 years", "education": "B.Tech"}'::jsonb,
    CURRENT_DATE - INTERVAL '120 days',
    '10:00:00',
    CURRENT_DATE - INTERVAL '125 days',
    'Multiple Locations',
    'Full-time',
    '6-10 LPA',
    '{"gpa_min": 6.5, "branches": ["Computer Science", "IT"], "skills": ["Java"]}'::jsonb,
    ARRAY['Java', 'Spring Boot', 'REST APIs'],
    ARRAY['Microservices', 'Docker'],
    'completed'
  );

-- Insert TCS and Wipro companies if they don't exist
INSERT INTO companies (name, logo_url, website, description, industry, company_size)
VALUES 
  ('TCS', 'https://logo.clearbit.com/tcs.com', 'https://tcs.com', 'Leading IT services company', 'IT Services', '10000+'),
  ('Wipro', 'https://logo.clearbit.com/wipro.com', 'https://wipro.com', 'Global IT consulting and services', 'IT Services', '10000+')
ON CONFLICT DO NOTHING;

-- Create historical drives for TCS and Wipro
INSERT INTO placement_drives (
  company_id, 
  job_title, 
  jd_text, 
  jd_parsed,
  drive_date, 
  drive_time,
  registration_deadline,
  location,
  job_type,
  salary_range,
  eligibility_criteria,
  required_skills,
  preferred_skills,
  status
)
VALUES 
  (
    (SELECT id FROM companies WHERE name = 'TCS' LIMIT 1),
    'Software Developer',
    'Java developer role for enterprise applications',
    '{"experience": "0-1 years", "education": "B.Tech"}'::jsonb,
    CURRENT_DATE - INTERVAL '90 days',
    '09:00:00',
    CURRENT_DATE - INTERVAL '95 days',
    'Pan India',
    'Full-time',
    '5-9 LPA',
    '{"gpa_min": 6.0, "branches": ["CS", "IT", "ECE"], "skills": ["Java"]}'::jsonb,
    ARRAY['Java', 'Spring Boot', 'SQL'],
    ARRAY['Microservices'],
    'completed'
  ),
  (
    (SELECT id FROM companies WHERE name = 'Wipro' LIMIT 1),
    'Python Developer',
    'Python development role for web applications',
    '{"experience": "0-2 years", "education": "B.Tech"}'::jsonb,
    CURRENT_DATE - INTERVAL '75 days',
    '14:00:00',
    CURRENT_DATE - INTERVAL '80 days',
    'Bangalore, Hyderabad',
    'Full-time',
    '6-11 LPA',
    '{"gpa_min": 6.5, "branches": ["CS", "IT"], "skills": ["Python"]}'::jsonb,
    ARRAY['Python', 'Django', 'PostgreSQL'],
    ARRAY['Flask', 'Docker'],
    'completed'
  );

-- Create successful applications (offers) for historical students
-- TCS offers (Alice and Sarah)
INSERT INTO applications (student_id, drive_id, status, applied_at, updated_at)
SELECT 
  u.id,
  d.id,
  'offer',
  d.drive_date - INTERVAL '5 days',
  d.drive_date + INTERVAL '30 days'
FROM users u
CROSS JOIN placement_drives d
JOIN companies c ON d.company_id = c.id
WHERE u.email = 'alice.brown@alumni.com' AND c.name = 'TCS' AND d.status = 'completed'
LIMIT 1;

INSERT INTO applications (student_id, drive_id, status, applied_at, updated_at)
SELECT 
  u.id,
  d.id,
  'offer',
  d.drive_date - INTERVAL '5 days',
  d.drive_date + INTERVAL '30 days'
FROM users u
CROSS JOIN placement_drives d
JOIN companies c ON d.company_id = c.id
WHERE u.email = 'sarah.johnson@alumni.com' AND c.name = 'TCS' AND d.status = 'completed'
LIMIT 1;

-- Infosys offers (Charlie and Emma)
INSERT INTO applications (student_id, drive_id, status, applied_at, updated_at)
SELECT 
  u.id,
  d.id,
  'offer',
  d.drive_date - INTERVAL '5 days',
  d.drive_date + INTERVAL '30 days'
FROM users u
CROSS JOIN placement_drives d
JOIN companies c ON d.company_id = c.id
WHERE u.email = 'charlie.davis@alumni.com' AND c.name = 'Infosys' AND d.status = 'completed'
LIMIT 1;

INSERT INTO applications (student_id, drive_id, status, applied_at, updated_at)
SELECT 
  u.id,
  d.id,
  'offer',
  d.drive_date - INTERVAL '5 days',
  d.drive_date + INTERVAL '30 days'
FROM users u
CROSS JOIN placement_drives d
JOIN companies c ON d.company_id = c.id
WHERE u.email = 'emma.wilson@alumni.com' AND c.name = 'Infosys' AND d.status = 'completed'
LIMIT 1;

-- Wipro offer (David)
INSERT INTO applications (student_id, drive_id, status, applied_at, updated_at)
SELECT 
  u.id,
  d.id,
  'offer',
  d.drive_date - INTERVAL '5 days',
  d.drive_date + INTERVAL '30 days'
FROM users u
CROSS JOIN placement_drives d
JOIN companies c ON d.company_id = c.id
WHERE u.email = 'david.lee@alumni.com' AND c.name = 'Wipro' AND d.status = 'completed'
LIMIT 1;

