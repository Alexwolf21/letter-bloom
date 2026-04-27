import { NextRequest, NextResponse } from "next/server";
import { getDates, createDate } from "@/lib/storage";

export async function GET() {
  try {
    const dates = await getDates();
    return NextResponse.json(dates);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dates" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { scheduledAt, description, createdBy } = await req.json();
    if (!scheduledAt || !description || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const date = await createDate(scheduledAt, description, createdBy);
    return NextResponse.json(date);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create date proposal" }, { status: 500 });
  }
}
