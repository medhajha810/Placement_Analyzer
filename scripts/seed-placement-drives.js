import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

const companies = [
  {
    name: "Google",
    website: "https://www.google.com",
    description: "Search, ads, cloud services, and more",
    industry: "Technology",
    company_size: "190000+",
    ceo_name: "Sundar Pichai"
  },
  {
    name: "Amazon",
    website: "https://www.amazon.com",
    description: "E-commerce, cloud computing, streaming",
    industry: "Technology & Retail",
    company_size: "1500000+",
    ceo_name: "Andy Jassy"
  },
  {
    name: "Microsoft",
    website: "https://www.microsoft.com",
    description: "Software, cloud, and enterprise solutions",
    industry: "Technology",
    company_size: "220000+",
    ceo_name: "Satya Nadella"
  },
  {
    name: "Meta",
    website: "https://www.meta.com",
    description: "Social media, metaverse, AI research",
    industry: "Technology",
    company_size: "66000+",
    ceo_name: "Mark Zuckerberg"
  },
  {
    name: "Apple",
    website: "https://www.apple.com",
    description: "Consumer electronics and software",
    industry: "Technology",
    company_size: "161000+",
    ceo_name: "Tim Cook"
  },
  {
    name: "Netflix",
    website: "https://www.netflix.com",
    description: "Streaming entertainment platform",
    industry: "Media & Entertainment",
    company_size: "11000+",
    ceo_name: "Reed Hastings"
  },
  {
    name: "Tesla",
    website: "https://www.tesla.com",
    description: "Electric vehicles and clean energy",
    industry: "Automotive & Energy",
    company_size: "128000+",
    ceo_name: "Elon Musk"
  },
  {
    name: "Uber",
    website: "https://www.uber.com",
    description: "Ride-sharing and delivery platform",
    industry: "Transportation",
    company_size: "76000+",
    ceo_name: "Dara Khosrowshahi"
  },
  {
    name: "Airbnb",
    website: "https://www.airbnb.com",
    description: "Property rental and hospitality platform",
    industry: "Travel & Hospitality",
    company_size: "5400+",
    ceo_name: "Brian Chesky"
  },
  {
    name: "Flipkart",
    website: "https://www.flipkart.com",
    description: "Indian e-commerce platform",
    industry: "E-commerce",
    company_size: "24000+",
    ceo_name: "Kalyan Krishnamurthy"
  }
];

const placementDrives = [
  {
    company: "Google",
    job_title: "Software Engineer II",
    jd_text: "We are looking for Software Engineers to join our Search team. You will work on problems of immense scale and impact millions of users. Required: Strong problem-solving skills, Data Structures & Algorithms, System Design. Preferred: C++, Java, Python, Go",
    job_type: "Full-time",
    salary_range: "₹45,00,000 - ₹60,00,000",
    required_skills: ["Data Structures", "Algorithms", "System Design", "Python", "C++", "Java"],
    preferred_skills: ["Machine Learning", "Distributed Systems", "Go"],
    eligibility_criteria: { gpa_min: 7.0, branches: ["CS", "IT", "ECE"], skills: ["Data Structures", "Algorithms", "System Design"] }
  },
  {
    company: "Amazon",
    job_title: "SDE I",
    jd_text: "Amazon is seeking talented Software Development Engineers to build and scale services. You will own projects end-to-end and impact millions of customers. Focus on backend development, databases, and distributed systems.",
    job_type: "Full-time",
    salary_range: "₹40,00,000 - ₹55,00,000",
    required_skills: ["Data Structures", "Algorithms", "System Design", "Java", "Python", "SQL"],
    preferred_skills: ["AWS", "Microservices", "NoSQL"],
    eligibility_criteria: { gpa_min: 6.5, branches: ["CS", "IT"], skills: ["Coding", "System Design"] }
  },
  {
    company: "Microsoft",
    job_title: "Software Engineer",
    jd_text: "Microsoft is hiring Software Engineers for Windows, Office, and Azure teams. Work on products used by billions. Required: Core CS fundamentals, Problem-solving, Design thinking.",
    job_type: "Full-time",
    salary_range: "₹38,00,000 - ₹52,00,000",
    required_skills: ["Data Structures", "Algorithms", "Object-Oriented Design", "C#", "C++"],
    preferred_skills: ["Azure", "REST APIs", "Databases"],
    eligibility_criteria: { gpa_min: 7.0, branches: ["CS", "IT"], skills: ["Data Structures", "Algorithms"] }
  },
  {
    company: "Meta",
    job_title: "Software Engineer",
    jd_text: "Meta is seeking Software Engineers for Backend, Frontend, and Infrastructure roles. Build systems at scale for billions of users. Required: Core algorithms, system design, communication skills.",
    job_type: "Full-time",
    salary_range: "₹50,00,000 - ₹70,00,000",
    required_skills: ["Algorithms", "System Design", "Python", "C++", "Java", "JavaScript"],
    preferred_skills: ["React", "GraphQL", "Distributed Systems"],
    eligibility_criteria: { gpa_min: 7.0, branches: ["CS", "IT", "ECE"], skills: ["Algorithms", "System Design"] }
  },
  {
    company: "Apple",
    job_title: "Software Engineer",
    jd_text: "Join Apple and work on products loved by millions worldwide. Roles in iOS, macOS, Services, and Hardware teams.",
    job_type: "Full-time",
    salary_range: "₹42,00,000 - ₹58,00,000",
    required_skills: ["Data Structures", "Algorithms", "Swift", "C++"],
    preferred_skills: ["iOS Development", "Distributed Systems", "Performance Optimization"],
    eligibility_criteria: { gpa_min: 7.0, branches: ["CS", "IT"], skills: ["Data Structures", "Algorithms", "Problem Solving"] }
  },
  {
    company: "Netflix",
    job_title: "Senior Software Engineer",
    jd_text: "Netflix is hiring for Streaming, Personalization, and Content Delivery teams. Build systems for 250M+ subscribers.",
    job_type: "Full-time",
    salary_range: "₹55,00,000 - ₹75,00,000",
    required_skills: ["System Design", "Distributed Systems", "Java", "Scala", "Python"],
    preferred_skills: ["Machine Learning", "Big Data", "Kubernetes"],
    eligibility_criteria: { gpa_min: 7.0, branches: ["CS", "IT"], skills: ["System Design", "Distributed Systems"] }
  },
  {
    company: "Tesla",
    job_title: "Software Engineer",
    jd_text: "Tesla is hiring for Vehicle Software, Firmware, and Cloud teams. Build the future of transportation.",
    job_type: "Full-time",
    salary_range: "₹48,00,000 - ₹65,00,000",
    required_skills: ["C++", "Python", "Linux", "Embedded Systems"],
    preferred_skills: ["CUDA", "Real-time Systems", "Hardware Integration"],
    eligibility_criteria: { gpa_min: 7.0, branches: ["CS", "IT", "ECE"], skills: ["C++", "Embedded Systems"] }
  },
  {
    company: "Uber",
    job_title: "Backend Engineer",
    jd_text: "Uber is hiring for Marketplace, Maps, and Platform teams. Work on real-time systems serving millions globally.",
    job_type: "Full-time",
    salary_range: "₹44,00,000 - ₹60,00,000",
    required_skills: ["System Design", "Microservices", "Java", "Go", "Python"],
    preferred_skills: ["Kubernetes", "Message Queues", "GraphQL"],
    eligibility_criteria: { gpa_min: 6.5, branches: ["CS", "IT"], skills: ["System Design", "Microservices"] }
  },
  {
    company: "Airbnb",
    job_title: "Full Stack Engineer",
    jd_text: "Airbnb is seeking Full Stack Engineers for Web, Mobile, and Platform teams. Build experiences for millions of travelers.",
    job_type: "Full-time",
    salary_range: "₹40,00,000 - ₹55,00,000",
    required_skills: ["JavaScript", "React", "Python", "System Design"],
    preferred_skills: ["Kubernetes", "Cloud Architecture", "Data Analytics"],
    eligibility_criteria: { gpa_min: 6.5, branches: ["CS", "IT"], skills: ["Full Stack", "JavaScript"] }
  },
  {
    company: "Flipkart",
    job_title: "Software Development Engineer",
    jd_text: "Flipkart is hiring for Supply Chain, Payments, and Platform teams. Shape the future of e-commerce in India.",
    job_type: "Full-time",
    salary_range: "₹25,00,000 - ₹40,00,000",
    required_skills: ["Java", "Python", "Data Structures", "System Design", "SQL"],
    preferred_skills: ["Microservices", "Kubernetes", "Machine Learning"],
    eligibility_criteria: { gpa_min: 6.0, branches: ["CS", "IT"], skills: ["Data Structures", "Algorithms"] }
  }
];

async function seedDatabase() {
  console.log("🌱 Starting database seeding...\n");

  try {
    // 1. Insert companies
    console.log("📦 Inserting companies...");
    const { data: insertedCompanies, error: companiesError } = await supabase
      .from("companies")
      .upsert(companies, { onConflict: "name" })
      .select();

    if (companiesError) throw companiesError;
    console.log(`✅ Inserted ${insertedCompanies?.length || 0} companies\n`);

    // 2. Fetch company IDs
    const { data: allCompanies, error: fetchError } = await supabase
      .from("companies")
      .select("id, name");

    if (fetchError) throw fetchError;

    const companyMap = new Map(allCompanies.map((c: any) => [c.name, c.id]));

    // 3. Insert placement drives
    console.log("📋 Inserting placement drives...");
    const drivesToInsert = placementDrives.map((drive) => ({
      company_id: companyMap.get(drive.company),
      job_title: drive.job_title,
      jd_text: drive.jd_text,
      job_type: drive.job_type,
      salary_range: drive.salary_range,
      required_skills: drive.required_skills,
      preferred_skills: drive.preferred_skills,
      eligibility_criteria: drive.eligibility_criteria,
      status: "active",
      drive_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString() // 25 days from now
    }));

    const { data: insertedDrives, error: drivesError } = await supabase
      .from("placement_drives")
      .insert(drivesToInsert)
      .select();

    if (drivesError) throw drivesError;
    console.log(`✅ Inserted ${insertedDrives?.length || 0} placement drives\n`);

    // 4. Verify
    const { data: verification } = await supabase
      .from("placement_drives")
      .select("id, company_id, job_title, status")
      .eq("status", "active");

    console.log("✨ Seeding completed successfully!\n");
    console.log(`📊 Database now has ${verification?.length || 0} active placement drives`);
    console.log("🎉 Mock interviews and flashcards are now available for all companies!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
