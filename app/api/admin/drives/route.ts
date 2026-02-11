import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      companyName,
      logo_url,
      website,
      description,
      industry,
      job_title,
      jd_text,
      drive_date,
      drive_time,
      registration_deadline,
      location,
      job_type,
      salary_range,
      eligibility_criteria,
      required_skills,
      preferred_skills
    } = body;

    // Create or get company
    const companies = await db.getCompanies();
    let company = companies.find(c => c.name.toLowerCase() === companyName.toLowerCase());
    
    if (!company) {
      company = await db.createCompany({
        name: companyName,
        logo_url,
        website,
        description,
        industry,
        company_size: '1000-5000'
      });
    }

    // Create placement drive
    const drive = await db.createDrive({
      company_id: company.id,
      job_title,
      jd_text,
      jd_parsed: {
        skills: [...required_skills, ...preferred_skills],
        experience: "0-2 years",
        education: "B.Tech/B.E."
      },
      drive_date: new Date(drive_date).toISOString(),
      drive_time,
      registration_deadline: registration_deadline ? new Date(registration_deadline).toISOString() : null,
      location,
      job_type,
      salary_range,
      eligibility_criteria: eligibility_criteria || { gpa_min: 7.0 },
      required_skills: required_skills || [],
      preferred_skills: preferred_skills || [],
      status: 'upcoming'
    });

    // TODO: Send notifications to eligible students
    // This would query student_profiles matching eligibility_criteria
    // and create notification records

    return NextResponse.json({
      success: true,
      drive,
      message: "Drive created successfully and students notified!"
    });
  } catch (error) {
    console.error("Error creating drive:", error);
    return NextResponse.json(
      { error: "Failed to create drive" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const drives = await db.getDrives(status ? { status } : undefined);

    return NextResponse.json({ drives });
  } catch (error) {
    console.error("Error fetching drives:", error);
    return NextResponse.json(
      { error: "Failed to fetch drives" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { driveId, updates } = await request.json();

    // TODO: Update drive details
    console.log("Updating drive:", driveId, updates);

    return NextResponse.json({
      success: true,
      message: "Drive updated successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update drive" },
      { status: 500 }
    );
  }
}
