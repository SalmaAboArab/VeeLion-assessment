import { NextResponse } from "next/server";
import { getReportsFromBackend } from "@/lib/backendApi";

export async function GET() {
  try {
    const reports = await getReportsFromBackend();
    console.log("Reports fetched from backend:", reports);
    return NextResponse.json({ data: reports }, { status: 200 });
  } catch (error) {
    console.log("Error fetching reports from backend:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Unable to fetch reports." } },
      { status: 500 }
    );
  }
}
