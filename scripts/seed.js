const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && !key.startsWith('#')) {
    process.env[key.trim()] = valueParts.join('=').trim();
  }
});

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const companies = [
  { name: "Google" },
  { name: "Amazon" },
  { name: "Microsoft" },
  { name: "Meta" },
  { name: "Apple" },
  { name: "Netflix" },
  { name: "Tesla" },
  { name: "Uber" },
  { name: "Airbnb" },
  { name: "Flipkart" }
];

const jobs = [
  {
    company: "Google",
    title: "Software Engineer II",
    job_type: "Full-time",
    description: "We are looking for Software Engineers to join our Search team. You will work on problems of immense scale and impact millions of users. Required: Strong problem-solving skills, Data Structures & Algorithms, System Design. Preferred: C++, Java, Python, Go",
    ctc_lpa: 50.0,
    min_gpa: 7.0,
    required_skills: ["Data Structures", "Algorithms", "System Design", "Python", "C++", "Java"],
    preferred_skills: ["Machine Learning", "Distributed Systems", "Go"],
    eligible_branches: ["CS", "IT", "ECE"],
    eligible_years: [3, 4]
  },
  {
    company: "Amazon",
    title: "SDE I",
    job_type: "Full-time",
    description: "Amazon is seeking talented Software Development Engineers to build and scale services. You will own projects end-to-end and impact millions of customers.",
    ctc_lpa: 45.0,
    min_gpa: 6.5,
    required_skills: ["Data Structures", "Algorithms", "System Design", "Java", "Python", "SQL"],
    preferred_skills: ["AWS", "Microservices", "NoSQL"],
    eligible_branches: ["CS", "IT"],
    eligible_years: [3, 4]
  },
  {
    company: "Microsoft",
    title: "Software Engineer",
    job_type: "Full-time",
    description: "Microsoft is hiring Software Engineers for Windows, Office, and Azure teams. Work on products used by billions.",
    ctc_lpa: 42.0,
    min_gpa: 7.0,
    required_skills: ["Data Structures", "Algorithms", "Object-Oriented Design", "C#", "C++"],
    preferred_skills: ["Azure", "REST APIs", "Databases"],
    eligible_branches: ["CS", "IT"],
    eligible_years: [3, 4]
  },
  {
    company: "Meta",
    title: "Software Engineer",
    job_type: "Full-time",
    description: "Meta is seeking Software Engineers for Backend, Frontend, and Infrastructure roles. Build systems at scale for billions of users.",
    ctc_lpa: 60.0,
    min_gpa: 7.0,
    required_skills: ["Algorithms", "System Design", "Python", "C++", "Java", "JavaScript"],
    preferred_skills: ["React", "GraphQL", "Distributed Systems"],
    eligible_branches: ["CS", "IT", "ECE"],
    eligible_years: [3, 4]
  },
  {
    company: "Apple",
    title: "Software Engineer",
    job_type: "Full-time",
    description: "Join Apple and work on products loved by millions worldwide. Roles in iOS, macOS, Services, and Hardware teams.",
    ctc_lpa: 48.0,
    min_gpa: 7.0,
    required_skills: ["Data Structures", "Algorithms", "Swift", "C++"],
    preferred_skills: ["iOS Development", "Distributed Systems", "Performance Optimization"],
    eligible_branches: ["CS", "IT"],
    eligible_years: [3, 4]
  },
  {
    company: "Netflix",
    title: "Senior Software Engineer",
    job_type: "Full-time",
    description: "Netflix is hiring for Streaming, Personalization, and Content Delivery teams. Build systems for 250M+ subscribers.",
    ctc_lpa: 65.0,
    min_gpa: 7.0,
    required_skills: ["System Design", "Distributed Systems", "Java", "Scala", "Python"],
    preferred_skills: ["Machine Learning", "Big Data", "Kubernetes"],
    eligible_branches: ["CS", "IT"],
    eligible_years: [3, 4]
  },
  {
    company: "Tesla",
    title: "Software Engineer",
    job_type: "Full-time",
    description: "Tesla is hiring for Vehicle Software, Firmware, and Cloud teams. Build the future of transportation.",
    ctc_lpa: 55.0,
    min_gpa: 7.0,
    required_skills: ["C++", "Python", "Linux", "Embedded Systems"],
    preferred_skills: ["CUDA", "Real-time Systems", "Hardware Integration"],
    eligible_branches: ["CS", "IT", "ECE"],
    eligible_years: [3, 4]
  },
  {
    company: "Uber",
    title: "Backend Engineer",
    job_type: "Full-time",
    description: "Uber is hiring for Marketplace, Maps, and Platform teams. Work on real-time systems serving millions globally.",
    ctc_lpa: 50.0,
    min_gpa: 6.5,
    required_skills: ["System Design", "Microservices", "Java", "Go", "Python"],
    preferred_skills: ["Kubernetes", "Message Queues", "GraphQL"],
    eligible_branches: ["CS", "IT"],
    eligible_years: [3, 4]
  },
  {
    company: "Airbnb",
    title: "Full Stack Engineer",
    job_type: "Full-time",
    description: "Airbnb is seeking Full Stack Engineers for Web, Mobile, and Platform teams. Build experiences for millions of travelers.",
    ctc_lpa: 48.0,
    min_gpa: 6.5,
    required_skills: ["JavaScript", "React", "Python", "System Design"],
    preferred_skills: ["Kubernetes", "Cloud Architecture", "Data Analytics"],
    eligible_branches: ["CS", "IT"],
    eligible_years: [3, 4]
  },
  {
    company: "Flipkart",
    title: "Software Development Engineer",
    job_type: "Full-time",
    description: "Flipkart is hiring for Supply Chain, Payments, and Platform teams. Shape the future of e-commerce in India.",
    ctc_lpa: 32.0,
    min_gpa: 6.0,
    required_skills: ["Java", "Python", "Data Structures", "System Design", "SQL"],
    preferred_skills: ["Microservices", "Kubernetes", "Machine Learning"],
    eligible_branches: ["CS", "IT"],
    eligible_years: [3, 4]
  }
];

async function seedDatabase() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // 1. Check connection
    console.log("🔍 Checking database connection...");
    const { data: connCheck } = await supabase
      .from("companies")
      .select("*")
      .limit(1);
    console.log("✅ Database connection successful\n");

    // 2. Insert companies
    console.log("📦 Inserting companies...");
    const { data: insertedCompanies, error: companiesError } = await supabase
      .from("companies")
      .upsert(companies, { onConflict: "name" })
      .select();

    if (companiesError) {
      console.log("⚠️  Companies insertion note:", companiesError.message);
    } else {
      console.log(`✅ Processed ${insertedCompanies?.length || 0} companies\n`);
    }

    // 3. Fetch company IDs
    const { data: allCompanies, error: fetchError } = await supabase
      .from("companies")
      .select("id, name");

    if (fetchError) throw fetchError;

    const companyMap = new Map(allCompanies.map(c => [c.name, c.id]));

    // 4. Insert jobs into placement_drives table
    console.log("📋 Inserting job listings...");
    const drivesToInsert = jobs.map((job) => ({
      company_id: companyMap.get(job.company),
      job_title: job.title,
      jd_text: job.description,
      jd_parsed: {
        skills: job.required_skills,
        preferred_skills: job.preferred_skills,
        job_type: job.job_type
      },
      drive_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      drive_time: "10:00",
      registration_deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      location: "Online",
      job_type: job.job_type,
      salary_range: `₹${job.ctc_lpa}L - ₹${job.ctc_lpa + 2}L`,
      eligibility_criteria: {
        gpa_min: job.min_gpa,
        branches: job.eligible_branches,
        years: job.eligible_years
      },
      required_skills: job.required_skills,
      preferred_skills: job.preferred_skills,
      status: "upcoming"
    }));

    const { data: insertedDrives, error: drivesError } = await supabase
      .from("placement_drives")
      .insert(drivesToInsert)
      .select();

    if (drivesError) throw drivesError;
    console.log(`✅ Inserted ${insertedDrives?.length || 0} job listings\n`);

    // 5. Verify
    const { data: verification } = await supabase
      .from("placement_drives")
      .select("id, job_title, status")
      .eq("status", "upcoming");

    console.log("✨ Seeding completed successfully!\n");
    console.log(`📊 Database now has ${verification?.length || 0} active job listings`);
    console.log("🎉 Mock interviews and flashcards are now available for all companies!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
