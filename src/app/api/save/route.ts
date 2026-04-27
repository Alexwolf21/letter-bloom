import { NextRequest, NextResponse } from "next/server";
import { saveLetter } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const { content, immediate, mood } = await req.json();

    if (!content) {
      return NextResponse.json(
        { error: "Letter content is required." },
        { status: 400 }
      );
    }

    const scheduledDate = immediate ? new Date() : undefined;
    const saved = await saveLetter(content, scheduledDate, mood);

    return NextResponse.json({ success: true, letter: saved });
  } catch (error: any) {
    console.error("API Save Error:", error);
    return NextResponse.json(
      { error: "Failed to save the letter." },
      { status: 500 }
    );
  }
}
