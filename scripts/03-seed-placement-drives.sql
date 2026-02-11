-- Seed top tech companies for placement drives
-- This script adds mock placement drives for interview preparation

-- First, insert companies if they don't exist
INSERT INTO companies (name, logo_url, website, description, industry, company_size, ceo_name) 
VALUES 
  ('Google', 'https://www.google.com/images/logo.png', 'https://www.google.com', 'Search, ads, cloud services, and more', 'Technology', '190000+', 'Sundar Pichai'),
  ('Amazon', 'https://www.amazon.com/images/logo.png', 'https://www.amazon.com', 'E-commerce, cloud computing, streaming', 'Technology & Retail', '1500000+', 'Andy Jassy'),
  ('Microsoft', 'https://www.microsoft.com/images/logo.png', 'https://www.microsoft.com', 'Software, cloud, and enterprise solutions', 'Technology', '220000+', 'Satya Nadella'),
  ('Meta', 'https://www.facebook.com/images/logo.png', 'https://www.meta.com', 'Social media, metaverse, AI research', 'Technology', '66000+', 'Mark Zuckerberg'),
  ('Apple', 'https://www.apple.com/images/logo.png', 'https://www.apple.com', 'Consumer electronics and software', 'Technology', '161000+', 'Tim Cook'),
  ('Netflix', 'https://www.netflix.com/images/logo.png', 'https://www.netflix.com', 'Streaming entertainment platform', 'Media & Entertainment', '11000+', 'Reed Hastings'),
  ('Tesla', 'https://www.tesla.com/images/logo.png', 'https://www.tesla.com', 'Electric vehicles and clean energy', 'Automotive & Energy', '128000+', 'Elon Musk'),
  ('Uber', 'https://www.uber.com/images/logo.png', 'https://www.uber.com', 'Ride-sharing and delivery platform', 'Transportation', '76000+', 'Dara Khosrowshahi'),
  ('Airbnb', 'https://www.airbnb.com/images/logo.png', 'https://www.airbnb.com', 'Property rental and hospitality platform', 'Travel & Hospitality', '5400+', 'Brian Chesky'),
  ('Flipkart', 'https://www.flipkart.com/images/logo.png', 'https://www.flipkart.com', 'Indian e-commerce platform', 'E-commerce', '24000+', 'Kalyan Krishnamurthy')
ON CONFLICT DO NOTHING;

-- Get company IDs for use in placement drives
WITH company_data AS (
  SELECT id, name FROM companies WHERE name IN ('Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Netflix', 'Tesla', 'Uber', 'Airbnb', 'Flipkart')
)

-- Insert placement drives for each company
INSERT INTO placement_drives (
  company_id, 
  job_title, 
  jd_text, 
  job_type, 
  salary_range, 
  eligibility_criteria, 
  required_skills, 
  preferred_skills, 
  status, 
  drive_date
)
SELECT 
  (SELECT id FROM company_data WHERE name = 'Google'),
  'Software Engineer II',
  'We are looking for Software Engineers to join our Search team. You will work on problems of immense scale and impact millions of users. Required: Strong problem-solving skills, Data Structures & Algorithms, System Design. Preferred: C++, Java, Python, Go',
  'Full-time',
  '₹45,00,000 - ₹60,00,000',
  '{"gpa_min": 7.0, "branches": ["CS", "IT", "ECE"], "skills": ["Data Structures", "Algorithms", "System Design"]}',
  ARRAY['Data Structures', 'Algorithms', 'System Design', 'Python', 'C++', 'Java'],
  ARRAY['Machine Learning', 'Distributed Systems', 'Go'],
  'active',
  NOW() + INTERVAL '30 days'
UNION ALL
SELECT 
  (SELECT id FROM company_data WHERE name = 'Amazon'),
  'SDE I',
  'Amazon is seeking talented Software Development Engineers to build and scale services. You will own projects end-to-end and impact millions of customers. Focus on backend development, databases, and distributed systems. Required: Strong coding skills, System Design, Problem Solving',
  'Full-time',
  '₹40,00,000 - ₹55,00,000',
  '{"gpa_min": 6.5, "branches": ["CS", "IT"], "skills": ["Coding", "System Design"]}',
  ARRAY['Data Structures', 'Algorithms', 'System Design', 'Java', 'Python', 'SQL'],
  ARRAY['AWS', 'Microservices', 'NoSQL'],
  'active',
  NOW() + INTERVAL '35 days'
UNION ALL
SELECT 
  (SELECT id FROM company_data WHERE name = 'Microsoft'),
  'Software Engineer',
  'Microsoft is hiring Software Engineers for Windows, Office, and Azure teams. Work on products used by billions. Required: Core CS fundamentals, Problem-solving, Design thinking. Tech Stack: C#, C++, Java, Python',
  'Full-time',
  '₹38,00,000 - ₹52,00,000',
  '{"gpa_min": 7.0, "branches": ["CS", "IT"], "skills": ["Data Structures", "Algorithms"]}',
  ARRAY['Data Structures', 'Algorithms', 'Object-Oriented Design', 'C#', 'C++'],
  ARRAY['Azure', 'REST APIs', 'Databases'],
  'active',
  NOW() + INTERVAL '28 days'
UNION ALL
SELECT 
  (SELECT id FROM company_data WHERE name = 'Meta'),
  'Software Engineer',
  'Meta is seeking Software Engineers for Backend, Frontend, and Infrastructure roles. Build systems at scale for billions of users. Required: Core algorithms, system design, communication skills. Tech: Python, C++, Java, JavaScript',
  'Full-time',
  '₹50,00,000 - ₹70,00,000',
  '{"gpa_min": 7.0, "branches": ["CS", "IT", "ECE"], "skills": ["Algorithms", "System Design"]}',
  ARRAY['Algorithms', 'System Design', 'Python', 'C++', 'Java', 'JavaScript'],
  ARRAY['React', 'GraphQL', 'Distributed Systems'],
  'active',
  NOW() + INTERVAL '32 days'
UNION ALL
SELECT 
  (SELECT id FROM company_data WHERE name = 'Apple'),
  'Software Engineer',
  'Join Apple and work on products loved by millions worldwide. Roles in iOS, macOS, Services, and Hardware teams. Required: Solid fundamentals in CS, strong problem-solving. Tech: Swift, Objective-C, C++, Python',
  'Full-time',
  '₹42,00,000 - ₹58,00,000',
  '{"gpa_min": 7.0, "branches": ["CS", "IT"], "skills": ["Data Structures", "Algorithms", "Problem Solving"]}',
  ARRAY['Data Structures', 'Algorithms', 'Swift', 'C++'],
  ARRAY['iOS Development', 'Distributed Systems', 'Performance Optimization'],
  'active',
  NOW() + INTERVAL '30 days'
UNION ALL
SELECT 
  (SELECT id FROM company_data WHERE name = 'Netflix'),
  'Senior Software Engineer',
  'Netflix is hiring for Streaming, Personalization, and Content Delivery teams. Build systems for 250M+ subscribers. Required: Strong fundamentals, System Design, Data Structures. Tech: Java, Node.js, Python, Scala',
  'Full-time',
  '₹55,00,000 - ₹75,00,000',
  '{"gpa_min": 7.0, "branches": ["CS", "IT"], "skills": ["System Design", "Distributed Systems"]}',
  ARRAY['System Design', 'Distributed Systems', 'Java', 'Scala', 'Python'],
  ARRAY['Machine Learning', 'Big Data', 'Kubernetes'],
  'active',
  NOW() + INTERVAL '25 days'
UNION ALL
SELECT 
  (SELECT id FROM company_data WHERE name = 'Tesla'),
  'Software Engineer',
  'Tesla is hiring for Vehicle Software, Firmware, and Cloud teams. Build the future of transportation. Required: C++, Python, Linux, Strong fundamentals. Experience with embedded systems preferred.',
  'Full-time',
  '₹48,00,000 - ₹65,00,000',
  '{"gpa_min": 7.0, "branches": ["CS", "IT", "ECE"], "skills": ["C++", "Embedded Systems"]}',
  ARRAY['C++', 'Python', 'Linux', 'Embedded Systems'],
  ARRAY['CUDA', 'Real-time Systems', 'Hardware Integration'],
  'active',
  NOW() + INTERVAL '40 days'
UNION ALL
SELECT 
  (SELECT id FROM company_data WHERE name = 'Uber'),
  'Backend Engineer',
  'Uber is hiring for Marketplace, Maps, and Platform teams. Work on real-time systems serving millions globally. Required: System Design, Microservices, Strong coding skills. Tech: Java, Python, Go, C++',
  'Full-time',
  '₹44,00,000 - ₹60,00,000',
  '{"gpa_min": 6.5, "branches": ["CS", "IT"], "skills": ["System Design", "Microservices"]}',
  ARRAY['System Design', 'Microservices', 'Java', 'Go', 'Python'],
  ARRAY['Kubernetes', 'Message Queues', 'GraphQL'],
  'active',
  NOW() + INTERVAL '33 days'
UNION ALL
SELECT 
  (SELECT id FROM company_data WHERE name = 'Airbnb'),
  'Full Stack Engineer',
  'Airbnb is seeking Full Stack Engineers for Web, Mobile, and Platform teams. Build experiences for millions of travelers. Required: Frontend (JS/TS), Backend (Python/Java), System Design.',
  'Full-time',
  '₹40,00,000 - ₹55,00,000',
  '{"gpa_min": 6.5, "branches": ["CS", "IT"], "skills": ["Full Stack", "JavaScript"]}',
  ARRAY['JavaScript', 'React', 'Python', 'System Design'],
  ARRAY['Kubernetes', 'Cloud Architecture', 'Data Analytics'],
  'active',
  NOW() + INTERVAL '27 days'
UNION ALL
SELECT 
  (SELECT id FROM company_data WHERE name = 'Flipkart'),
  'Software Development Engineer',
  'Flipkart is hiring for Supply Chain, Payments, and Platform teams. Shape the future of e-commerce in India. Required: Strong fundamentals, Data Structures, System Design. Tech: Java, Python, Go',
  'Full-time',
  '₹25,00,000 - ₹40,00,000',
  '{"gpa_min": 6.0, "branches": ["CS", "IT"], "skills": ["Data Structures", "Algorithms"]}',
  ARRAY['Java', 'Python', 'Data Structures', 'System Design', 'SQL'],
  ARRAY['Microservices', 'Kubernetes', 'Machine Learning'],
  'active',
  NOW() + INTERVAL '35 days'
ON CONFLICT DO NOTHING;

-- Verify the inserts
SELECT COUNT(*) as total_drives, COUNT(DISTINCT company_id) as companies 
FROM placement_drives 
WHERE status = 'active';
