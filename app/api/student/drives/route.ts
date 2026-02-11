import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function GET() {
  try {
    // Query placement_drives with company info
    const { data: drivesData, error: drivesError } = await supabase
      .from("placement_drives")
      .select("id, company_id, job_title, drive_date, status")
      .eq("status", "upcoming");

    if (drivesError) throw drivesError;
    if (!drivesData || drivesData.length === 0) {
      return NextResponse.json({
        success: true,
        drives: []
      });
    }

    // Get unique company IDs
    const companyIds = [...new Set(drivesData.map(d => d.company_id))];

    // Get company names
    const { data: companiesData, error: companiesError } = await supabase
      .from("companies")
      .select("id, name")
      .in("id", companyIds);

    if (companiesError) throw companiesError;

    // Create a map of company IDs to names
    const companyMap = new Map(companiesData?.map(c => [c.id, c.name]) || []);

    // Transform to expected format
    const drives = drivesData.map(drive => ({
      id: drive.id,
      job_title: drive.job_title,
      company: {
        id: drive.company_id,
        name: companyMap.get(drive.company_id) || "Unknown"
      },
      drive_date: drive.drive_date
    }));

    return NextResponse.json({
      success: true,
      drives
    });
  } catch (error) {
    console.error("Error fetching drives:", error);
    return NextResponse.json(
      { error: "Failed to fetch drives" },
      { status: 500 }
    );
  }
}
