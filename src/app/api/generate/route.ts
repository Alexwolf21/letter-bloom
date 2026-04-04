import { NextRequest, NextResponse } from "next/server";
import { generateLoveLetter } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { feelings, memories, notes } = await req.json();

    if (!feelings || !memories) {
      return NextResponse.json(
        { error: "Feelings and Memories are required to bloom a letter." },
        { status: 400 }
      );
    }

    const letter = await generateLoveLetter({ feelings, memories, notes });

    return NextResponse.json({ letter });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during generation." },
      { status: 500 }
    );
  }
}
